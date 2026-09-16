import type { PageServerLoad } from './$types';
import { oauthEnabled } from '../../../auth';

export const load: PageServerLoad = async ({ url }) => {
	const raw = url.searchParams.get('returnTo') ?? '/';
	const returnTo = raw.startsWith('/') && !raw.startsWith('//') ? raw : '/';
	// oauth: אילו ספקים פעילים - למסך "עדיין אין חשבון" שמציע הרשמה בלחיצה
	return { returnTo, error: url.searchParams.get('error'), oauth: oauthEnabled };
};
