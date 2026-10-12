import type { L10n } from '$lib/i18n';
import { SITE_NAMES } from '$lib/networkSites';

interface AdBase<T> {
    id: number;
    title: T;
    description: T;
    cta: T;
    href: string;
    image: string;
    color: string;
    imageHeight?: string;   // גובה מותאם לתמונה (ברירת מחדל: auto)
    imageScale?: number;    // זום על התמונה (ברירת מחדל: 1)
    hover?: T;              // טקסט tooltip בריחוף מעל כפתור ה-CTA
    gradientCss?: string;   // רקע כמחרוזת CSS מלאה (מודעות מהבילדר) — גובר על color
    /** מזהה המודעה ב-Strapi (רק למודעות מהבילדר) — למדידה בדשבורד המפרסם */
    adId?: string;
}

/** מודעה כפי שמוצגת: כל הטקסטים כבר בשפה הנוכחית */
export type Ad = AdBase<string>;

/** מודעה כפי שהיא מוגדרת כאן: טקסט יכול להיות זוג { he, en } או מחרוזת רגילה (מודעות מהבילדר) */
export type AdSource = AdBase<string | L10n>;

/** פרסומות רשת "יוצאים לחירות". לתצוגה: i18n.l(ads) */
export const ads: AdSource[] = [
    {
        id: 7,
        title: SITE_NAMES.community,
        description: { he: "כל יתרונות השכונה תחת קורת גג אחת", en: "All the neighborhood’s benefits under one roof" },
        cta: { he: "תהנה מכל היתרונות של הקהילה בשכונה שלך", en: "Enjoy everything the community in your neighborhood has to offer" },
        href: "https://community.gofreeil.com/",
        image: "/images/community-neighborhood.webp",
        color: "from-blue-500 to-purple-600"
    },
    {
        id: 1,
        title: SITE_NAMES.reconciliation,
        description: { he: "מתנדבים לתת לך עזרה מלאה בדין / פיוס בכל סיכסוך", en: "Volunteers ready to give you full help with legal proceedings or reconciliation in any dispute" },
        cta: { he: "יש לך סיכסוך? לחץ לפתרון", en: "In a dispute? Click for a solution" },
        href: "https://chachmim.gofreeil.com/",
        image: "/images/bati-hapius.webp",
        color: "from-orange-600 to-red-600"
    },
    {
        id: 9,
        title: SITE_NAMES.gemach,
        description: { he: 'כל הגמחים תחת קורת גג אחת', en: 'Every gemach (free-loan society) under one roof' },
        cta: { he: 'לאתר הגמ"ח הארצי', en: 'To the National Gemach site' },
        hover: { he: 'מצא כל גמח בקלות!', en: 'Find any gemach with ease!' },
        href: "https://gemach.gofreeil.com/",
        image: "/images/gemach-harzi.webp",
        color: "from-pink-600 via-fuchsia-600 to-purple-700",
    },
    {
        id: 2,
        title: SITE_NAMES.committees,
        description: { he: "מהפכת משילות העם על המוסדות", en: "A revolution in the people’s governance of its institutions" },
        cta: { he: "הכר והשתתף במהפכת משילות העם על מוסדותיו", en: "Get to know and join the people’s governance revolution" },
        href: "https://neighborhoods.gofreeil.com/",
        image: "/images/news/vaadei-shchunot.webp",
        color: "from-blue-600 to-cyan-600",
        imageHeight: "110px"
    },
    {
        id: 5,
        title: SITE_NAMES.watchdog,
        description: { he: "מבקרים את הרשויות, ממצים את זכות התושב", en: "Auditing the authorities and exercising residents’ rights" },
        cta: { he: "מבקרים את הרשויות, ממצים את זכות התושב", en: "Auditing the authorities and exercising residents’ rights" },
        href: "https://criticism.gofreeil.com/",
        image: "/images/mevaker-rashuyot.webp",
        color: "from-blue-700 to-indigo-700",
        imageHeight: "120px",
        imageScale: 1.2,
    },
    {
        id: 10,
        title: SITE_NAMES.rating,
        description: { he: "העם מדרג את הרשויות ועובדי הציבור", en: "The people rate the authorities and public servants" },
        cta: { he: "העם מדרג את הרשויות ועובדי הציבור", en: "The people rate the authorities and public servants" },
        href: "https://rating.gofreeil.com/",
        image: "/images/public-rating.webp",
        color: "from-indigo-600 to-blue-600",
        imageHeight: "110px",
        imageScale: 0.9,
    },
    {
        id: 8,
        title: SITE_NAMES.referendum,
        description: { he: "הבע דעתך על הסוגיות האקטואליות", en: "Have your say on the issues of the day" },
        cta: { he: "הבע דעתך על הסוגיות האקטואליות", en: "Have your say on the issues of the day" },
        hover: { he: "הבע דעתך על הסוגיות האקטואליות", en: "Have your say on the issues of the day" },
        href: "https://referendum.gofreeil.com/",
        image: "/images/referendum.webp",
        color: "from-purple-600 to-indigo-700"
    },
    {
        id: 3,
        title: SITE_NAMES.groupBuying,
        description: { he: "הוזל את ההוצאות שלך", en: "Cut your expenses" },
        cta: { he: "הצטרף לקבוצת הרכישה שלנו והוזל מיד את ההוצאות!", en: "Join our buying group and cut your expenses right away!" },
        href: "https://groups.gofreeil.com/",
        image: "/images/whatsapp_cta.webp",
        color: "from-green-800 to-emerald-900"
    },
    {
        id: 6,
        title: SITE_NAMES.professionals,
        description: { he: "חתמו על תנאי הקהילה ונותנים לנו הנחות והטבות יחודיות", en: "They’ve signed the community’s terms and give us exclusive discounts and perks" },
        cta: { he: "מחפש בעל מקצוע איכותי באזורך?", en: "Looking for a quality professional near you?" },
        href: "https://index.gofreeil.com/",
        image: "/images/professionals.webp",
        color: "from-yellow-500 to-orange-500",
        imageHeight: "110px"
    },
    {
        id: 11,
        title: SITE_NAMES.shop,
        description: { he: "מוצרים נבחרים לבריאות טבעית, חקלאות ביתית, טכנולוגיה ועוד", en: "Hand-picked products for natural health, home farming, technology and more" },
        cta: { he: "כנסו לחנות לחיים טובים יותר", en: "Visit the store for a better life" },
        hover: { he: "החנות שלנו!", en: "Our store!" },
        href: "https://shop.gofreeil.com/",
        image: "/images/shop.webp",
        color: "from-emerald-600 to-teal-700",
        imageHeight: "110px"
    }
];
