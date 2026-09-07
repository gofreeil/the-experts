import type { RequestHandler } from './$types';
import { listApproved } from '$lib/server/adsStore';

/** הדומיין הקנוני של האתר (ב-seo.ts אין SITE_URL - הקבוע חי כאן) */
const SITE_URL = 'https://experts.gofreeil.com';

// דפים ציבוריים קבועים - בלי ניהול, API, התחברות, פרופיל או נתיבי redirect
// (לוח הבעיות /problems/[id] נטען בצד הלקוח מה-store ולכן דפי הפרט לא נכללים כאן)
const STATIC_PAGES: Array<{ path: string; priority: number; changefreq: string }> = [
    { path: '/',                      priority: 1.0, changefreq: 'daily' },
    { path: '/problems',              priority: 0.9, changefreq: 'daily' },   // לוח בעיות לפתרון
    { path: '/problems/new',          priority: 0.4, changefreq: 'monthly' }, // העלאת בעיה חדשה
    { path: '/about',                 priority: 0.5, changefreq: 'monthly' },
    { path: '/about/advertise',       priority: 0.5, changefreq: 'monthly' },
    { path: '/about/advertise/terms', priority: 0.3, changefreq: 'yearly' },
];

function xmlEscape(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function urlEntry(path: string, opts: { lastmod?: string; priority?: number; changefreq?: string } = {}): string {
    const loc = xmlEscape(SITE_URL + path);
    const parts = [`    <loc>${loc}</loc>`];
    if (opts.lastmod) parts.push(`    <lastmod>${opts.lastmod.slice(0, 10)}</lastmod>`);
    if (opts.changefreq) parts.push(`    <changefreq>${opts.changefreq}</changefreq>`);
    if (opts.priority !== undefined) parts.push(`    <priority>${opts.priority.toFixed(1)}</priority>`);
    return `  <url>\n${parts.join('\n')}\n  </url>`;
}

export const GET: RequestHandler = async ({ setHeaders }) => {
    const urls: string[] = STATIC_PAGES.map((p) => urlEntry(p.path, { priority: p.priority, changefreq: p.changefreq }));

    // דפי נחיתה של פרסומות מאושרות ופעילות (/ads/[id]) - אם Strapi נופל, ממשיכים בלעדיהן
    try {
        const ads = await listApproved();
        for (const ad of ads) {
            if (ad.id) urls.push(urlEntry(`/ads/${ad.id}`, { priority: 0.5, changefreq: 'weekly' }));
        }
    } catch { /* מחזירים לפחות את הדפים הקבועים */ }

    const body =
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        urls.join('\n') +
        `\n</urlset>\n`;

    setHeaders({
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    });
    return new Response(body);
};
