import { handle as authHandle } from './auth';
import type { Handle } from '@sveltejs/kit';

/**
 * נתיב תמונות הפרסומות - ציבורי לחלוטין ולא תלוי-משתמש, ולכן עוקף את
 * שרשרת ה-auth: @auth/sveltekit מוסיף Set-Cookie לכל תשובה, ו-Vercel לעולם
 * לא שומר בקאש הקצה תשובה שנושאת עוגייה. בלי העקיפה ה-CDN היה מחזיר MISS
 * בכל בקשת תמונה, והבייטים היו יוצאים מה-origin מחדש בכל פעם.
 */
const PUBLIC_IMAGE_PATH = /^\/api\/ad-image\/[^/]+\/[^/]+$/;

/**
 * עוטפים את ה-handle של Auth.js ב-try/catch: אם ה-JWT בעוגייה לא תקין
 * (למשל AUTH_SECRET שונה) @auth/sveltekit עלול לזרוק ולהפיל את כל הדפים.
 * הפתרון: אם זרק — ממשיכים כמשתמש אנונימי.
 */
export const handle: Handle = async ({ event, resolve }) => {
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
