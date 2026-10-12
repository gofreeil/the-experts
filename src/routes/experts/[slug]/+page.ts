import { error } from '@sveltejs/kit';
import { expertBySlug } from '$lib/expertsData';
import { createTranslator } from '$lib/i18n/translate';
import type { PageLoad } from './$types';

// הדף מקבל רק את ה-slug; הרזומה נפתר בשפה הנוכחית ברכיב
export const load: PageLoad = async ({ params, parent }) => {
    const { locale } = await parent();
    if (!expertBySlug(params.slug)) error(404, createTranslator(locale).t('expert.notFound'));
    return { slug: params.slug };
};
