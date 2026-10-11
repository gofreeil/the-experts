// חיפוש חכם לדף הבית: בעיות, מומחים ותחומים בשורה אחת.
// מעל מנוע הטקסט העברי (search.ts) יש כאן שלוש שכבות:
//   1. הבנת שפה חופשית: "עורך דין מעל 5000", "בעיות פרטיות מהשבוע", "הכי גבוה"
//      הופכים לסינון וסדר, והשאר לטקסט לחיפוש.
//   2. מושגים: כל תחום מכיר עשרות מילים נרדפות (אפליקציה ← טכנולוגיה, קנס ← עורכי דין),
//      ולכן אפשר למצוא בעיה לפי נושא גם כשהמילה עצמה לא כתובה בה.
//   3. "האם התכוונת ל...": תיקון טעויות הקלדה מול אוצר המילים של האתר.

import type { Problem } from './problemsStore.svelte';
import { catShort, fmt } from './homeData';
import { EXPERTS, type Expert } from './expertsData';
import { teams, teamBySlug, type Team } from './teamsData';
import { buildVocab, editDistance, foldFinals, indexItems, levelOf, makeDoc, makePlan, normalizeHe, rank, suggest, type Doc, type Entry, type Plan, type Vocab } from './search';

/** מילים נרדפות ונושאים לכל תחום. נבדקות רק כשהחיפוש הרגיל לא מכסה, ומסומנות "קשור לתחום". */
export const CONCEPTS: Record<string, string> = {
    law: 'עורך דין עורכת דין עוד משפט משפטי משפטית תביעה תביעות תובע ייצוגית חוזה חוזים הסכם שכירות שוכר משכיר ערעור ערר קנס קנסות דוח חניה בית משפט רשות רשויות עירייה חוק זכות צוואה ירושה יורשים גישור הגנה מכתב התראה ייפוי כוח נוטריון',
    economy: 'כסף כלכלה כלכלי תקציב משכנתא הלוואה ריבית חיסכון פנסיה השקעה מס מסים חשבון חשבונות חשמל מים ארנונה הוצאות עלות עלויות יקר זול מימון מיחזור ספק חברת אשראי חוב חובות יועץ פיננסי ביטוח',
    education: 'חינוך לימוד ללמוד בית ספר תלמיד תלמידים מורה מורים שיעור שיעורים בגרות מתמטיקה הוראה חוג חוגים גן ילדים נוער הורים ועד הורים סדנה קורס הדרכה מערך שיעור מדריך הכשרה',
    agriculture: 'חקלאות גינה גינות גינון צמחים צמח עצים עץ עצי הדר השקיה גידול ירקות פירות מאכל קומפוסט אדמה זרעים נטיעה גג ירוק חצר מחלה מחלות צמחים',
    technology: 'טכנולוגיה אפליקציה אפליקציות אתר אתרים תוכנה מחשב מחשבים רשת אינטרנט וויפי אבטחה סייבר דיגיטלי מערכת מערכות פיתוח קוד נתונים גיבוי שחזור מדפסת מצלמות סיסמה אימייל אפליקציית טלפון סמארטפון',
    health: 'בריאות רפואה רופא רופאה תזונה דיאטה סוכרת אלרגיה אלרגיות טיפול טבעי משלים צמחי מרפא שינה כאב כאבים מחלה תרופות ויטמינים קשישים גיל שלישי חוות דעת נשימה לחץ דם משקל',
    ethics: 'מוסר אתיקה גישור סכסוך סכסוכים מחלוקת מחלוקות קהילה קהילתי ועד ועדים שכנים שכנות לשון הרע התנהגות כללים הסכמה פיוס שלום יחסים משפחה ירושה מגשר',
    rights: 'זכויות זכות מיצוי הטבה הטבות קצבה קצבאות ביטוח לאומי נכות פנסיה עולים עולה חדש קליטה סל קליטה קשישים גמלה סיוע הנחה הנחות מענק מענקים רווחה שירותים רשות מדינה טפסים הגשה בקשה'
};

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

const PRIVATE = wordSet('פרטי פרטית פרטיות פרטיים');
const PUBLIC = wordSet('ציבורי ציבורית ציבוריות ציבוריים קהילתי קהילתית קהילתיות');
const TODAY = wordSet('היום');
const WEEK = wordSet('השבוע בשבוע');
const MONTH = wordSet('החודש בחודש');
const NEWEST = wordSet('אחרונות אחרונה אחרון חדשות חדשה עדכניות טריות');
const HIGH = wordSet('גבוה גבוהה גבוהות גבוהים גדול גדולה גדולות גדולים יקר יקרה יקרות יקרים משתלם משתלמת משתלמות');
const EXPERT_WORDS = wordSet('מומחה מומחים מומחית מומחיות');
const PROBLEM_WORDS = wordSet('בעיה בעיות משימה משימות');

const UNIT = String.raw`(?:\s*(אלף|אלפים|k|ק|מיליון)(?![א-תa-z]))?`;
const NUM = String.raw`₪?\s*(\d+)` + UNIT + String.raw`(?:\s*(?:שח|שקל|שקלים|₪))?`;
const re = (src: string) => new RegExp(f(src), 'u');
const MIN_RE = re(String.raw`(?:^| )(?:מעל|יותר מ|מעבר ל|לפחות|גדול מ|מינימום)\s*ל?\s*` + NUM);
const MAX_RE = re(String.raw`(?:^| )(?:עד|פחות מ|מתחת ל|לכל היותר|קטן מ|מקסימום)\s*ל?\s*` + NUM);
const BETWEEN_RE = re(String.raw`(?:^| )בין\s*` + NUM + String.raw`\s*(?:ל|ו|עד)\s*-?\s*` + NUM);

function amount(digits: string, unit?: string): number {
    const n = parseInt(digits, 10);
    if (!unit) return n;
    return /^(מיליונ)$/.test(f(unit)) ? n * 1_000_000 : n * 1000;
}

export function parseQuery(raw: string): Parsed {
    let s = ' ' + normalizeHe(raw) + ' ';
    const filters: ProblemFilters = {};
    const chips: string[] = [];

    const take = (rx: RegExp, apply: (m: RegExpExecArray) => void) => {
        const m = rx.exec(s);
        if (!m) return;
        apply(m);
        s = s.replace(rx, ' ');
    };

    take(BETWEEN_RE, (m) => {
        const a = amount(m[1], m[2]);
        const b = amount(m[3], m[4]);
        filters.min = Math.min(a, b);
        filters.max = Math.max(a, b);
        chips.push(`פרס בין ${fmt(filters.min)} ל-${fmt(filters.max)}`);
    });
    take(MIN_RE, (m) => {
        filters.min = amount(m[1], m[2]);
        chips.push(`פרס מעל ${fmt(filters.min)}`);
    });
    take(MAX_RE, (m) => {
        filters.max = amount(m[1], m[2]);
        chips.push(`פרס עד ${fmt(filters.max)}`);
    });

    const words = s.split(' ').filter(Boolean);
    const keep: string[] = [];
    let wantsExperts = false;
    let wantsProblems = false;
    for (let i = 0; i < words.length; i++) {
        const w = words[i];
        const next = words[i + 1];
        if (w === f('הכי') && next && HIGH.has(next)) {
            filters.sort = 'bounty';
            i++;
        } else if (w === f('פרס') && next && HIGH.has(next)) {
            filters.sort = 'bounty';
            i++;
        } else if (PRIVATE.has(w)) filters.type = 'individual';
        else if (PUBLIC.has(w)) filters.type = 'community';
        else if (TODAY.has(w)) filters.sinceDays = 1;
        else if (WEEK.has(w)) filters.sinceDays = 7;
        else if (MONTH.has(w)) filters.sinceDays = 30;
        else if (NEWEST.has(w)) filters.sort = filters.sort ?? 'new';
        else if (EXPERT_WORDS.has(w)) wantsExperts = true;
        else if (PROBLEM_WORDS.has(w)) wantsProblems = true;
        else keep.push(w);
    }
    if (filters.type) chips.push(filters.type === 'individual' ? 'בעיות פרטיות' : 'בעיות ציבוריות');
    if (filters.sinceDays) chips.push(filters.sinceDays === 1 ? 'מהיום' : filters.sinceDays === 7 ? 'מהשבוע האחרון' : 'מהחודש האחרון');
    if (filters.sort === 'bounty') chips.push('מהפרס הגבוה');
    else if (filters.sort === 'new') chips.push('מהחדשות לישנות');

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

const teamName = (slug: string) => teamBySlug(slug)?.name ?? '';
const realTeams = teams.filter((t) => t.slug !== 'admin');

const expertEntries = indexItems(EXPERTS, (e) => [e.n, e.role, teamName(e.c), catShort(e.c), ...e.skills, e.bio]);
const teamEntries = indexItems(realTeams, (t) => [t.name, catShort(t.slug), t.desc]);
const conceptDocs = Object.entries(CONCEPTS).map(([slug, words]) => ({ slug, doc: makeDoc(words + ' ' + teamName(slug) + ' ' + catShort(slug)) }));
const conceptOf = (slug: string) => CONCEPTS[slug] ?? '';

/** כל המומחים עם מילות המושגים של התחום שלהם, לשכבת "קשור לתחום" */
const expertConceptDocs = new Map<string, Doc>(
    EXPERTS.map((e) => [e.slug, makeDoc([e.n, e.role, teamName(e.c), catShort(e.c), ...e.skills, e.bio, conceptOf(e.c)].join(' '))])
);

const problemFields = (p: Problem) => [p.title, p.description, catShort(p.category), teamName(p.category)];

let cachedFor: readonly Problem[] | null = null;
let cachedEntries: Entry<Problem>[] = [];
let cachedVocab: Vocab | null = null;
let cachedConceptDocs = new Map<string, Doc>();

function problemIndex(problems: readonly Problem[]) {
    if (cachedFor !== problems) {
        cachedFor = problems;
        cachedEntries = indexItems(problems, problemFields);
        cachedConceptDocs = new Map(problems.map((p) => [p.id, makeDoc([...problemFields(p), conceptOf(p.category)].join(' '))]));
        cachedVocab = buildVocab([
            ...problems.flatMap((p) => [
                { text: p.title, weight: 3 },
                { text: p.description, weight: 1 },
                { text: catShort(p.category), weight: 2 }
            ]),
            ...EXPERTS.flatMap((e) => [
                { text: e.n, weight: 2 },
                { text: e.role, weight: 2 },
                { text: e.skills.join(' '), weight: 2 }
            ]),
            ...realTeams.map((t) => ({ text: t.name, weight: 2 })),
            ...Object.values(CONCEPTS).map((w) => ({ text: w, weight: 1 }))
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
function detectConcepts(plan: Plan): string[] {
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

export function smartSearch(rawQuery: string, problems: readonly Problem[], now = Date.now()): SmartResult {
    const parsed = parseQuery(rawQuery);
    const { filters } = parsed;
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
            const ex = [...EXPERTS].sort((a, b) => b.solved - a.solved);
            return { ...blank, experts: ex.slice(0, LIMITS.experts).map((e) => ({ e, related: false })), totalExperts: ex.length, empty: ex.length === 0 };
        }
        const hits = filtered.map((p) => ({ p, related: false }));
        return { ...blank, problems: hits.slice(0, LIMITS.problems), totalProblems: hits.length, empty: hits.length === 0 };
    }

    const { entries, vocab, conceptDocs: problemConceptDocs } = problemIndex(problems);
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
            ex: onlyProblems ? [] : rank(plan, expertEntries),
            tm: onlyProblems ? [] : rank(plan, teamEntries)
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
    const conceptSlugs = detectConcepts(res.plan);

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
            for (const e of EXPERTS) {
                if (hitExperts.has(e.slug)) continue;
                const l = levelOf(res.plan, expertConceptDocs.get(e.slug)!, false);
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
        concepts: conceptSlugs.map((s) => teamBySlug(s)).filter((t): t is Team => !!t),
        corrected,
        usedCorrection,
        expertsFirst: parsed.wantsExperts && !parsed.wantsProblems,
        empty
    };
}
