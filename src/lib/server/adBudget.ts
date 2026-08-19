// ============================================================
// adBudget.ts — אכיפת תקרות המשקל גם בצד השרת.
// הבילדר כבר מכווץ ואוכף בצד הלקוח (adPayloadBudget), אבל בקשה
// ישירה ל-API עוקפת אותו — ולכן אותן תקרות נבדקות שוב כאן:
//   • 220KB לכל תמונה (data-URI, לפי בייטים מקורבים של ה-base64)
//   • 600KB לכל המודעה (koa-body של Strapi חותך בקשות ב-1MB)
// חריגה מחזירה שגיאה שהמפרסם יכול לתקן — לא 413 עירום מ-Strapi.
// ============================================================

export const SERVER_IMAGE_MAX_BYTES = 220 * 1024;
export const SERVER_AD_MAX_BYTES = 600 * 1024;

function dataUriBytes(v: unknown): number {
    if (typeof v !== 'string' || !v.startsWith('data:')) return 0;
    const i = v.indexOf(',');
    const b64 = i >= 0 ? v.slice(i + 1) : v;
    return Math.ceil((b64.length * 3) / 4);
}

/**
 * בודק את כל תמונות המודעה ואת המשקל הכולל. מחזיר הודעת שגיאה בעברית,
 * או null כשהכול בגבולות.
 */
export function adPayloadIssue(payload: {
    logo?: unknown;
    mainImage?: unknown;
    landing?: { image?: unknown; products?: Array<{ image?: unknown }> } | null;
}): string | null {
    const images: Array<[string, unknown]> = [
        ['הלוגו', payload.logo],
        ['התמונה הראשית', payload.mainImage],
        ['תמונת דף הנחיתה', payload.landing?.image],
        ...(Array.isArray(payload.landing?.products)
            ? payload.landing.products.map((p, i): [string, unknown] => [`תמונת מוצר ${i + 1}`, p?.image])
            : []),
    ];
    for (const [label, img] of images) {
        if (dataUriBytes(img) > SERVER_IMAGE_MAX_BYTES) {
            return `${label} כבדה מדי (מעל 220KB) — הקטינו אותה ונסו שוב`;
        }
    }
    const total = Buffer.byteLength(JSON.stringify(payload), 'utf8');
    if (total > SERVER_AD_MAX_BYTES) {
        return 'המודעה כולה כבדה מדי (מעל 600KB) — הקטינו או הסירו תמונה ונסו שוב';
    }
    return null;
}
