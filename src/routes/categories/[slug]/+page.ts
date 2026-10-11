import { error } from '@sveltejs/kit';
import { teamBySlug } from '$lib/teamsData';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
    const team = teamBySlug(params.slug);
    if (!team) error(404, 'הצוות לא נמצא');
    return { team };
};
