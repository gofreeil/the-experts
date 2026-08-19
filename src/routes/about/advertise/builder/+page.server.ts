import type { PageServerLoad } from './$types';
import { resolveRole } from '$lib/server/adsAdmin';

// הבילדר פתוח לכולם (התשלום מגיע רק בשלב השליחה); אדמין של האתר
// (exp_admin/סופר-אדמין — בדיקת שרת) מזוהה כדי לדלג על שער התשלום.
export const load: PageServerLoad = async ({ locals }) => {
    const session = await locals.auth();
    const role = await resolveRole(session);
    return {
        isAdmin: role !== null,
        layoutUser: session?.user
            ? { email: session.user.email ?? null, name: session.user.name ?? null }
            : null,
    };
};
