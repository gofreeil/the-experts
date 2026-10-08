import { triggerAdPopup } from '$lib/adPopupStore';

// בנייד: פרסומת ביניים קצרה בדרך לדף הבעיה (כמו בלוח הבעיות).
// triggerAdPopup מחזיר false בדסקטופ, ואז הקישור מנווט כרגיל.
export function adThenGo(e: MouseEvent, href: string) {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    if (triggerAdPopup(href)) e.preventDefault();
}
