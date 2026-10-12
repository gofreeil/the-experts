// המומחים, הרזומה של כל אחד, והבעיות שפתרו (הדגמה, כמו שאר הנתונים ב-homeData).
// כל מומחה שייך לצוות אחד (c = slug של צוות). הרשימה ממוינת לפי הרווח, והדירוג בדף הצוות לפי בעיות שנפתרו.
// שדות טקסט הם זוגות { he, en } (נפתרים בתצוגה ע"י i18n.l); מספרים וסלאגים ניטרליים.

import { LEDGER, type Solved } from './homeData';
import type { L10n, Localized } from './i18n';

export type ExpertSource = {
    slug: string;
    n: L10n;
    c: string;          // slug של הצוות
    ini: L10n;
    solved: number;     // סך הבעיות שנפתרו, ציבוריות ופרטיות
    earned: number;
    rate: string;
    rt: L10n;           // זמן תגובה
    open: number;       // ידיים מורמות כרגע
    role: L10n;
    since: number;      // שנת הצטרפות
    bio: L10n;
    skills: L10n<string[]>;
    creds: L10n<string[]>;    // השכלה והסמכות
};

/** מומחה כפי שמוצג: כל הטקסטים בשפה הנוכחית */
export type Expert = Localized<ExpertSource>;

const experts: ExpertSource[] = [
    /* ───── עורכי דין ───── */
    { slug: 'ronit-cohen', n: { he: 'עו״ד רונית כהן', en: 'Adv. Ronit Cohen' }, c: 'law', ini: { he: 'רכ', en: 'RC' }, solved: 23, earned: 41200, rate: '4.9', rt: { he: '3 שעות', en: '3 hours' }, open: 2,
      role: { he: 'עורכת דין, דיני רשויות וקצבאות', en: 'Attorney, administrative and benefits law' }, since: 2024,
      bio: { he: 'מלווה ועדי שכונות ומשפחות מול הרשויות. מתמחה בערעורים על החלטות מנהליות ובניסוח חוזים הוגנים לדיירים.', en: 'Accompanies neighborhood committees and families in dealings with the authorities. Specializes in appeals of administrative decisions and in drafting fair contracts for tenants.' },
      skills: { he: ['ערעורים מנהליים', 'דיני שכירות', 'ביטוח לאומי', 'מכתבי התראה'], en: ['Administrative appeals', 'Tenancy law', 'National Insurance', 'Warning letters'] },
      creds: { he: ['תואר ראשון במשפטים, האוניברסיטה העברית', 'חברה בלשכת עורכי הדין מאז 2011'], en: ['LL.B., Hebrew University', 'Member of the Israel Bar Association since 2011'] } },
    { slug: 'yuval-mizrahi', n: { he: 'עו״ד יובל מזרחי', en: 'Adv. Yuval Mizrahi' }, c: 'law', ini: { he: 'ימ', en: 'YM' }, solved: 15, earned: 21500, rate: '4.8', rt: { he: '5 שעות', en: '5 hours' }, open: 1,
      role: { he: 'עורך דין, תביעות מול רשויות מקומיות', en: 'Attorney, claims against local authorities' }, since: 2024,
      bio: { he: 'מנסח מכתבי התראה ותביעות מול עיריות ורשויות. עובד עם ועדי שכונות מאז שהוקמו.', en: 'Drafts warning letters and lawsuits against municipalities and authorities. Has worked with neighborhood committees since they were founded.' },
      skills: { he: ['דיני רשויות מקומיות', 'חופש המידע', 'מכתבי התראה', 'ייצוג ועדים'], en: ['Local-authority law', 'Freedom of information', 'Warning letters', 'Representing committees'] },
      creds: { he: ['תואר ראשון במשפטים, אוניברסיטת בר-אילן', 'חבר בלשכת עורכי הדין מאז 2014'], en: ['LL.B., Bar-Ilan University', 'Member of the Israel Bar Association since 2014'] } },
    { slug: 'tamar-segal', n: { he: 'עו״ד תמר סגל', en: 'Adv. Tamar Segal' }, c: 'law', ini: { he: 'תס', en: 'TS' }, solved: 9, earned: 9800, rate: '4.7', rt: { he: 'יום', en: '1 day' }, open: 1,
      role: { he: 'עורכת דין, משפחה, ירושה ועמותות', en: 'Attorney, family, inheritance and nonprofit law' }, since: 2025,
      bio: { he: 'כותבת מדריכים משפטיים בשפה פשוטה, ומלווה ועדים בהקמת עמותות.', en: 'Writes legal guides in plain language, and helps committees set up nonprofits.' },
      skills: { he: ['צוואות וירושות', 'ייפוי כוח', 'הקמת עמותות', 'הסכמים בין שכנים'], en: ['Wills and inheritance', 'Power of attorney', 'Setting up nonprofits', 'Agreements between neighbors'] },
      creds: { he: ['תואר ראשון במשפטים, המכללה האקדמית שערי משפט', 'חברה בלשכת עורכי הדין מאז 2016'], en: ['LL.B., Shaarei Mishpat Academic College', 'Member of the Israel Bar Association since 2016'] } },

    /* ───── כלכלה ───── */
    { slug: 'uri-ben-david', n: { he: 'אורי בן-דוד', en: 'Uri Ben-David' }, c: 'economy', ini: { he: 'אב', en: 'UB' }, solved: 14, earned: 19800, rate: '4.7', rt: { he: '6 שעות', en: '6 hours' }, open: 2,
      role: { he: 'יועץ כלכלי, חיסכון בבניין ובמשק הבית', en: 'Financial advisor, savings for buildings and households' }, since: 2024,
      bio: { he: 'בודק הצעות מחיר, חשבונות ומשכנתאות, ומראה איפה אפשר לחסוך בלי לוותר על איכות.', en: 'Reviews quotes, bills and mortgages, and shows where you can save without giving up quality.' },
      skills: { he: ['חיסכון בהוצאות בניין', 'ייעוץ משכנתאות', 'השוואת ספקים', 'תקצוב ביתי'], en: ['Cutting building expenses', 'Mortgage advice', 'Supplier comparison', 'Household budgeting'] },
      creds: { he: ['תואר שני במנהל עסקים, האוניברסיטה העברית', 'יועץ משכנתאות מוסמך'], en: ['MBA, Hebrew University', 'Certified mortgage advisor'] } },
    { slug: 'ronen-adari', n: { he: 'רו״ח רונן אדרי', en: 'Ronen Adari, CPA' }, c: 'economy', ini: { he: 'רא', en: 'RA' }, solved: 10, earned: 12600, rate: '4.8', rt: { he: 'יום', en: '1 day' }, open: 1,
      role: { he: 'רואה חשבון, ניהול כספי של עמותות', en: 'Accountant, financial management for nonprofits' }, since: 2025,
      bio: { he: 'עוזר לעמותות ולוועדים קטנים לנהל כספים בצורה שקופה ולעבור ביקורת בשקט.', en: 'Helps nonprofits and small committees manage their money transparently and get through an audit calmly.' },
      skills: { he: ['הנהלת חשבונות לעמותות', 'מיסוי', 'דוחות כספיים', 'ביקורת פנימית'], en: ['Nonprofit bookkeeping', 'Taxation', 'Financial statements', 'Internal audit'] },
      creds: { he: ['רואה חשבון מוסמך', 'תואר ראשון בחשבונאות, אוניברסיטת תל אביב'], en: ['Certified public accountant', 'B.A. in accounting, Tel Aviv University'] } },
    { slug: 'shira-golan', n: { he: 'שירה גולן', en: 'Shira Golan' }, c: 'economy', ini: { he: 'שג', en: 'SG' }, solved: 7, earned: 8100, rate: '4.6', rt: { he: 'יומיים', en: '2 days' }, open: 1,
      role: { he: 'כלכלנית, תקצוב ציבורי ומימון קהילתי', en: 'Economist, public budgeting and community funding' }, since: 2025,
      bio: { he: 'מתכננת מודלים לחלוקת תקציבים קטנים בשכונה, כך שכל תושב יכול לראות לאן הכסף הלך.', en: 'Designs models for dividing small neighborhood budgets, so that every resident can see where the money went.' },
      skills: { he: ['תקצוב משתתף', 'מימון קהילתי', 'ניתוח עלות ותועלת'], en: ['Participatory budgeting', 'Community funding', 'Cost-benefit analysis'] },
      creds: { he: ['תואר שני בכלכלה, האוניברסיטה העברית'], en: ['M.A. in economics, Hebrew University'] } },

    /* ───── חינוך ───── */
    { slug: 'anat-rosen', n: { he: 'ענת רוזן', en: 'Anat Rosen' }, c: 'education', ini: { he: 'ער', en: 'AR' }, solved: 9, earned: 17200, rate: '4.8', rt: { he: '5 שעות', en: '5 hours' }, open: 1,
      role: { he: 'מחנכת, חינוך פיננסי וחינוך עצמאי', en: 'Educator, financial and independent education' }, since: 2024,
      bio: { he: 'כותבת מערכי שיעור פתוחים לכל מי שרוצה ללמד, בבית ובבית הספר.', en: 'Writes open lesson plans for anyone who wants to teach, at home and at school.' },
      skills: { he: ['חינוך פיננסי', 'כתיבת מערכי שיעור', 'הוראה ביתית', 'הדרכת הורים'], en: ['Financial education', 'Writing lesson plans', 'Home teaching', 'Parent guidance'] },
      creds: { he: ['תואר שני בחינוך, אוניברסיטת בר-אילן', 'מורה מוסמכת, 14 שנות ניסיון'], en: ['M.A. in education, Bar-Ilan University', 'Certified teacher, 14 years of experience'] } },
    { slug: 'itai-barak', n: { he: 'איתי ברק', en: 'Itai Barak' }, c: 'education', ini: { he: 'אב', en: 'IB' }, solved: 7, earned: 9400, rate: '4.7', rt: { he: 'יום', en: '1 day' }, open: 1,
      role: { he: 'מורה לשפה, הוראת קריאה וכתיבה', en: 'Language teacher, reading and writing instruction' }, since: 2025,
      bio: { he: 'עוסק בהוראת קריאה בכיתות הנמוכות, ובפיתוח תרגילים שהורים יכולים לעשות בבית.', en: 'Teaches reading in the lower grades, and develops exercises that parents can do at home.' },
      skills: { he: ['הוראת קריאה', 'הבנת הנקרא', 'הערכה חלופית'], en: ['Teaching reading', 'Reading comprehension', 'Alternative assessment'] },
      creds: { he: ['תואר ראשון בהוראה, מכללת הרצוג', 'מורה לשפה, 9 שנות ניסיון'], en: ['B.Ed., Herzog College', 'Language teacher, 9 years of experience'] } },
    { slug: 'lior-hadad', n: { he: 'ליאור חדד', en: 'Lior Hadad' }, c: 'education', ini: { he: 'לח', en: 'LH' }, solved: 5, earned: 6100, rate: '4.6', rt: { he: 'יומיים', en: '2 days' }, open: 1,
      role: { he: 'יועץ חינוכי, ועדי הורים', en: 'Education consultant, parents’ committees' }, since: 2025,
      bio: { he: 'מסייע לוועדי הורים לפנות לבתי הספר, לקבל מידע ולהשפיע על תכני הלימוד.', en: 'Helps parents’ committees approach schools, get information and influence what is taught.' },
      skills: { he: ['ועדי הורים', 'עבודה מול בתי ספר', 'כתיבת פניות'], en: ['Parents’ committees', 'Working with schools', 'Writing formal requests'] },
      creds: { he: ['תואר שני בייעוץ חינוכי, האוניברסיטה העברית'], en: ['M.A. in educational counseling, Hebrew University'] } },

    /* ───── חקלאות ───── */
    { slug: 'sarah-levi', n: { he: 'ד״ר שרה לוי', en: 'Dr. Sarah Levi' }, c: 'agriculture', ini: { he: 'של', en: 'SL' }, solved: 11, earned: 38900, rate: '4.8', rt: { he: 'יום', en: '1 day' }, open: 1,
      role: { he: 'אגרונומית, גינות מאכל ושכונות ירוקות', en: 'Agronomist, edible gardens and green neighborhoods' }, since: 2024,
      bio: { he: 'מתכננת גינות מאכל שמתאימות לאקלים ההררי, ובונה תוכניות שאפשר לשכפל מרחוב לרחוב.', en: 'Designs edible gardens suited to the hill-country climate, and builds plans that can be replicated from street to street.' },
      skills: { he: ['גינות מאכל', 'קומפוסט', 'עצי פרי', 'תכנון נטיעות'], en: ['Edible gardens', 'Composting', 'Fruit trees', 'Planting design'] },
      creds: { he: ['דוקטורט באגרונומיה, הפקולטה לחקלאות ברחובות', '15 שנות ניסיון בגינון עירוני'], en: ['Ph.D. in agronomy, Faculty of Agriculture in Rehovot', '15 years of experience in urban gardening'] } },
    { slug: 'gil-amar', n: { he: 'גיל עמר', en: 'Gil Amar' }, c: 'agriculture', ini: { he: 'גע', en: 'GA' }, solved: 8, earned: 11200, rate: '4.7', rt: { he: 'יום', en: '1 day' }, open: 1,
      role: { he: 'מהנדס השקיה וגגות ירוקים', en: 'Irrigation and green-roof engineer' }, since: 2025,
      bio: { he: 'מתכנן מערכות השקיה זולות לגינות, גגות ומרפסות, כולל רשימת חומרים וחישוב עלות.', en: 'Designs low-cost irrigation systems for gardens, roofs and balconies, including a materials list and a cost estimate.' },
      skills: { he: ['טפטוף והשקיה', 'גגות ירוקים', 'חיסכון במים'], en: ['Drip irrigation', 'Green roofs', 'Water saving'] },
      creds: { he: ['תואר ראשון בהנדסת סביבה, הטכניון'], en: ['B.Sc. in environmental engineering, Technion'] } },
    { slug: 'rotem-eden', n: { he: 'רותם עדן', en: 'Rotem Eden' }, c: 'agriculture', ini: { he: 'רע', en: 'RE' }, solved: 6, earned: 7400, rate: '4.8', rt: { he: 'יומיים', en: '2 days' }, open: 1,
      role: { he: 'מדריכת גידול ביתי ועצי הדר', en: 'Home-growing and citrus instructor' }, since: 2025,
      bio: { he: 'מלמדת לגדל ירקות ועצי פרי גם בדירה בלי חצר, ומאבחנת מחלות בעצים.', en: 'Teaches how to grow vegetables and fruit trees even in an apartment without a yard, and diagnoses tree diseases.' },
      skills: { he: ['גידול במרפסת', 'עצי הדר', 'אבחון מחלות'], en: ['Balcony growing', 'Citrus trees', 'Disease diagnosis'] },
      creds: { he: ['הסמכה כמדריכת גינון, משרד החקלאות'], en: ['Certified gardening instructor, Ministry of Agriculture'] } },

    /* ───── טכנולוגיה ───── */
    { slug: 'yoav-shimoni', n: { he: 'יואב שמעוני', en: 'Yoav Shimoni' }, c: 'technology', ini: { he: 'יש', en: 'YS' }, solved: 17, earned: 52300, rate: '4.9', rt: { he: '5 שעות', en: '5 hours' }, open: 3,
      role: { he: 'מפתח תוכנה, מערכות לקהילה', en: 'Software developer, community systems' }, since: 2024,
      bio: { he: 'בונה מערכות קטנות וקלות לתחזוקה לוועדים ולארגונים שכונתיים, ומפרסם אותן בקוד פתוח.', en: 'Builds small, easy-to-maintain systems for committees and neighborhood organizations, and publishes them as open source.' },
      skills: { he: ['פיתוח אתרים ואפליקציות', 'מערכות רישום ותשלום', 'קוד פתוח', 'ארכיטקטורת מערכות'], en: ['Web and app development', 'Sign-up and payment systems', 'Open source', 'System architecture'] },
      creds: { he: ['תואר ראשון במדעי המחשב, האוניברסיטה העברית', '12 שנות ניסיון בפיתוח'], en: ['B.Sc. in computer science, Hebrew University', '12 years of development experience'] } },
    { slug: 'maya-dror', n: { he: 'מאיה דרור', en: 'Maya Dror' }, c: 'technology', ini: { he: 'מד', en: 'MD' }, solved: 13, earned: 24800, rate: '4.8', rt: { he: '4 שעות', en: '4 hours' }, open: 2,
      role: { he: 'מפתחת Full-stack ומעצבת מוצר', en: 'Full-stack developer and product designer' }, since: 2024,
      bio: { he: 'מתכננת ובונה אתרים נגישים, שגם מי שלא מבין במחשבים יכול לעדכן.', en: 'Designs and builds accessible websites that even someone who isn’t tech-savvy can update.' },
      skills: { he: ['עיצוב מוצר', 'נגישות', 'אתרים לארגונים', 'חוויית משתמש'], en: ['Product design', 'Accessibility', 'Websites for organizations', 'User experience'] },
      creds: { he: ['תואר ראשון בתקשורת חזותית, בצלאל', 'מפתחת 9 שנים'], en: ['B.Des. in visual communication, Bezalel', 'Developer for 9 years'] } },
    { slug: 'nadav-katz', n: { he: 'נדב כץ', en: 'Nadav Katz' }, c: 'technology', ini: { he: 'נכ', en: 'NK' }, solved: 9, earned: 14300, rate: '4.7', rt: { he: 'יום', en: '1 day' }, open: 1,
      role: { he: 'מומחה אבטחת מידע ורשתות', en: 'Information and network security specialist' }, since: 2025,
      bio: { he: 'מגדיר רשתות ומערכות מאובטחות לעסקים קטנים ולמוסדות קהילה.', en: 'Sets up secure networks and systems for small businesses and community institutions.' },
      skills: { he: ['אבטחת רשתות', 'גיבויים', 'הרשאות', 'שחזור נתונים'], en: ['Network security', 'Backups', 'Access permissions', 'Data recovery'] },
      creds: { he: ['מוסמך CISSP', 'תואר ראשון בהנדסת תקשורת'], en: ['CISSP certified', 'B.Sc. in communications engineering'] } },

    /* ───── בריאות טבעית ───── */
    { slug: 'noa-green', n: { he: 'ד״ר נועה גרין', en: 'Dr. Noa Green' }, c: 'health', ini: { he: 'גנ', en: 'NG' }, solved: 12, earned: 16400, rate: '4.9', rt: { he: 'יום', en: '1 day' }, open: 1,
      role: { he: 'רופאה, תזונה ובריאות הגיל השלישי', en: 'Physician, nutrition and senior health' }, since: 2024,
      bio: { he: 'כותבת מדריכי בריאות מבוססי מחקר, בשפה פשוטה, עם מקורות ועם הגבול ברור למתי חייבים רופא.', en: 'Writes research-based health guides in plain language, with sources and a clear line on when you must see a doctor.' },
      skills: { he: ['תזונה', 'בריאות קשישים', 'רפואה מונעת', 'חוות דעת שנייה'], en: ['Nutrition', 'Senior health', 'Preventive medicine', 'Second opinions'] },
      creds: { he: ['דוקטורט ברפואה, הדסה', 'התמחות ברפואת המשפחה'], en: ['M.D., Hadassah', 'Residency in family medicine'] } },
    { slug: 'eli-sharabi', n: { he: 'אלי שרעבי', en: 'Eli Sharabi' }, c: 'health', ini: { he: 'אש', en: 'ES' }, solved: 8, earned: 9100, rate: '4.7', rt: { he: 'יום', en: '1 day' }, open: 1,
      role: { he: 'יועץ תזונה, אכילה בריאה בתקציב קטן', en: 'Nutrition consultant, healthy eating on a small budget' }, since: 2025,
      bio: { he: 'בונה תוכניות תזונה למשפחות גדולות, עם רשימות קניות לפי עונה.', en: 'Builds nutrition plans for large families, with seasonal shopping lists.' },
      skills: { he: ['תזונה למשפחות', 'תכנון תפריטים', 'קניות חכמות'], en: ['Family nutrition', 'Meal planning', 'Smart shopping'] },
      creds: { he: ['תואר ראשון בתזונה, האוניברסיטה העברית', 'דיאטן קליני רשום'], en: ['B.Sc. in nutrition, Hebrew University', 'Registered clinical dietitian'] } },
    { slug: 'hila-ben-ami', n: { he: 'הילה בן-עמי', en: 'Hila Ben-Ami' }, c: 'health', ini: { he: 'הב', en: 'HB' }, solved: 6, earned: 6800, rate: '4.8', rt: { he: 'יומיים', en: '2 days' }, open: 1,
      role: { he: 'מטפלת בצמחי מרפא', en: 'Herbal medicine practitioner' }, since: 2025,
      bio: { he: 'מלמדת שימוש בטוח בצמחי מרפא, כולל אזהרות ואינטראקציה עם תרופות.', en: 'Teaches the safe use of medicinal herbs, including warnings and interactions with medication.' },
      skills: { he: ['צמחי מרפא', 'בטיחות', 'עירוב עם תרופות'], en: ['Medicinal herbs', 'Safety', 'Combining with medication'] },
      creds: { he: ['הסמכה בצמחי מרפא, המכללה לרפואה משלימה'], en: ['Herbal medicine certification, College of Complementary Medicine'] } },

    /* ───── מוסר ───── */
    { slug: 'dana-ashkenazi', n: { he: 'דנה אשכנזי', en: 'Dana Ashkenazi' }, c: 'ethics', ini: { he: 'דא', en: 'DA' }, solved: 8, earned: 11300, rate: '4.7', rt: { he: 'יומיים', en: '2 days' }, open: 1,
      role: { he: 'מגשרת קהילתית', en: 'Community mediator' }, since: 2024,
      bio: { he: 'מגשרת בסכסוכי שכנים וקהילה, ומלמדת ועדים לנהל שיחות קשות.', en: 'Mediates neighbor and community disputes, and teaches committees how to hold difficult conversations.' },
      skills: { he: ['גישור', 'ניהול סכסוכים', 'שיח בין קהילות', 'הנחיית קבוצות'], en: ['Mediation', 'Conflict management', 'Dialogue between communities', 'Group facilitation'] },
      creds: { he: ['מגשרת מוסמכת, משרד המשפטים', 'תואר שני בגישור, אוניברסיטת בר-אילן'], en: ['Certified mediator, Ministry of Justice', 'M.A. in mediation, Bar-Ilan University'] } },
    { slug: 'amit-vaknin', n: { he: 'עמית וקנין', en: 'Amit Vaknin' }, c: 'ethics', ini: { he: 'עו', en: 'AV' }, solved: 6, earned: 7200, rate: '4.6', rt: { he: 'יום', en: '1 day' }, open: 1,
      role: { he: 'מנחה לשיח בין קהילות', en: 'Facilitator of dialogue between communities' }, since: 2025,
      bio: { he: 'מארגן מפגשים בין שכנים מקהילות שונות, עם כללי שיח שכולם מקבלים.', en: 'Organizes meetings between neighbors from different communities, with ground rules that everyone accepts.' },
      skills: { he: ['מפגשי קהילות', 'הנחיית שיח', 'ארגון אירועים'], en: ['Community meetings', 'Facilitating dialogue', 'Event organizing'] },
      creds: { he: ['תואר ראשון בסוציולוגיה, האוניברסיטה העברית'], en: ['B.A. in sociology, Hebrew University'] } },
    { slug: 'miriam-goldstein', n: { he: 'מרים גולדשטיין', en: 'Miriam Goldstein' }, c: 'ethics', ini: { he: 'מג', en: 'MG' }, solved: 5, earned: 5300, rate: '4.7', rt: { he: 'יומיים', en: '2 days' }, open: 1,
      role: { he: 'יועצת ארגונית לוועדים', en: 'Organizational consultant for committees' }, since: 2025,
      bio: { he: 'עוזרת לוועדי שכונות ובתים לנהל ישיבות ולקבל החלטות בלי ריבים.', en: 'Helps neighborhood and building committees run meetings and make decisions without quarrels.' },
      skills: { he: ['ניהול ישיבות', 'קבלת החלטות', 'פיתוח ארגוני'], en: ['Running meetings', 'Decision-making', 'Organizational development'] },
      creds: { he: ['תואר שני בפיתוח ארגוני, האוניברסיטה העברית'], en: ['M.A. in organizational development, Hebrew University'] } },

    /* ───── מיצוי זכויות ───── */
    { slug: 'michal-avraham', n: { he: 'מיכל אברהם', en: 'Michal Avraham' }, c: 'rights', ini: { he: 'מא', en: 'MA' }, solved: 19, earned: 27600, rate: '4.8', rt: { he: '4 שעות', en: '4 hours' }, open: 2,
      role: { he: 'יועצת זכויות, ליווי מול גופי המדינה', en: 'Rights advisor, guidance through government agencies' }, since: 2024,
      bio: { he: 'מרכזת את הזכויות שמגיעות לאנשים, ומלווה אותם צעד אחר צעד עד שהן מתקבלות.', en: 'Gathers the rights that people are owed, and accompanies them step by step until they receive them.' },
      skills: { he: ['זכויות עולים', 'זכויות הורים', 'הגשת בקשות', 'מדריכים רב-לשוניים'], en: ['Rights of new immigrants', 'Parents’ rights', 'Filing applications', 'Multilingual guides'] },
      creds: { he: ['תואר שני בעבודה סוציאלית, האוניברסיטה העברית', '11 שנות ניסיון בליווי זכויות'], en: ['M.S.W., Hebrew University', '11 years of experience guiding people through their rights'] } },
    { slug: 'haim-biton', n: { he: 'חיים ביטון', en: 'Haim Biton' }, c: 'rights', ini: { he: 'חב', en: 'HB' }, solved: 14, earned: 17900, rate: '4.8', rt: { he: '5 שעות', en: '5 hours' }, open: 1,
      role: { he: 'יועץ גמלאות וזכויות קשישים', en: 'Benefits and senior-rights advisor' }, since: 2024,
      bio: { he: 'מלווה משפחות בבקשות לקצבאות ולסיעוד, ומכין להן את התיק לפני האבחון.', en: 'Guides families through applications for allowances and long-term care, and prepares their file before the assessment.' },
      skills: { he: ['קצבת סיעוד', 'גמלאות', 'ערעורים', 'ליווי בבקשות'], en: ['Long-term care allowance', 'Benefits', 'Appeals', 'Application support'] },
      creds: { he: ['יועץ זכויות מוסמך, המוסד לביטוח לאומי', 'עובד סוציאלי בעבר בלשכת רווחה'], en: ['Certified rights advisor, National Insurance Institute', 'Former social worker at a welfare bureau'] } },
    { slug: 'lilach-sabag', n: { he: 'לילך סבג', en: 'Lilach Sabag' }, c: 'rights', ini: { he: 'לס', en: 'LS' }, solved: 10, earned: 12400, rate: '4.7', rt: { he: 'יום', en: '1 day' }, open: 1,
      role: { he: 'רכזת זכויות עולים ועצמאים', en: 'Coordinator of rights for new immigrants and the self-employed' }, since: 2025,
      bio: { he: 'עוזרת לעולים חדשים לממש הטבות, לפתוח עסק ולהתמצא במערכת.', en: 'Helps new immigrants claim their benefits, open a business and find their way in the system.' },
      skills: { he: ['זכויות עולים', 'פתיחת עסק', 'הטבות מס'], en: ['Rights of new immigrants', 'Opening a business', 'Tax benefits'] },
      creds: { he: ['תואר ראשון בכלכלה וניהול, אוניברסיטת בן-גוריון'], en: ['B.A. in economics and management, Ben-Gurion University'] } }
];

/** כל המומחים, מהרווח הגבוה לנמוך (כך מוצג גם בדף הבית). */
export const EXPERTS: ExpertSource[] = [...experts].sort((a, b) => b.earned - a.earned);

/* ───────── בעיות שנפתרו, בנוסף לאלה שברשימת התשלומים ───────── */
const MORE: Solved[] = [
    { t: { he: 'בקשת חופש מידע על תקציב ניקיון הרחובות', en: 'Freedom-of-information request on the street-cleaning budget' }, c: 'law', ex: 'yuval-mizrahi', days: 14, amt: 1900, pub: true,
      d: { he: 'הוועד ביקש לדעת כמה משלמת העירייה על ניקיון השכונה ולא קיבל תשובה. הוגשה בקשה לפי חוק חופש המידע, והנתונים התקבלו.', en: 'The committee wanted to know how much the municipality pays to clean the neighborhood and got no answer. A request was filed under the Freedom of Information Law, and the data was received.' } },
    { t: { he: 'תקנון לוועד בית שמונע סכסוכים', en: 'Building-committee bylaws that prevent disputes' }, c: 'law', ex: 'ronit-cohen', days: 12, amt: 1400, pub: true,
      d: { he: 'ועדי בתים התנהלו בלי נוהל כתוב, וכל החלטה הפכה למחלוקת. נוסח תקנון קצר וברור שאפשר לאמץ.', en: 'Building committees operated without written procedures, and every decision became a dispute. A short, clear set of bylaws was drafted for adoption.' } },
    { t: { he: 'ערעור קולקטיבי על חיוב ארנונה כפול', en: 'Collective appeal of a double property-tax charge' }, c: 'law', ex: 'ronit-cohen', days: 16, amt: 2600, pub: true,
      d: { he: 'עשרות דיירים חויבו פעמיים בארנונה על אותו נכס. הוגש ערעור משותף והחיוב בוטל.', en: 'Dozens of residents were charged property tax twice for the same property. A joint appeal was filed and the charge was cancelled.' } },
    { t: { he: 'מדריך צוואה וייפוי כוח לקשישים', en: 'Wills and power-of-attorney guide for seniors' }, c: 'law', ex: 'tamar-segal', days: 10, amt: 1300, pub: true,
      d: { he: 'קשישים בשכונה לא ידעו איך מסדרים צוואה וייפוי כוח בלי עלות גבוהה. נכתב מדריך צעד אחר צעד עם נוסחים מוכנים.', en: 'Seniors in the neighborhood didn’t know how to arrange a will and a power of attorney without high costs. A step-by-step guide was written, with ready-made templates.' } },
    { t: { he: 'הקמת עמותה לוועד שכונה', en: 'Setting up a nonprofit for a neighborhood committee' }, c: 'law', ex: 'tamar-segal', days: 20, amt: 2200, pub: true,
      d: { he: 'ועד שכונה רצה להתאגד כעמותה ולא ידע מאיפה מתחילים. הוכנו מסמכי ההקמה והוגשו לרשם העמותות.', en: 'A neighborhood committee wanted to incorporate as a nonprofit and didn’t know where to start. The founding documents were prepared and filed with the Registrar of Associations.' } },

    { t: { he: 'דוח חיסכון בהוצאות ועד הבית', en: 'Savings report on building-committee expenses' }, c: 'economy', ex: 'uri-ben-david', days: 13, amt: 1600, pub: true,
      d: { he: 'ועד הבית שילם יותר מדי על ניקיון, מעלית וביטוח. נבדקו הצעות מחיר והוגש דוח חיסכון.', en: 'The building committee was paying too much for cleaning, the elevator and insurance. Quotes were compared and a savings report was submitted.' } },
    { t: { he: 'ניהול ספרים פשוט לעמותת שכונה', en: 'Simple bookkeeping for a neighborhood nonprofit' }, c: 'economy', ex: 'ronen-adari', days: 18, amt: 2400, pub: true,
      d: { he: 'עמותת שכונה ניהלה כספים בגיליון אחד ובלי קבלות מסודרות. נבנתה שיטת דיווח פשוטה שעוברת ביקורת.', en: 'A neighborhood nonprofit kept its finances in a single spreadsheet with no proper receipts. A simple reporting system that passes an audit was set up.' } },
    { t: { he: 'מדריך הנחות ופטורים לעמותות קטנות', en: 'Guide to discounts and exemptions for small nonprofits' }, c: 'economy', ex: 'ronen-adari', days: 9, amt: 1200, pub: true,
      d: { he: 'עמותות קטנות לא ידעו על הנחות ופטורי מס שמגיעים להן. נכתב מדריך עם רשימת בדיקה.', en: 'Small nonprofits didn’t know about the discounts and tax exemptions they are entitled to. A guide with a checklist was written.' } },
    { t: { he: 'תקציב משתתף לפרויקט שכונתי', en: 'Participatory budget for a neighborhood project' }, c: 'economy', ex: 'shira-golan', days: 21, amt: 1800, pub: true,
      d: { he: 'ועד שכונה רצה שהתושבים יחליטו על חלוקת תקציב קטן. תוכננה שיטת הצבעה ותקצוב שקופה.', en: 'A neighborhood committee wanted residents to decide how to divide a small budget. A transparent voting and budgeting method was designed.' } },

    { t: { he: 'ערכת שיעורים פתוחה לחינוך עצמאי', en: 'Open lesson kit for independent education' }, c: 'education', ex: 'anat-rosen', days: 25, amt: 3100, pub: true,
      d: { he: 'הורים שלמדו בבית חיפשו מערכי שיעור מסודרים. נבנתה ערכת שיעורים פתוחה לחשבון ולשפה, בחינם לכולם.', en: 'Parents who homeschool were looking for organized lesson plans. An open lesson kit for math and language was built, free for everyone.' } },
    { t: { he: 'מערך הוראה להבנת הנקרא בכיתות ג עד ה', en: 'Reading-comprehension teaching plan for grades 3 to 5' }, c: 'education', ex: 'itai-barak', days: 17, amt: 1900, pub: true,
      d: { he: 'ילדים רבים סיימו כיתה ג בלי קריאה שוטפת. נכתב מערך שיעורים עם תרגולים והערכה פשוטה.', en: 'Many children finished third grade without fluent reading. A lesson plan with exercises and simple assessment was written.' } },
    { t: { he: 'מדריך לוועד הורים: איך מבקשים לראות את תוכנית הלימודים', en: 'Guide for parents’ committees: how to request to see the curriculum' }, c: 'education', ex: 'lior-hadad', days: 12, amt: 1100, pub: true,
      d: { he: 'ועדי הורים לא ידעו איך פונים לבית הספר בבקשה לראות את תוכנית הלימודים. נכתב מדריך עם נוסח פנייה.', en: 'Parents’ committees didn’t know how to ask their school to see the curriculum. A guide with a template request was written.' } },

    { t: { he: 'מפת צמחי מאכל לאקלים ירושלים', en: 'Edible-plant map for Jerusalem’s climate' }, c: 'agriculture', ex: 'sarah-levi', days: 15, amt: 2100, pub: true,
      d: { he: 'תושבים נטעו עצי פרי שלא מתאימים לאקלים ההררי. הוכנה מפת צמחים מומלצים לפי עונה ותנאי קרקע.', en: 'Residents planted fruit trees that don’t suit the hill-country climate. A map of recommended plants was prepared by season and soil conditions.' } },
    { t: { he: 'קומפוסטר שכונתי לשבעה בניינים', en: 'Neighborhood composter for seven buildings' }, c: 'agriculture', ex: 'sarah-levi', days: 29, amt: 3300, pub: true,
      d: { he: 'הפסולת האורגנית של שבעה בניינים הלכה לפח. תוכנן ונבנה קומפוסטר משותף, עם לוח תורנויות.', en: 'The organic waste of seven buildings was going in the trash. A shared composter was designed and built, with a duty roster.' } },
    { t: { he: 'מערכת טפטוף לגג ירוק בבניין משותף', en: 'Drip-irrigation system for a green roof on a shared building' }, c: 'agriculture', ex: 'gil-amar', days: 22, amt: 2800, pub: true,
      d: { he: 'דיירים רצו גג ירוק בלי חשבון מים מנופח. תוכננה מערכת טפטוף עם בקר פשוט ועלות חומרים מוגדרת.', en: 'Residents wanted a green roof without an inflated water bill. A drip system with a simple controller and a defined materials cost was designed.' } },
    { t: { he: 'מדריך לגידול ירקות במרפסת קטנה', en: 'Guide to growing vegetables on a small balcony' }, c: 'agriculture', ex: 'rotem-eden', days: 8, amt: 700, pub: true,
      d: { he: 'דיירי דירות בלי חצר רצו לגדל ירק לצריכה ביתית. נכתב מדריך עם רשימת קניות ולוח זמנים.', en: 'Apartment dwellers without a yard wanted to grow vegetables for home use. A guide with a shopping list and a schedule was written.' } },

    { t: { he: 'אתר הצבעות לוועדי שכונות', en: 'Voting site for neighborhood committees' }, c: 'technology', ex: 'yoav-shimoni', days: 34, amt: 6200, pub: true,
      d: { he: 'ועדים החליטו בוואטסאפ וקולות אבדו. נבנה אתר הצבעה מאובטח עם תיעוד ההחלטות.', en: 'Committees were deciding over WhatsApp and votes were getting lost. A secure voting site with a record of decisions was built.' } },
    { t: { he: 'כלי פתוח לניהול תורנויות בבניין', en: 'Open tool for managing building duty rosters' }, c: 'technology', ex: 'yoav-shimoni', days: 12, amt: 1700, pub: true,
      d: { he: 'תורנויות ניקיון ותשלומים נוהלו בפתקים על הדלת. פורסם כלי קוד פתוח שכל בניין יכול להתקין.', en: 'Cleaning duties and payments were managed with notes on the door. An open-source tool that any building can install was published.' } },
    { t: { he: 'אתר לשכונה: אירועים, הודעות ותרומות', en: 'A neighborhood site: events, announcements and donations' }, c: 'technology', ex: 'maya-dror', days: 38, amt: 5400, pub: true,
      d: { he: 'לשכונה לא היה מקום אחד להודעות ולאירועים. נבנה אתר קל לתחזוקה שוועד השכונה מעדכן בעצמו.', en: 'The neighborhood had no single place for announcements and events. An easy-to-maintain site was built, which the committee updates on its own.' } },
    { t: { he: 'טופס רישום נגיש לפעילות הגיל השלישי', en: 'Accessible sign-up form for senior activities' }, c: 'technology', ex: 'maya-dror', days: 14, amt: 1800, pub: true,
      d: { he: 'טפסי ההרשמה לפעילות לגיל השלישי היו מורכבים בטלפון. נבנה טופס נגיש בגופן גדול.', en: 'The sign-up forms for senior activities were hard to use on a phone. An accessible form in a large font was built.' } },
    { t: { he: 'אבטחת רשת לבית כנסת ולמתנ״ס', en: 'Network security for a synagogue and a community center' }, c: 'technology', ex: 'nadav-katz', days: 19, amt: 2600, pub: true,
      d: { he: 'רשת אחת שימשה אורחים וציוד מנהלי. הופרדו הרשתות, והוגדרו הרשאות וגיבוי.', en: 'A single network served both guests and administrative equipment. The networks were separated, and permissions and backups were set up.' } },

    { t: { he: 'מדריך להתמודדות עם גל חום לקשישים', en: 'Heat-wave survival guide for seniors' }, c: 'health', ex: 'noa-green', days: 6, amt: 800, pub: true,
      d: { he: 'גל חום מסוכן לגיל השלישי, ואין הנחיות פשוטות. נכתב מדריך עם סימני אזהרה ומתי לפנות לרופא.', en: 'A heat wave is dangerous for seniors, and there were no simple guidelines. A guide was written with warning signs and when to see a doctor.' } },
    { t: { he: 'תוכנית תזונה זולה למשפחה גדולה', en: 'Low-cost nutrition plan for a large family' }, c: 'health', ex: 'eli-sharabi', days: 11, amt: 1400, pub: true,
      d: { he: 'משפחות גדולות ביקשו לאכול בריא בלי להוציא הרבה. הוכנה תוכנית שבועית עם רשימת קניות לפי עונה.', en: 'Large families wanted to eat healthily without spending a lot. A weekly plan with a seasonal shopping list was prepared.' } },
    { t: { he: 'מדריך בטוח לשימוש בצמחי מרפא', en: 'Safe-use guide for medicinal herbs' }, c: 'health', ex: 'hila-ben-ami', days: 16, amt: 1700, pub: true,
      d: { he: 'ברשת מסתובב מידע מסוכן על צמחי מרפא. נכתב מדריך עם אזהרות ואינטראקציות עם תרופות.', en: 'Dangerous information about medicinal herbs circulates online. A guide was written with warnings and drug interactions.' } },

    { t: { he: 'מפגש חודשי בין קהילות בשכונה', en: 'Monthly meeting between the neighborhood’s communities' }, c: 'ethics', ex: 'dana-ashkenazi', days: 26, amt: 2000, pub: true,
      d: { he: 'שכונה מעורבת שבה קהילות לא נפגשו. נוסד מפגש חודשי עם נושאים משותפים וכללי שיח.', en: 'A mixed neighborhood where communities never met. A monthly meeting was founded, with shared topics and ground rules for discussion.' } },
    { t: { he: 'ערב היכרות בין קהילות', en: 'Get-to-know-you evening between communities' }, c: 'ethics', ex: 'amit-vaknin', days: 18, amt: 1500, pub: true,
      d: { he: 'שכנים מקהילות שונות לא הכירו זה את זה. נוסח נוהל, ונערך ערב היכרות שחוזר מדי חודש.', en: 'Neighbors from different communities didn’t know one another. A protocol was drafted and an introduction evening was held, and it now recurs every month.' } },
    { t: { he: 'נוהל לניהול ישיבת ועד בלי ריבים', en: 'Procedure for running a committee meeting without quarrels' }, c: 'ethics', ex: 'miriam-goldstein', days: 13, amt: 1000, pub: true,
      d: { he: 'ישיבות ועד הסתיימו בצעקות. נכתב נוהל עם סדר יום, זמני דיבור וסיכום החלטות.', en: 'Committee meetings ended in shouting. A procedure was written with an agenda, speaking times and a summary of decisions.' } },

    { t: { he: 'מפת זכויות להורים לילד עם צרכים מיוחדים', en: 'Rights map for parents of a child with special needs' }, c: 'rights', ex: 'michal-avraham', days: 24, amt: 3600, pub: true,
      d: { he: 'הורים לא ידעו אילו הטבות וסיוע מגיעים להם. נבנתה מפה מסודרת לכל זכות, עם טופס ודרך הגשה.', en: 'Parents didn’t know which benefits and assistance they were entitled to. An organized map was built for each right, with the form and how to apply.' } },
    { t: { he: 'ליווי בבקשות לקצבת סיעוד', en: 'Support with long-term care allowance applications' }, c: 'rights', ex: 'haim-biton', days: 12, amt: 1800, pub: true,
      d: { he: 'משפחות לא הצליחו לעבור את תהליך הבקשה לקצבת סיעוד. נכתב מדריך שלבים, כולל הכנה לאבחון.', en: 'Families struggled to get through the application process for the long-term care allowance. A step-by-step guide was written, including preparation for the assessment.' } },
    { t: { he: 'נוסח ערעור לדוגמה לביטוח לאומי', en: 'Sample appeal letter to National Insurance' }, c: 'rights', ex: 'haim-biton', days: 5, amt: 600, pub: true,
      d: { he: 'בקשות נדחו בלי הסבר, והמבקשים לא ידעו איך מערערים. הוכן נוסח ערעור שאפשר להתאים לכל מקרה.', en: 'Applications were rejected without explanation, and applicants didn’t know how to appeal. An appeal template that can be adapted to any case was prepared.' } },
    { t: { he: 'מדריך זכויות לעולים שפתחו עסק', en: 'Rights guide for new immigrants who opened a business' }, c: 'rights', ex: 'lilach-sabag', days: 13, amt: 1500, pub: true,
      d: { he: 'עולים שפתחו עסק קטן לא ידעו על הטבות מס והלוואות. נכתב מדריך בשלוש שפות.', en: 'New immigrants who opened a small business didn’t know about tax benefits and loans. A guide was written in three languages.' } }
];

/** כל הפתרונות שאושרו: רשימת התשלומים האחרונים, ועוד. */
export const SOLVED: Solved[] = [...LEDGER, ...MORE];

export const expertBySlug = (slug: string): ExpertSource | undefined => EXPERTS.find((e) => e.slug === slug);

/** הבעיות הציבוריות שמומחה פתר, מהרווחית ביותר */
export const publicSolvedBy = (slug: string): Solved[] =>
    SOLVED.filter((s) => s.ex === slug && s.pub).sort((a, b) => b.amt - a.amt);

/** כמה בעיות פרטיות הוא פתר. הן לא מפורסמות בשמן. */
export const privateSolvedCount = (e: ExpertSource): number => Math.max(0, e.solved - publicSolvedBy(e.slug).length);

/** מומחי הצוות, לפי מספר הבעיות שפתרו (ובשוויון, לפי הרווח) */
export const teamExperts = (teamSlug: string): ExpertSource[] =>
    EXPERTS.filter((e) => e.c === teamSlug).sort((a, b) => b.solved - a.solved || b.earned - a.earned);
