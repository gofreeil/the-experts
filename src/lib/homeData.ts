// נתונים ועזרים לדף הבית.
// הבעיות עצמן מגיעות מ-problemsStore. כל השאר כאן (סכומים שחולקו, מפגשים, ארכיון, מומחים)
// הוא נתוני הדגמה עד שיהיה להם שרת. DEMO_DATA=false מסיר את תווית "נתוני הדגמה" מהדף.

import type { Problem } from './problemsStore.svelte';
import { teamBySlug } from './teamsData';

export const DEMO_DATA = true;

/* ───────── תחומים ───────── */
export type Cat = { slug: string; short: string; days: number; experts: number };

export const CATS: Cat[] = [
    { slug: 'law',         short: 'עורכי דין',     days: 12, experts: 42 },
    { slug: 'economy',     short: 'כלכלה',         days: 9,  experts: 31 },
    { slug: 'education',   short: 'חינוך',         days: 21, experts: 27 },
    { slug: 'agriculture', short: 'חקלאות',        days: 26, experts: 14 },
    { slug: 'technology',  short: 'טכנולוגיה',     days: 33, experts: 58 },
    { slug: 'health',      short: 'בריאות טבעית',  days: 7,  experts: 24 },
    { slug: 'ethics',      short: 'מוסר וקהילה',   days: 18, experts: 19 },
    { slug: 'rights',      short: 'מיצוי זכויות',  days: 16, experts: 36 }
];

export const catColor = (slug: string): string => (CATS.some((c) => c.slug === slug) ? `var(--c-${slug})` : 'var(--honey)');
export const catShort = (slug: string): string => CATS.find((c) => c.slug === slug)?.short ?? teamBySlug(slug)?.name ?? slug;
export const catMeta = (slug: string): Cat => CATS.find((c) => c.slug === slug) ?? CATS[0];

/* ───────── עיצוב ───────── */
export const fmt = (n: number): string => '₪' + Math.round(n).toLocaleString('en-US');
export const fmtShort = (n: number): string =>
    n >= 10000 ? '₪' + Math.round(n / 1000) + 'K' : n >= 1000 ? '₪' + (n / 1000).toFixed(1).replace('.0', '') + 'K' : '₪' + n;
export const fmtCompact = (n: number): string =>
    n >= 1e6 ? '₪' + (n / 1e6).toFixed(2).replace(/0$/, '') + 'M' : n >= 1000 ? '₪' + Math.round(n / 1000) + 'K' : '₪' + n;

/** דרגת הבעיה לפי הפרס, 1 עד 5 */
export const tierOf = (b: number): number => (b >= 20000 ? 5 : b >= 8000 ? 4 : b >= 2500 ? 3 : b >= 700 ? 2 : 1);

export const handsOf = (p: Problem): number => Math.max(p.hands ?? 0, p.solutions.length);
export const backersOf = (p: Problem): number => p.backers ?? 1;

/* ───────── כסף שחולק (הדגמה) ───────── */
export const MONTHS = ['נוב׳', 'דצמ׳', 'ינו׳', 'פבר׳', 'מרץ', 'אפר׳', 'מאי', 'יוני', 'יולי', 'אוג׳', 'ספט׳', 'אוק׳'];
export const PAID = [41200, 52800, 63500, 71900, 88400, 97300, 109800, 118600, 132400, 147900, 161200, 176500];
export const PAID_TOTAL = PAID.reduce((s, v) => s + v, 0);
export const SPLIT: [string, number][] = [
    ['technology', 0.27], ['law', 0.19], ['rights', 0.14], ['economy', 0.11],
    ['health', 0.09], ['education', 0.08], ['agriculture', 0.07], ['ethics', 0.05]
];
export const SOLVED_COUNT = 412;
export const PAID_EXPERTS = 186;
export const MEDIAN_DAYS = 14;

/* ───────── פתרונות שהתקבלו (הדגמה) ───────── */
export const FEATURED = {
    title: 'ערעור על סירוב לקצבת נכות',
    problem: 'הבקשה נדחתה בלי הסבר אחרי 8 חודשים. המשפחה לא ידעה איך לערער.',
    solution: 'עו״ד רונית כהן ניסחה ערעור מנומק וליוותה את הדיון. הערעור התקבל ושולם רטרואקטיבית.',
    quote: 'הייתי בטוח שאין מה לעשות. תוך שלושה שבועות היה לנו מכתב אישור ביד.',
    by: 'דוד מ., העלה את הבעיה',
    paid: 1200,
    days: 19,
    rating: '4.9'
};

export const LEDGER = [
    { t: 'אפליקציית רישום לחוגי קרית משה', c: 'technology',  who: 'צוות קוד-קהילה',   days: 41, amt: 8000 },
    { t: 'תוכנית לגינת מאכל ברחוב אחד',    c: 'agriculture', who: 'ד״ר שרה לוי',      days: 23, amt: 5400 },
    { t: 'מכתב התראה לעירייה על גינות',    c: 'law',         who: 'עו״ד יובל מזרחי',  days: 9,  amt: 3500 },
    { t: 'מדריך מיצוי זכויות לעולים',       c: 'rights',      who: 'מיכל אברהם',       days: 17, amt: 2900 },
    { t: 'ייעוץ מיחזור משכנתא',             c: 'economy',     who: 'אורי בן-דוד',       days: 4,  amt: 650 },
    { t: 'חוות דעת שנייה על תפריט לילד',    c: 'health',      who: 'ד״ר נועה גרין',     days: 2,  amt: 300 }
];

/* ───────── מפגש מומחים (הדגמה) ───────── */
export const MEETUP = {
    first: '2026-11-11T20:00:00+02:00',
    periodDays: 28,
    number: 14,
    registered: 214,
    capacity: 500,
    speakers: [
        { name: 'עו״ד רונית כהן', team: 'law',         ini: 'רכ' },
        { name: 'יואב שמעוני',    team: 'technology',  ini: 'יש' },
        { name: 'ד״ר שרה לוי',    team: 'agriculture', ini: 'של' }
    ],
    agenda: [
        { time: '20:00', t: 'פתיחה וסיכום החודש', s: 'מי קיבל כמה ועל מה', amt: '' },
        { time: '20:15', t: 'מערכת ארצית לרישום לחוגי שכונה', s: '3 מומחים מציגים תוכנית', amt: '₪48K' },
        { time: '20:50', t: 'מודל מימון לגנים קהילתיים', s: 'דיון פתוח עם שאלות מהקהל', amt: '₪31K' },
        { time: '21:15', t: 'גינות מאכל בכל רחוב', s: 'הצגת תוכנית הנדסית', amt: '₪22K' },
        { time: '21:30', t: 'הצבעה וסיום', s: 'איזה פתרון מקבל את הפרס', amt: '' }
    ]
};

/* ───────── ארכיון ודיונים (הדגמה) ───────── */
export const RECS = [
    { n: 'מפגש 13', date: '9 בספטמבר 2026',  t: 'מי משלם על תיקון המדרכות?', dur: '1:42:10', att: 187, dec: 3, c: 'law',        d: 'הוחלט להגיש בקשה משותפת של 14 ועדים, ולהציב עליה פרס ציבורי.' },
    { n: 'מפגש 12', date: '12 באוגוסט 2026', t: 'זכויות קשישים: מה לא מנוצל', dur: '1:28:45', att: 203, dec: 2, c: 'rights',     d: 'נולדה בעיית מפת ההטבות, שנמצאת עכשיו בין הבעיות הגדולות בלוח.' },
    { n: 'מפגש 11', date: '8 ביולי 2026',    t: 'רפואה משלימה ומערכת הבריאות: חיבור או התנגשות', dur: '1:55:20', att: 164, dec: 4, c: 'health', d: 'סוכמו כללי אתיקה לייעוץ מרחוק, שאומצו על ידי הצוות.' },
    { n: 'מפגש 10', date: '10 ביוני 2026',   t: 'איך בונים אפליקציה לשכונה בלי תקציב', dur: '1:37:02', att: 151, dec: 1, c: 'technology', d: 'הוגדרה בעיית מערכת הרישום לחוגים והפרס שלה קפץ פי שישה.' }
];

export const THREADS = [
    { t: 'האם ראוי להגביל פרס מקסימלי לבעיה פרטית?', c: 'ethics',     r: 48, last: 'לפני 12 דקות', hot: true },
    { t: 'איך מודדים שפתרון באמת פתר את הבעיה?',       c: 'economy',    r: 31, last: 'לפני שעה',      hot: true },
    { t: 'הצעה: נאמנות מדורגת, שליש בבחירת הפותר והשאר באישור', c: 'economy', r: 27, last: 'לפני 3 שעות', hot: false },
    { t: 'פרסום פתרונות ציבוריים בקוד פתוח',              c: 'technology', r: 22, last: 'אתמול',         hot: false },
    { t: 'כללי אתיקה לייעוץ בריאות מרחוק',                c: 'health',     r: 19, last: 'לפני יומיים',   hot: false }
];

/* ───────── מומחים (הדגמה) ───────── */
export const EXPERTS = [
    { n: 'יואב שמעוני',    c: 'technology',  solved: 17, earned: 52300, rate: '4.9', rt: '5 שעות', open: 3, ini: 'יש' },
    { n: 'עו״ד רונית כהן', c: 'law',         solved: 23, earned: 41200, rate: '4.9', rt: '3 שעות', open: 2, ini: 'רכ' },
    { n: 'ד״ר שרה לוי',    c: 'agriculture', solved: 11, earned: 38900, rate: '4.8', rt: 'יום',    open: 1, ini: 'של' },
    { n: 'מיכל אברהם',     c: 'rights',      solved: 19, earned: 27600, rate: '4.8', rt: '4 שעות', open: 2, ini: 'מא' }
];

/* ───────── איך זה עובד ───────── */
export const STEPS = [
    { t: 'מעלים בעיה', d: 'ציבורית, שכל אחד יכול לראות ולהצטרף אליה, או פרטית, שרק מומחים מאומתים רואים.' },
    { t: 'מציבים פרס', d: 'אתם קובעים סכום ופותחים לאחרים להוסיף. הכסף נשמר בנאמנות ולא עובר לאף אחד.' },
    { t: 'מומחים מרימים יד', d: 'כל מומחה מציע פתרון ומחיר. אתם רואים דירוג והיסטוריה ובוחרים.' },
    { t: 'מאשרים ומשלמים', d: 'הפתרון נבדק, הפרס משתחרר, והפתרון נשמר בארכיון כדי שהבעיה הבאה תיפתר מהר יותר.' }
];
