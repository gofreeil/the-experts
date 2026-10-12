import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { isOwnerCode } from '$lib/server/adsCode';
import { createTranslator } from '$lib/i18n/translate';

// אימות קוד הבעלים בצד השרת — הקוד עצמו לא קיים בקוד הלקוח.
export const POST: RequestHandler = async ({ request, locals }) => {
    let payload: any;
    try {
        payload = await request.json();
    } catch {
        throw error(400, createTranslator(locals.locale).t('api.badJson'));
    }
    return json({ ok: isOwnerCode(payload?.code) });
};
