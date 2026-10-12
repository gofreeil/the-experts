import { redirect, fail } from '@sveltejs/kit';
import { strapiRegister } from '$lib/server/strapiAuth';
import type { PageServerLoad, Actions } from './$types';
import { oauthEnabled } from '../../auth';
import { createTranslator } from '$lib/i18n/translate';

export const load: PageServerLoad = async ({ locals, url }) => {
	const session = await locals.auth();
	const redirectTo = url.searchParams.get('redirect') ?? '/';
	if (session?.user) throw redirect(302, redirectTo);
	// כפתור Google/Facebook מוצג רק אם הספק באמת מוגדר (מפתחות ב-env)
	return { redirectTo, oauth: oauthEnabled };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const { t } = createTranslator(locals.locale);
		const form = await request.formData();
		const name = (form.get('name') as string)?.trim();
		const email = (form.get('email') as string)?.trim().toLowerCase();
		const password = form.get('password') as string;

		if (!email || !password) return fail(400, { error: t('register.needEmailPw') });
		if (password.length < 6) return fail(400, { error: t('register.pwShort') });

		const username = name || email.split('@')[0];
		try {
			await strapiRegister(username, email, password);
		} catch (err) {
			const msg = String((err as Error)?.message || '');
			if (msg.includes('taken') || msg.includes('already') || msg.includes('400'))
				return fail(400, { error: t('register.exists') });
			return fail(500, { error: t('register.failed') });
		}
		// הצלחה — הלקוח יבצע signIn('credentials') עם אותם פרטים
		return { success: true };
	}
};
