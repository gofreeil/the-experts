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

/**
 * עוטפים את ה-handle של Auth.js ב-try/catch: אם ה-JWT בעוגייה לא תקין
 * (למשל AUTH_SECRET שונה) @auth/sveltekit עלול לזרוק ולהפיל את כל הדפים.
 * הפתרון: אם זרק — ממשיכים כמשתמש אנונימי.
 */
const authenticate: Handle = async ({ event, resolve }) => {
	if (PUBLIC_IMAGE_PATH.test(event.url.pathname)) {
		event.locals.auth = async () => null;
		return await resolve(event);
	}
	try {
		return await authHandle({ event, resolve });
	} catch (err) {
		console.warn('[hooks] auth handle threw - continuing anonymously:', err);
		if (!event.locals.auth) {
			event.locals.auth = async () => null;
		}
		return await resolve(event);
	}
};

export const handle: Handle = sequence(localeHandle, authenticate);
