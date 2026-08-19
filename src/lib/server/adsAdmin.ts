// ============================================================
// adsAdmin.ts — שערת הניהול של סטודיו הפרסומות (בדגם של referendum)
//
// תפקיד פר-אתר מעל רשימת המשתמשים המשותפת ב-Strapi: super_admin הוא
// גלובלי לכל הרשת, ו-exp_admin הוא התפקיד המקומי של המומחים של העם
// (כמו ref_admin במשאלים ו-idx_admin באינדקס). כל פעולת ניהול —
// אישור/דחייה/השהיה/קציבה/סידור — חייבת לעבור כאן, בצד השרת.
//
// זיהוי התפקיד: בעל האתר תמיד סופר-אדמין; אחרת נקרא app_role —
// קודם עם ה-JWT האישי שבסשן (/users/me), ואם אין JWT בסשן נופלים
// לחיפוש המשתמש לפי אימייל עם טוקן השרת ברשימה המשותפת.
// ============================================================

import { error, redirect } from '@sveltejs/kit';
import type { Session } from '@auth/sveltekit';
import { getStrapiMe, findStrapiUpUsers } from './strapiClient';

export const OWNER_EMAIL = 'yahavanter@gmail.com';

export const ADMIN_ROLES = ['super_admin', 'exp_admin'] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

export interface AdminContext {
    user: { id: string; name: string; email: string };
    role: AdminRole;
    superAdmin: boolean;
}

function asAdminRole(v: unknown): AdminRole | null {
    return v === 'super_admin' || v === 'exp_admin' ? v : null;
}

/**
 * התפקיד של המשתמש המחובר: בעל האתר תמיד סופר-אדמין (גם בלי טוקן וגם אם
 * Strapi לא זמין); אחרת לפי app_role על הרשומה המשותפת — דרך ה-JWT שבסשן,
 * ובנפילה-אחורה בחיפוש לפי אימייל עם טוקן השרת.
 */
export async function resolveRole(session: Session | null): Promise<AdminRole | null> {
    const u = session?.user;
    if (!u) return null;
    const email = (u.email ?? '').trim().toLowerCase();
    if (email === OWNER_EMAIL) return 'super_admin';

    if (u.strapiJwt) {
        const me = await getStrapiMe(u.strapiJwt);
        const role = asAdminRole(me?.app_role);
        if (role) return role;
        if (me) return null; // הרשומה נקראה ואין תפקיד — אין מה להמשיך לחפש
    }

    // סשן בלי JWT (למשל ספק OAuth שלא הצליח להירשם ב-Strapi) — חיפוש לפי
    // אימייל עם טוקן השרת ברשימה המשותפת.
    if (!email) return null;
    try {
        const users = await findStrapiUpUsers({ 'filters[email][$eq]': email });
        return asAdminRole((users?.[0] as { app_role?: unknown } | undefined)?.app_role);
    } catch {
        return null;
    }
}

/** שולף את הסשן ומוודא הרשאת ניהול. לשימוש ב-load ובכל action של /admin. */
export async function getAdminContext(locals: App.Locals): Promise<AdminContext> {
    const session = await locals.auth();
    if (!session?.user) throw redirect(302, '/login?redirect=/admin/ads');
    const role = await resolveRole(session);
    if (!role) throw error(403, 'אין לך הרשאת גישה לניהול הפרסומות');
    return {
        user: {
            id: session.user.id ?? '',
            name: session.user.name ?? '',
            email: session.user.email ?? '',
        },
        role,
        superAdmin: role === 'super_admin',
    };
}
