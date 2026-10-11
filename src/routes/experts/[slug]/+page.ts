import { error } from '@sveltejs/kit';
import { expertBySlug } from '$lib/expertsData';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
    const expert = expertBySlug(params.slug);
    if (!expert) error(404, 'המומחה לא נמצא');
    return { expert };
};
