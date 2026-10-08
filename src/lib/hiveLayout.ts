// פריסת "כוורת הבעיות": כל בעיה היא משושה ששטחו פרופורציוני לפרס.
// אלגוריתם: התחלה בספירלה (או במיקום הקודם), הדיפה הדדית עד שאין חפיפה, ומשיכה עדינה למרכז.
// אם עדיין יש חפיפה, מקטינים מעט את כל התאים וחוזרים על ההדיפה.

export type HiveInput = { id: string; value: number };
export type HiveNode = { id: string; value: number; x: number; y: number; r: number };
export type HivePos = { x: number; y: number };

const GAP = 3;
const HALF_W = 0.866; // חצי רוחב משושה "מחודד למעלה" ביחס לרדיוס

export function layoutHive(
    items: HiveInput[],
    W: number,
    H: number,
    memory: Map<string, HivePos>,
    prevSize: { w: number; h: number } | null
): HiveNode[] {
    if (!items.length || W < 40 || H < 40) return [];

    const sorted = [...items].sort((a, b) => b.value - a.value || a.id.localeCompare(b.id));
    const sum = sorted.reduce((s, p) => s + p.value, 0) || 1;
    const k = Math.sqrt((0.4 * W * H) / (2.598 * sum));
    const maxR = Math.min(W, H) * 0.3;

    const nodes: HiveNode[] = sorted.map((p, i) => {
        const r = Math.min(maxR, Math.max(14, k * Math.sqrt(p.value)));
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
                    const min = a.r + b.r + GAP;
                    if (d < min) {
                        const push = min - d, ux = dx / d, uy = dy / d;
                        const wa = b.r / (a.r + b.r), wb = a.r / (a.r + b.r);
                        a.x -= ux * push * wa; a.y -= uy * push * wa;
                        b.x += ux * push * wb; b.y += uy * push * wb;
                    }
                }
            }
            const pull = usePull ? 0.004 + 0.012 * (it / iters) : 0;
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
                const o = a.r + b.r + GAP - Math.hypot(a.x - b.x, a.y - b.y);
                if (o > worst) worst = o;
            }
        }
        return worst;
    }

    relax(240, true);
    for (let attempt = 0; attempt < 10 && worstOverlap() > 0.6; attempt++) {
        relax(160, false);
        if (worstOverlap() > 0.6) for (const p of nodes) p.r *= 0.96;
    }

    memory.clear();
    for (const p of nodes) memory.set(p.id, { x: p.x, y: p.y });
    return nodes;
}
