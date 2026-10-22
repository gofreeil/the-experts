// ============================================================
// adGradient.ts — כיוון הגרדיאנט של כרטיס הפרסומת
// ------------------------------------------------------------
// באתר הזה הגרדיאנט נשמר כמחרוזת CSS מלאה (linear-gradient(135deg, …)),
// ובקהילה בשכונה - כזוג מחלקות Tailwind שמוחל בשני כיוונים שונים:
// bg-gradient-to-br ברצועה האלכסונית ו-bg-gradient-to-r ברצועת ה-CTA.
// כדי שמודעה שהופצה משם תיראה כאן בדיוק אותו דבר, אותם שני צבעים
// מוחלים כאן באותם שני כיוונים.
// ============================================================

/** ברירת המחדל כשלמודעה אין גרדיאנט שמור */
export const DEFAULT_AD_GRADIENT = 'linear-gradient(135deg, #f59e0b, #ea580c)';

const LEADING_DIRECTION = /^linear-gradient\(\s*(?:-?[\d.]+(?:deg|turn|rad|grad)|to\s+[a-z]+(?:\s+[a-z]+)?)\s*,/i;

/**
 * אותו גרדיאנט בכיוון אחר. מחרוזת שאינה linear-gradient עם כיוון
 * מפורש (או ריקה) חוזרת כמו-שהיא / כברירת המחדל.
 */
export function adGradient(css: string | null | undefined, direction: 'to bottom right' | 'to right'): string {
    const raw = (css ?? '').trim() || DEFAULT_AD_GRADIENT;
    return LEADING_DIRECTION.test(raw) ? raw.replace(LEADING_DIRECTION, `linear-gradient(${direction},`) : raw;
}

/** הרצועה האלכסונית שעל התמונה (bg-gradient-to-br בקהילה בשכונה) */
export const bandGradient = (css: string | null | undefined) => adGradient(css, 'to bottom right');

/** רצועת ה-CTA שמתחת לתמונה (bg-gradient-to-r בקהילה בשכונה) */
export const ctaGradient = (css: string | null | undefined) => adGradient(css, 'to right');
