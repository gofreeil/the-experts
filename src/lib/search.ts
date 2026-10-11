// ============================================================
// חיפוש טקסט עברי סלחני, בלי תלויות. שכבות מהמדויקת לסלחנית, כל שכבה נכנסת
// רק כשהקודמת נכשלה, כך שהתאמות "אמיתיות" תמיד מדורגות לפני ניחושים:
//   0  הטקסט מתחיל בשאילתה
//   1  הטקסט מכיל את השאילתה כרצף
//   2  כל מילה בשאילתה נמצאת (כחלק ממילה, או כשורש: חוגים↔חוג, לגמח↔גמח), בכל סדר
//   3  כתיב רופף: בלי אמות קריאה (א/ו/י), מלא/חסר: דויד↔דוד, ויטל↔ויטאל
//   4  השאילתה הוקלדה בפריסת מקלדת אנגלית ("dnj" במקום "גמח")
//   5  טעויות הקלדה: מרחק עריכה (Damerau-Levenshtein) לפי אורך המילה
// בנוסף: "האם התכוונת ל..." מול אוצר המילים של הרשימה עצמה (suggest).
// ============================================================

// ───── נורמליזציה ─────

const FINALS: Record<string, string> = { ך: 'כ', ם: 'מ', ן: 'נ', ף: 'פ', ץ: 'צ' };

/** איחוד אותיות סופיות לצורה הרגילה (שולחנ = שולחן). */
export const foldFinals = (s: string): string => s.replace(/[ךםןףץ]/g, (c) => FINALS[c]);

/** ניקוי בלי איחוד סופיות (לתצוגה): אותיות קטנות, בלי גרשיים/ניקוד, מפרידים לרווח. */
function light(s: string | null | undefined): string {
    return String(s ?? '')
        .toLowerCase()
        .replace(/["'׳״`‘’“”֑-ׇ]/g, '')
        .replace(/(\d)[.,](?=\d{3}(?!\d))/g, '$1') // 5,000 -> 5000
        .replace(/(\d)-(?=\d)/g, '$1') // 050-123 -> 050123
        .replace(/[-–—־/|,;:()[\]{}!?.׃]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

/** הצורה שעליה מושווה הכל: ניקוי + אותיות סופיות מאוחדות. */
export const normalizeHe = (s: string | null | undefined): string => foldFinals(light(s));

const MATER = /[אוי]/g;
/** כתיב רופף: בלי אמות קריאה. מילה שנשארת ממנה אות אחת לא מרופפת ("לוי" נשארת "לוי"). */
export function loosen(s: string): string {
    const l = s.replace(MATER, '');
    return l.length >= 2 ? l : s;
}

const CLITICS = 'הובלמשכ';
/** שורש גס: בלי אותיות שימוש בתחילה (עד שתיים) ובלי ים/ות בסוף. חוגים -> חוג, לגמח -> גמח. */
export function stem(t: string): string {
    let s = t;
    if (s.length >= 4 && CLITICS.includes(s[0])) {
        s = s.slice(1);
        if (s.length >= 4 && CLITICS.includes(s[0]) && 'וכמש'.includes(t[0])) s = s.slice(1);
    }
    if (s.length >= 5 && (s.endsWith('ימ') || s.endsWith('ות'))) s = s.slice(0, -2);
    else if (s.length >= 6 && s.endsWith('יות')) s = s.slice(0, -3);
    return s;
}

// מילים שלא מוסיפות משמעות לחיפוש
const STOP = new Set(['של', 'את', 'עמ', 'על', 'אל', 'או', 'גמ', 'כי', 'זה', 'זו', 'אני', 'לי', 'יש', 'אינ', 'לא', 'מה', 'איכ', 'איפ', 'צריכ', 'רוצה', 'מחפש', 'מחפשת', 'דרוש', 'דרושה', 'דרושימ'].map(foldFinals));

// ───── מרחק עריכה ─────

/** Damerau-Levenshtein עם יציאה מוקדמת כשחורגים מ-max. */
export function editDistance(a: string, b: string, max = 99): number {
    if (a === b) return 0;
    const la = a.length;
    const lb = b.length;
    if (Math.abs(la - lb) > max) return max + 1;
    let prev2: number[] = [];
    let prev: number[] = Array.from({ length: lb + 1 }, (_, j) => j);
    for (let i = 1; i <= la; i++) {
        const cur: number[] = [i];
        let rowMin = i;
        for (let j = 1; j <= lb; j++) {
            let v = Math.min(prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1), prev[j] + 1, cur[j - 1] + 1);
            if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, prev2[j - 2] + 1);
            cur[j] = v;
            if (v < rowMin) rowMin = v;
        }
        if (rowMin > max) return max + 1;
        prev2 = prev;
        prev = cur;
    }
    return prev[lb];
}

/** תקציב שגיאות לפי אורך: עד 3 אותיות אפס, 4-5 אחת, 6 ומעלה שתיים. */
export const typoBudget = (len: number): number => (len <= 3 ? 0 : len <= 5 ? 1 : 2);

function fuzzyTok(q: string, d: string): boolean {
    if (q === d) return true;
    const b = typoBudget(q.length);
    if (b === 0) return false;
    if (editDistance(q, d, b) <= b) return true;
    return d.length > q.length && editDistance(q, d.slice(0, q.length), b) <= b; // המשתמש עוד מקליד
}

// ───── פריסת מקלדת ─────

const LATIN_TO_HE: Record<string, string> = {
    q: '/', w: "'", e: 'ק', r: 'ר', t: 'א', y: 'ט', u: 'ו', i: 'ן', o: 'ם', p: 'פ',
    a: 'ש', s: 'ד', d: 'ג', f: 'כ', g: 'ע', h: 'י', j: 'ח', k: 'ל', l: 'ך', ';': 'ף',
    z: 'ז', x: 'ס', c: 'ב', v: 'ה', b: 'נ', n: 'מ', m: 'צ', ',': 'ת', '.': 'ץ'
};

const isLatinCode = (c: number) => (c >= 97 && c <= 122) || (c >= 65 && c <= 90);
const isHebCode = (c: number) => c >= 0x05d0 && c <= 0x05ea;

export function looksLatin(s: string): boolean {
    let latin = 0;
    let heb = 0;
    for (let i = 0; i < s.length; i++) {
        const c = s.charCodeAt(i);
        if (isLatinCode(c)) latin++;
        else if (isHebCode(c)) heb++;
    }
    return latin > 0 && latin > heb;
}

/** המרת מחרוזת שהוקלדה בפריסה אנגלית לעברית. null אם זו לא המרה אמיתית (פחות מ-3 אותיות). */
export function swapLayout(s: string): string | null {
    if (!looksLatin(s)) return null;
    let out = '';
    let letters = 0;
    for (const ch of s.toLowerCase()) {
        const he = LATIN_TO_HE[ch];
        if (he) {
            out += he;
            if (isHebCode(he.charCodeAt(0))) letters++;
        } else out += ch;
    }
    return letters >= 3 ? out : null;
}

// ───── מסמכים ושאילתות ─────

/** טקסט יעד מפורק פעם אחת: מילים, שורשים וגרסה רופפת. */
export interface Doc {
    text: string;
    tokens: string[];
    stems: string[];
    keys: string[];
}

export function makeDoc(raw: string | null | undefined): Doc {
    const text = normalizeHe(raw);
    const tokens = text ? text.split(' ') : [];
    const stems = tokens.map(stem);
    return { text, tokens, stems, keys: stems.map(loosen) };
}

export interface Plan {
    q: string;
    tokens: string[];
    stems: string[];
    keys: string[];
    /** מילה קצרה (עד 3 אותיות) מתאימה רק כמילה שלמה, אחרת "מים" תתאים ל"מימון" */
    short: boolean[];
    swap: Plan | null;
}

export function makePlan(raw: string, allowSwap = true): Plan {
    const q = normalizeHe(raw);
    let tokens = q ? q.split(' ') : [];
    const content = tokens.filter((t) => !STOP.has(t));
    if (content.length > 0) tokens = content;
    const stems = tokens.map(stem);
    const sw = allowSwap ? swapLayout(String(raw ?? '')) : null;
    return { q, tokens, stems, keys: stems.map(loosen), short: tokens.map((t) => t.length <= 3), swap: sw ? makePlan(sw, false) : null };
}

type Matcher = (q: string, d: string, short: boolean) => boolean;

/** מילה שלמה, או (במילה ארוכה) תחילת מילה: "חוגי" מוצאת "חוגים", "מים" לא מוצאת "מימון". */
const prefixMatch: Matcher = (q, d, short) => (short ? d === q : d.startsWith(q));

const stemMatch: Matcher = (q, d, short) => {
    if (short) return d === q;
    if (d.startsWith(q)) return true;
    // יחיד מול רבים בכיוון ההפוך: תביעה מול תביעות (השורש של היעד קצר מעט מהשאילתה)
    return d.length >= 3 && q.length - d.length <= 2 && q.startsWith(d);
};

const fuzzyMatch: Matcher = (q, d) => fuzzyTok(q, d);

function covers(qs: string[], ds: string[], short: boolean[], match: Matcher): boolean {
    if (qs.length === 0) return false;
    return qs.every((q, i) => ds.some((d) => match(q, d, short[i])));
}

/** רמת ההתאמה 0..5 של שאילתה מול יעד, או -1. */
export function levelOf(plan: Plan, doc: Doc, allowFuzzy = true): number {
    if (!plan.q || !doc.text) return -1;
    if (plan.tokens.length === 1 && plan.short[0]) {
        const i = doc.tokens.indexOf(plan.q);
        if (i === 0) return 0;
        if (i > 0) return 1;
    } else {
        if (doc.text.startsWith(plan.q)) return 0;
        if ((' ' + doc.text).includes(' ' + plan.q)) return 1;
    }
    if (covers(plan.tokens, doc.tokens, plan.short, prefixMatch) || covers(plan.stems, doc.stems, plan.short, stemMatch)) return 2;
    if (covers(plan.keys, doc.keys, plan.short, stemMatch)) return 3;
    if (plan.swap) {
        const l = levelOf(plan.swap, doc, false);
        if (l >= 0 && l <= 3) return 4;
    }
    if (!allowFuzzy) return -1;
    if (covers(plan.stems, doc.stems, plan.short, fuzzyMatch)) return 5;
    if (plan.swap && covers(plan.swap.stems, doc.stems, plan.swap.short, fuzzyMatch)) return 5;
    return -1;
}

// ───── דירוג רשימה ─────

export interface Entry<T> {
    item: T;
    /** כל השדות מאוחדים, והשדה הראשון (הכותרת) בנפרד */
    all: Doc;
    title: Doc;
}

export function indexItems<T>(items: readonly T[], getFields: (item: T) => (string | null | undefined)[]): Entry<T>[] {
    return items.map((item) => {
        const f = getFields(item);
        return { item, title: makeDoc(f[0]), all: makeDoc(f.filter(Boolean).join(' ')) };
    });
}

export interface Ranked<T> {
    item: T;
    /** נמוך = טוב. פחות מ-4 = התאמה מדויקת, 4 ומעלה = סלחנית (מקלדת/טעויות הקלדה) */
    score: number;
}

/** מדרג ומסנן. התאמה בכותרת עדיפה על התאמה רק בתיאור באותה רמה. יציב: הסדר המקורי נשמר בשוויון. */
export function rank<T>(plan: Plan, entries: readonly Entry<T>[]): Ranked<T>[] {
    const out: (Ranked<T> & { i: number })[] = [];
    entries.forEach((e, i) => {
        const all = levelOf(plan, e.all);
        if (all < 0) return;
        const t = levelOf(plan, e.title);
        out.push({ item: e.item, score: t >= 0 ? Math.min(t, all) : all + 0.4, i });
    });
    out.sort((a, b) => a.score - b.score || a.i - b.i);
    return out;
}

// ───── אוצר מילים ו"האם התכוונת" ─────

export interface Vocab {
    /** מילה מאוחדת סופיות -> משקל */
    weight: Map<string, number>;
    /** מילה מאוחדת -> צורת התצוגה (כפי שנכתבה) */
    surface: Map<string, string>;
}

export function buildVocab(sources: { text: string | null | undefined; weight?: number }[]): Vocab {
    const weight = new Map<string, number>();
    const surface = new Map<string, string>();
    for (const { text, weight: w = 1 } of sources) {
        for (const raw of light(text).split(' ')) {
            if (raw.length < 2) continue;
            const t = foldFinals(raw);
            weight.set(t, (weight.get(t) ?? 0) + w);
            if (!surface.has(t)) surface.set(t, raw);
        }
    }
    return { weight, surface };
}

function isVocabPrefix(t: string, vocab: Vocab): boolean {
    if (t.length < 2) return false;
    for (const v of vocab.weight.keys()) if (v.length > t.length && v.startsWith(t)) return true;
    return false;
}

/** תיקון כל מילה בשאילתה שלא מוכרת באוצר: מרחק עריכה, פריסת מקלדת, אות שימוש, או שתי מילים מחוברות. */
export function suggest(query: string, vocab: Vocab): string | null {
    const shown = light(query).split(' ').filter(Boolean);
    if (shown.length === 0 || vocab.weight.size === 0) return null;
    let changed = false;
    const out = shown.map((raw) => {
        const t = foldFinals(raw);
        if (t.length < 2 || vocab.weight.has(t) || STOP.has(t) || isVocabPrefix(t, vocab)) return raw;
        const sw = swapLayout(raw);
        const swF = sw ? foldFinals(sw) : null;
        if (swF && (vocab.weight.has(swF) || isVocabPrefix(swF, vocab))) {
            changed = true;
            return vocab.surface.get(swF) ?? sw!;
        }
        // אות שימוש: לגמח -> גמח, או הוספה: גמח -> לגמח
        const st = stem(t);
        if (st !== t && vocab.weight.has(st)) { changed = true; return vocab.surface.get(st)!; }
        const budget = typoBudget(t.length);
        let best: { tok: string; d: number; w: number } | null = null;
        if (budget > 0) {
            for (const [tok, w] of vocab.weight) {
                if (Math.abs(tok.length - t.length) > budget) continue;
                const d = editDistance(t, tok, budget);
                if (d > budget) continue;
                // שוויון: המרחק הקצר, אותו שלד (בלי אמות קריאה), ואז המשקל באוצר
                if (!best || d < best.d || (d === best.d && w > best.w)) best = { tok, d, w };
            }
        }
        if (!best) {
            // שתי מילים שהוקלדו מחוברות: "בייביסיטר" -> "בייבי סיטר"
            for (let i = 2; i <= t.length - 2; i++) {
                const a = t.slice(0, i);
                const b = t.slice(i);
                if (vocab.weight.has(a) && vocab.weight.has(b)) {
                    changed = true;
                    return (vocab.surface.get(a) ?? a) + ' ' + (vocab.surface.get(b) ?? b);
                }
            }
            return raw;
        }
        changed = true;
        return vocab.surface.get(best.tok) ?? best.tok;
    });
    if (!changed) return null;
    const result = out.join(' ');
    return result === shown.join(' ') ? null : result;
}
