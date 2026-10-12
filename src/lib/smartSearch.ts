// חיפוש חכם לדף הבית: בעיות, מומחים ותחומים בשורה אחת.
// מעל מנוע הטקסט (search.ts) יש כאן שלוש שכבות:
//   1. הבנת שפה חופשית: "עורך דין מעל 5000" / "lawyer over 5000", "בעיות פרטיות מהשבוע" / "private this week",
//      "הכי גבוה" / "highest" הופכים לסינון וסדר, והשאר לטקסט לחיפוש.
//   2. מושגים: כל תחום מכיר עשרות מילים נרדפות (אפליקציה ← טכנולוגיה, קנס ← עורכי דין),
//      ולכן אפשר למצוא בעיה לפי נושא גם כשהמילה עצמה לא כתובה בה.
//   3. "האם התכוונת ל...": תיקון טעויות הקלדה מול אוצר המילים של האתר.
//
// החיפוש מותאם לשפת הגולש: לכל שפה יש לקסיקון משלה (מילות סינון, ביטויי סכום, מושגים), והאינדקס נבנה
// מהטקסטים בשפה הנוכחית. הנתונים עצמם דו-לשוניים, ולכן עברית ואנגלית מחפשות באותו מאגר.

import type { Problem } from './problemsStore.svelte';
import { catShort, fmt } from './homeData';
import { EXPERTS, type Expert } from './expertsData';
import { teamsFor, teamBySlug, type Team } from './teamsData';
import { resolve, type Locale } from './i18n';
import { createTranslator } from './i18n/translate';
import { buildVocab, editDistance, foldFinals, indexItems, levelOf, makeDoc, makePlan, normalizeHe, rank, suggest, type Doc, type Entry, type Plan, type Vocab } from './search';

/** מילים נרדפות ונושאים לכל תחום. נבדקות רק כשהחיפוש הרגיל לא מכסה, ומסומנות "קשור לתחום". */
export const CONCEPTS_HE: Record<string, string> = {
    law: 'עורך דין עורכת דין עוד משפט משפטי משפטית תביעה תביעות תובע ייצוגית חוזה חוזים הסכם שכירות שוכר משכיר ערעור ערר קנס קנסות דוח חניה בית משפט רשות רשויות עירייה חוק זכות צוואה ירושה יורשים גישור הגנה מכתב התראה ייפוי כוח נוטריון',
    economy: 'כסף כלכלה כלכלי תקציב משכנתא הלוואה ריבית חיסכון פנסיה השקעה מס מסים חשבון חשבונות חשמל מים ארנונה הוצאות עלות עלויות יקר זול מימון מיחזור ספק חברת אשראי חוב חובות יועץ פיננסי ביטוח',
    education: 'חינוך לימוד ללמוד בית ספר תלמיד תלמידים מורה מורים שיעור שיעורים בגרות מתמטיקה הוראה חוג חוגים גן ילדים נוער הורים ועד הורים סדנה קורס הדרכה מערך שיעור מדריך הכשרה',
    agriculture: 'חקלאות גינה גינות גינון צמחים צמח עצים עץ עצי הדר השקיה גידול ירקות פירות מאכל קומפוסט אדמה זרעים נטיעה גג ירוק חצר מחלה מחלות צמחים',
    technology: 'טכנולוגיה אפליקציה אפליקציות אתר אתרים תוכנה מחשב מחשבים רשת אינטרנט וויפי אבטחה סייבר דיגיטלי מערכת מערכות פיתוח קוד נתונים גיבוי שחזור מדפסת מצלמות סיסמה אימייל אפליקציית טלפון סמארטפון',
    health: 'בריאות רפואה רופא רופאה תזונה דיאטה סוכרת אלרגיה אלרגיות טיפול טבעי משלים צמחי מרפא שינה כאב כאבים מחלה תרופות ויטמינים קשישים גיל שלישי חוות דעת נשימה לחץ דם משקל',
    ethics: 'מוסר אתיקה גישור סכסוך סכסוכים מחלוקת מחלוקות קהילה קהילתי ועד ועדים שכנים שכנות לשון הרע התנהגות כללים הסכמה פיוס שלום יחסים משפחה ירושה מגשר',
    rights: 'זכויות זכות מיצוי הטבה הטבות קצבה קצבאות ביטוח לאומי נכות פנסיה עולים עולה חדש קליטה סל קליטה קשישים גמלה סיוע הנחה הנחות מענק מענקים רווחה שירותים רשות מדינה טפסים הגשה בקשה'
};

export const CONCEPTS_EN: Record<string, string> = {
    law: 'lawyer lawyers attorney law legal court lawsuit sue claim claims contract contracts agreement lease rent tenant landlord appeal fine fines ticket parking municipality municipal authority authorities city hall regulation will inheritance heir mediation defense warning letter power of attorney notary',
    economy: 'money economy economic economics budget mortgage loan interest savings save pension investment tax taxes bill bills electricity water property tax expenses cost costs expensive cheap funding refinance supplier provider credit debt debts financial advisor insurance',
    education: 'education learning study school student students teacher teachers lesson lessons matriculation math mathematics teaching class classes kindergarten children kids youth teens teenagers parents workshop course training curriculum guide',
    agriculture: 'agriculture farming garden gardens gardening plants plant trees tree citrus irrigation watering growing vegetables fruit edible compost soil seeds planting green roof yard disease diseases',
    technology: 'technology tech app apps application website websites software computer computers network internet wifi security cyber digital system systems development code data backup recovery printer cameras password email phone smartphone',
    health: 'health medicine medical doctor physician nutrition diet diabetes allergy allergies treatment natural complementary herbs herbal sleep pain illness disease medication vitamins seniors elderly second opinion breathing blood pressure weight',
    ethics: 'ethics moral morality mediation conflict conflicts dispute disputes community committee committees neighbors neighbours slander gossip behavior rules agreement reconciliation peace relationships family inheritance mediator',
    rights: 'rights right entitlement benefit benefits allowance allowances national insurance disability pension immigrants immigrant olim absorption seniors elderly grant grants welfare services state forms application apply discount discounts'
};

export const CONCEPTS: Record<Locale, Record<string, string>> = { he: CONCEPTS_HE, en: CONCEPTS_EN };

export type ProblemFilters = {
    min?: number;
    max?: number;
    type?: 'individual' | 'community';
    sinceDays?: number;
    sort?: 'bounty' | 'new';
};

export type Parsed = {
    /** הטקסט שנשאר לחיפוש אחרי שהוצאו הסינונים */
    text: string;
    filters: ProblemFilters;
    chips: string[];
    wantsExperts: boolean;
    wantsProblems: boolean;
};

const f = foldFinals;
const wordSet = (s: string) => new Set(s.split(' ').map(f));
const re = (src: string) => new RegExp(f(src), 'u');

/** הלקסיקון של שפה אחת: מילות סינון וביטויי סכום */
interface Lexicon {
    isPrivate: Set<string>;
    isPublic: Set<string>;
    today: Set<string>;
    week: Set<string>;
    month: Set<string>;
    newest: Set<string>;
    expertWords: Set<string>;
    problemWords: Set<string>;
    minRe: RegExp;
    maxRe: RegExp;
    betweenRe: RegExp;
    /** האם יחידת הסכום היא "מיליון" (אחרת אלפים) */
    isMillion: (unit: string) => boolean;
    /** כמה מילים צורכת הבעת "פרס גבוה" שמתחילה במילה i (0 = אין) */
    high: (words: string[], i: number) => number;
}

const HE_UNIT = String.raw`(?:\s*(אלף|אלפים|k|ק|מיליון)(?![א-תa-z]))?`;
const HE_NUM = String.raw`₪?\s*(\d+)` + HE_UNIT + String.raw`(?:\s*(?:שח|שקל|שקלים|₪))?`;
const HE_HIGH = wordSet('גבוה גבוהה גבוהות גבוהים גדול גדולה גדולות גדולים יקר יקרה יקרות יקרים משתלם משתלמת משתלמות');

const HE: Lexicon = {
    isPrivate: wordSet('פרטי פרטית פרטיות פרטיים'),
    isPublic: wordSet('ציבורי ציבורית ציבוריות ציבוריים קהילתי קהילתית קהילתיות'),
    today: wordSet('היום'),
    week: wordSet('השבוע בשבוע'),
    month: wordSet('החודש בחודש'),
    newest: wordSet('אחרונות אחרונה אחרון חדשות חדשה עדכניות טריות'),
    expertWords: wordSet('מומחה מומחים מומחית מומחיות'),
    problemWords: wordSet('בעיה בעיות משימה משימות'),
    minRe: re(String.raw`(?:^| )(?:מעל|יותר מ|מעבר ל|לפחות|גדול מ|מינימום)\s*ל?\s*` + HE_NUM),
    maxRe: re(String.raw`(?:^| )(?:עד|פחות מ|מתחת ל|לכל היותר|קטן מ|מקסימום)\s*ל?\s*` + HE_NUM),
    betweenRe: re(String.raw`(?:^| )בין\s*` + HE_NUM + String.raw`\s*(?:ל|ו|עד)\s*-?\s*` + HE_NUM),
    isMillion: (unit) => /^(מיליונ)$/.test(f(unit)),
    high: (words, i) => {
        const next = words[i + 1];
        if ((words[i] === f('הכי') || words[i] === f('פרס')) && next && HE_HIGH.has(next)) return 2;
        return 0;
    }
};

const EN_NUM = String.raw`₪?\s*(\d+)(?:\s*(k|thousand|million)(?![a-z]))?(?:\s*(?:nis|ils|shekels?|sheqels?|₪))?`;
const EN_TOP = wordSet('highest biggest largest richest top');
const EN_BIG = wordSet('high big large');
const EN_REWARD = wordSet('reward rewards bounty bounties prize prizes');

const EN: Lexicon = {
    isPrivate: wordSet('private individual'),
    isPublic: wordSet('public community communal'),
    today: wordSet('today'),
    week: wordSet('week weekly'),
    month: wordSet('month monthly'),
    newest: wordSet('newest latest recent recently fresh'),
    expertWords: wordSet('expert experts specialist specialists professional professionals'),
    problemWords: wordSet('problem problems task tasks challenge challenges'),
    minRe: re(String.raw`(?:^| )(?:over|above|more than|greater than|at least|minimum|min)\s*` + EN_NUM),
    maxRe: re(String.raw`(?:^| )(?:under|below|less than|up to|at most|no more than|maximum|max)\s*` + EN_NUM),
    betweenRe: re(String.raw`(?:^| )between\s*` + EN_NUM + String.raw`\s*(?:and|to)?\s*-?\s*` + EN_NUM),
    isMillion: (unit) => unit.toLowerCase() === 'million',
    high: (words, i) => {
        const w = words[i];
        const next = words[i + 1];
        if (EN_TOP.has(w)) return next && EN_REWARD.has(next) ? 2 : 1;
        if (EN_BIG.has(w) && next && EN_REWARD.has(next)) return 2;
        return 0;
    }
};

const LEXICONS: Record<Locale, Lexicon> = { he: HE, en: EN };

function amount(lex: Lexicon, digits: string, unit?: string): number {
    const n = parseInt(digits, 10);
    if (!unit) return n;
    return lex.isMillion(unit) ? n * 1_000_000 : n * 1000;
}

export function parseQuery(raw: string, locale: Locale = 'he'): Parsed {
    const lex = LEXICONS[locale];
    const { t } = createTranslator(locale);
    let s = ' ' + normalizeHe(raw) + ' ';
    const filters: ProblemFilters = {};
    const chips: string[] = [];

    const take = (rx: RegExp, apply: (m: RegExpExecArray) => void) => {
        const m = rx.exec(s);
        if (!m) return;
        apply(m);
        s = s.replace(rx, ' ');
    };

    take(lex.betweenRe, (m) => {
        const a = amount(lex, m[1], m[2]);
        const b = amount(lex, m[3], m[4]);
        filters.min = Math.min(a, b);
        filters.max = Math.max(a, b);
        chips.push(t('search.chipBetween', { min: fmt(filters.min), max: fmt(filters.max) }));
    });
    take(lex.minRe, (m) => {
        filters.min = amount(lex, m[1], m[2]);
        chips.push(t('search.chipMin', { n: fmt(filters.min) }));
    });
    take(lex.maxRe, (m) => {
        filters.max = amount(lex, m[1], m[2]);
        chips.push(t('search.chipMax', { n: fmt(filters.max) }));
    });

    const words = s.split(' ').filter(Boolean);
    const keep: string[] = [];
    let wantsExperts = false;
    let wantsProblems = false;
    for (let i = 0; i < words.length; i++) {
        const w = words[i];
        const consumed = lex.high(words, i);
        if (consumed) {
            filters.sort = 'bounty';
            i += consumed - 1;
        } else if (lex.isPrivate.has(w)) filters.type = 'individual';
        else if (lex.isPublic.has(w)) filters.type = 'community';
        else if (lex.today.has(w)) filters.sinceDays = 1;
        else if (lex.week.has(w)) filters.sinceDays = 7;
        else if (lex.month.has(w)) filters.sinceDays = 30;
        else if (lex.newest.has(w)) filters.sort = filters.sort ?? 'new';
        else if (lex.expertWords.has(w)) wantsExperts = true;
        else if (lex.problemWords.has(w)) wantsProblems = true;
        else keep.push(w);
    }
    if (filters.type) chips.push(t(filters.type === 'individual' ? 'search.chipPrivate' : 'search.chipPublic'));
    if (filters.sinceDays) chips.push(t(filters.sinceDays === 1 ? 'search.chipToday' : filters.sinceDays === 7 ? 'search.chipWeek' : 'search.chipMonth'));
    if (filters.sort === 'bounty') chips.push(t('search.chipHigh'));
    else if (filters.sort === 'new') chips.push(t('search.chipNew'));

    return { text: keep.join(' '), filters, chips, wantsExperts, wantsProblems };
}

const hasProblemFilter = (fl: ProblemFilters) => fl.min !== undefined || fl.max !== undefined || !!fl.type || !!fl.sinceDays;

function applyFilters(list: readonly Problem[], fl: ProblemFilters, now: number): Problem[] {
    const out = list.filter(
        (p) =>
            (fl.min === undefined || p.bounty >= fl.min) &&
            (fl.max === undefined || p.bounty <= fl.max) &&
            (!fl.type || p.type === fl.type) &&
            (!fl.sinceDays || now - p.createdAt <= fl.sinceDays * 86_400_000)
    );
    return out.sort(fl.sort === 'new' ? (a, b) => b.createdAt - a.createdAt : (a, b) => b.bounty - a.bounty);
}

// ───── אינדקס ─────

/** האינדקס הקבוע (מומחים, צוותים, מושגים) של שפה אחת — נבנה פעם אחת לשפה */
interface StaticIndex {
    experts: Expert[];
    realTeams: Team[];
    expertEntries: Entry<Expert>[];
    teamEntries: Entry<Team>[];
    conceptDocs: { slug: string; doc: Doc }[];
    expertConceptDocs: Map<string, Doc>;
    teamName: (slug: string) => string;
}

const staticIndexes: Partial<Record<Locale, StaticIndex>> = {};

function staticIndex(locale: Locale): StaticIndex {
    const cached = staticIndexes[locale];
    if (cached) return cached;

    const concepts = CONCEPTS[locale];
    const experts = resolve(EXPERTS, locale);
    const realTeams = teamsFor(locale).filter((t) => t.slug !== 'admin');
    const teamName = (slug: string) => teamBySlug(slug, locale)?.name ?? '';
    const conceptOf = (slug: string) => concepts[slug] ?? '';

    const built: StaticIndex = {
        experts,
        realTeams,
        teamName,
        expertEntries: indexItems(experts, (e) => [e.n, e.role, teamName(e.c), catShort(e.c, locale), ...e.skills, e.bio]),
        teamEntries: indexItems(realTeams, (t) => [t.name, catShort(t.slug, locale), t.desc]),
        conceptDocs: Object.entries(concepts).map(([slug, words]) => ({ slug, doc: makeDoc(words + ' ' + teamName(slug) + ' ' + catShort(slug, locale)) })),
        /** כל המומחים עם מילות המושגים של התחום שלהם, לשכבת "קשור לתחום" */
        expertConceptDocs: new Map<string, Doc>(
            experts.map((e) => [e.slug, makeDoc([e.n, e.role, teamName(e.c), catShort(e.c, locale), ...e.skills, e.bio, conceptOf(e.c)].join(' '))])
        )
    };
    staticIndexes[locale] = built;
    return built;
}

let cachedFor: readonly Problem[] | null = null;
let cachedLocale: Locale | null = null;
let cachedEntries: Entry<Problem>[] = [];
let cachedVocab: Vocab | null = null;
let cachedConceptDocs = new Map<string, Doc>();

function problemIndex(problems: readonly Problem[], locale: Locale) {
    const idx = staticIndex(locale);
    if (cachedFor !== problems || cachedLocale !== locale) {
        cachedFor = problems;
        cachedLocale = locale;
        const concepts = CONCEPTS[locale];
        const problemFields = (p: Problem) => [p.title, p.description, catShort(p.category, locale), idx.teamName(p.category)];
        cachedEntries = indexItems(problems, problemFields);
        cachedConceptDocs = new Map(problems.map((p) => [p.id, makeDoc([...problemFields(p), concepts[p.category] ?? ''].join(' '))]));
        cachedVocab = buildVocab([
            ...problems.flatMap((p) => [
                { text: p.title, weight: 3 },
                { text: p.description, weight: 1 },
                { text: catShort(p.category, locale), weight: 2 }
            ]),
            ...idx.experts.flatMap((e) => [
                { text: e.n, weight: 2 },
                { text: e.role, weight: 2 },
                { text: e.skills.join(' '), weight: 2 }
            ]),
            ...idx.realTeams.map((t) => ({ text: t.name, weight: 2 })),
            ...Object.values(concepts).map((w) => ({ text: w, weight: 1 }))
        ]);
    }
    return { entries: cachedEntries, vocab: cachedVocab!, conceptDocs: cachedConceptDocs };
}

// ───── חיפוש ─────

export type ProblemHit = { p: Problem; related: boolean };
export type ExpertHit = { e: Expert; related: boolean };

export type SmartResult = {
    query: string;
    parsed: Parsed;
    problems: ProblemHit[];
    experts: ExpertHit[];
    teams: Team[];
    totalProblems: number;
    totalExperts: number;
    /** תחומים שזוהו מהמושגים בשאילתה */
    concepts: Team[];
    /** השאילתה המתוקנת: מוצגת (usedCorrection) או מוצעת בלבד */
    corrected: string | null;
    usedCorrection: boolean;
    expertsFirst: boolean;
    empty: boolean;
};

const LIMITS = { problems: 6, experts: 4, teams: 3 };

/** התחומים שמילות השאילתה שייכות למושגים שלהם (לתצוגה: "הבנתי: תחום ..."). מילה שלמה, תחילת מילה או טעות הקלדה אחת, בלי התאמת אמצע מילה. */
function detectConcepts(plan: Plan, conceptDocs: { slug: string; doc: Doc }[]): string[] {
    const score = new Map<string, number>();
    const bump = (slug: string) => score.set(slug, (score.get(slug) ?? 0) + 1);
    plan.stems.forEach((qs, i) => {
        if (qs.length < 3) return;
        const next = plan.tokens[i + 1] ? plan.tokens[i] + ' ' + plan.tokens[i + 1] : null;
        for (const { slug, doc } of conceptDocs) {
            const hit = doc.stems.some((ds) => ds === qs || (!plan.short[i] && ds.startsWith(qs)) || (qs.length >= 5 && ds.length >= 5 && editDistance(qs, ds, 1) <= 1));
            if (hit || (next && (' ' + doc.text).includes(' ' + next))) bump(slug);
        }
    });
    return [...score.entries()].sort((a, b) => b[1] - a[1]).slice(0, 2).map(([slug]) => slug);
}

/**
 * problems = הבעיות כפי שמוצגות בשפה הנוכחית (localizeProblems), כך שהחיפוש רץ על מה שהגולש רואה.
 */
export function smartSearch(rawQuery: string, problems: readonly Problem[], locale: Locale = 'he', now = Date.now()): SmartResult {
    const parsed = parseQuery(rawQuery, locale);
    const { filters } = parsed;
    const idx = staticIndex(locale);
    const filtered = applyFilters(problems, filters, now);
    const filteredIds = new Set(filtered.map((p) => p.id));
    const blank: SmartResult = {
        query: rawQuery, parsed, problems: [], experts: [], teams: [], totalProblems: 0, totalExperts: 0, concepts: [],
        corrected: null, usedCorrection: false, expertsFirst: parsed.wantsExperts && !parsed.wantsProblems, empty: true
    };
    if (!parsed.text) {
        // רק סינון ("מעל 5000", "פרטיות"): כל הבעיות שעוברות אותו
        if (!hasProblemFilter(filters) && !filters.sort && !parsed.wantsExperts && !parsed.wantsProblems) return blank;
        if (parsed.wantsExperts && !parsed.wantsProblems && !hasProblemFilter(filters)) {
            const ex = [...idx.experts].sort((a, b) => b.solved - a.solved);
            return { ...blank, experts: ex.slice(0, LIMITS.experts).map((e) => ({ e, related: false })), totalExperts: ex.length, empty: ex.length === 0 };
        }
        const hits = filtered.map((p) => ({ p, related: false }));
        return { ...blank, problems: hits.slice(0, LIMITS.problems), totalProblems: hits.length, empty: hits.length === 0 };
    }

    const { entries, vocab, conceptDocs: problemConceptDocs } = problemIndex(problems, locale);
    const candidates = entries.filter((e) => filteredIds.has(e.item.id));
    // סדר הכניסה קובע שוויון בדירוג: הפרס הגבוה (או החדש) קודם
    const order = new Map(filtered.map((p, i) => [p.id, i]));
    candidates.sort((a, b) => order.get(a.item.id)! - order.get(b.item.id)!);
    const onlyProblems = hasProblemFilter(filters);

    const run = (text: string) => {
        const plan = makePlan(text);
        return {
            plan,
            pr: rank(plan, candidates),
            ex: onlyProblems ? [] : rank(plan, idx.expertEntries),
            tm: onlyProblems ? [] : rank(plan, idx.teamEntries)
        };
    };
    const exact = (r: ReturnType<typeof run>) => [...r.pr, ...r.ex, ...r.tm].filter((x) => x.score < 4).length;

    let res = run(parsed.text);
    let corrected: string | null = null;
    let usedCorrection = false;
    const sug = suggest(parsed.text, vocab);
    if (sug) {
        const alt = run(sug);
        if (exact(res) === 0 && exact(alt) > 0) {
            res = alt;
            corrected = sug;
            usedCorrection = true;
        } else if (exact(alt) > exact(res)) corrected = sug;
    }

    // התאמות סלחניות (טעות הקלדה קרובה) רק כשאין מספיק התאמות מדויקות, אחרת הן רעש
    const strong = <T>(list: { item: T; score: number }[]) => (list.filter((x) => x.score < 4).length >= 2 ? list.filter((x) => x.score < 4) : list);
    res = { ...res, pr: strong(res.pr), ex: strong(res.ex), tm: strong(res.tm) };

    const hitIds = new Set(res.pr.map((x) => x.item.id));
    const hitExperts = new Set(res.ex.map((x) => x.item.slug));
    const conceptSlugs = detectConcepts(res.plan, idx.conceptDocs);

    // קשורים לפי תחום: מה שלא נמצא בחיפוש עצמו, אבל מכוסה כשמוסיפים לו את מילות המושגים של התחום שלו
    // ("אפליקציה לחוגים" מוצאת בעיה בטכנולוגיה שמדברת על חוגים, גם בלי המילה אפליקציה)
    const relatedProblems: ProblemHit[] = [];
    const relatedExperts: ExpertHit[] = [];
    if (res.pr.length + res.ex.length < 8) {
        const relP: { p: Problem; l: number }[] = [];
        for (const p of filtered) {
            if (hitIds.has(p.id)) continue;
            const l = levelOf(res.plan, problemConceptDocs.get(p.id)!, false);
            if (l >= 0 && l <= 3) relP.push({ p, l });
        }
        relP.sort((a, b) => a.l - b.l);
        relatedProblems.push(...relP.slice(0, 3).map(({ p }) => ({ p, related: true })));
        if (!onlyProblems) {
            const relE: { e: Expert; l: number }[] = [];
            for (const e of idx.experts) {
                if (hitExperts.has(e.slug)) continue;
                const l = levelOf(res.plan, idx.expertConceptDocs.get(e.slug)!, false);
                if (l >= 0 && l <= 3) relE.push({ e, l });
            }
            relE.sort((a, b) => a.l - b.l || b.e.solved - a.e.solved);
            relatedExperts.push(...relE.slice(0, 3).map(({ e }) => ({ e, related: true })));
        }
    }

    const problemHits: ProblemHit[] = [...res.pr.map((x) => ({ p: x.item, related: false })), ...relatedProblems];
    const expertHits: ExpertHit[] = [...res.ex.map((x) => ({ e: x.item, related: false })), ...relatedExperts];
    const teamHits = res.tm.map((x) => x.item);
    const empty = problemHits.length + expertHits.length + teamHits.length === 0;

    return {
        query: rawQuery,
        parsed,
        problems: problemHits.slice(0, LIMITS.problems),
        experts: expertHits.slice(0, LIMITS.experts),
        teams: teamHits.slice(0, LIMITS.teams),
        totalProblems: problemHits.length,
        totalExperts: expertHits.length,
        concepts: conceptSlugs.map((s) => teamBySlug(s, locale)).filter((t): t is Team => !!t),
        corrected,
        usedCorrection,
        expertsFirst: parsed.wantsExperts && !parsed.wantsProblems,
        empty
    };
}
