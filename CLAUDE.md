# CLAUDE.md - הנחיות לפרויקט קהילה בשכונה

## סקירת הפרויקט

פלטפורמת קהילה שכונתית ישראלית המחברת תושבים לשירותים מקומיים, יתרונות שכונתיים ויוזמות קהילתיות. מתמקד בירושלים (קרית משה) עם תמיכה בעיר נוספות.

## טכנולוגיות ואיך להריץ

- **Framework**: SvelteKit 2.x + Svelte 5
- **Styling**: Tailwind CSS 4.x
- **שפות**: TypeScript
- **i18n**: מערכת תרגום פנימית ב-`src/lib/i18n/` (עברית ואנגלית)

```bash
npm run dev       # שרת פיתוח
npm run build     # בניית ייצור
npm run check     # בדיקת TypeScript + Svelte
npm run preview   # תצוגה מקדימה של build
```

## מבנה הפרויקט

```
src/
├── lib/
│   ├── components/         # רכיבי UI לשימוש חוזר
│   │   ├── Header.svelte         # כותרת עליונה עם בחירת שפה
│   │   ├── Footer.svelte         # כותרת תחתונה
│   │   ├── AdsSidebar.svelte     # סרגל פרסומות צד ימין (דסקטופ)
│   │   ├── MobileAdsBanner.svelte # פרסומות נייד
│   │   ├── MobileTextAds.svelte  # פרסומות טקסט נייד
│   │   ├── JerusalemMap.svelte   # מפת שכונות אינטראקטיבית
│   │   ├── LostAndFound.svelte   # מקטע אבידות ומצבי חירום
│   │   ├── NewsTicker.svelte     # טיקר חדשות
│   │   ├── FacebookComments.svelte # תגובות פייסבוק
│   │   ├── FullAdModal.svelte    # מודל פרסומת מלאה
│   │   └── ReferendumBanner.svelte # באנר קמפיין
│   ├── adsData.ts            # נתוני פרסומות וטיפוסים
│   ├── itemsData.ts          # נתוני פריטים/יתרונות קהילתיים
│   ├── i18n/                 # תרגום: שפות, מילונים (messages/), הקשר לרכיבים
│   └── index.ts              # ייצוא רכיבים
└── routes/
    ├── +layout.svelte        # Layout ראשי (3 עמודות: פרסומות|תוכן|פרסומות)
    ├── +page.svelte          # דף הבית
    ├── community-fund/
    │   └── +page.svelte      # כותל המשאלות
    └── items/[id]/
        └── +page.svelte      # דף פרט פריט דינמי
```

## עיצוב ו-RTL

- **כיווניות**: RTL (ימין לשמאל) לעברית
- **גופן**: "Heebo" — גופן משתנה (100–900) המתארח אצלנו ב-`static/fonts/`, לא נמשך מגוגל
- **ערכת צבעים**: ערכה כהה - `#070b14`, `#0f172a` עם גרדיאנטים כחול-סגול-ורוד
- **Breakpoints**:
  - נייד: < 768px
  - דסקטופ: > 1024px

**חשוב**: האתר עובד בשני כיוונים. ה-`dir` נקבע ב-`<html>` לפי השפה (rtl לעברית, ltr לאנגלית) — לא לכתוב `dir="rtl"` על אלמנטים.
להעדיף מאפיינים לוגיים: `text-start`/`text-end`, `ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `inset-inline-*`, `margin-inline-*`.
חצים ואיורים עם כיוון: `i18n.fwd` / `i18n.back`, או היפוך ב-CSS תחת `:global(html[dir='ltr'])`.

## i18n - רב-לשוניות

תיקייה: `src/lib/i18n/`

- שפת ברירת מחדל: **עברית (he)**; נתמכת גם **אנגלית (en)**
- השפה נקבעת בשרת (`hooks.server.ts`) מעוגיית `lang` או מ-`?lang=en`, ומגיעה לכל הדפים דרך `+layout.server.ts` — כך ה-SSR כבר בשפה הנכונה
- טקסטי ממשק: במילונים `src/lib/i18n/messages/*.ts` (לפי נושא; בכל קובץ `he` ו-`en` זה לצד זה, ומפתח שחסר באחת השפות נכשל בקומפילציה)
- תוכן (נתוני הדגמה, מומחים, צוותים, שאלות נפוצות): זוגות `{ he, en }` על הנתון עצמו, ומתורגמים בתצוגה עם `i18n.l(...)`
- בעיות שגולשים כתבו נשארות בשפה שבה נכתבו; בעיות ההדגמה מתורגמות לפי הטקסט העברי שלהן (`demoProblems.ts`)
- הודעות שגיאה בשרת: `createTranslator(locals.locale).t('key')`
- כל טקסט חדש חייב להיות מתורגם לשתי השפות

```typescript
// דוגמת שימוש ברכיב
import { useI18n } from '$lib/i18n/context';
const i18n = useI18n();

{i18n.t('home.title')}                  // טקסט לפי מפתח
{i18n.tn('home.openProblems', count)}   // ריבוי (one/two/other), {n} מוזרק אוטומטית
{i18n.l(item.title)}                    // תוכן דו-לשוני { he, en }
```

## קטגוריות הפלטפורמה

היתרונות השכונתיים מחולקים לקטגוריות:
- **גמח** - שירותי השאלה חינם
- **מסירה** - פריטים למסירה חינם
- **בייבי סיטר** - שמרטפים
- **יהדות** - מניינים, שיעורים, שבת
- **חוגים** - חוגים ותחביבים
- **אירוח לשבת** - הכנסת אורחים
- **צימרים** - השכרת נופש
- **חנויות ומסעדות** - עסקים מקומיים
- **טרמפים** - נסיעות משותפות
- **עבודות, שידוכים, אירועים**

## נתוני הפרסומות (`adsData.ts`)

הפרסומות מוגדרות כ-array של אובייקטים עם:
```typescript
interface Ad {
  id: number;
  title: string;
  description: string;
  color: string;        // צבע גרדיאנט
  icon: string;         // אמוג'י
  fullDescription: string;
  contact?: string;
}
```

## נתוני הפריטים (`itemsData.ts`)

```typescript
interface Item {
  id: string;
  label: string;
  icon: string;
  description: string;
  address?: string;
  phone?: string;
}
```

## סגנון עבודה

- **אין לשאול שאלות מיותרות** - לבצע ישירות לפי ההוראה
- **אין לבקש אישור** לפני כל שינוי - לממש ולדחוף
- לשאול רק אם ההוראה לא ברורה לחלוטין

## כללי עבודה חשובים

1. **שפה**: הפרויקט בעברית - שמות משתנים וקומנטים יכולים להיות באנגלית, אך תוכן UI תמיד דרך i18n
2. **Svelte 5**: להשתמש בסינטקס החדש - `$state()`, `$derived()`, `$effect()` במקום `writable`/`readable`
3. **Tailwind 4**: להשתמש בסינטקס החדש של Tailwind 4 (לא להשתמש ב-`@apply` כשאפשר)
4. **ריספונסיבי**: כל שינוי חייב לתמוך בנייד ודסקטופ
5. **ביצועים**: לשמור על אנימציות קלילות - `pulse-slow` מוגדר ב-tailwind.config.js (11 שניות)

## פקודות שימושיות

```bash
# בדיקת שגיאות TypeScript
npm run check

# בניה + בדיקה לפני commit
npm run build && npm run check
```

## הנחיות לסיום משימה

בסיום כל משימה יש לבצע בסדר הבא:
1. **צליל** - הרץ `echo -e "\a"` בבאש כדי להשמיע צליל התראה
2. **commit ו-push** - בצע `git add` + `git commit` + `git push` אוטומטית ללא שאלה
3. **סיכום** - סכם בטבלה או ברשימה ברורה מה נבנה/שונה
