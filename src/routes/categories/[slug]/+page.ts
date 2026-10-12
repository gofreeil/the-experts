import { error } from '@sveltejs/kit';
import { teamSources } from '$lib/teamsData';
import { createTranslator } from '$lib/i18n/translate';
import type { PageLoad } from './$types';

// הדף מקבל רק את ה-slug; שם הצוות ותיאורו נפתרים בשפה הנוכחית ברכיב (teamBySlug)
export const load: PageLoad = async ({ params, parent }) => {
    const { locale } = await parent();
    if (!teamSources.some((t) => t.slug === params.slug)) error(404, createTranslator(locale).t('team.notFound'));
    return { slug: params.slug };
};
