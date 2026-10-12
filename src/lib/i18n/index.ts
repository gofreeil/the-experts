// מקור יחיד לשפות האתר. משותף לשרת ולדפדפן — בלי תלות ב-Svelte.
//
// ארכיטקטורה (בקצרה):
//  - השפה נקבעת בשרת (hooks.server.ts) מעוגיית `lang` או מ-?lang=, ונשלחת לכל הדפים דרך +layout.server.ts.
//    כך ה-SSR כבר יוצא בשפה הנכונה, וה-<html lang dir> נכון מההתחלה — בלי הבהוב ובלי localStorage.
//  - טקסטי ממשק יושבים במילונים (messages/*.ts), לפי נושא, ובכל קובץ he ו-en זה לצד זה.
//    מפתח שחסר באחד מהם נתפס בזמן קומפילציה.
//  - תוכן (נתוני הדגמה, מומחים, שאלות נפוצות) נכתב כזוגות { he, en } על הנתון עצמו, ונפתר ב-resolve().
//  - אין סטור גלובלי: ההקשר נוצר פר-בקשה ב-+layout.svelte, כך שבקשות מקבילות בשתי שפות לא מתערבבות.

export const LOCALES = ['he', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'he';
export const LOCALE_COOKIE = 'lang';
/** שנה — שפה שנבחרה נשמרת */
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export type Dir = 'rtl' | 'ltr';

export const LOCALE_META: Record<Locale, { name: string; flag: string; dir: Dir; bcp47: string; ogLocale: string }> = {
	he: { name: 'עברית', flag: 'il', dir: 'rtl', bcp47: 'he-IL', ogLocale: 'he_IL' },
	en: { name: 'English', flag: 'us', dir: 'ltr', bcp47: 'en-US', ogLocale: 'en_US' }
};

export const isLocale = (v: unknown): v is Locale => typeof v === 'string' && (LOCALES as readonly string[]).includes(v);

/** ערך חופשי (עוגייה / פרמטר) → שפה תקפה, או שפת ברירת המחדל */
export const toLocale = (v: unknown): Locale => (isLocale(v) ? v : DEFAULT_LOCALE);

export const dirOf = (locale: Locale): Dir => LOCALE_META[locale].dir;

/** תוכן דו-לשוני: כל שדה טקסט בנתון הוא זוג { he, en } */
export type L10n<T = string> = { he: T; en: T };

/** הופך את כל זוגות ה-L10n בטיפוס לערך בשפה הנבחרת */
export type Localized<T> = T extends (...args: never[]) => unknown
	? T
	: T extends { he: infer V; en: unknown }
		? [Exclude<keyof T, 'he' | 'en'>] extends [never]
			? Localized<V>
			: LocalizedMap<T>
		: T extends object
			? LocalizedMap<T>
			: T;

// מפה הומומורפית — שומרת על מערכים וטאפלים כמערכים וטאפלים
type LocalizedMap<T> = { [K in keyof T]: Localized<T[K]> };

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
	typeof v === 'object' && v !== null && Object.getPrototypeOf(v) === Object.prototype;

const isL10n = (v: Record<string, unknown>): boolean => {
	const keys = Object.keys(v);
	return keys.length === 2 && 'he' in v && 'en' in v;
};

const cache = new WeakMap<object, Partial<Record<Locale, unknown>>>();

/**
 * עובר על נתון (מערכים ואובייקטים מקוננים) ומחליף כל { he, en } בערך בשפה הנבחרת.
 * התוצאה נשמרת בזיכרון פר-נתון ופר-שפה, כך שקריאה חוזרת בתוך תבנית זולה.
 */
export function resolve<T>(data: T, locale: Locale): Localized<T> {
	if (typeof data !== 'object' || data === null) return data as Localized<T>;
	const hit = cache.get(data);
	if (hit && locale in hit) return hit[locale] as Localized<T>;

	let out: unknown;
	if (Array.isArray(data)) {
		out = data.map((x) => resolve(x, locale));
	} else if (isPlainObject(data)) {
		if (isL10n(data)) {
			out = resolve(data[locale], locale);
		} else {
			out = Object.fromEntries(Object.entries(data).map(([k, v]) => [k, resolve(v, locale)]));
		}
	} else {
		out = data;
	}
	cache.set(data, { ...hit, [locale]: out });
	return out as Localized<T>;
}

/** בוחר ערך בודד מזוג L10n */
export const pick = <T>(v: L10n<T>, locale: Locale): T => v[locale];
