import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// אין (עדיין) אזור ניהול מלא באתר הזה — מסך הניהול היחיד הוא הפרסומות.
export const load: PageServerLoad = async () => {
    throw redirect(302, '/admin/ads');
};
