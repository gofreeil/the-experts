// ============================================================
// Strapi 5 HTTP Client — the-experts (המומחים של העם)
// משותף עם אתר "קהילה בשכונה" — אותו STRAPI_URL + STRAPI_TOKEN.
// כל בקשה לבאקאנד עוברת דרך כאן.
// ============================================================

import { env } from '$env/dynamic/private';

export const STRAPI_URL = env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = env.STRAPI_TOKEN ?? '';

const RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 800;

/** שגיאה ייחודית ל-content type לא רשום (404 מ-Strapi) */
export class StrapiContentTypeError extends Error {
    constructor(path: string, status: number) {
        super(`[Strapi] Content type not registered: ${path} (${status})`);
        this.name = 'StrapiContentTypeError';
    }
}

function getHeaders(jwt?: string): HeadersInit {
    const token = jwt || STRAPI_TOKEN || undefined;
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

function isRetryable(status: number): boolean {
    return status === 503 || status === 502 || status === 504 || status === 429;
}

function isContentTypeError(status: number, text: string): boolean {
    return status === 404 && (
        text.includes('Route not found') ||
        text.includes('Not Found') ||
        text.includes('url not found')
    );
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function strapiGet<T = unknown>(
    path: string,
    params?: Record<string, string>,
    jwt?: string
): Promise<T> {
    const url = new URL(STRAPI_URL + path);
    if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

    let lastError: Error | undefined;
    for (let attempt = 1; attempt <= RETRY_ATTEMPTS; attempt++) {
        try {
            const res = await fetch(url.toString(), { headers: getHeaders(jwt) });
            if (res.ok) return res.json() as Promise<T>;

            const text = await res.text();
            if (isContentTypeError(res.status, text)) throw new StrapiContentTypeError(path, res.status);
            if (!isRetryable(res.status)) throw new Error(`[Strapi] GET ${path} → ${res.status}: ${text}`);
            lastError = new Error(`[Strapi] GET ${path} → ${res.status}: ${text}`);
        } catch (e) {
            if (e instanceof StrapiContentTypeError) throw e;
            const err = e instanceof Error ? e : new Error(String(e));
            const isHttp = err.message.startsWith('[Strapi] GET') && !err.message.includes('fetch failed');
            if (isHttp) throw err;
            lastError = err;
        }
        if (attempt < RETRY_ATTEMPTS) await delay(RETRY_DELAY_MS * attempt);
    }
    throw lastError!;
}

export async function strapiPost<T = unknown>(path: string, body: unknown, jwt?: string): Promise<T> {
    const res = await fetch(STRAPI_URL + path, {
        method:  'POST',
        headers: getHeaders(jwt),
        body:    JSON.stringify(body),
    });
    if (!res.ok) {
        const text = await res.text();
        if (isContentTypeError(res.status, text)) throw new StrapiContentTypeError(path, res.status);
        throw new Error(`[Strapi] POST ${path} → ${res.status}: ${text}`);
    }
    return res.json() as Promise<T>;
}

export async function strapiPut<T = unknown>(path: string, body: unknown, jwt?: string): Promise<T> {
    const res = await fetch(STRAPI_URL + path, {
        method:  'PUT',
        headers: getHeaders(jwt),
        body:    JSON.stringify(body),
    });
    if (!res.ok) {
        const text = await res.text();
        if (isContentTypeError(res.status, text)) throw new StrapiContentTypeError(path, res.status);
        throw new Error(`[Strapi] PUT ${path} → ${res.status}: ${text}`);
    }
    return res.json() as Promise<T>;
}

export async function strapiDelete(path: string, jwt?: string): Promise<void> {
    const res = await fetch(STRAPI_URL + path, {
        method:  'DELETE',
        headers: getHeaders(jwt),
    });
    if (!res.ok) {
        const text = await res.text();
        if (isContentTypeError(res.status, text)) throw new StrapiContentTypeError(path, res.status);
        throw new Error(`[Strapi] DELETE ${path} → ${res.status}: ${text}`);
    }
}

// ============================================================
// ---- Users-Permissions (רשימת המשתמשים המאוחדת של קהילה בשכונה) ----
// הרשמה כאן יוצרת משתמש באותו Strapi המשותף → נוסף לרשימת הרשומים של הקהילה.
// ============================================================

export interface StrapiAuthUser { id: number; username: string; email: string; }
export interface StrapiAuthResponse { jwt?: string; user: StrapiAuthUser; }

/** הרשמה עם שם משתמש, אימייל + סיסמה (users-permissions). כשאישור-מייל פעיל,
 *  Strapi יוצר משתמש לא-מאומת ושולח מייל אישור (לא מחזיר JWT). */
export async function strapiRegister(username: string, email: string, password: string): Promise<StrapiAuthResponse> {
    const res = await fetch(STRAPI_URL + '/api/auth/local/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ username, email, password }),
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`[Strapi] REGISTER → ${res.status}: ${text}`);
    }
    return res.json() as Promise<StrapiAuthResponse>;
}

/** פרטי המשתמש המחובר כפי שמוחזרים מ-/api/users/me */
export interface StrapiMe {
    id: number;
    username: string;
    email: string;
    name?: string | null;
    phone?: string | null;
    city?: string | null;
    /** תפקיד ניהולי ברשת (super_admin / exp_admin / ...) — לשערת האדמין */
    app_role?: string | null;
}

/** מאמת JWT של users-permissions ומחזיר את פרטי המשתמש; null אם פג/לא-תקף.
 *  משמש לזיהוי-מאוחד: קריאת עוגיית gofreeil-auth המשותפת ל-.gofreeil.com. */
export async function getStrapiMe(jwt: string): Promise<StrapiMe | null> {
    try {
        const res = await fetch(STRAPI_URL + '/api/users/me', {
            headers: { Authorization: `Bearer ${jwt}` },
        });
        if (!res.ok) return null;
        return (await res.json()) as StrapiMe;
    } catch {
        return null;
    }
}

/** GET /api/users (users-permissions) — מחזיר מערך ישיר. משתמש ב-STRAPI_TOKEN. */
export async function findStrapiUpUsers(params: Record<string, string>): Promise<Array<Record<string, unknown>>> {
    const url = new URL(STRAPI_URL + '/api/users');
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    const res = await fetch(url.toString(), { headers: getHeaders() });
    if (!res.ok) {
        if (res.status === 401 || res.status === 403) return [];
        return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? data : (data.data ?? []);
}

/** PUT /api/users/:id (users-permissions) — משתמש ב-STRAPI_TOKEN. */
export async function updateStrapiUpUser(id: number, data: Record<string, unknown>): Promise<void> {
    const res = await fetch(STRAPI_URL + `/api/users/${id}`, {
        method:  'PUT',
        headers: getHeaders(),
        body:    JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`[Strapi] PUT /api/users/${id} → ${res.status}`);
}
