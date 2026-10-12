// ============================================================
// adPlans.ts — מסלולי הפרסום באתר: תקופה + מחיר, בתשלום מראש.
// מקור אמת יחיד לדף "פרסם אצלנו" (/about/advertise) ולתנאי הפרסום.
// שינוי מחיר/תקופה נעשה כאן בלבד.
// זהה לרשימה שבשאר אתרי הרשת (הגמ"ח הארצי, רכישות קבוצתיות).
// ============================================================

import type { Locale } from './i18n';

export interface AdPlan {
    /** אורך הפרסום בימים */
    days: number;
    /** תווית קצרה (עברית — המנהל, המיילים וההודעות בשרת נשארים בעברית) */
    label: string;
    /** הניסוח המלא, כמו בשורת המחירון (עברית) */
    title: string;
    /** התווית הקצרה והניסוח המלא באנגלית, לדפי הציבור */
    labelEn: string;
    titleEn: string;
    /** מחיר בשקלים — תשלום מראש לכל התקופה */
    price: number;
}

export const adPlans: AdPlan[] = [
    { days: 7,   label: 'שבוע',    title: 'פרסום לשבוע',    labelEn: 'Week',      titleEn: 'One week of advertising',      price: 50 },
    { days: 30,  label: '30 יום',  title: 'פרסום ל-30 יום', labelEn: '30 days',   titleEn: '30 days of advertising',       price: 130 },
    { days: 90,  label: 'רבעון',   title: 'פרסום לרבעון',   labelEn: 'Quarter',   titleEn: 'One quarter of advertising',   price: 350 },
    { days: 180, label: 'חצי שנה', title: 'פרסום לחצי שנה', labelEn: 'Half year', titleEn: 'Half a year of advertising',   price: 600 },
    { days: 365, label: 'שנה',     title: 'פרסום לכל השנה', labelEn: 'Year',      titleEn: 'A full year of advertising',   price: 1000 },
];

/** שם המסלול לתצוגה בשפת הגולש */
export const planTitle = (p: AdPlan, locale: Locale): string => (locale === 'en' ? p.titleEn : p.title);
export const planShortLabel = (p: AdPlan, locale: Locale): string => (locale === 'en' ? p.labelEn : p.label);

/** ברירת המחדל — המסלול החודשי */
export const DEFAULT_PLAN_DAYS = 30;

/** כל ערך שמגיע מבחוץ מצומצם לאחד המסלולים */
export function normalizePlanDays(value: unknown): number {
    const days = Number(value);
    return adPlans.some((p) => p.days === days) ? days : DEFAULT_PLAN_DAYS;
}

export function planFor(value: unknown): AdPlan {
    const days = normalizePlanDays(value);
    return adPlans.find((p) => p.days === days) as AdPlan;
}

/** "חצי שנה" */
export const planLabel = (value: unknown): string => planFor(value).label;

/** "חצי שנה — 600 ₪" */
export const planLabelWithPrice = (value: unknown): string => {
    const p = planFor(value);
    return `${p.label} — ${p.price} ₪`;
};
