// מקור יחיד לדפי האתר: התפריט הנפתח בהדר, כותרות הדפים הנפרדים וקישורי "לדף המלא" בדף הבית.
// title = שם הדף (גם תווית התפריט), lede = משפט הפתיחה של הדף. שניהם דו-לשוניים: { he, en }.
import type { L10n } from '$lib/i18n';

export type NavItem = {
    href: string;
    icon: string;
    title: L10n;
    lede: L10n;
};

export const NAV_ITEMS: NavItem[] = [
    {
        href: '/', icon: '🏠',
        title: { he: 'דף הבית', en: 'Home' },
        lede: { he: 'הכוורת במבט אחד: בעיות, פרסים, מפגשי המומחים ופתרונות.', en: 'The hive at a glance: problems, rewards, expert meetups and solutions.' }
    },
    {
        href: '/how-it-works', icon: '💡',
        title: { he: 'איך זה עובד', en: 'How it works' },
        lede: { he: 'ארבעה צעדים מהבעיה ועד התשלום למי שפתר אותה.', en: 'Four steps from a problem to paying whoever solved it.' }
    },
    {
        href: '/problems', icon: '🧩',
        title: { he: 'לוח הבעיות', en: 'Problem board' },
        lede: { he: 'כל הבעיות הפתוחות, עם פרס. מרימים יד ומציעים פתרון.', en: 'Every open problem, each with a reward. Raise your hand and offer a solution.' }
    },
    {
        href: '/problems/new', icon: '➕',
        title: { he: 'העלאת בעיה', en: 'Post a problem' },
        lede: { he: 'מתארים בעיה, קובעים פרס, והמומחים כבר יראו אותה.', en: 'Describe a problem, set a reward, and the experts will see it right away.' }
    },
    {
        href: '/paid', icon: '💰',
        title: { he: 'כסף שחולק', en: 'Money paid out' },
        lede: { he: 'כמה כסף עבר לפותרי בעיות, ולאן הוא הלך. הספרים פתוחים.', en: 'How much money went to problem-solvers, and where it went. The books are open.' }
    },
    {
        href: '/meetup', icon: '🎥',
        title: { he: 'מפגשי המומחים', en: 'Expert meetups' },
        lede: { he: 'פעם בחודש, בשידור חי: הבעיות הגדולות מול המומחים.', en: 'Once a month, live: the biggest problems put to the experts.' }
    },
    {
        href: '/solved', icon: '✅',
        title: { he: 'פתרונות שהתקבלו', en: 'Accepted solutions' },
        lede: { he: 'בעיות שנסגרו, מי פתר אותן ובכמה.', en: 'Problems that were closed, who solved them, and for how much.' }
    },
    {
        href: '/categories', icon: '🗂️',
        title: { he: 'תחומים', en: 'Fields' },
        lede: { he: 'שמונה צוותי מומחים, ובעיות פתוחות בכל תחום.', en: 'Eight expert teams, with open problems in every field.' }
    },
    {
        href: '/archive', icon: '📚',
        title: { he: 'ארכיון ודיונים', en: 'Archive & discussions' },
        lede: { he: 'מפגשים קודמים והדיונים שמתנהלים עכשיו.', en: 'Past meetups and the discussions happening right now.' }
    },
    {
        href: '/experts', icon: '🎓',
        title: { he: 'המומחים', en: 'The experts' },
        lede: { he: 'מי מרים יד הכי הרבה, ומי באמת פותר.', en: 'Who raises their hand most, and who actually solves.' }
    },
    {
        href: '/about', icon: 'ℹ️',
        title: { he: 'אודות', en: 'About' },
        lede: { he: 'על הפרויקט ועל מי שעומד מאחוריו.', en: 'About the project and the people behind it.' }
    }
];

export const navItem = (href: string): NavItem => NAV_ITEMS.find((i) => i.href === href) ?? NAV_ITEMS[0];

/** האם הקישור הוא הדף הנוכחי. /problems לא נדלק על /problems/new, שיש לו פריט משלו. */
export function isNavActive(href: string, pathname: string): boolean {
    if (href === '/') return pathname === '/';
    if (pathname === href) return true;
    if (!pathname.startsWith(href + '/')) return false;
    return !NAV_ITEMS.some((o) => o.href !== href && o.href.startsWith(href + '/') && (pathname === o.href || pathname.startsWith(o.href + '/')));
}
