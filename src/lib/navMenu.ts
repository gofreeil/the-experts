// מקור יחיד לדפי האתר: התפריט הנפתח בהדר, כותרות הדפים הנפרדים וקישורי "לדף המלא" בדף הבית.
// key = מפתח תרגום ב-i18n (לתפריט). title/lede = עברית, לכותרת הדף עצמו.

export type NavItem = {
    href: string;
    key: string;
    icon: string;
    title: string;
    lede: string;
};

export const NAV_ITEMS: NavItem[] = [
    { href: '/', key: 'nav_home', icon: '🏠', title: 'דף הבית', lede: 'הכוורת במבט אחד: בעיות, פרסים, מפגשי מומחים ופתרונות.' },
    { href: '/how-it-works', key: 'nav_how', icon: '💡', title: 'איך זה עובד', lede: 'ארבעה צעדים מהבעיה ועד התשלום למי שפתר אותה.' },
    { href: '/problems', key: 'nav_problems', icon: '🧩', title: 'לוח הבעיות', lede: 'כל הבעיות הפתוחות, עם פרס. מרימים יד ומציעים פתרון.' },
    { href: '/problems/new', key: 'nav_new_problem', icon: '➕', title: 'העלאת בעיה', lede: 'מתארים בעיה, קובעים פרס, והמומחים כבר יראו אותה.' },
    { href: '/paid', key: 'nav_paid', icon: '💰', title: 'כסף שחולק', lede: 'כמה כסף עבר לפותרי בעיות, ולאן הוא הלך. הספרים פתוחים.' },
    { href: '/meetup', key: 'nav_meetup', icon: '🎥', title: 'מפגשי מומחים', lede: 'פעם בחודש, בשידור חי: הבעיות הגדולות מול המומחים.' },
    { href: '/solved', key: 'nav_solved', icon: '✅', title: 'פתרונות שהתקבלו', lede: 'בעיות שנסגרו, מי פתר אותן ובכמה.' },
    { href: '/categories', key: 'nav_categories', icon: '🗂️', title: 'תחומים', lede: 'שמונה צוותי מומחים, ובעיות פתוחות בכל תחום.' },
    { href: '/archive', key: 'nav_archive', icon: '📚', title: 'ארכיון ודיונים', lede: 'מפגשים קודמים והדיונים שמתנהלים עכשיו.' },
    { href: '/experts', key: 'nav_experts', icon: '🎓', title: 'המומחים', lede: 'מי מרים יד הכי הרבה, ומי באמת פותר.' },
    { href: '/about', key: 'about', icon: 'ℹ️', title: 'אודות', lede: 'על הפרויקט ועל מי שעומד מאחוריו.' }
];

export const navItem = (href: string): NavItem => NAV_ITEMS.find((i) => i.href === href) ?? NAV_ITEMS[0];

/** האם הקישור הוא הדף הנוכחי. /problems לא נדלק על /problems/new, שיש לו פריט משלו. */
export function isNavActive(href: string, pathname: string): boolean {
    if (href === '/') return pathname === '/';
    if (pathname === href) return true;
    if (!pathname.startsWith(href + '/')) return false;
    return !NAV_ITEMS.some((o) => o.href !== href && o.href.startsWith(href + '/') && (pathname === o.href || pathname.startsWith(o.href + '/')));
}
