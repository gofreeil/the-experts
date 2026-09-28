import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getOwnerAssets } from '$lib/server/ownerAssets';
import { resolveRole } from '$lib/server/adsAdmin';
import { myAdsAdminActions } from '$lib/server/myAdsActions';

// "הנכסים שלי" — הפרסומות שהמשתמש המחובר שלח (עם המדדים שלהן).
// הכניסה מחייבת התחברות; השליפה עצמה יושבת ב-ownerAssets.
export const load: PageServerLoad = async ({ locals, url }) => {
    const session = await locals.auth();
    if (!session?.user) {
        throw redirect(302, `/login?redirect=${encodeURIComponent(url.pathname)}`);
    }

    return {
        user: { name: session.user.name ?? '', email: session.user.email ?? '' },
        // קיצורי הניהול ברשימה — לכל אדמין (אותה הרשאה כמו /admin/ads)
        isAdmin: (await resolveRole(session)) !== null,
        ...(await getOwnerAssets(session.user)),
    };
};

// קיצורי הניהול מ"הנכסים שלי" (approve/reject/pause/resume/unapprove) —
// ההרשאה נבדקת בתוך כל פעולה, ב-myAdsActions
export const actions: Actions = { ...myAdsAdminActions };
