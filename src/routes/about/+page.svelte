<script lang="ts">
    // דף "אודותינו" — מה האתר, למי הוא מיועד ומה עושים בו, ואגף שאלות ותשובות.
    // השו"ת נבנה מ-$lib/aboutFaq (מקור אמת אחד) ומוזרק גם כסכמת FAQPage
    // ב-JSON-LD, כדי שמנועי חיפוש ומנועי AI יזהו את מטרת האתר.
    import { ABOUT_FAQ, SITE_NAME, SITE_URL } from "$lib/aboutFaq";
    import { faqSchema, aboutPageSchema } from "$lib/seo";
    import JsonLd from "$lib/components/JsonLd.svelte";
    import { teams } from "$lib/teamsData";

    const description =
        "המומחים של העם — כוורת של צוותי מומחים מתנדבים לפי תחום ולוח בעיות לפתרון עם תקציב. חלק מרשת האתרים של התנועה החברתית יוצאים לחירות.";

    const schemas = [
        aboutPageSchema({ name: `אודותינו | ${SITE_NAME}`, url: `${SITE_URL}/about`, description }),
        faqSchema(ABOUT_FAQ)
    ];
</script>

<svelte:head>
    <title>אודותינו | {SITE_NAME}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href="{SITE_URL}/about" />
</svelte:head>

<JsonLd schema={schemas} />

<div class="mx-auto max-w-3xl px-4 py-8 md:py-12" dir="rtl">
    <div class="rounded-3xl border border-[#3b5794] bg-[#16264d] shadow-2xl overflow-hidden">

        <!-- כותרת + פסקת פתיחה -->
        <div class="p-6 md:p-10 text-center">
            <div class="text-5xl mb-4">🐝</div>
            <h1 class="text-3xl md:text-4xl font-black bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent mb-3">
                אודותינו
            </h1>
            <p class="text-gray-300 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
                המומחים של העם הוא אתר שמרכז צוותי מומחים מתנדבים לפי תחום — "כוורת המומחים" —
                שתפקידם לסייע לתושבים ולוועדי השכונות, ולצידה לוח "בעיות לפתרון" שבו כל אחד
                יכול להעלות בעיה עם תקציב ולקבל הצעות פתרון ממומחים. האתר הוא חלק מרשת
                האתרים של התנועה החברתית "יוצאים לחירות", והשימוש בו חינם.
            </p>
        </div>

        <!-- צוותי הכוורת -->
        <div class="mx-8 md:mx-12 border-t border-[#3b5794]"></div>
        <div class="p-6 md:p-10">
            <h2 class="text-2xl font-black text-white mb-4 text-center">צוותי המומחים</h2>
            <ul class="flex flex-wrap justify-center gap-2">
                {#each teams as t (t.slug)}
                    <li class="rounded-full border px-3 py-1 text-sm font-bold text-gray-200"
                        style="border-color:{t.color}55;background:{t.color}22">
                        <span aria-hidden="true">{t.emoji}</span> {t.name}
                    </li>
                {/each}
            </ul>
            <div class="mt-6 flex flex-wrap justify-center gap-3">
                <a href="/" class="rounded-full bg-gradient-to-l from-amber-500 to-orange-600 px-5 py-2 text-sm font-black text-white shadow-lg hover:opacity-90 transition-opacity">
                    לכוורת המומחים
                </a>
                <a href="/problems" class="rounded-full border border-amber-400/50 px-5 py-2 text-sm font-bold text-amber-200 hover:bg-amber-400/10 transition-colors">
                    ללוח בעיות לפתרון
                </a>
            </div>
        </div>

        <!-- שאלות ותשובות -->
        <div class="mx-8 md:mx-12 border-t border-[#3b5794]"></div>
        <section id="faq" aria-labelledby="faq-title" class="p-6 md:p-10">
            <h2 id="faq-title" class="text-2xl font-black text-white mb-6 text-center">שאלות ותשובות</h2>
            <div class="flex flex-col gap-3">
                {#each ABOUT_FAQ as item, i (item.q)}
                    <details class="faq-item group rounded-2xl border border-[#3b5794] bg-[#0f172a]/60 open:bg-[#0f172a]" open={i < 2}>
                        <summary class="cursor-pointer list-none select-none px-5 py-4 text-base md:text-lg font-bold text-amber-200 flex items-center justify-between gap-3">
                            <span>{item.q}</span>
                            <span class="faq-chevron text-gray-400 transition-transform group-open:rotate-180" aria-hidden="true">▾</span>
                        </summary>
                        <p class="px-5 pb-5 text-sm md:text-base leading-relaxed text-gray-300">{item.a}</p>
                    </details>
                {/each}
            </div>
        </section>

        <!-- קישורים משלימים -->
        <div class="mx-8 md:mx-12 border-t border-[#3b5794]"></div>
        <div class="p-6 md:p-8 text-center text-sm text-gray-400">
            <a href="/about/advertise" class="text-amber-300 hover:text-white transition-colors font-bold">פרסם אצלנו</a>
            <span class="mx-2 text-gray-600" aria-hidden="true">|</span>
            <a href="/about/legal" class="text-amber-300 hover:text-white transition-colors font-bold">תנאי שימוש והצהרת נגישות</a>
            <span class="mx-2 text-gray-600" aria-hidden="true">|</span>
            <a href="https://gofreeil.com/" target="_blank" rel="noopener noreferrer" class="text-amber-300 hover:text-white transition-colors font-bold">יוצאים לחירות</a>
        </div>
    </div>
</div>

<style>
    /* מסתיר את משולש ברירת המחדל של <details> בדפדפנים שמתעלמים מ-list-none */
    .faq-item summary::-webkit-details-marker {
        display: none;
    }
</style>
