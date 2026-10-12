import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { submitAd, normalizeLanding } from '$lib/server/adsStore';
import { isOwnerCode } from '$lib/server/adsCode';
import { notifyAdminsNewAd, notifyOwnerCodeUse } from '$lib/server/adsNotify';
import { adPayloadIssue } from '$lib/server/adBudget';
import { normalizePlanDays, planLabelWithPrice } from '$lib/adPlans';
import { createTranslator } from '$lib/i18n/translate';

// קליטת פרסומת חדשה מהבילדר — נשמרת ב-Strapi במצב "ממתינה לאישור".
// חובה להיות מחובר: מודעה בלי submitted_by היא מודעה בלי בעלים — המפרסם
// לא יכול לראות את הביצועים שלה, לערוך אותה או לחדש אותה לעולם.
export const POST: RequestHandler = async ({ request, locals }) => {
    const { t } = createTranslator(locals.locale);
    const session = await locals.auth();
    if (!session?.user) {
        throw error(401, t('api.loginToSubmit'));
    }

    let payload: any;
    try {
        payload = await request.json();
    } catch {
        throw error(400, t('api.badJson'));
    }

    for (const k of ['title', 'subtitle', 'mainImage', 'gradient']) {
        if (!payload?.[k] || typeof payload[k] !== 'string') {
            throw error(400, t('api.missingField', { field: k }));
        }
    }
    if (!payload.landing || typeof payload.landing !== 'object') {
        throw error(400, t('api.missingLanding'));
    }

    // אכיפת התקרות גם בשרת — הבילדר אוכף בצד הלקוח, אבל בקשה ישירה עוקפת אותו
    const weightIssue = adPayloadIssue(payload);
    if (weightIssue) throw error(413, weightIssue);

    // הקוד מאומת כאן, בשרת — לא סומכים על דגל payment מהדפדפן
    const usedOwnerCode = isOwnerCode(payload.ownerCode);
    const requestedDurationDays = normalizePlanDays(payload.requestedDurationDays);
    try {
        const ad = await submitAd({
            submittedBy: {
                id: String(session.user.id ?? ''),
                email: session.user.email ?? '',
                name: session.user.name ?? '',
            },
            title: payload.title,
            subtitle: payload.subtitle,
            payment: usedOwnerCode ? 'code' : 'pending',
            requestedDurationDays,
            hoverText: payload.hoverText ?? '',
            cta: payload.cta ?? '',
            gradient: payload.gradient,
            logo: payload.logo ?? '',
            mainImage: payload.mainImage,
            mainImageFit: payload.mainImageFit,
            // העיצוב מהבילדר (לוגו, רצועה, כותרת) — בלעדיו המודעה מתפרסמת
            // עם ברירות המחדל של האתר ולא עם מה שהמפרסם ראה על המסך
            adStyle: payload.adStyle,
            landing: normalizeLanding(payload.landing),
            // 'new' = המפרסם הגיע מדף המחירים וקנה משבצת נוספת. השליחה לא
            // מתקשרת למודעה הקיימת והאישור לא יוריד אותה.
            standalone: payload.intent === 'new',
        });
        // התראה על *כל* בקשת פרסום — בלעדיה פרסומת ממתינה בשקט מוחלט
        // ואיש לא יודע עליה. לא חוסמת ולא מפילה.
        // מפרסם ששב לשפר מודעה קיימת מקבל ניסוח משלו: "עדכון" ולא "חדשה".
        await notifyAdminsNewAd({
            adTitle: payload.title,
            advertiserName: session.user.name,
            advertiserEmail: session.user.email,
            durationLabel: planLabelWithPrice(requestedDurationDays),
            usedOwnerCode,
            replacesTitle: ad.replacesTitle,
            replacesLive: ad.replacesStatus === 'approved',
        });
        // התראה נפרדת על שימוש בקוד — נשמרת כדי לא לאבד את ההתראה הייעודית
        if (usedOwnerCode) {
            await notifyOwnerCodeUse({
                adTitle: payload.title,
                durationLabel: planLabelWithPrice(requestedDurationDays),
                submitter: { name: session.user.name, email: session.user.email },
            });
        }
        return json({ ok: true, id: ad.id, status: ad.status });
    } catch (err) {
        console.error('ads/submit failed:', err);
        // תקרת koa-body של Strapi (~1MB) — שגיאה שהמפרסם יכול לתקן בעצמו
        if (err instanceof Error && err.message.includes('→ 413')) {
            throw error(413, t('api.tooHeavy'));
        }
        throw error(502, t('api.submitFailed'));
    }
};
