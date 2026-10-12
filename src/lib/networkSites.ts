// ============================================================
// networkSites.ts - הרשימה הקנונית של כל אתרי רשת "יוצאים לחירות"
// משמשת את רשת הלוגואים במסך הברכה (WelcomeScreen) — כוללת את
// כל האתרים, כולל האתר הנוכחי עצמו. רשימה זהה קיימת בכל המאגרים
// של הרשת — עדכון כאן מחייב עדכון מקביל בכולם.
// (שונה מ-adsData.ts שמשמש לרוטציית פרסומות ומחליף את המודעה העצמית.)
// ============================================================

import type { L10n } from '$lib/i18n';

export interface NetworkSite {
    id: number;
    title: L10n;
    href: string;
    image: string;
    color: string;
}

/** שמות האתרים בשתי השפות — מקור יחיד, גם לרשת הלוגואים וגם לפרסומות הרשת (adsData) */
export const SITE_NAMES = {
    reconciliation: { he: 'בתי הפיוס', en: 'Houses of Reconciliation' },
    gemach: { he: 'הגמ"ח הארצי', en: 'The National Gemach' },
    community: { he: 'קהילה בשכונה', en: 'Neighborhood Community' },
    committees: { he: 'ועדי שכונות', en: 'Neighborhood Committees' },
    watchdog: { he: 'מבקר רשויות המדינה', en: 'State Authorities Watchdog' },
    rating: { he: 'דירוג ציבורי', en: 'Public Rating' },
    referendum: { he: 'משאלי העם', en: 'People’s Referendums' },
    groupBuying: { he: 'רכישות קבוצתיות', en: 'Group Purchases' },
    professionals: { he: 'בעלי מקצוע כשירים', en: 'Qualified Professionals' },
    shop: { he: 'חנות החירות', en: 'The Freedom Store' }
} satisfies Record<string, L10n>;

export const networkSites: NetworkSite[] = [
    {
        id: 1,
        title: SITE_NAMES.reconciliation,
        href: 'https://chachmim.gofreeil.com/',
        image: '/images/bati-hapius.webp',
        color: 'from-orange-600 to-red-600'
    },
    {
        id: 2,
        title: SITE_NAMES.gemach,
        href: 'https://gemach.gofreeil.com/',
        image: '/images/gemach-harzi.webp',
        color: 'from-pink-600 via-fuchsia-600 to-purple-700'
    },
    {
        id: 3,
        title: SITE_NAMES.community,
        href: 'https://community.gofreeil.com/',
        image: '/images/community-neighborhood.webp',
        color: 'from-blue-500 to-purple-600'
    },
    {
        id: 4,
        title: SITE_NAMES.committees,
        href: 'https://neighborhoods.gofreeil.com/',
        image: '/images/news/vaadei-shchunot.webp',
        color: 'from-blue-600 to-cyan-600'
    },
    {
        id: 5,
        title: SITE_NAMES.watchdog,
        href: 'https://criticism.gofreeil.com/',
        image: '/images/mevaker-rashuyot.webp',
        color: 'from-blue-700 to-indigo-700'
    },
    {
        id: 6,
        title: SITE_NAMES.rating,
        href: 'https://rating.gofreeil.com/',
        image: '/images/public-rating.webp',
        color: 'from-indigo-600 to-blue-600'
    },
    {
        id: 7,
        title: SITE_NAMES.referendum,
        href: 'https://referendum.gofreeil.com/',
        image: '/images/referendum.webp',
        color: 'from-purple-600 to-indigo-700'
    },
    {
        id: 8,
        title: SITE_NAMES.groupBuying,
        href: 'https://groups.gofreeil.com/',
        image: '/images/whatsapp_cta.webp',
        color: 'from-green-800 to-emerald-900'
    },
    {
        id: 9,
        title: SITE_NAMES.professionals,
        href: 'https://index.gofreeil.com/',
        image: '/images/professionals.webp',
        color: 'from-yellow-500 to-orange-500'
    },
    {
        id: 10,
        title: SITE_NAMES.shop,
        href: 'https://shop.gofreeil.com/',
        image: '/images/shop.webp',
        color: 'from-emerald-600 to-teal-700'
    }
];
