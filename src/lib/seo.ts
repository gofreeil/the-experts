// ============================================================
// seo.ts - בוני סכמות JSON-LD (schema.org) למנועי חיפוש ומנועי AI
// ההזרקה לדף נעשית דרך רכיב JsonLd.svelte.
// ============================================================

export function faqSchema(items: { q: string; a: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((i) => ({
            '@type': 'Question',
            name: i.q,
            acceptedAnswer: { '@type': 'Answer', text: i.a }
        }))
    };
}

export function aboutPageSchema(opts: { name: string; url: string; description: string }) {
    return {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: opts.name,
        url: opts.url,
        description: opts.description,
        isPartOf: { '@type': 'WebSite', name: 'המומחים של העם', url: 'https://experts.gofreeil.com' },
        publisher: { '@type': 'Organization', name: 'יוצאים לחירות', url: 'https://gofreeil.com' }
    };
}
