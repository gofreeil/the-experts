// ============================================================
// adOwner.ts — עזרי תצוגה לדשבורד המפרסם (/about/advertise/manage)
// סטטוס, תוקף, אחוזי הקלקה ותאריכים בעברית — מקום אחד לשני העמודים
// (רשימת הנכסים ודף הנכס הבודד).
// ============================================================

import { LOCALE_META, DEFAULT_LOCALE, type Locale } from './i18n';
import { createTranslator } from './i18n/translate';

export type AdStatusKind = 'pending' | 'approved' | 'rejected';

/** מתחת לזה מוצגת קריאה לחידוש הפרסום */
export const RENEW_WARNING_DAYS = 7;

export interface StatusView {
    label: string;
    hint: string;
    /** ערכת צבע לגלולה — הדף מתרגם לקלאסים */
    tone: 'amber' | 'emerald' | 'rose' | 'slate';
}

/** מספר הימים שנותרו לפרסום. null = בלי תוקף (טרם אושרה). */
export function daysLeft(expiresAt: string | null | undefined): number | null {
    if (!expiresAt) return null;
    const ts = Date.parse(expiresAt);
    if (Number.isNaN(ts)) return null;
    return Math.ceil((ts - Date.now()) / (24 * 60 * 60 * 1000));
}

export function isExpired(status: AdStatusKind, expiresAt: string | null | undefined): boolean {
    const left = daysLeft(expiresAt);
    return status === 'approved' && left !== null && left <= 0;
}

export function needsRenewal(status: AdStatusKind, expiresAt: string | null | undefined): boolean {
    const left = daysLeft(expiresAt);
    return status === 'approved' && left !== null && left > 0 && left <= RENEW_WARNING_DAYS;
}

export function statusView(status: AdStatusKind, expiresAt?: string | null, paused = false, locale: Locale = DEFAULT_LOCALE): StatusView {
    const { t, tn } = createTranslator(locale);
    if (status === 'rejected') {
        return { label: t('owner.rejected'), hint: t('owner.rejectedHint'), tone: 'rose' };
    }
    if (status === 'pending') {
        return { label: t('owner.pending'), hint: t('owner.pendingHint'), tone: 'amber' };
    }
    // מושהית בידי המנהל — לא באוויר, אבל הימים שנותרו לה שמורים
    if (paused) {
        return { label: t('owner.paused'), hint: t('owner.pausedHint'), tone: 'slate' };
    }
    if (isExpired('approved', expiresAt)) {
        return { label: t('owner.expired'), hint: t('owner.expiredHint'), tone: 'slate' };
    }
    const left = daysLeft(expiresAt);
    return {
        label: t('owner.live'),
        hint: left === null ? t('owner.liveHint') : tn('owner.daysLeft', left),
        tone: 'emerald',
    };
}

/** "28.07.2026" / "Jul 28, 2026" — ריק אם אין תאריך.
 *  באנגלית החודש במילים: תאריך מספרי כמו 03/04 נקרא אחרת בארה"ב ובשאר העולם. */
export function fmtDate(iso: string | null | undefined, locale: Locale = DEFAULT_LOCALE): string {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString(
        LOCALE_META[locale].bcp47,
        locale === 'he' ? { day: '2-digit', month: '2-digit', year: 'numeric' } : { day: 'numeric', month: 'short', year: 'numeric' }
    );
}

/** אחוז ההקלקה — "4.2%" (ריק כשאין חשיפות בכלל) */
export function ctr(clicks: number, impressions: number): string {
    if (!impressions) return '—';
    return `${((clicks / impressions) * 100).toFixed(1)}%`;
}
