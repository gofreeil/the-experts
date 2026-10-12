// בעיות הדגמה לדף הבית - מוצגות עד שמישהו מוסיף בעיה ראשונה (ראו problemsStore).
// הנתונים בדויים. ברגע שיש שרת אמיתי, מוחקים את הקובץ הזה ואת השימוש בו.
//
// כל שורה נושאת גם את התרגום לאנגלית (en). הבעיות נשמרות ב-localStorage בעברית בלבד, ולכן התרגום
// נמצא לפי הטקסט העברי עצמו (ראו problemTextEn / solutionTextEn): הוא עובד גם על נתונים ישנים שנשמרו
// בדפדפן, וגם כשמוסיפים או מסדרים מחדש שורות. בעיות שהגולשים כתבו נשארות בשפה שבה נכתבו.

import type { Problem, Solution } from './problemsStore.svelte';

const HOUR = 1000 * 60 * 60;
const DAY = HOUR * 24;

type Row = {
    title: string;
    description: string;
    category: string;
    pub: boolean;       // ציבורית?
    bounty: number;
    hands: number;      // ידיים מורמות
    backers: number;    // תורמים
    age: number;        // גיל בימים
    en: { title: string; description: string };
};

const rows: Row[] = [
    { title: 'חקלאות מקומית בעיר, ועיריית רמת גן מחפשת פתרון שייתן תפוקה כפולה', description: 'עיריית רמת גן מחפשת פתרון לחקלאות מקומית שייתן תפוקה כפולה, ומציעה 100 אלף ש״ח למומחה שיצליח.', category: 'agriculture', pub: true, bounty: 100000, hands: 8, backers: 58, age: 3,
      en: { title: 'Local agriculture in the city, and the Ramat Gan municipality is looking for a solution that doubles the yield', description: 'The Ramat Gan municipality is looking for a solution for local agriculture that will double the yield, and is offering NIS 100,000 to the expert who succeeds.' } },
    { title: 'פקקים בירושלים, והעירייה מחפשת למנוע אותם בעזרת רמזורים חכמים', description: 'עיריית ירושלים מחפשת פתרון למניעת פקקים בעיר על ידי רמזורים חכמים שמתאימים את עצמם לעומס בכל צומת.', category: 'technology', pub: true, bounty: 36000, hands: 6, backers: 41, age: 21,
      en: { title: 'Traffic jams in Jerusalem, and the municipality is looking to prevent them with smart traffic lights', description: 'The Jerusalem municipality is looking for a way to prevent traffic jams in the city using smart traffic lights that adapt to the load at each intersection.' } },
    { title: 'יתושים ברמת בית שמש, והתושבים מחפשים מומחה שיפתור את הבעיה', description: 'תושבי רמת בית שמש מחפשים פתרון ליתושים בעיר, ומציעים 200 אלף ש״ח למומחה שיפתור את הבעיה.', category: 'health', pub: true, bounty: 200000, hands: 9, backers: 214, age: 5,
      en: { title: 'Mosquitoes in Ramat Beit Shemesh, and residents are looking for an expert to solve the problem', description: 'Residents of Ramat Beit Shemesh are looking for a solution to the mosquitoes in town, and are offering NIS 200,000 to the expert who solves it.' } },
    { title: 'אין תוכנית ותקציב להקמת גינות מאכל ברחובות השכונה', description: 'תוכנית לגינות מאכל שכונתיות, עם בחירת צמחים, השקיה, אחזקה ועלויות לכל רחוב.', category: 'agriculture', pub: true, bounty: 22000, hands: 7, backers: 29, age: 15,
      en: { title: 'There is no plan or budget for setting up edible gardens on the neighborhood’s streets', description: 'A plan for neighborhood edible gardens, with plant selection, irrigation, maintenance and costs for each street.' } },
    { title: 'קשישים עם סוכרת סוג 2 לא יודעים איזה טיפול משלים באמת עובד', description: 'מדריך כתוב בעברית פשוטה, עם מקורות, שמסביר מה עובד ומה לא, ומתי חייבים רופא.', category: 'health', pub: true, bounty: 18400, hands: 9, backers: 52, age: 6,
      en: { title: 'Seniors with type 2 diabetes don’t know which complementary treatments actually work', description: 'A guide written in plain language, with sources, explaining what works and what doesn’t, and when you must see a doctor.' } },
    { title: 'קשישים לא מקבלים הטבות וקצבאות שמגיעות להם כי אף אחד לא מספר להם', description: 'ריכוז כל ההטבות, ההנחות והקצבאות שמגיעות לבני 67 ומעלה, עם טופס ודרך הגשה לכל אחת.', category: 'rights', pub: true, bounty: 15800, hands: 8, backers: 47, age: 4,
      en: { title: 'Seniors aren’t receiving benefits and allowances they are owed, because nobody tells them', description: 'A roundup of every benefit, discount and allowance owed to people aged 67 and over, with the form and how to apply for each.' } },
    { title: 'בני נוער מסיימים בית ספר בלי לדעת מה זה חיסכון, אשראי וריבית', description: 'שמונה מפגשים על חיסכון, אשראי וריבית, מותאמים לגיל 14 עד 17, עם מערכי שיעור מוכנים.', category: 'education', pub: true, bounty: 12300, hands: 4, backers: 33, age: 18,
      en: { title: 'Teens finish school without knowing what savings, credit and interest are', description: 'Eight sessions on savings, credit and interest, tailored to ages 14 to 17, with ready-made lesson plans.' } },
    { title: 'ועדי שכונות שנמצאים בסכסוך נתקעים ואין למי לפנות', description: 'כשוועדים נתקעים, אין למי לפנות. מחפשים הליך גישור קצר, שקוף וחינמי לצדדים.', category: 'ethics', pub: true, bounty: 9600, hands: 3, backers: 24, age: 11,
      en: { title: 'Neighborhood committees in a dispute get stuck, and have nobody to turn to', description: 'When committees get stuck, there is nobody to turn to. We’re looking for a short, transparent and free mediation process for the parties.' } },
    { title: 'הודעות ועד ותורנויות בבניין משותף לא מגיעות לכל הדיירים', description: 'מסך ותוכנה קלה שמציגים הודעות ועד, תורנויות ואירועי שכנים. בלי חשבון ובלי אפליקציה.', category: 'technology', pub: true, bounty: 4200, hands: 5, backers: 14, age: 8,
      en: { title: 'Committee notices and duty rosters in a shared building don’t reach all the residents', description: 'A screen and simple software that display committee notices, duty rosters and neighbor events. No account and no app.' } },
    { title: 'עולים חדשים לא מממשים את זכויותיהם בשנה הראשונה', description: 'רשימה מסודרת של כל סל הקליטה, בעברית, ברוסית ובאנגלית.', category: 'rights', pub: true, bounty: 2800, hands: 2, backers: 12, age: 10,
      en: { title: 'New immigrants don’t claim their rights in their first year', description: 'A clear list of the entire absorption basket, in Hebrew, Russian and English.' } },
    { title: 'בניינים משותפים משלמים על חשמל יותר מדי ואין מי שיבדוק אם כדאי להחליף ספק', description: 'חישוב אם כדאי לעבור לספק פרטי בבנייני דירות של 20 יחידות ומעלה.', category: 'economy', pub: true, bounty: 2200, hands: 3, backers: 9, age: 14,
      en: { title: 'Shared buildings pay too much for electricity, and nobody checks whether switching suppliers makes sense', description: 'A calculation of whether it pays to switch to a private supplier in apartment buildings of 20 units or more.' } },
    { title: 'הורים לא יודעים איך לדבר עם בני נוער על כסף', description: 'סדנה של שעה וחצי לוועדי הורים, עם דוגמאות ותרגילים מוכנים.', category: 'education', pub: true, bounty: 1900, hands: 2, backers: 10, age: 19,
      en: { title: 'Parents don’t know how to talk to teens about money', description: 'A 90-minute workshop for parents’ committees, with ready-made examples and exercises.' } },
    { title: 'בני נוער ישנים מעט ולא מצליחים להתרכז בגלל מסכים', description: 'שיעור קצר וחינמי לבתי ספר על שינה, מסכים וריכוז, עם מקורות.', category: 'health', pub: true, bounty: 1600, hands: 2, backers: 8, age: 16,
      en: { title: 'Teens sleep too little and can’t concentrate because of screens', description: 'A short, free lesson for schools on sleep, screens and concentration, with sources.' } },
    { title: 'ליווי משפחתי במחלוקת ירושה', description: 'שלושה אחים לא מצליחים להסכים על חלוקת דירה. מחפשים מגשר שמכיר את הנושא.', category: 'ethics', pub: false, bounty: 1500, hands: 1, backers: 1, age: 13,
      en: { title: 'Family support in an inheritance dispute', description: 'Three siblings can’t agree on how to divide an apartment. We’re looking for a mediator who knows the subject.' } },
    { title: 'מורה למתמטיקה לבגרות 5 יחידות, בזום', description: 'תלמיד כיתה י״ב עם פערים בחדו״א. מחפשים מורה לשני מפגשים בשבוע עד המועד.', category: 'education', pub: false, bounty: 900, hands: 4, backers: 1, age: 7,
      en: { title: 'Math tutor for the 5-unit matriculation exam, on Zoom', description: 'A 12th-grader with gaps in calculus. We’re looking for a tutor for two sessions a week until the exam date.' } },
    { title: 'קבוצות שכונה בוואטסאפ מוצפות בלשון הרע, ספאם ופרסום עסקים', description: 'מסמך קצר שוועדים יכולים לאמץ, שמטפל בלשון הרע, ספאם ופרסום עסקים.', category: 'ethics', pub: true, bounty: 800, hands: 1, backers: 6, age: 22,
      en: { title: 'Neighborhood WhatsApp groups are flooded with slander, spam and business ads', description: 'A short document that committees can adopt, dealing with slander, spam and business advertising.' } },
    { title: 'עורך דין לערעור על קנס חניה מצטבר', description: 'שמונה קנסות על אותה חניה בבניין. צריך ערעור משותף וחוות דעת.', category: 'law', pub: false, bounty: 700, hands: 2, backers: 1, age: 6,
      en: { title: 'A lawyer to appeal an accumulated parking fine', description: 'Eight fines for the same parking spot in the building. We need a joint appeal and a legal opinion.' } },
    { title: 'ייעוץ משכנתא: מיחזור לפני סוף השנה', description: 'משכנתא של 2019 בריבית משתנה. רוצה לדעת אם כדאי למחזר, ובאיזה מסלול.', category: 'economy', pub: false, bounty: 650, hands: 2, backers: 1, age: 2,
      en: { title: 'Mortgage advice: refinancing before year-end', description: 'A 2019 mortgage at a variable rate. I’d like to know whether refinancing makes sense, and on which track.' } },
    { title: 'גינה קהילתית מבזבזת מים ואין כסף למערכת השקיה יקרה', description: 'דרכים להשקות גינה קהילתית בלי לבזבז מים ובלי לשלם על מערכת יקרה.', category: 'agriculture', pub: true, bounty: 600, hands: 2, backers: 5, age: 9,
      en: { title: 'A community garden wastes water and there’s no money for an expensive irrigation system', description: 'Ways to water a community garden without wasting water and without paying for an expensive system.' } },
    { title: 'הגדרת רשת ביתית בטוחה לעסק קטן', description: 'חמש עמדות, מדפסת ומצלמות. רוצים הפרדה בין רשת העסק לרשת הלקוחות.', category: 'technology', pub: false, bounty: 450, hands: 3, backers: 1, age: 3,
      en: { title: 'Setting up a secure home network for a small business', description: 'Five workstations, a printer and cameras. We want the business network separated from the customer network.' } },
    { title: 'בדיקת חוזה שכירות עם סעיף שנראה בעייתי', description: 'המשכיר מבקש ערבות בנקאית ושלושה שיקים. מבקש חוות דעת קצרה לפני חתימה.', category: 'law', pub: false, bounty: 400, hands: 3, backers: 1, age: 5,
      en: { title: 'Reviewing a lease with a clause that looks problematic', description: 'The landlord is asking for a bank guarantee and three checks. I’d like a short opinion before signing.' } },
    { title: 'חוות דעת שנייה על תפריט לילד עם אלרגיות', description: 'הרופא המליץ על דיאטה מצמצמת. מעוניינים בדעה נוספת לפני שמתחילים.', category: 'health', pub: false, bounty: 300, hands: 2, backers: 1, age: 2,
      en: { title: 'A second opinion on a meal plan for a child with allergies', description: 'The doctor recommended a restrictive diet. We’d like another opinion before we start.' } },
    { title: 'שחזור תמונות ממחשב ישן שלא נדלק', description: 'דיסק קשיח עם תמונות משפחה מ-2009. צריך שחזור בלי לאבד קבצים.', category: 'technology', pub: false, bounty: 250, hands: 3, backers: 1, age: 4,
      en: { title: 'Recovering photos from an old computer that won’t turn on', description: 'A hard drive with family photos from 2009. We need recovery without losing files.' } },
    { title: 'אבחון מחלה בעצי הדר בחצר', description: 'העלים מצהיבים והפרי נושר. צילומים מצורפים. צריך אבחנה ופתרון.', category: 'agriculture', pub: false, bounty: 180, hands: 2, backers: 1, age: 1,
      en: { title: 'Diagnosing a disease in the backyard citrus trees', description: 'The leaves are yellowing and the fruit is dropping. Photos attached. We need a diagnosis and a solution.' } }
];

// הצעות פתרון להדגמה (קומת "פתרונות אחרונים שהועלו"), לפי מספר השורה למעלה (מ-0).
type SolRow = {
    row: number;
    solverName: string;
    proposal: string;
    askingPrice: number;
    ageHours: number;
    en: { solverName: string; proposal: string };
};

const solRows: SolRow[] = [
    { row: 8, solverName: 'מאיה דרור', proposal: 'מסך קטן בכניסה לבניין שמציג הודעות ועד ותורנויות מדף אינטרנט פשוט. בלי חשבון ובלי אפליקציה, והוועד מעדכן מהטלפון.', askingPrice: 900, ageHours: 3,
      en: { solverName: 'Maya Dror', proposal: 'A small screen at the building entrance showing committee notices and duty rosters from a simple web page. No account and no app, and the committee updates it from a phone.' } },
    { row: 5, solverName: 'מיכל אברהם', proposal: 'טבלה מסודרת של כל ההטבות לבני 67 ומעלה, ולכל הטבה טופס ודרך הגשה צעד אחר צעד.', askingPrice: 2900, ageHours: 9,
      en: { solverName: 'Michal Avraham', proposal: 'A well-organized table of every benefit for people aged 67 and over, with a form and a step-by-step way to apply for each one.' } },
    { row: 0, solverName: 'אילנה גולד', proposal: 'חממה עירונית קטנה עם השקיה בטפטוף וחיישני לחות שמכפילה את היבול לדונם. מתחילים בחלקה אחת של העירייה כניסוי של עונה.', askingPrice: 14000, ageHours: 14,
      en: { solverName: 'Ilana Gold', proposal: 'A small urban greenhouse with drip irrigation and moisture sensors that doubles the yield per dunam. Starting with one municipal plot as a one-season pilot.' } },
    { row: 2, solverName: 'ד״ר גיל שפירא', proposal: 'מיפוי מקווי מים עומדים בעיר, טיפול ביולוגי ממוקד בהם ותוכנית תחזוקה שנתית יחד עם ועדי השכונות.', askingPrice: 38000, ageHours: 20,
      en: { solverName: 'Dr. Gil Shapira', proposal: 'Mapping the city’s standing-water sites, targeted biological treatment of them, and an annual maintenance plan together with the neighborhood committees.' } },
    { row: 3, solverName: 'ד״ר שרה לוי', proposal: 'תוכנית נטיעה והשקיה לרחוב אחד, עם רשימת צמחים ועלות לכל מגרש. אפשר לשכפל לשאר הרחובות.', askingPrice: 5400, ageHours: 31,
      en: { solverName: 'Dr. Sarah Levi', proposal: 'A planting and irrigation plan for one street, with a plant list and the cost for each plot. It can be replicated on the other streets.' } },
    { row: 1, solverName: 'דן אביטל', proposal: 'רמזורים שמאריכים ומקצרים את הירוק לפי העומס בזמן אמת, עם חיישנים בצמתים. מתחילים בעשרה צמתים עמוסים כניסוי.', askingPrice: 9500, ageHours: 52,
      en: { solverName: 'Dan Avital', proposal: 'Traffic lights that lengthen and shorten the green according to real-time load, with sensors at intersections. Starting with ten busy intersections as a pilot.' } },
    { row: 6, solverName: 'ענת רוזן', proposal: 'שמונה מפגשים עם מערכי שיעור מוכנים, מותאמים לגילאי 14 עד 17 ופתוחים לכל בית ספר.', askingPrice: 2400, ageHours: 76,
      en: { solverName: 'Anat Rosen', proposal: 'Eight sessions with ready-made lesson plans, tailored to ages 14 to 17 and open to any school.' } }
];

// פרטים שונים משאר השורות, לפי מספר השורה: מי פרסם, ותמונה אמיתית לכרטיס
const extras: Record<number, { poster?: { he: string; en: string }; image?: string }> = {
    0: { poster: { he: 'עיריית רמת גן', en: 'Ramat Gan Municipality' }, image: '/images/problems/local-agriculture.webp' },
    1: { poster: { he: 'עיריית ירושלים', en: 'Jerusalem Municipality' }, image: '/images/problems/traffic-lights.webp' },
    2: { poster: { he: 'תושבי רמת בית שמש', en: 'Residents of Ramat Beit Shemesh' }, image: '/images/problems/mosquitoes.webp' }
};

const POSTER_PUBLIC = { he: 'ועד שכונה', en: 'Neighborhood committee' };
const POSTER_PRIVATE = { he: 'מבקש פרטי', en: 'Private requester' };

export function demoProblems(): Problem[] {
    const now = Date.now();
    return rows.map(({ title, description, category, pub, bounty, hands, backers, age }, i) => ({
        id: `demo-${i + 1}`,
        title,
        description,
        category,
        type: pub ? 'community' : 'individual',
        posterName: (extras[i]?.poster ?? (pub ? POSTER_PUBLIC : POSTER_PRIVATE)).he,
        image: extras[i]?.image,
        contact: 'demo@example.com',
        bounty,
        status: 'open',
        createdAt: now - age * DAY,
        solutions: solRows
            .filter(({ row }) => row === i)
            .map(({ solverName, proposal, askingPrice, ageHours }, j): Solution => ({
                id: `demo-${i + 1}-s${j + 1}`,
                problemId: `demo-${i + 1}`,
                solverName,
                contact: 'demo@example.com',
                proposal,
                askingPrice,
                createdAt: now - ageHours * HOUR
            })),
        hands,
        backers
    }));
}

/* ───────── תרגום לפי הטקסט העברי ───────── */

type ProblemTextEn = { title: string; description: string; posterName?: string };
type SolutionTextEn = { solverName: string; proposal: string };

const problemTm = new Map<string, ProblemTextEn>(rows.map((r) => [r.title, r.en]));
const posterTm = new Map<string, string>([
    ...Object.values(extras).flatMap((x) => (x.poster ? [[x.poster.he, x.poster.en] as [string, string]] : [])),
    [POSTER_PUBLIC.he, POSTER_PUBLIC.en],
    [POSTER_PRIVATE.he, POSTER_PRIVATE.en]
]);
const solutionTm = new Map<string, SolutionTextEn>(solRows.map((s) => [s.proposal, s.en]));

// בעיות ההתחלתיות שב-problemsStore (seed-1..3)
const seedTm: [string, ProblemTextEn][] = [
    ['ועד השכונה מנהל מאבק מול עיריית ירושלים על ניקיון רחובות וגינות ציבוריות',
        { title: 'The neighborhood committee is fighting the Jerusalem municipality over street cleaning and public gardens',
          description: 'Our neighborhood committee (Kiryat Moshe) is fighting the municipality over street cleaning and public gardens. We need a lawyer who specializes in claims against local authorities to review the case and write a warning letter.',
          posterName: 'Kiryat Moshe neighborhood committee' }],
    ['חוגי השכונה מתנהלים בקבצי אקסל ובווטסאפ וההורים לא יכולים להירשם ולשלם',
        { title: 'Neighborhood classes run on Excel files and WhatsApp, and parents can’t sign up and pay',
          description: 'We have 12 classes run through Excel files and WhatsApp. We need a simple app that lets parents sign up and pay, and lets instructors see their rosters.',
          posterName: 'Neighborhood classes management' }],
    ['בקשה לקצבת נכות סורבה בלי הסבר ואין מי שילווה בערעור מול ביטוח לאומי',
        { title: 'A disability allowance claim was denied without explanation, and nobody is helping with the National Insurance appeal',
          description: 'My father applied for a disability allowance 8 months ago and was refused without explanation. We need support with an appeal.',
          posterName: 'David M.' }]
];
for (const [he, en] of seedTm) problemTm.set(he, en);
posterTm.set('ועד שכונת קרית משה', 'Kiryat Moshe neighborhood committee');
posterTm.set('הנהלת חוגי השכונה', 'Neighborhood classes management');
posterTm.set('דוד מ.', 'David M.');

/** התרגום לאנגלית של בעיית הדגמה (לפי הכותרת העברית), או undefined לבעיה שגולש כתב */
export const problemTextEn = (title: string): ProblemTextEn | undefined => problemTm.get(title);
export const posterNameEn = (name: string): string | undefined => posterTm.get(name);
export const solutionTextEn = (proposal: string): SolutionTextEn | undefined => solutionTm.get(proposal);
