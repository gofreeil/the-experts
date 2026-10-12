import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAd, isAdOwner, updateAdContent, normalizeLanding } from '$lib/server/adsStore';
import { ownerCandidateKeys } from '$lib/server/ownership';
import { adPayloadIssue } from '$lib/server/adBudget';
import { createTranslator } from '$lib/i18n/translate';

// עריכה מחדש של מודעה קיימת בידי המפרסם שהעלה אותה (דשבורד הנכס →
// הבונה → שלב השליחה). תוכן בלבד: הסטטוס, התוקף, המסלול והתשלום
// נשארים כפי שהאדמין קבע, ורק edited_at מתעדכן.
export const PUT: RequestHandler = async ({ params, request, locals }) => {
    const { t } = createTranslator(locals.locale);
    const session = await locals.auth();
    if (!session?.user) throw error(401, t('api.loginToEdit'));

    const ad = await getAd(params.id);
    if (!ad) throw error(404, t('detail.notFound'));
    if (!isAdOwner(ownerCandidateKeys(session.user), ad)) {
        throw error(403, t('api.forbidden'));
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

    try {
        await updateAdContent(params.id, {
            title: payload.title,
            subtitle: payload.subtitle,
            hoverText: payload.hoverText ?? '',
            cta: payload.cta ?? '',
            gradient: payload.gradient,
            logo: payload.logo ?? '',
            mainImage: payload.mainImage,
            mainImageFit: payload.mainImageFit,
            // העיצוב שנקבע בבילדר נשמר גם בעריכה — בלעדיו עריכת טקסט
            // הייתה מאפסת את מיקום הלוגו, גובה הרצועה וצבע הכותרת
            adStyle: payload.adStyle,
            landing: normalizeLanding(payload.landing),
        });
    } catch (err) {
        console.error('ads PUT failed:', err);
        // תקרת koa-body של Strapi (~1MB) — שגיאה שהמפרסם יכול לתקן בעצמו
        if (err instanceof Error && err.message.includes('→ 413')) {
            throw error(413, t('api.tooHeavy'));
        }
        throw error(502, t('api.updateFailed'));
    }

    return json({ ok: true, id: params.id, status: ad.status });
};
