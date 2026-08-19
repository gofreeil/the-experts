import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getOwnerAssets } from '$lib/server/ownerAssets';

// "הנכסים שלי" — הפרסומות שהמשתמש המחובר שלח (עם המדדים שלהן).
// הכניסה מחייבת התחברות; השליפה עצמה יושבת ב-ownerAssets.
export const load: PageServerLoad = async ({ locals, url }) => {
    const session = await locals.auth();
    if (!session?.user) {
        throw redirect(302, `/login?redirect=${encodeURIComponent(url.pathname)}`);
    }

    return {
        user: { name: session.user.name ?? '', email: session.user.email ?? '' },
        ...(await getOwnerAssets(session.user)),
    };
};
