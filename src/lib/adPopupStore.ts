import { writable } from 'svelte/store';
import { ads, type AdSource } from './adsData';

// המאגר כאן נשאר דו-לשוני (AdSource); הפופ-אפ עצמו (MobileAdPopup) מתרגם בעת התצוגה,
// כך שהחפיסה והמצב השמור לא תלויים בשפה.

const STORAGE_KEY = 'ad_deck_v2';
const LEGACY_STORAGE_KEY = 'ad_deck';

// ============================================================
// הפופ-אפ בנייד: מפרסמים אמיתיים קודם, פרסומות רשת בדילול
// ------------------------------------------------------------
// מבנה זהה לשאר אתרי הרשת: שתי חפיסות - מפרסמים משולמים ופרסומות
// רשת - ופרסומת רשת משובצת רק אחת ל-NETWORK_AD_EVERY פופ-אפים.
// באתר הזה עוד אין מקור מודעות משולמות, ולכן registerPaidAds לא
// נקרא בינתיים והרשת ממלאה את כל הסבב; כשיחובר מקור - הדילול
// ייכנס לפעולה מעצמו.
// ============================================================

/** כל כמה פופ-אפים מוצגת פרסומת רשת אחת; השאר - מפרסמים משולמים */
const NETWORK_AD_EVERY = 4;

let paidAds: AdSource[] = [];

/** לרישום מודעות משולמות כשיהיה לאתר מקור כזה (ראו אתר הקהילה) */
export function registerPaidAds(list: AdSource[]): void {
    paidAds = list.filter(a => a.title && a.image && a.href);
}

function getNetworkAds(): AdSource[] {
    return ads.filter(a => a.title && a.description && a.image && a.href);
}

// Fisher-Yates shuffle
function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

interface DeckState { deck: string[]; pos: number }
interface PopupState { paid: DeckState; net: DeckState; count: number }

function emptyState(): PopupState {
    return { paid: { deck: [], pos: 0 }, net: { deck: [], pos: 0 }, count: 0 };
}

function loadState(): PopupState {
    if (typeof window === 'undefined') return emptyState();

    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const s = JSON.parse(raw) as PopupState;
            if (Array.isArray(s?.paid?.deck) && Array.isArray(s?.net?.deck)) {
                return {
                    paid:  { deck: s.paid.deck.map(String), pos: s.paid.pos | 0 },
                    net:   { deck: s.net.deck.map(String),  pos: s.net.pos | 0 },
                    count: (s.count | 0),
                };
            }
        }
    } catch {}

    return emptyState();
}

function saveState(state: PopupState) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        // המבנה הישן (חפיסה אחת מעורבבת) כבר לא בשימוש
        localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {}
}

/**
 * שולף את הפרסומת הבאה מחפיסה מסוג אחד (משולמות או רשת).
 * החפיסה נבנית מחדש כשהיא נגמרה או כשהמאגר השתנה - למשל פרסומת
 * שנוספה אחרי שהחפיסה נשמרה, או פרסומת שהוסרה.
 */
function drawFrom(state: DeckState, pool: AdSource[]): AdSource | null {
    if (!pool.length) return null;

    const poolIds = new Set(pool.map(a => String(a.id)));
    const stale = state.deck.length !== pool.length || state.deck.some(id => !poolIds.has(id));
    if (stale || state.pos >= state.deck.length) {
        state.deck = shuffle(pool.map(a => String(a.id)));
        state.pos = 0;
    }

    const id = state.deck[state.pos];
    state.pos += 1;
    return pool.find(a => String(a.id) === id) ?? pool[0];
}

function getNextAd(): AdSource | null {
    const paid = paidAds;
    const net = getNetworkAds();
    if (!paid.length && !net.length) return null;

    const state = loadState();

    // פרסומת רשת רק בכל פופ-אפ NETWORK_AD_EVERY-י; כל השאר - מפרסמים
    // אמיתיים. בלי מפרסמים משולמים - הרשת היא ה-fallback המלא.
    const networkTurn = state.count % NETWORK_AD_EVERY === NETWORK_AD_EVERY - 1;
    const useNetwork = !paid.length || (networkTurn && net.length > 0);

    const ad = useNetwork
        ? (drawFrom(state.net, net) ?? drawFrom(state.paid, paid))
        : (drawFrom(state.paid, paid) ?? drawFrom(state.net, net));

    if (ad) {
        state.count += 1;
        saveState(state);
    }
    return ad;
}

export const adPopup = writable<{ ad: AdSource; pendingHref?: string } | null>(null);

export function triggerAdPopup(pendingHref?: string): boolean {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) return false;
    const ad = getNextAd();
    if (!ad) return false;
    adPopup.set({ ad, pendingHref });
    return true;
}

export function closeAdPopup() {
    adPopup.set(null);
}
