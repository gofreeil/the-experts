// ============================================================
// seo.ts - בוני סכמות JSON-LD (schema.org) למנועי חיפוש ומנועי AI
// ההזרקה לדף נעשית דרך רכיב JsonLd.svelte.
// ============================================================

import type { Locale } from './i18n';

export function faqSchema(items: { q: string; a: string }[], locale: Locale = 'he') {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        inLanguage: locale,
        mainEntity: items.map((i) => ({
            '@type': 'Question',
            name: i.q,
            acceptedAnswer: { '@type': 'Answer', text: i.a }
        }))
    };
}

export function aboutPageSchema(opts: { name: string; url: string; description: string; siteName: string; orgName: string; locale?: Locale }) {
    return {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: opts.name,
        url: opts.url,
        description: opts.description,
        inLanguage: opts.locale ?? 'he',
        isPartOf: { '@type': 'WebSite', name: opts.siteName, url: 'https://experts.gofreeil.com' },
        publisher: { '@type': 'Organization', name: opts.orgName, url: 'https://gofreeil.com' }
    };
}
