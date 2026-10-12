// אחסון בעיות + הצעות פתרון ב-localStorage עם Svelte 5 $state
// מודל: בעיה אחת -> מספר הצעות פתרון

import { browser } from '$app/environment';
import { demoProblems, problemTextEn, posterNameEn, solutionTextEn } from './demoProblems';
import { DEFAULT_LOCALE, LOCALE_META, type Locale } from './i18n';
import { createTranslator } from './i18n/translate';

export type ProblemType = 'individual' | 'community';
export type ProblemStatus = 'open' | 'in-progress' | 'solved';

export type Solution = {
    id: string;
    problemId: string;
    solverName: string;
    contact: string;
    proposal: string;
    askingPrice: number;
    createdAt: number;
};

export type Problem = {
    id: string;
    title: string;
    description: string;
    category: string;   // team slug
    type: ProblemType;
    posterName: string;
    contact: string;
    bounty: number;
    status: ProblemStatus;
    createdAt: number;
    solutions: Solution[];
    backers?: number;   // כמה אנשים הוסיפו לפרס (בעיות ציבוריות)
    hands?: number;     // מומחים שהרימו יד, כולל כאלה שעוד לא הגישו הצעה מלאה
    image?: string;     // תמונה לכרטיס בדף הבית; בלי זה מוצג האיור של התחום
};

const STORAGE_KEY = 'experts_problems_v1';

function makeId(): string {
    return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// בעיות התחלתיות לדמו - מוצגות עד שמישהו יוסיף בעיה ראשונה
const seed: Problem[] = [
    {
        id: 'seed-1',
        title: 'ועד השכונה מנהל מאבק מול עיריית ירושלים על ניקיון רחובות וגינות ציבוריות',
        description: 'ועד השכונה שלנו (קרית משה) מנהל מאבק מול העירייה על ניקיון רחובות וגינות ציבוריות. דרוש עורך דין שמתמחה בתביעות מול רשויות מקומיות לבחון תיק ולכתוב מכתב התראה.',
        category: 'law',
        type: 'community',
        posterName: 'ועד שכונת קרית משה',
        contact: 'vaad.km@example.com',
        bounty: 3500,
        status: 'open',
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
        solutions: [],
        hands: 4,
        backers: 17
    },
    {
        id: 'seed-2',
        title: 'חוגי השכונה מתנהלים בקבצי אקסל ובווטסאפ וההורים לא יכולים להירשם ולשלם',
        description: 'יש לנו 12 חוגים שמתנהלים בקבצי אקסל ובווטסאפ. דרושה אפליקציה פשוטה שמאפשרת להורים להירשם ולשלם, ולמדריכים לראות רשימות.',
        category: 'technology',
        type: 'community',
        posterName: 'הנהלת חוגי השכונה',
        contact: '052-1234567',
        bounty: 8000,
        status: 'open',
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
        solutions: [],
        hands: 5,
        backers: 22
    },
    {
        id: 'seed-3',
        title: 'בקשה לקצבת נכות סורבה בלי הסבר ואין מי שילווה בערעור מול ביטוח לאומי',
        description: 'אבא שלי הגיש בקשה לקצבת נכות לפני 8 חודשים, סורבו ללא הסבר. צריך ליווי בערעור.',
        category: 'rights',
        type: 'individual',
        posterName: 'דוד מ.',
        contact: 'david@example.com',
        bounty: 1200,
        status: 'open',
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1,
        solutions: [],
        hands: 3,
        backers: 1
    },
    ...demoProblems()
];

// הבעיות ההתחלתיות - לשימוש הרינדור הראשון בדף הבית (זהה בשרת ובלקוח, לפני קריאת localStorage)
export const seedProblems: Problem[] = seed;

function load(): Problem[] {
    if (!browser) return seed;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return seed;
        const parsed = JSON.parse(raw) as Problem[];
        return Array.isArray(parsed) ? parsed : seed;
    } catch {
        return seed;
    }
}

function save(items: Problem[]) {
    if (!browser) return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
}

// reactive store
class ProblemsStore {
    items = $state<Problem[]>(load());

    refresh() {
        this.items = load();
    }

    addProblem(input: Omit<Problem, 'id' | 'createdAt' | 'status' | 'solutions'>): Problem {
        const next: Problem = {
            ...input,
            id: makeId(),
            createdAt: Date.now(),
            status: 'open',
            solutions: []
        };
        this.items = [next, ...this.items];
        save(this.items);
        return next;
    }

    // מוסיף לפרס של בעיה קיימת (תרומה נוספת של מישהו שמצטרף לבעיה ציבורית)
    addToBounty(problemId: string, amount: number) {
        const idx = this.items.findIndex((p) => p.id === problemId);
        if (idx === -1 || !(amount > 0)) return;
        const p = this.items[idx];
        const updated = { ...p, bounty: p.bounty + amount, backers: (p.backers ?? 1) + 1 };
        this.items = [...this.items.slice(0, idx), updated, ...this.items.slice(idx + 1)];
        save(this.items);
    }

    getById(id: string): Problem | undefined {
        return this.items.find((p) => p.id === id);
    }

    addSolution(problemId: string, input: Omit<Solution, 'id' | 'createdAt' | 'problemId'>): Solution | null {
        const idx = this.items.findIndex((p) => p.id === problemId);
        if (idx === -1) return null;
        const sol: Solution = {
            ...input,
            id: makeId(),
            problemId,
            createdAt: Date.now()
        };
        const updated = { ...this.items[idx], solutions: [...this.items[idx].solutions, sol] };
        this.items = [...this.items.slice(0, idx), updated, ...this.items.slice(idx + 1)];
        save(this.items);
        return sol;
    }
}

export const problemsStore = new ProblemsStore();

/** "לפני 3 שעות" / "3 hours ago" */
export function formatTimeAgo(ts: number, locale: Locale = DEFAULT_LOCALE): string {
    const { t, tn } = createTranslator(locale);
    const diffMs = Date.now() - ts;
    const min = Math.floor(diffMs / 60000);
    if (min < 1) return t('time.now');
    if (min < 60) return tn('time.minutesAgo', min);
    const hr = Math.floor(min / 60);
    if (hr < 24) return tn('time.hoursAgo', hr);
    const days = Math.floor(hr / 24);
    if (days < 30) return tn('time.daysAgo', days);
    const months = Math.floor(days / 30);
    return tn('time.monthsAgo', months);
}

/** "1,200 ₪" בעברית (השקל אחרי המספר), "₪1,200" באנגלית */
export function formatBounty(n: number, locale: Locale = DEFAULT_LOCALE): string {
    const num = new Intl.NumberFormat(LOCALE_META[locale].bcp47).format(n);
    return locale === 'he' ? `${num} ₪` : `₪${num}`;
}

/**
 * הבעיה כפי שמוצגת בשפה הנבחרת. בעיות הדגמה מתורגמות (לפי הכותרת העברית שלהן);
 * בעיה שגולש כתב נשארת בשפה שבה נכתבה.
 */
export function localizeProblem(p: Problem, locale: Locale): Problem {
    if (locale === 'he') return p;
    const en = problemTextEn(p.title);
    const poster = posterNameEn(p.posterName);
    if (!en && !poster && !p.solutions.some((s) => solutionTextEn(s.proposal))) return p;
    return {
        ...p,
        title: en?.title ?? p.title,
        description: en?.description ?? p.description,
        posterName: poster ?? en?.posterName ?? p.posterName,
        solutions: p.solutions.map((s) => {
            const t = solutionTextEn(s.proposal);
            return t ? { ...s, solverName: t.solverName, proposal: t.proposal } : s;
        })
    };
}

export const localizeProblems = (list: Problem[], locale: Locale): Problem[] =>
    locale === 'he' ? list : list.map((p) => localizeProblem(p, locale));
