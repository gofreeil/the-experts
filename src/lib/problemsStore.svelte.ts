// אחסון בעיות + הצעות פתרון ב-localStorage עם Svelte 5 $state
// מודל: בעיה אחת -> מספר הצעות פתרון

import { browser } from '$app/environment';

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
};

const STORAGE_KEY = 'experts_problems_v1';

function makeId(): string {
    return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// בעיות התחלתיות לדמו - מוצגות עד שמישהו יוסיף בעיה ראשונה
const seed: Problem[] = [
    {
        id: 'seed-1',
        title: 'דרושה ייעוץ משפטי לוועד שכונה מול עיריית ירושלים',
        description: 'ועד השכונה שלנו (קרית משה) מנהל מאבק מול העירייה על ניקיון רחובות וגינות ציבוריות. דרוש עורך דין שמתמחה בתביעות מול רשויות מקומיות לבחון תיק ולכתוב מכתב התראה.',
        category: 'law',
        type: 'community',
        posterName: 'ועד שכונת קרית משה',
        contact: 'vaad.km@example.com',
        bounty: 3500,
        status: 'open',
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
        solutions: []
    },
    {
        id: 'seed-2',
        title: 'בניית אפליקציה לרישום ילדים לחוגי שכונה',
        description: 'יש לנו 12 חוגים שמתנהלים בקבצי אקסל ובווטסאפ. דרושה אפליקציה פשוטה שמאפשרת להורים להירשם ולשלם, ולמדריכים לראות רשימות.',
        category: 'technology',
        type: 'community',
        posterName: 'הנהלת חוגי השכונה',
        contact: '052-1234567',
        bounty: 8000,
        status: 'open',
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
        solutions: []
    },
    {
        id: 'seed-3',
        title: 'מיצוי זכויות מול ביטוח לאומי - נכות',
        description: 'אבא שלי הגיש בקשה לקצבת נכות לפני 8 חודשים, סורבו ללא הסבר. צריך ליווי בערעור.',
        category: 'rights',
        type: 'individual',
        posterName: 'דוד מ.',
        contact: 'david@example.com',
        bounty: 1200,
        status: 'open',
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1,
        solutions: []
    }
];

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

export function formatTimeAgo(ts: number): string {
    const diffMs = Date.now() - ts;
    const min = Math.floor(diffMs / 60000);
    if (min < 1) return 'הרגע';
    if (min < 60) return `לפני ${min} דק'`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `לפני ${hr} שעות`;
    const days = Math.floor(hr / 24);
    if (days < 30) return `לפני ${days} ימים`;
    const months = Math.floor(days / 30);
    return `לפני ${months} חודשים`;
}

export function formatBounty(n: number): string {
    return new Intl.NumberFormat('he-IL').format(n) + ' ₪';
}
