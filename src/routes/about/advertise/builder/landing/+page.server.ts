import type { PageServerLoad } from './$types';
import { resolveRole } from '$lib/server/adsAdmin';

// אותה שערת גישה כמו בבילדר הראשי — אדמין נכנס בלי דף התשלום.
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
