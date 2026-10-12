// הקשר התרגום לרכיבי Svelte.
//
// ב-+layout.svelte:   setI18n(() => data.locale)
// בכל רכיב:           const i18n = useI18n();   ...   {i18n.t('home.title')}
//
// לא עושים destructuring של locale/dir — הם getters ורק הקריאה בתוך התבנית נרשמת כתלות.
// t / tn / l / num / date בטוחים ל-destructuring, כי הם קוראים את השפה בכל הפעלה.
import { getContext, setContext } from 'svelte';
import { DEFAULT_LOCALE, LOCALE_META, dirOf, resolve, type Dir, type Locale, type Localized } from './index';
import { createTranslator, type MessageKey, type Params } from './translate';

export interface I18n {
	readonly locale: Locale;
	readonly dir: Dir;
	readonly rtl: boolean;
	readonly bcp47: string;
	/** חץ "קדימה" לקישורים ("לדף המלא ←" בעברית, "Full page →" באנגלית) */
	readonly fwd: '←' | '→';
	/** חץ "אחורה" ("→ חזרה" בעברית, "← Back" באנגלית) */
	readonly back: '←' | '→';
	/** טקסט ממשק לפי מפתח */
	t(key: MessageKey, params?: Params): string;
	/** טקסט עם ריבוי (one/two/other); {n} מוזרק אוטומטית */
	tn(key: MessageKey, count: number, params?: Params): string;
	/** תוכן דו-לשוני: מחליף כל { he, en } בערך בשפה הנוכחית (גם בתוך מערכים ואובייקטים) */
	l<T>(data: T): Localized<T>;
	/** מספר בפורמט השפה */
	num(n: number, options?: Intl.NumberFormatOptions): string;
	/** תאריך בפורמט השפה (אזור זמן ישראל כברירת מחדל) */
	date(value: Date | string | number, options?: Intl.DateTimeFormatOptions): string;
}

const KEY = Symbol('i18n');

function create(getLocale: () => Locale): I18n {
	return {
		get locale() {
			return getLocale();
		},
		get dir() {
			return dirOf(getLocale());
		},
		get rtl() {
			return dirOf(getLocale()) === 'rtl';
		},
		get bcp47() {
			return LOCALE_META[getLocale()].bcp47;
		},
		get fwd() {
			return dirOf(getLocale()) === 'rtl' ? '←' : '→';
		},
		get back() {
			return dirOf(getLocale()) === 'rtl' ? '→' : '←';
		},
		t: (key, params) => createTranslator(getLocale()).t(key, params),
		tn: (key, count, params) => createTranslator(getLocale()).tn(key, count, params),
		l: (data) => resolve(data, getLocale()),
		num: (n, options) => n.toLocaleString(LOCALE_META[getLocale()].bcp47, options),
		date: (value, options) =>
			new Date(value).toLocaleDateString(LOCALE_META[getLocale()].bcp47, { timeZone: 'Asia/Jerusalem', ...options })
	};
}

export function setI18n(getLocale: () => Locale): I18n {
	const i18n = create(getLocale);
	setContext(KEY, i18n);
	return i18n;
}

const fallback = create(() => DEFAULT_LOCALE);

export function useI18n(): I18n {
	return getContext<I18n | undefined>(KEY) ?? fallback;
}
