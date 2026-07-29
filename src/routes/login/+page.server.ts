import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { oauthEnabled } from '../../auth';

export const load: PageServerLoad = async ({ locals, url }) => {
	const session = await locals.auth();
	const redirectTo = url.searchParams.get('redirect') ?? '/';
	if (session?.user) throw redirect(302, redirectTo);
	// כפתור Google/Facebook מוצג רק אם הספק באמת מוגדר (מפתחות ב-env)
	return { redirectTo, error: url.searchParams.get('error') ?? null, oauth: oauthEnabled };
};
