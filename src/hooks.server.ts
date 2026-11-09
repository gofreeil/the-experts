import { handle as authHandle } from './auth';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE, dirOf, isLocale, toLocale } from '$lib/i18n';

/**
 * נתיב תמונות הפרסומות - ציבורי לחלוטין ולא תלוי-משתמש, ולכן עוקף את
 * שרשרת ה-auth: @auth/sveltekit מוסיף Set-Cookie לכל תשובה, ו-Vercel לעולם
 * לא שומר בקאש הקצה תשובה שנושאת עוגייה. בלי העקיפה ה-CDN היה מחזיר MISS
 * בכל בקשת תמונה, והבייטים היו יוצאים מה-origin מחדש בכל פעם.
 */
const PUBLIC_IMAGE_PATH = /^\/api\/ad-image\/[^/]+\/[^/]+$/;

/**
 * שפת הגולש: ?lang=en|he (ונשמר בעוגייה, כדי ששיתוף קישור באנגלית יעבוד), אחרת העוגייה
 * `lang` שההדר קובע בהחלפת שפה, אחרת עברית. נשמרת ב-event.locals.locale לשימוש
 * ה-layout וההודעות בצד השרת, וקובעת את <html lang dir> כבר ב-SSR.
 */
const localeHandle: Handle = async ({ event, resolve }) => {
	const fromQuery = event.url.searchParams.get(LOCALE_COOKIE);
	if (isLocale(fromQuery)) {
		event.cookies.set(LOCALE_COOKIE, fromQuery, {
			path: '/',
			maxAge: LOCALE_COOKIE_MAX_AGE,
			sameSite: 'lax',
			// ההדר מחליף שפה ע"י כתיבת העוגייה מהדפדפן, ולכן היא לא יכולה להיות httpOnly
			httpOnly: false
		});
		event.locals.locale = fromQuery;
	} else {
		event.locals.locale = toLocale(event.cookies.get(LOCALE_COOKIE));
	}

	const { locale } = event.locals;
	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', locale).replace('%dir%', dirOf(locale))
	});
};

// נתיבי סריקה של בוטים (וורדפרס/PHP/קבצי סודות) — לאתר הזה אין אף אחד מהם. בלי הקיצור כל
// ניסיון כזה מרנדר את דף ה-404 המלא (כולל ה-layout) ועולה זמן CPU; עונים בשורה אחת, ו-s-maxage
// נותן ל-CDN של Vercel לזכור את התשובה כך שחזרה על אותו נתיב לא מגיעה לפונקציה.
const JUNK_PATH =
	/\.(?:php\d*|aspx?|jsp|cgi)$|^\/(?:wp-[^/]*|wordpress|phpmyadmin|cgi-bin|\.env[^/]*|\.git|\.aws|\.ssh)(?:\/|$)/i;

// עוגיית הסשן של Auth.js (גם בגרסה המאובטחת __Secure-, וגם כשהיא מפוצלת ל-.0/.1)
const SESSION_COOKIE = /(?:^|;\s*)[^=;\s]*session-token[^=;]*=/;

/**
 * מבקר בלי עוגיית סשן הוא אנונימי בהכרח, ו-Auth.js היה מחזיר לו null בכל מקרה — אבל רק אחרי
 * שבנה את כל ההגדרות מחדש (וזה קורה בכל בקשה, גם של בוטים). בלי עוגייה — null מיד.
 * רץ אחרי authHandle, כך שנתיבי /auth/* (התחברות) ממשיכים להיות מטופלים כרגיל.
 */
const skipAuthWhenAnonymous: Handle = async ({ event, resolve }) => {
	if (!SESSION_COOKIE.test(event.request.headers.get('cookie') ?? '')) {
		event.locals.auth = async () => null;
	}
	return resolve(event);
};

/**
 * עוטפים את ה-handle של Auth.js ב-try/catch: אם ה-JWT בעוגייה לא תקין
 * (למשל AUTH_SECRET שונה) @auth/sveltekit עלול לזרוק ולהפיל את כל הדפים.
 * הפתרון: אם זרק — ממשיכים כמשתמש אנונימי.
 */
const authenticate: Handle = async ({ event, resolve }) => {
	if (event.request.method === 'GET' && JUNK_PATH.test(event.url.pathname)) {
		return new Response('Not found', {
			status: 404,
			headers: {
				'content-type': 'text/plain; charset=utf-8',
				'cache-control': 'public, s-maxage=86400'
			}
		});
	}
	if (PUBLIC_IMAGE_PATH.test(event.url.pathname)) {
		event.locals.auth = async () => null;
		return await resolve(event);
	}
	try {
		return await sequence(authHandle, skipAuthWhenAnonymous)({ event, resolve });
	} catch (err) {
		console.warn('[hooks] auth handle threw - continuing anonymously:', err);
		if (!event.locals.auth) {
			event.locals.auth = async () => null;
		}
		return await resolve(event);
	}
};

export const handle: Handle = sequence(localeHandle, authenticate);
