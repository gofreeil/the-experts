// נתונים ועזרים לדף הבית.
// הבעיות עצמן מגיעות מ-problemsStore. כל השאר כאן (סכומים שחולקו, מפגשים, ארכיון, מומחים)
// הוא נתוני הדגמה עד שיהיה להם שרת. DEMO_DATA=false מסיר את תווית "נתוני הדגמה" מהדף.
//
// שדות טקסט הם זוגות { he, en } ונפתרים בתצוגה ע"י i18n.l(...). מספרים, מזהים וסלאגים נשארים ניטרליים.

import type { Problem } from './problemsStore.svelte';
import { teamBySlug } from './teamsData';
import type { L10n, Locale } from './i18n';

export const DEMO_DATA = true;

/* ───────── תחומים ───────── */
export type CatSource = { slug: string; short: L10n; days: number; experts: number };
export type Cat = { slug: string; short: string; days: number; experts: number };

export const CATS: CatSource[] = [
    { slug: 'law',         short: { he: 'עורכי דין',     en: 'Lawyers' },            days: 12, experts: 42 },
    { slug: 'economy',     short: { he: 'כלכלה',         en: 'Economics' },          days: 9,  experts: 31 },
    { slug: 'education',   short: { he: 'חינוך',         en: 'Education' },          days: 21, experts: 27 },
    { slug: 'agriculture', short: { he: 'חקלאות',        en: 'Agriculture' },        days: 26, experts: 14 },
    { slug: 'technology',  short: { he: 'טכנולוגיה',     en: 'Technology' },         days: 33, experts: 58 },
    { slug: 'health',      short: { he: 'בריאות טבעית',  en: 'Natural health' },     days: 7,  experts: 24 },
    { slug: 'ethics',      short: { he: 'מוסר וקהילה',   en: 'Ethics & community' }, days: 18, experts: 19 },
    { slug: 'rights',      short: { he: 'מיצוי זכויות',  en: 'Securing rights' },    days: 16, experts: 36 }
];

export const catColor = (slug: string): string => (CATS.some((c) => c.slug === slug) ? `var(--c-${slug})` : 'var(--honey)');
export const catShort = (slug: string, locale: Locale): string =>
    CATS.find((c) => c.slug === slug)?.short[locale] ?? teamBySlug(slug, locale)?.name ?? slug;
export const catMeta = (slug: string): CatSource => CATS.find((c) => c.slug === slug) ?? CATS[0];

/* ───────── עיצוב ───────── */
export const fmt = (n: number): string => '₪' + Math.round(n).toLocaleString('en-US');
export const fmtShort = (n: number): string =>
    n >= 10000 ? '₪' + Math.round(n / 1000) + 'K' : n >= 1000 ? '₪' + (n / 1000).toFixed(1).replace('.0', '') + 'K' : '₪' + n;
export const fmtCompact = (n: number): string =>
    n >= 1e6 ? '₪' + (n / 1e6).toFixed(2).replace(/0$/, '') + 'M' : n >= 1000 ? '₪' + Math.round(n / 1000) + 'K' : '₪' + n;

/** פותח את כותרת הבעיה בכרטיסים בדף הבית */
export const NEED_PREFIX: L10n = { he: 'דרוש פתרון עבור:', en: 'Solution needed for:' };

/** הסכומים שמשתמש יכול להוסיף בלחיצה לפרס של בעיה ציבורית */
export const PLEDGE_AMOUNTS = [50, 100, 500];

/** דרגת הבעיה לפי הפרס, 1 עד 5 */
export const tierOf = (b: number): number => (b >= 20000 ? 5 : b >= 8000 ? 4 : b >= 2500 ? 3 : b >= 700 ? 2 : 1);

export const handsOf = (p: Problem): number => Math.max(p.hands ?? 0, p.solutions.length);
export const backersOf = (p: Problem): number => p.backers ?? 1;

/* ───────── כסף שחולק (הדגמה) ───────── */
export const MONTHS: L10n<string[]> = {
    he: ['נוב׳', 'דצמ׳', 'ינו׳', 'פבר׳', 'מרץ', 'אפר׳', 'מאי', 'יוני', 'יולי', 'אוג׳', 'ספט׳', 'אוק׳'],
    en: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']
};
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
    title: { he: 'ערעור על סירוב לקצבת נכות', en: 'Appeal of a denied disability allowance' },
    problem: {
        he: 'הבקשה נדחתה בלי הסבר אחרי 8 חודשים. המשפחה לא ידעה איך לערער.',
        en: 'The claim was rejected without explanation after 8 months. The family didn’t know how to appeal.'
    },
    solution: {
        he: 'עו״ד רונית כהן ניסחה ערעור מנומק וליוותה את הדיון. הערעור התקבל ושולם רטרואקטיבית.',
        en: 'Adv. Ronit Cohen drafted a well-reasoned appeal and accompanied the hearing. The appeal was accepted and paid retroactively.'
    },
    quote: {
        he: 'הייתי בטוח שאין מה לעשות. תוך שלושה שבועות היה לנו מכתב אישור ביד.',
        en: 'I was sure there was nothing to be done. Within three weeks we had an approval letter in hand.'
    },
    by: { he: 'דוד מ., העלה את הבעיה', en: 'David M., who posted the problem' },
    paid: 1200,
    days: 19,
    rating: '4.9'
};

/** פתרון שאושר ושולם. ex = המומחה שפתר (slug ב-expertsData). pub = בעיה ציבורית: רק היא מופיעה בשמה ברזומה. d = תיאור הבעיה. */
export type Solved = { t: L10n; c: string; ex: string; days: number; amt: number; pub: boolean; d?: L10n };

export const LEDGER: Solved[] = [
    { t: { he: 'אפליקציית רישום לחוגי קרית משה', en: 'Sign-up app for Kiryat Moshe classes' }, c: 'technology',  ex: 'yoav-shimoni',   days: 41, amt: 8000, pub: true,
      d: { he: 'שנים עשר חוגים התנהלו באקסל ובוואטסאפ. נבנתה אפליקציה שבה הורים נרשמים ומשלמים, ומדריכים רואים רשימות.', en: 'Twelve after-school classes were run through Excel and WhatsApp. An app was built where parents sign up and pay, and instructors see their rosters.' } },
    { t: { he: 'תוכנית לגינת מאכל ברחוב אחד', en: 'Edible-garden plan for a single street' }, c: 'agriculture', ex: 'sarah-levi',     days: 23, amt: 5400, pub: true,
      d: { he: 'רחוב שלם בלי תוכנית לגינה משותפת. הוכנה תוכנית נטיעה, השקיה ואחזקה, עם עלויות לכל מגרש.', en: 'A whole street with no plan for a shared garden. A planting, irrigation and maintenance plan was prepared, with costs for each plot.' } },
    { t: { he: 'מכתב התראה לעירייה על גינות', en: 'Warning letter to the municipality about gardens' }, c: 'law',         ex: 'yuval-mizrahi',  days: 9,  amt: 3500, pub: true,
      d: { he: 'ועד השכונה נאבק בעירייה על ניקיון רחובות וגינות ציבוריות. נוסח מכתב התראה לפני תביעה, והוגש בשם הוועד.', en: 'The neighborhood committee was battling the municipality over street cleaning and public gardens. A pre-lawsuit warning letter was drafted and submitted on the committee’s behalf.' } },
    { t: { he: 'מדריך מיצוי זכויות לעולים', en: 'Rights guide for new immigrants' }, c: 'rights',      ex: 'michal-avraham', days: 17, amt: 2900, pub: true,
      d: { he: 'עולים חדשים לא ידעו מה מגיע להם בשנה הראשונה. נכתב מדריך מסודר בעברית, ברוסית ובאנגלית.', en: 'New immigrants didn’t know what they were entitled to in their first year. A clear guide was written in Hebrew, Russian and English.' } },
    { t: { he: 'סדנת חינוך פיננסי לנוער', en: 'Financial-literacy workshop for teens' }, c: 'education',   ex: 'anat-rosen',     days: 27, amt: 2200, pub: true,
      d: { he: 'בני נוער סיימו תיכון בלי להבין אשראי וריבית. נבנתה סדנה בת שמונה מפגשים לגילאי 14 עד 17.', en: 'Teens were finishing high school without understanding credit and interest. An eight-session workshop was built for ages 14 to 17.' } },
    { t: { he: 'הסכם שכירות הוגן לדיירי הבניין', en: 'A fair lease for the building’s tenants' }, c: 'law',         ex: 'ronit-cohen',    days: 6,  amt: 1800, pub: true,
      d: { he: 'דיירי בניין חתמו על חוזים שונים וחד-צדדיים. נוסח הסכם אחיד והוגן שהדיירים יכולים לאמץ.', en: 'Tenants in one building had signed different, one-sided contracts. A uniform, fair agreement was drafted for the tenants to adopt.' } },
    { t: { he: 'מנגנון גישור לסכסוכי שכנים', en: 'Mediation process for neighbor disputes' }, c: 'ethics',      ex: 'dana-ashkenazi', days: 19, amt: 1500, pub: true,
      d: { he: 'סכסוכי שכנים הגיעו לבית משפט בלי ניסיון קודם להסדר. הוקם הליך גישור קצר וחינמי בשכונה.', en: 'Neighbor disputes were reaching court with no earlier attempt at a settlement. A short, free mediation process was set up in the neighborhood.' } },
    { t: { he: 'מדריך להפחתת חשבון חשמל בבניין', en: 'Guide to cutting the building’s electricity bill' }, c: 'economy',     ex: 'uri-ben-david',  days: 11, amt: 1100, pub: true,
      d: { he: 'חשבון החשמל של השטחים המשותפים עלה משנה לשנה. נכתב מדריך עם בדיקת כדאיות למעבר לספק אחר.', en: 'The electricity bill for the common areas rose year after year. A guide was written, including a check of whether switching suppliers pays off.' } },
    { t: { he: 'תוכנית תזונה לגיל השלישי', en: 'Nutrition plan for seniors' }, c: 'health',      ex: 'noa-green',      days: 8,  amt: 900,  pub: true,
      d: { he: 'קשישים בשכונה סבלו מתזונה לקויה ומחוסר ידע. נבנתה תוכנית תזונה פשוטה וזולה, מבוססת מחקר.', en: 'Seniors in the neighborhood suffered from poor nutrition and a lack of knowledge. A simple, inexpensive, research-based nutrition plan was built.' } },
    { t: { he: 'ייעוץ מיחזור משכנתא', en: 'Mortgage refinancing consultation' }, c: 'economy',     ex: 'uri-ben-david',  days: 4,  amt: 650,  pub: false },
    { t: { he: 'ערעור על קנס חניה בשכונה', en: 'Appeal of a parking fine in the neighborhood' }, c: 'law',         ex: 'yuval-mizrahi',  days: 3,  amt: 450,  pub: false },
    { t: { he: 'חוות דעת שנייה על תפריט לילד', en: 'Second opinion on a child’s meal plan' }, c: 'health',      ex: 'noa-green',      days: 2,  amt: 300,  pub: false }
];

/* ───────── מפגש מומחים (הדגמה) ───────── */
export const MEETUP = {
    first: '2026-11-11T20:00:00+02:00',
    periodDays: 28,
    number: 14,
    registered: 214,
    capacity: 500,
    speakers: [
        { name: { he: 'עו״ד רונית כהן', en: 'Adv. Ronit Cohen' }, team: 'law',         ini: { he: 'רכ', en: 'RC' } },
        { name: { he: 'יואב שמעוני',    en: 'Yoav Shimoni' },     team: 'technology',  ini: { he: 'יש', en: 'YS' } },
        { name: { he: 'ד״ר שרה לוי',    en: 'Dr. Sarah Levi' },   team: 'agriculture', ini: { he: 'של', en: 'SL' } }
    ],
    agenda: [
        { time: '20:00', t: { he: 'פתיחה וסיכום החודש', en: 'Opening and recap of the month' }, s: { he: 'מי קיבל כמה ועל מה', en: 'Who got how much, and for what' }, amt: '' },
        { time: '20:15', t: { he: 'חקלאות מקומית בעיר בתפוקה כפולה', en: 'Local urban agriculture at double the yield' }, s: { he: '3 מומחים מציגים תוכנית', en: '3 experts present a plan' }, amt: '₪100K' },
        { time: '20:50', t: { he: 'רמזורים חכמים נגד פקקים בירושלים', en: 'Smart traffic lights against Jerusalem’s jams' }, s: { he: 'דיון פתוח עם שאלות מהקהל', en: 'Open discussion with questions from the audience' }, amt: '₪36K' },
        { time: '21:15', t: { he: 'גינות מאכל בכל רחוב', en: 'Edible gardens on every street' }, s: { he: 'הצגת תוכנית הנדסית', en: 'Presentation of an engineering plan' }, amt: '₪22K' },
        { time: '21:30', t: { he: 'הצבעה וסיום', en: 'Vote and wrap-up' }, s: { he: 'איזה פתרון מקבל את הפרס', en: 'Which solution gets the reward' }, amt: '' }
    ]
};

/* ───────── ארכיון ודיונים (הדגמה) ───────── */
// n = מספר המפגש, date = תאריך ISO (מעוצב לפי השפה)
export const RECS = [
    { n: 13, date: '2026-09-09', t: { he: 'מי משלם על תיקון המדרכות?', en: 'Who pays to fix the sidewalks?' }, dur: '1:42:10', att: 187, dec: 3, c: 'law',
      d: { he: 'הוחלט להגיש בקשה משותפת של 14 ועדים, ולהציב עליה פרס ציבורי.', en: 'It was decided to file a joint request on behalf of 14 committees, and to put a public reward on it.' } },
    { n: 12, date: '2026-08-12', t: { he: 'זכויות קשישים: מה לא מנוצל', en: 'Seniors’ rights: what goes unused' }, dur: '1:28:45', att: 203, dec: 2, c: 'rights',
      d: { he: 'נולדה בעיית מפת ההטבות, שנמצאת עכשיו בין הבעיות הגדולות בלוח.', en: 'The benefits-map problem was born here, and it now sits among the largest problems on the board.' } },
    { n: 11, date: '2026-07-08', t: { he: 'רפואה משלימה ומערכת הבריאות: חיבור או התנגשות', en: 'Complementary medicine and the health system: partnership or clash?' }, dur: '1:55:20', att: 164, dec: 4, c: 'health',
      d: { he: 'סוכמו כללי אתיקה לייעוץ מרחוק, שאומצו על ידי הצוות.', en: 'Ethics rules for remote consultations were agreed on and adopted by the team.' } },
    { n: 10, date: '2026-06-10', t: { he: 'איך בונים אפליקציה לשכונה בלי תקציב', en: 'How to build an app for a neighborhood with no budget' }, dur: '1:37:02', att: 151, dec: 1, c: 'technology',
      d: { he: 'הוגדרה בעיית מערכת הרישום לחוגים והפרס שלה קפץ פי שישה.', en: 'The class sign-up system problem was defined, and its reward jumped sixfold.' } },
    { n: 9, date: '2026-05-13', t: { he: 'חינוך עצמאי: מה עובד בפועל', en: 'Independent education: what actually works' }, dur: '1:31:50', att: 142, dec: 2, c: 'education',
      d: { he: 'הוקמה קבוצת עבודה למערך שיעורים פתוח, והפרס עליו עלה פי שלושה.', en: 'A working group was set up for an open lesson-plan set, and its reward tripled.' } },
    { n: 8, date: '2026-04-08', t: { he: 'גינות מאכל בכל רחוב', en: 'Edible gardens on every street' }, dur: '1:22:30', att: 133, dec: 3, c: 'agriculture',
      d: { he: 'אושרה תוכנית פיילוט לשלושה רחובות, עם תקציב ראשוני מהפרסים.', en: 'A pilot plan for three streets was approved, with an initial budget drawn from the rewards.' } }
];

export const THREADS = [
    { t: { he: 'האם ראוי להגביל פרס מקסימלי לבעיה פרטית?', en: 'Should a private problem have a maximum reward?' }, c: 'ethics', r: 48, last: { he: 'לפני 12 דקות', en: '12 minutes ago' }, hot: true },
    { t: { he: 'איך מודדים שפתרון באמת פתר את הבעיה?', en: 'How do we measure whether a solution really solved the problem?' }, c: 'economy', r: 31, last: { he: 'לפני שעה', en: 'an hour ago' }, hot: true },
    { t: { he: 'הצעה: נאמנות מדורגת, שליש בבחירת הפותר והשאר באישור', en: 'Proposal: staged escrow, a third when the solver is chosen and the rest on approval' }, c: 'economy', r: 27, last: { he: 'לפני 3 שעות', en: '3 hours ago' }, hot: false },
    { t: { he: 'פרסום פתרונות ציבוריים בקוד פתוח', en: 'Publishing public solutions as open source' }, c: 'technology', r: 22, last: { he: 'אתמול', en: 'yesterday' }, hot: false },
    { t: { he: 'כללי אתיקה לייעוץ בריאות מרחוק', en: 'Ethics rules for remote health consultations' }, c: 'health', r: 19, last: { he: 'לפני יומיים', en: '2 days ago' }, hot: false },
    { t: { he: 'כמה מומחים צריכים לאשר פתרון בבעיה גדולה?', en: 'How many experts should approve a solution to a large problem?' }, c: 'law', r: 16, last: { he: 'לפני 3 ימים', en: '3 days ago' }, hot: false },
    { t: { he: 'מה עושים כשהפותר נעלם באמצע העבודה?', en: 'What do we do when the solver disappears mid-work?' }, c: 'rights', r: 14, last: { he: 'לפני 4 ימים', en: '4 days ago' }, hot: false },
    { t: { he: 'שקיפות: האם להציג את שם המעלה גם בבעיה פרטית?', en: 'Transparency: should the poster’s name be shown on a private problem too?' }, c: 'ethics', r: 11, last: { he: 'לפני שבוע', en: 'a week ago' }, hot: false }
];

/* המומחים (הדגמה) עברו ל-expertsData.ts, יחד עם הרזומה ורשימת הבעיות שכל אחד פתר. */

/* ───────── איך זה עובד ───────── */
export const STEPS = [
    {
        t: { he: 'הציבור מעלה בעיה', en: 'The public posts a problem' },
        d: { he: 'כללית או פרטית, ומציע עליה תשלום.', en: 'Public or private, with a payment offered for solving it.' },
        more: {
            he: ['בעיה כללית גלויה לכולם ואחרים יכולים להצטרף ולהוסיף לתשלום, בעיה פרטית גלויה רק למומחים מאומתים.', 'הסכום חופשי, מ-₪100 ועד ₪50,000, והכסף נשמר בנאמנות. ככל שהוא גדול יותר, המשבצת של הבעיה במפה גדולה יותר.'],
            en: ['A public problem is visible to everyone, and others can join and add to the payment; a private problem is visible only to verified experts.', 'The amount is up to you, from ₪100 to ₪50,000, and the money is held in escrow. The larger it is, the bigger the problem’s tile on the map.']
        }
    },
    {
        t: { he: 'המומחים מציעים פתרון', en: 'Experts propose solutions' },
        d: { he: 'המומחים מתכנסים ומעלים את פתרונותיהם.', en: 'Experts gather and submit their solutions.' },
        more: {
            he: ['מומחי התחום מקבלים התראה ויכולים להגיש הצעה.', 'לכל מומחה יש דירוג, זמן תגובה והיסטוריה של בעיות שפתר.'],
            en: ['Experts in the field are notified and can submit a proposal.', 'Every expert has a rating, a response time and a history of problems solved.']
        }
    },
    {
        t: { he: 'בוחרים פתרון', en: 'A solution is chosen' },
        d: { he: 'בעלי הבעיה והשותפים בה בוחרים את הפתרון שמוצא חן בעיניהם.', en: 'The problem’s owner and its partners pick the solution they like best.' },
        more: {
            he: ['כל ההצעות גלויות לבעלי הבעיה ולשותפים בה.', 'הבחירה נעשית לפי מה שמתאים להם, לא לפי סדר ההגשה.'],
            en: ['All proposals are visible to the problem’s owner and partners.', 'The choice is based on what suits them, not on the order of submission.']
        }
    },
    {
        t: { he: 'המערכת משלמת', en: 'The system pays' },
        d: { he: 'המערכת מעבירה את התשלום לפותרים.', en: 'The system transfers the payment to the solvers.' },
        more: {
            he: ['הכסף עובר רק אחרי שנבחר פתרון.', 'כל תשלום מתועד ומופיע ברשימת הפתרונות.'],
            en: ['Money moves only after a solution has been chosen.', 'Every payment is documented and appears in the solutions list.']
        }
    }
];
