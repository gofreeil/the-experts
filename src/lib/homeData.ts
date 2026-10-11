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

/** הסכומים שמשתמש יכול להוסיף בלחיצה לפרס של בעיה ציבורית */
export const PLEDGE_AMOUNTS = [50, 100, 500];

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

/** פתרון שאושר ושולם. ex = המומחה שפתר (slug ב-expertsData). pub = בעיה ציבורית: רק היא מופיעה בשמה ברזומה. d = תיאור הבעיה. */
export type Solved = { t: string; c: string; ex: string; days: number; amt: number; pub: boolean; d?: string };

export const LEDGER: Solved[] = [
    { t: 'אפליקציית רישום לחוגי קרית משה', c: 'technology',  ex: 'yoav-shimoni',   days: 41, amt: 8000, pub: true, d: 'שנים עשר חוגים התנהלו באקסל ובוואטסאפ. נבנתה אפליקציה שבה הורים נרשמים ומשלמים, ומדריכים רואים רשימות.' },
    { t: 'תוכנית לגינת מאכל ברחוב אחד',    c: 'agriculture', ex: 'sarah-levi',     days: 23, amt: 5400, pub: true, d: 'רחוב שלם בלי תוכנית לגינה משותפת. הוכנה תוכנית נטיעה, השקיה ואחזקה, עם עלויות לכל מגרש.' },
    { t: 'מכתב התראה לעירייה על גינות',    c: 'law',         ex: 'yuval-mizrahi',  days: 9,  amt: 3500, pub: true, d: 'ועד השכונה נאבק בעירייה על ניקיון רחובות וגינות ציבוריות. נוסח מכתב התראה לפני תביעה, והוגש בשם הוועד.' },
    { t: 'מדריך מיצוי זכויות לעולים',       c: 'rights',      ex: 'michal-avraham', days: 17, amt: 2900, pub: true, d: 'עולים חדשים לא ידעו מה מגיע להם בשנה הראשונה. נכתב מדריך מסודר בעברית, ברוסית ובאנגלית.' },
    { t: 'סדנת חינוך פיננסי לנוער',         c: 'education',   ex: 'anat-rosen',     days: 27, amt: 2200, pub: true, d: 'בני נוער סיימו תיכון בלי להבין אשראי וריבית. נבנתה סדנה בת שמונה מפגשים לגילאי 14 עד 17.' },
    { t: 'הסכם שכירות הוגן לדיירי הבניין',  c: 'law',         ex: 'ronit-cohen',    days: 6,  amt: 1800, pub: true, d: 'דיירי בניין חתמו על חוזים שונים וחד-צדדיים. נוסח הסכם אחיד והוגן שהדיירים יכולים לאמץ.' },
    { t: 'מנגנון גישור לסכסוכי שכנים',      c: 'ethics',      ex: 'dana-ashkenazi', days: 19, amt: 1500, pub: true, d: 'סכסוכי שכנים הגיעו לבית משפט בלי ניסיון קודם להסדר. הוקם הליך גישור קצר וחינמי בשכונה.' },
    { t: 'מדריך להפחתת חשבון חשמל בבניין',  c: 'economy',     ex: 'uri-ben-david',  days: 11, amt: 1100, pub: true, d: 'חשבון החשמל של השטחים המשותפים עלה משנה לשנה. נכתב מדריך עם בדיקת כדאיות למעבר לספק אחר.' },
    { t: 'תוכנית תזונה לגיל השלישי',        c: 'health',      ex: 'noa-green',      days: 8,  amt: 900,  pub: true, d: 'קשישים בשכונה סבלו מתזונה לקויה ומחוסר ידע. נבנתה תוכנית תזונה פשוטה וזולה, מבוססת מחקר.' },
    { t: 'ייעוץ מיחזור משכנתא',             c: 'economy',     ex: 'uri-ben-david',  days: 4,  amt: 650,  pub: false },
    { t: 'ערעור על קנס חניה בשכונה',        c: 'law',         ex: 'yuval-mizrahi',  days: 3,  amt: 450,  pub: false },
    { t: 'חוות דעת שנייה על תפריט לילד',    c: 'health',      ex: 'noa-green',      days: 2,  amt: 300,  pub: false }
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
    { n: 'מפגש 10', date: '10 ביוני 2026',   t: 'איך בונים אפליקציה לשכונה בלי תקציב', dur: '1:37:02', att: 151, dec: 1, c: 'technology', d: 'הוגדרה בעיית מערכת הרישום לחוגים והפרס שלה קפץ פי שישה.' },
    { n: 'מפגש 9',  date: '13 במאי 2026',    t: 'חינוך עצמאי: מה עובד בפועל', dur: '1:31:50', att: 142, dec: 2, c: 'education', d: 'הוקמה קבוצת עבודה למערך שיעורים פתוח, והפרס עליו עלה פי שלושה.' },
    { n: 'מפגש 8',  date: '8 באפריל 2026',   t: 'גינות מאכל בכל רחוב', dur: '1:22:30', att: 133, dec: 3, c: 'agriculture', d: 'אושרה תוכנית פיילוט לשלושה רחובות, עם תקציב ראשוני מהפרסים.' }
];

export const THREADS = [
    { t: 'האם ראוי להגביל פרס מקסימלי לבעיה פרטית?', c: 'ethics',     r: 48, last: 'לפני 12 דקות', hot: true },
    { t: 'איך מודדים שפתרון באמת פתר את הבעיה?',       c: 'economy',    r: 31, last: 'לפני שעה',      hot: true },
    { t: 'הצעה: נאמנות מדורגת, שליש בבחירת הפותר והשאר באישור', c: 'economy', r: 27, last: 'לפני 3 שעות', hot: false },
    { t: 'פרסום פתרונות ציבוריים בקוד פתוח',              c: 'technology', r: 22, last: 'אתמול',         hot: false },
    { t: 'כללי אתיקה לייעוץ בריאות מרחוק',                c: 'health',     r: 19, last: 'לפני יומיים',   hot: false },
    { t: 'כמה מומחים צריכים לאשר פתרון בבעיה גדולה?',      c: 'law',        r: 16, last: 'לפני 3 ימים',   hot: false },
    { t: 'מה עושים כשהפותר נעלם באמצע העבודה?',            c: 'rights',     r: 14, last: 'לפני 4 ימים',   hot: false },
    { t: 'שקיפות: האם להציג את שם המעלה גם בבעיה פרטית?',  c: 'ethics',     r: 11, last: 'לפני שבוע',     hot: false }
];

/* המומחים (הדגמה) עברו ל-expertsData.ts, יחד עם הרזומה ורשימת הבעיות שכל אחד פתר. */

/* ───────── איך זה עובד ───────── */
export const STEPS = [
    { t: 'הציבור מעלה בעיה', d: 'כללית או פרטית, ומציע עליה תשלום.',
      more: ['בעיה כללית גלויה לכולם ואחרים יכולים להצטרף ולהוסיף לתשלום, בעיה פרטית גלויה רק למומחים מאומתים.', 'הסכום חופשי, מ-₪100 ועד ₪50,000, והכסף נשמר בנאמנות. ככל שהוא גדול יותר, המשבצת של הבעיה במפה גדולה יותר.'] },
    { t: 'המומחים מציעים פתרון', d: 'המומחים מתכנסים ומעלים את פתרונותיהם.',
      more: ['מומחי התחום מקבלים התראה ויכולים להגיש הצעה.', 'לכל מומחה יש דירוג, זמן תגובה והיסטוריה של בעיות שפתר.'] },
    { t: 'בוחרים פתרון', d: 'בעלי הבעיה והשותפים בה בוחרים את הפתרון שמוצא חן בעיניהם.',
      more: ['כל ההצעות גלויות לבעלי הבעיה ולשותפים בה.', 'הבחירה נעשית לפי מה שמתאים להם, לא לפי סדר ההגשה.'] },
    { t: 'המערכת משלמת', d: 'המערכת מעבירה את התשלום ליוצרי הפתרון.',
      more: ['הכסף עובר רק אחרי שנבחר פתרון.', 'כל תשלום מתועד ומופיע ברשימת הפתרונות.'] }
];
