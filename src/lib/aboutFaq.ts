// ============================================================
// aboutFaq.ts - שאלות ותשובות של דף "אודותינו"
// מקור אמת אחד: גם האגף הגלוי בדף וגם סכמת FAQPage (JSON-LD)
// למנועי חיפוש ומנועי AI נבנים מהרשימה הזו. הטקסט חייב להיות
// זהה בשניהם — לכן לא לשכפל אותו לקבצים אחרים.
// כל שאלה ותשובה היא זוג { he, en }; הדף מציג ומזריק לסכמה את השפה של הגולש.
// ============================================================

import type { L10n } from './i18n';

export interface FaqSource {
    q: L10n;
    a: L10n;
}

export interface FaqItem {
    q: string;
    a: string;
}

export const SITE_NAME: L10n = { he: 'המומחים של העם', en: "The Nation's Experts" };
export const SITE_DOMAIN = 'experts.gofreeil.com';
export const SITE_URL = `https://${SITE_DOMAIN}`;

export const ABOUT_FAQ: FaqSource[] = [
    {
        q: { he: 'מה זה "המומחים של העם" ומה מטרתו?', en: 'What is “The Nation’s Experts” and what is its purpose?' },
        a: {
            he: 'המומחים של העם (experts.gofreeil.com) הוא אתר שמרכז צוותי מומחים מתנדבים לצד לוח "בעיות לפתרון". בלב האתר "כוורת המומחים" — תשעה צוותים לפי תחום שתפקידם לסייע לתושבים ולוועדי השכונות, ולצידה לוח שבו כל אחד יכול להעלות בעיה עם תקציב ולקבל הצעות פתרון ממומחים.',
            en: 'The Nation’s Experts (experts.gofreeil.com) is a site that brings together teams of volunteer experts alongside a “Problems to Solve” board. At its heart is the “Experts’ Hive”: nine teams, organized by field, whose job is to help residents and neighborhood committees. Beside it sits a board where anyone can post a problem with a budget and receive solution proposals from experts.'
        }
    },
    {
        q: { he: 'למי האתר מיועד?', en: 'Who is the site for?' },
        a: {
            he: 'לתושבים, לוועדי שכונות ולקהילות שזקוקים לייעוץ או לפתרון מקצועי — בתחומים כמו משפט, מיצוי זכויות, כלכלה, חינוך, חקלאות, טכנולוגיה ובריאות. ובמקביל — לאנשי מקצוע ולמומחים שרוצים לתרום מהידע שלהם או להציע פתרון לבעיה שפורסמה בלוח.',
            en: 'For residents, neighborhood committees and communities who need professional advice or a professional solution, in fields such as law, securing rights, economics, education, agriculture, technology and health. And, at the same time, for professionals and experts who want to contribute their knowledge or offer a solution to a problem posted on the board.'
        }
    },
    {
        q: { he: 'מה אפשר למצוא ולעשות באתר?', en: 'What can I find and do on the site?' },
        a: {
            he: 'בדף הבית מוצגת כוורת המומחים עם תשעת הצוותים: צוות מנהל, עורכי דין, כלכלה, חינוך, חקלאות, טכנולוגיה, בריאות טבעית, מוסר ומיצוי זכויות — כל צוות עם תיאור תפקידו. בלוח "בעיות לפתרון" אפשר לעיין בבעיות פתוחות, לסנן לפי תחום ולפי סוג המעלה (אדם פרטי או קהילה), למיין לפי תאריך או תקציב, להעלות בעיה חדשה ולהגיש הצעת פתרון לבעיה קיימת.',
            en: 'The home page shows the Experts’ Hive with its nine teams: management, lawyers, economics, education, agriculture, technology, natural health, ethics and rights, each with a description of its role. On the “Problems to Solve” board you can browse open problems, filter by field and by who posted them (a private individual or a community), sort by date or budget, post a new problem, and submit a solution proposal to an existing one.'
        }
    },
    {
        q: { he: 'האם השימוש באתר בתשלום?', en: 'Is the site free to use?' },
        a: {
            he: 'לא. הגלישה באתר, העלאת בעיה ללוח והגשת הצעת פתרון — הכול בחינם. התקציב שמופיע ליד כל בעיה הוא הפרס שמעלה הבעיה מציב למי שיפתור אותה: הכסף נשמר במערכת ומחולק לנותני הפתרון, בכפוף להנחיות עורכי הדין של עמותת "יוצאים לחירות". הדבר היחיד בתשלום הוא פרסום עסקי באתר, לפי המחירון בדף "פרסם אצלנו".',
            en: 'Yes. Browsing the site, posting a problem to the board and submitting a solution proposal are all free. The budget shown next to each problem is the reward the poster offers to whoever solves it: the money is held by the system and paid to the solvers, subject to the guidelines of the lawyers of the “Yotzim LeCherut” association. The only thing that costs money is business advertising on the site, according to the price list on the “Advertise with us” page.'
        }
    },
    {
        q: { he: 'איך מעלים בעיה או מגישים הצעת פתרון?', en: 'How do I post a problem or submit a solution proposal?' },
        a: {
            he: 'להעלאת בעיה נכנסים ללוח "בעיות לפתרון" ולוחצים "העלאת בעיה חדשה": בוחרים אם מדובר באדם פרטי או בקהילה/ועד, ממלאים כותרת, תיאור מפורט, תחום, תקציב מוצע, שם להצגה ופרטי קשר. להצעת פתרון פותחים את דף הבעיה ולוחצים "הצעת פתרון": כותבים את ההצעה, מציינים מחיר מבוקש ופרטי קשר — ומעלה הבעיה יכול ליצור קשר ישירות. בנוסף אפשר להירשם למערכת המשתמשים המאוחדת של "יוצאים לחירות" (באימייל וסיסמה או דרך Google ו-Facebook) ולקבל אזור אישי.',
            en: 'To post a problem, go to the “Problems to Solve” board and click “Post a new problem”: choose whether you are a private individual or a community/committee, then fill in a title, a detailed description, a field, a proposed budget, a display name and contact details. To propose a solution, open the problem’s page and click “Propose a solution”: write your proposal and state an asking price and your contact details, and the poster can contact you directly. You can also register with the unified user system of “Yotzim LeCherut” (with an email and password, or through Google or Facebook) and get a personal area.'
        }
    },
    {
        q: { he: 'מי עומד מאחורי האתר?', en: 'Who is behind the site?' },
        a: {
            he: 'האתר הוא חלק מרשת האתרים של התנועה החברתית "יוצאים לחירות" (gofreeil.com), לצד אתרים כמו "קהילה בשכונה", "ועדי שכונות", "הגמ"ח הארצי" ו"דירוג ציבורי". התפקיד הייחודי שלו ברשת הוא הזרוע המקצועית: צוותי מומחים לפי תחום שמלווים את ועדי השכונות ואת התושבים, ולוח שמחבר בין בעיות אמיתיות לאנשים שיכולים לפתור אותן.',
            en: 'The site is part of the network of sites of the social movement “Yotzim LeCherut” (gofreeil.com), alongside sites such as “Neighborhood Community”, “Neighborhood Committees”, “The National Gemach” and “Public Rating”. Its unique role in the network is the professional arm: teams of experts by field who accompany the neighborhood committees and residents, and a board that connects real problems with the people who can solve them.'
        }
    },
    {
        q: { he: 'במה האתר שונה מאתרים דומים?', en: 'How is the site different from similar sites?' },
        a: {
            he: 'המומחים כאן מאורגנים בצוותים לפי תחום עם ייעוד ציבורי מוצהר — סיוע לוועדי שכונות ולתושבים — ולא כרשימת נותני שירות. לוח הבעיות פתוח לאנשים פרטיים ולקהילות כאחד, התקציב וההצעות גלויים לכולם, האתר לא גובה על השימוש, וכל הפעילות נעשית מתוך תנועה חברתית ולא כעסק.',
            en: 'The experts here are organized into teams by field with a declared public mission, helping neighborhood committees and residents, rather than as a list of service providers. The problem board is open to private individuals and communities alike, the budgets and proposals are visible to everyone, the site doesn’t charge for use, and all the activity comes from a social movement rather than a business.'
        }
    },
    {
        q: { he: 'איך יוצרים קשר או מדווחים על בעיה באתר?', en: 'How do I get in touch or report a problem with the site?' },
        a: {
            he: 'דרך הקישור "צור קשר" בתחתית כל דף, שמוביל לכתובת האימייל של התנועה: freedomhasbegun@gmail.com. בנושאי פרסום באתר אפשר לפנות גם דרך דף "פרסם אצלנו", שבו מופיעים אפשרויות הפנייה והמחירון.',
            en: 'Through the “Contact us” link at the bottom of every page, which leads to the movement’s email address: freedomhasbegun@gmail.com. For advertising on the site you can also use the “Advertise with us” page, which lists the contact options and the price list.'
        }
    },
    {
        q: { he: 'מה זה "בעיה עם תקציב" ואיך התהליך עובד?', en: 'What is a “problem with a budget” and how does the process work?' },
        a: {
            he: 'מי שמעלה בעיה נוקב בסכום שהוא מוכן להקצות לפתרונה — הסכום מוצג לצד הבעיה בלוח. מומחים שמעוניינים לטפל בה מגישים הצעת פתרון עם מחיר מבוקש, וכל ההצעות מוצגות בדף הבעיה. מעלה הבעיה בוחר את ההצעה שמתאימה לו ויוצר קשר עם המציע לפי פרטי הקשר שהשאיר. הכסף נשמר במערכת ומחולק לנותני הפתרון, בכפוף להנחיות עורכי הדין של עמותת "יוצאים לחירות".',
            en: 'Whoever posts a problem names the amount they are willing to set aside for solving it, and that amount is displayed next to the problem on the board. Experts who want to handle it submit a solution proposal with an asking price, and all the proposals are displayed on the problem’s page. The poster chooses the proposal that suits them and contacts the proposer using the contact details they left. The money is held by the system and paid to the solvers, subject to the guidelines of the lawyers of the “Yotzim LeCherut” association.'
        }
    }
];
