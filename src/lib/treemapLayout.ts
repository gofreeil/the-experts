// פריסת "מפת הבעיות": כל בעיה היא משבצת מלבנית ששטחה עולה עם הפרס (squarified treemap),
// כך שהמפה ממלאת את כל השטח בלי חורים, והמשבצות קרובות לריבוע וקלות לקריאה וללחיצה.
// הגדלים מכווצים (שורש) כדי שגם בעיות קטנות יישארו קריאות; מה שלא נכנס בגודל נוח מתכנס למשבצת "עוד".

export type TreemapInput = { id: string; value: number };
export type TreemapRect = { id: string; value: number; x: number; y: number; w: number; h: number; more?: number };

export const MORE_ID = '__more__';

type Item = { id: string; value: number; area: number; more?: number };

const MIN_AREA = 3400; // שטח מינימלי למשבצת: מספיק לסכום וכותרת קצרה
const POWER = 0.5; // שטח ~ פרס^0.5

function worst(row: Item[], sum: number, side: number): number {
    let max = 0, min = Infinity;
    for (const it of row) {
        if (it.area > max) max = it.area;
        if (it.area < min) min = it.area;
    }
    const s2 = side * side;
    return Math.max((s2 * max) / (sum * sum), (sum * sum) / (s2 * min));
}

function squarify(items: Item[], x: number, y: number, w: number, h: number): TreemapRect[] {
    const out: TreemapRect[] = [];
    let rest = items;
    let rx = x, ry = y, rw = w, rh = h;
    while (rest.length) {
        const side = Math.min(rw, rh);
        const row: Item[] = [rest[0]];
        let sum = rest[0].area;
        let best = worst(row, sum, side);
        for (let i = 1; i < rest.length; i++) {
            const next = sum + rest[i].area;
            const cand = worst([...row, rest[i]], next, side);
            if (cand > best) break;
            row.push(rest[i]);
            sum = next;
            best = cand;
        }
        const thick = sum / side;
        if (rw >= rh) {
            let cy = ry;
            for (const it of row) {
                const ih = it.area / thick;
                out.push({ id: it.id, value: it.value, more: it.more, x: rx, y: cy, w: thick, h: ih });
                cy += ih;
            }
            rx += thick;
            rw -= thick;
        } else {
            let cx = rx;
            for (const it of row) {
                const iw = it.area / thick;
                out.push({ id: it.id, value: it.value, more: it.more, x: cx, y: ry, w: iw, h: thick });
                cx += iw;
            }
            ry += thick;
            rh -= thick;
        }
        rest = rest.slice(row.length);
    }
    return out;
}

/**
 * מחזיר משבצות במערכת קואורדינטות של קנבס W×H. הגדולה ביותר בצד ימין-למעלה (עברית).
 * אם לא כולן נכנסות בגודל נוח, הקטנות מתכנסות למשבצת אחת (id = MORE_ID, more = כמה בעיות).
 */
export function layoutTreemap(items: TreemapInput[], W: number, H: number, gap = 6): TreemapRect[] {
    if (!items.length || W < 80 || H < 80) return [];

    const sorted = [...items].sort((a, b) => b.value - a.value || a.id.localeCompare(b.id));
    const weight = (v: number) => Math.pow(Math.max(v, 1), POWER);

    // כמה משבצות אפשר להציג בגודל נוח
    let n = sorted.length;
    let list: Item[] = [];
    for (; n >= Math.min(3, sorted.length); n--) {
        const shown = sorted.slice(0, n);
        const restItems = sorted.slice(n);
        const wShown = shown.map((p) => weight(p.value));
        // משבצת "עוד" קטנה יחסית: לכל היותר פי 2.2 מהמשבצת הקטנה ביותר שמוצגת
        const wRest = restItems.length ? Math.min(restItems.reduce((s, p) => s + weight(p.value), 0), 2.2 * wShown[n - 1]) : 0;
        const total = wShown.reduce((s, v) => s + v, 0) + wRest;
        const areaOf = (wt: number) => (W * H * wt) / total;
        if (areaOf(wShown[n - 1]) >= MIN_AREA || n === Math.min(3, sorted.length)) {
            list = shown.map((p, i) => ({ id: p.id, value: p.value, area: areaOf(wShown[i]) }));
            if (restItems.length) list.push({ id: MORE_ID, value: 0, area: areaOf(wRest), more: restItems.length });
            break;
        }
    }

    list.sort((a, b) => b.area - a.area);
    const raw = squarify(list, 0, 0, W, H);
    const g = gap / 2;
    // היפוך אופקי: הגדול מימין, כמו הקריאה בעברית
    return raw.map((r) => ({ ...r, x: W - r.x - r.w + g, y: r.y + g, w: Math.max(0, r.w - gap), h: Math.max(0, r.h - gap) }));
}
