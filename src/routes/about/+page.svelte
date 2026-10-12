<script lang="ts">
    // דף "אודותינו" — מה האתר, למי הוא מיועד ומה עושים בו, ואגף שאלות ותשובות.
    // השו"ת נבנה מ-$lib/aboutFaq (מקור אמת אחד) ומוזרק גם כסכמת FAQPage
    // ב-JSON-LD, כדי שמנועי חיפוש ומנועי AI יזהו את מטרת האתר.
    import { ABOUT_FAQ, SITE_NAME, SITE_URL } from "$lib/aboutFaq";
    import { faqSchema, aboutPageSchema } from "$lib/seo";
    import JsonLd from "$lib/components/JsonLd.svelte";
    import { teamsFor } from "$lib/teamsData";
    import { useI18n } from "$lib/i18n/context";

    const i18n = useI18n();
    const teams = $derived(teamsFor(i18n.locale));
    const siteName = $derived(i18n.l(SITE_NAME));
    const faq = $derived(i18n.l(ABOUT_FAQ));

    const description = $derived(i18n.t("about.metaDesc"));

    const schemas = $derived([
        aboutPageSchema({
            name: `${i18n.t("about.title")} | ${siteName}`,
            url: `${SITE_URL}/about`,
            description,
            siteName,
            orgName: i18n.t("footer.movement"),
            locale: i18n.locale
        }),
        faqSchema(faq, i18n.locale)
    ]);
</script>

<svelte:head>
    <title>{i18n.t("about.title")} | {siteName}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href="{SITE_URL}/about" />
</svelte:head>

<JsonLd schema={schemas} />

<div class="mx-auto max-w-3xl px-4 py-4 md:py-12">
    <div class="rounded-3xl border border-[#3b5794] bg-[#16264d] shadow-2xl overflow-hidden">

        <!-- כותרת + פסקת פתיחה -->
        <div class="p-4 md:p-10 text-center">
            <div class="text-4xl mb-2 md:text-5xl md:mb-4">🐝</div>
            <h1 class="text-3xl md:text-4xl font-black bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent mb-3">
                {i18n.t("about.title")}
            </h1>
            <p class="text-gray-300 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
                {i18n.t("about.intro")}
            </p>
        </div>

        <!-- צוותי הכוורת -->
        <div class="mx-4 md:mx-12 border-t border-[#3b5794]"></div>
        <div class="p-4 md:p-10">
            <h2 class="text-2xl font-black text-white mb-3 md:mb-4 text-center">{i18n.t("about.teams")}</h2>
            <ul class="flex flex-wrap justify-center gap-2">
                {#each teams as t (t.slug)}
                    <li class="rounded-full border px-3 py-1 text-sm font-bold text-gray-200"
                        style="border-color:{t.color}55;background:{t.color}22">
                        <span aria-hidden="true">{t.emoji}</span> {t.name}
                    </li>
                {/each}
            </ul>
            <div class="mt-4 md:mt-6 flex flex-wrap justify-center gap-2 md:gap-3">
                <a href="/" class="rounded-full bg-gradient-to-l from-amber-500 to-orange-600 px-5 py-2 text-sm font-black text-white shadow-lg hover:opacity-90 transition-opacity">
                    {i18n.t("about.toHive")}
                </a>
                <a href="/problems" class="rounded-full border border-amber-400/50 px-5 py-2 text-sm font-bold text-amber-200 hover:bg-amber-400/10 transition-colors">
                    {i18n.t("about.toBoard")}
                </a>
            </div>
        </div>

        <!-- שאלות ותשובות -->
        <div class="mx-4 md:mx-12 border-t border-[#3b5794]"></div>
        <section id="faq" aria-labelledby="faq-title" class="p-4 md:p-10">
            <h2 id="faq-title" class="text-2xl font-black text-white mb-3 md:mb-6 text-center">{i18n.t("about.faq")}</h2>
            <div class="flex flex-col gap-2 md:gap-3">
                {#each faq as item, i (item.q)}
                    <details class="faq-item group rounded-2xl border border-[#3b5794] bg-[#0f172a]/60 open:bg-[#0f172a]" open={i < 2}>
                        <summary class="cursor-pointer list-none select-none px-4 py-3 md:px-5 md:py-4 text-base md:text-lg font-bold text-amber-200 flex items-center justify-between gap-3">
                            <span>{item.q}</span>
                            <span class="faq-chevron text-gray-400 transition-transform group-open:rotate-180" aria-hidden="true">▾</span>
                        </summary>
                        <p class="px-4 pb-4 md:px-5 md:pb-5 text-sm md:text-base leading-relaxed text-gray-300">{item.a}</p>
                    </details>
                {/each}
            </div>
        </section>

        <!-- קישורים משלימים -->
        <div class="mx-4 md:mx-12 border-t border-[#3b5794]"></div>
        <div class="p-4 md:p-8 text-center text-sm text-gray-400">
            <a href="/about/advertise" class="text-amber-300 hover:text-white transition-colors font-bold">{i18n.t("footer.advertise")}</a>
            <span class="mx-2 text-gray-600" aria-hidden="true">|</span>
            <a href="/about/legal" class="text-amber-300 hover:text-white transition-colors font-bold">{i18n.t("about.legal")}</a>
            <span class="mx-2 text-gray-600" aria-hidden="true">|</span>
            <a href="https://gofreeil.com/" target="_blank" rel="noopener noreferrer" class="text-amber-300 hover:text-white transition-colors font-bold">{i18n.t("footer.movement")}</a>
        </div>
    </div>
</div>

<style>
    /* מסתיר את משולש ברירת המחדל של <details> בדפדפנים שמתעלמים מ-list-none */
    .faq-item summary::-webkit-details-marker {
        display: none;
    }
</style>
