// תרגום טהור (בלי Svelte): עובד באותו אופן בשרת (הודעות שגיאה של טפסים) ובדפדפן.
import { DEFAULT_LOCALE, LOCALE_META, type Locale } from './index';
import { he, en } from './messages';
import type * as builder from './messages/builder';

/** כל המפתחות, כולל מילונים שנטענים רק בחלק מהדפים (registerMessages) */
export type MessageKey = keyof typeof he | keyof typeof builder.he;
export type Params = Record<string, string | number>;

/** הודעה עם ריבוי: one / two / other. other חובה, והיא גם ברירת המחדל לצורות שחסרות */
export interface Plural {
	zero?: string;
	one?: string;
	two?: string;
	few?: string;
	many?: string;
	other: string;
}
export type Message = string | Plural;

const dictionaries: Record<Locale, Record<string, Message>> = { he: { ...he }, en: { ...en } };

/**
 * מוסיף מילון של אזור שנחוץ רק בחלק מהדפים (למשל הבילדר), כדי לא להעמיס אותו על כל האתר.
 * נקרא ב-<script module> של הדף, כך שהמילון זמין עוד לפני הרינדור (גם ב-SSR). בטוח לקריאה חוזרת.
 */
export function registerMessages(extra: { he: Record<string, Message>; en: Record<string, Message> }): void {
	Object.assign(dictionaries.he, extra.he);
	Object.assign(dictionaries.en, extra.en);
}

/** מחליף {name} בערך מ-params. פרמטר שלא נמסר נשאר כמו שהוא, כדי שהחור יהיה גלוי */
export function format(template: string, params?: Params, locale: Locale = DEFAULT_LOCALE): string {
	if (!params) return template;
	return template.replace(/\{(\w+)\}/g, (whole, name: string) => {
		if (!(name in params)) return whole;
		const v = params[name];
		return typeof v === 'number' ? v.toLocaleString(LOCALE_META[locale].bcp47) : v;
	});
}

const pluralRules: Partial<Record<Locale, Intl.PluralRules>> = {};
const rulesFor = (locale: Locale) => (pluralRules[locale] ??= new Intl.PluralRules(LOCALE_META[locale].bcp47));

function lookup(locale: Locale, key: string): Message {
	return dictionaries[locale][key] ?? dictionaries[DEFAULT_LOCALE][key] ?? key;
}

export function translate(locale: Locale, key: MessageKey, params?: Params): string {
	const msg = lookup(locale, key);
	return format(typeof msg === 'string' ? msg : msg.other, params, locale);
}

/** בוחר צורת ריבוי לפי count. {n} מוזרק אוטומטית */
export function translatePlural(locale: Locale, key: MessageKey, count: number, params?: Params): string {
	const msg = lookup(locale, key);
	if (typeof msg === 'string') return format(msg, { n: count, ...params }, locale);
	const category = rulesFor(locale).select(count) as keyof Plural;
	const template = msg[category] ?? msg.other;
	return format(template, { n: count, ...params }, locale);
}

export interface Translator {
	t(key: MessageKey, params?: Params): string;
	tn(key: MessageKey, count: number, params?: Params): string;
}

const translators: Partial<Record<Locale, Translator>> = {};

export function createTranslator(locale: Locale): Translator {
	return (translators[locale] ??= {
		t: (key, params) => translate(locale, key, params),
		tn: (key, count, params) => translatePlural(locale, key, count, params)
	});
}
