// ============================================================
// adsCode.ts — קוד הבעלים לפרסום ללא תשלום, בצד השרת בלבד.
// הקוד עצמו לא נמצא בקוד המקור (המאגר ציבורי!) אלא במשתנה
// הסביבה ADS_OWNER_CODE. הדפדפן שולח את מה שהוקלד, והשרת מאמת
// מולו (verify-code + בזמן ההגשה עצמה — כך שאי אפשר לזייף
// payment='code' בבקשה ישירה). ההתראות עצמן ב-adsNotify.
// ============================================================

import { env } from '$env/dynamic/private';

function normalize(v: string): string {
    return v.trim().replace(/\s+/g, ' ');
}

/** האם הטקסט שהוקלד הוא קוד הבעלים. אם ADS_OWNER_CODE לא הוגדר — תמיד לא. */
export function isOwnerCode(raw: unknown): boolean {
    const secret = normalize(env.ADS_OWNER_CODE ?? '');
    if (!secret) return false;
    return typeof raw === 'string' && normalize(raw) === secret;
}
