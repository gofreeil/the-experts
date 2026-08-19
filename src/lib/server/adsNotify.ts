// ============================================================
// adsNotify.ts — התראה על בקשת פרסום חדשה (בדגם של public-rating-il).
//
// לאתר הזה אין תיבת הודעות משלו, אבל הוא יושב על אותו Strapi משותף
// כמו שאר אתרי הרשת — ולכן ההתראה נשלחת לאוסף messages המשותף,
// ונוחתת בתיבת ההודעות של האדמין ב"קהילה בשכונה". בלי זה פרסומת
// נשמרת כ"ממתינה לאישור" בשקט מוחלט ואיש לא יודע עליה.
//
// נמענים: הסופר-אדמינים (תיבות פר-תפקיד-אתר — בהמשך).
// ============================================================

import { strapiGet, strapiPost } from './strapiClient';
import { env } from '$env/dynamic/private';

const SITE_NAME = 'המומחים של העם';
const ADMIN_ROLES = ['super_admin'];

/** מזהי כל הנמענים ב-Strapi המשותף. שגיאה כאן מחזירה [] ולא מפילה כלום. */
async function resolveAdminUserIds(): Promise<number[]> {
    const ids = new Set<number>();
    const notifyEmail = (env.ADS_NOTIFY_EMAIL ?? '').trim().toLowerCase();
    if (notifyEmail) {
        try {
            const users = await strapiGet<Array<{ id: number }>>('/api/users', {
                'filters[email][$eq]': notifyEmail,
            });
            if (Array.isArray(users) && users[0]?.id) ids.add(users[0].id);
        } catch {
            /* ממשיכים לרשימת התפקידים */
        }
    }
    try {
        const params: Record<string, string> = { 'pagination[limit]': '100' };
        ADMIN_ROLES.forEach((r, i) => { params[`filters[app_role][$in][${i}]`] = r; });
        const users = await strapiGet<Array<{ id: number }>>('/api/users', params);
        if (Array.isArray(users)) {
            for (const u of users) if (u?.id) ids.add(u.id);
        }
    } catch {
        /* בלי רשימת אדמינים נסתפק במה שכבר נאסף */
    }
    return [...ids];
}

/**
 * התראה על בקשת פרסום. best-effort במלוא מובן המילה: כל כשל נבלע —
 * פרסומת לא תיפול בגלל התראה.
 *
 * מפרסם ששב לשפר מודעה קיימת מקבל ניסוח משלו: "עדכון" ולא "חדשה", כי
 * האישור יחליף את הישנה במקום להוסיף מודעה שנייה לצידה.
 */
export async function notifyAdminsNewAd(info: {
    adTitle: string;
    advertiserName?: string | null;
    advertiserEmail?: string | null;
    durationLabel?: string | null;
    usedOwnerCode?: boolean;
    /** כותרת המודעה הקודמת של אותו מפרסם — קיימת רק כששליחה היא שדרוג */
    replacesTitle?: string;
    /** האם אותה קודמת באמת על האתר (ורק אז האישור מחליף אותה) */
    replacesLive?: boolean;
}): Promise<void> {
    try {
        const receivers = await resolveAdminUserIds();
        if (receivers.length === 0) {
            console.warn('[ads] no notify recipient resolved — skipping new-ad notification');
            return;
        }
        const who = info.advertiserEmail
            ? `${info.advertiserName || 'ללא שם'} (${info.advertiserEmail})`
            : (info.advertiserName || 'משתמש לא מזוהה');
        const isUpdate = Boolean(info.replacesTitle);
        const content =
            (isUpdate
                ? `🔄 עדכון למודעה קיימת — ${SITE_NAME}\n`
                : `📢 בקשת פרסום חדשה — ${SITE_NAME}\n`) +
            `פרסומת: "${info.adTitle}"\n` +
            (isUpdate
                ? `הגרסה הקודמת: "${info.replacesTitle}"${info.replacesLive ? '' : ' (לא על האתר)'}\n`
                : '') +
            `מי שלח: ${who}\n` +
            (info.durationLabel ? `תקופה מבוקשת: ${info.durationLabel}\n` : '') +
            `תשלום: ${info.usedOwnerCode ? 'קוד בעלים' : 'ממתין לתשלום'}\n` +
            (isUpdate && info.replacesLive
                ? `עם האישור הגרסה החדשה נכנסת במקום הישנה — אותה משבצת, אותו תאריך סיום, והישנה יורדת מהאתר.\n`
                : '') +
            `המודעה ממתינה לאישור ב-experts.gofreeil.com/admin/ads`;
        await Promise.all(receivers.map(receiver =>
            strapiPost('/api/messages', { data: { receiver, content, read: false } })
        ));
    } catch (err) {
        console.warn('[ads] new-ad notification failed:', err instanceof Error ? err.message : err);
    }
}

/** הודעה נפרדת על שימוש בקוד הבעלים — נשמרת כהתראה ייעודית. */
export async function notifyOwnerCodeUse(info: {
    adTitle: string;
    durationLabel?: string | null;
    submitter?: { name?: string | null; email?: string | null } | null;
}): Promise<void> {
    try {
        const receivers = await resolveAdminUserIds();
        if (receivers.length === 0) {
            console.warn('[ads] no notify recipient resolved — skipping owner notification');
            return;
        }
        const who = info.submitter?.email
            ? `${info.submitter.name || 'ללא שם'} (${info.submitter.email})`
            : 'משתמש לא מחובר';
        const content =
            `📢 שימוש בקוד בעלים — ${SITE_NAME}\n` +
            `פרסומת: "${info.adTitle}"\n` +
            `מי השתמש: ${who}\n` +
            (info.durationLabel ? `תקופה מבוקשת: ${info.durationLabel}\n` : '') +
            `המודעה ממתינה לאישור ב-experts.gofreeil.com/admin/ads`;
        await Promise.all(receivers.map(receiver =>
            strapiPost('/api/messages', { data: { receiver, content, read: false } })
        ));
    } catch (err) {
        console.warn('[ads] owner-code notification failed:', err instanceof Error ? err.message : err);
    }
}
