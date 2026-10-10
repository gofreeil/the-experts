// פריסת "כוורת הבעיות": כל בעיה היא משושה, וגודלו עולה עם הפרס (בטווח מכווץ, כדי שגם התאים הקטנים יישארו קריאים ונוחים ללחיצה).
// אלגוריתם: התחלה בספירלה (או במיקום הקודם), הדיפה הדדית לפי צורת המשושה האמיתית (לא עיגול) כך שהתאים נצמדים כמו חלת דבש,
// ומשיכה עדינה למרכז. אם עדיין יש חפיפה, מקטינים מעט את התאים הגדולים וחוזרים על ההדיפה.

export type HiveInput = { id: string; value: number };
export type HiveNode = { id: string; value: number; x: number; y: number; r: number };
export type HivePos = { x: number; y: number };

const GAP = 2.5;
const HALF_W = 0.866; // חצי רוחב משושה "מחודד למעלה" ביחס לרדיוס
const SLOPE = 0.5774; // שיפוע הצלעות האלכסוניות
const MIN_R = 26; // רדיוס מינימלי: רחב מספיק לסכום קריא ולמגע באצבע
const FLOOR_R = 22; // גם אחרי כיווץ לא יורדים מתחת לזה
const FILL = 0.52; // כמה מהשטח התא-ים תופסים
const POWER = 0.35; // שטח התא ~ פרס^0.7, כלומר רדיוס ~ פרס^0.35

/** "מרחק משושה" בכיוון (dx,dy), ביחס לרדיוס: שני משושים זהי-כיוון לא חופפים כש-norm >= r1 + r2 */
const hexNorm = (dx: number, dy: number) => Math.max(Math.abs(dx) / HALF_W, Math.abs(dy) + Math.abs(dx) * SLOPE);

export function layoutHive(
    items: HiveInput[],
    W: number,
    H: number,
    memory: Map<string, HivePos>,
    prevSize: { w: number; h: number } | null
): HiveNode[] {
    if (!items.length || W < 40 || H < 40) return [];

    // רק מה שנכנס בגודל קריא; השאר נשארים בלוח שמתחת
    const capacity = Math.max(6, Math.floor((0.62 * W * H) / (2.598 * MIN_R * MIN_R)));
    const sorted = [...items].sort((a, b) => b.value - a.value || a.id.localeCompare(b.id)).slice(0, capacity);

    const weights = sorted.map((p) => Math.pow(Math.max(p.value, 1), 2 * POWER));
    const wSum = weights.reduce((s, w) => s + w, 0) || 1;
    const maxR = Math.min(W, H) * 0.27;

    const nodes: HiveNode[] = sorted.map((p, i) => {
        const r = Math.min(maxR, Math.max(MIN_R, Math.sqrt((FILL * W * H * weights[i]) / (2.598 * wSum))));
        const old = memory.get(p.id);
        if (old && prevSize) return { ...p, r, x: (old.x / prevSize.w) * W, y: (old.y / prevSize.h) * H };
        const ang = i * 2.399;
        const rad = 18 * Math.sqrt(i + 1) * (Math.min(W, H) / 420) * 3.2;
        return { ...p, r, x: W / 2 + Math.cos(ang) * rad * 1.25, y: H / 2 + Math.sin(ang) * rad * 0.9 };
    });

    function relax(iters: number, usePull: boolean) {
        for (let it = 0; it < iters; it++) {
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const a = nodes[i], b = nodes[j];
                    const dx = b.x - a.x, dy = b.y - a.y;
                    const d = Math.sqrt(dx * dx + dy * dy) || 0.01;
                    const ux = dx / d, uy = dy / d;
                    const min = (a.r + b.r + GAP) / hexNorm(ux, uy);
                    if (d < min) {
                        const push = min - d;
                        const wa = b.r / (a.r + b.r), wb = a.r / (a.r + b.r);
                        a.x -= ux * push * wa; a.y -= uy * push * wa;
                        b.x += ux * push * wb; b.y += uy * push * wb;
                    }
                }
            }
            const pull = usePull ? 0.01 + 0.03 * (it / iters) : 0;
            for (const p of nodes) {
                p.x += (W / 2 - p.x) * pull;
                p.y += (H / 2 - p.y) * pull;
                p.x = Math.max(p.r * HALF_W + 4, Math.min(W - p.r * HALF_W - 4, p.x));
                p.y = Math.max(p.r + 4, Math.min(H - p.r - 4, p.y));
            }
        }
    }

    function worstOverlap(): number {
        let worst = 0;
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const a = nodes[i], b = nodes[j];
                const dx = b.x - a.x, dy = b.y - a.y;
                const o = a.r + b.r + GAP - hexNorm(dx, dy);
                if (o > worst) worst = o;
            }
        }
        return worst;
    }

    relax(260, true);
    for (let attempt = 0; attempt < 12 && worstOverlap() > 0.6; attempt++) {
        relax(160, false);
        if (worstOverlap() > 0.6) for (const p of nodes) p.r = Math.max(FLOOR_R, p.r * 0.96);
    }

    memory.clear();
    for (const p of nodes) memory.set(p.id, { x: p.x, y: p.y });
    return nodes;
}
