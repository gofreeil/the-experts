<script lang="ts">
    // דף "פרסם אצלנו" — היעד של הקישור בפוטר ובבאנרי הפרסום הפנויים.
    // מכאן יוצאים לבילדר: מעצבים את הפרסומת ישירות באתר, משלמים,
    // והמודעה עולה מיד אחרי אישור מנהל (/admin/ads).
    import { adPlans, planTitle } from "$lib/adPlans";
    import { setAdIntent } from "$lib/adIntent";
    import { useI18n } from "$lib/i18n/context";

    const i18n = useI18n();

    const builderUrl = "/about/advertise/builder";
    const email = "freedomhasbegun@gmail.com";
    const waNumber = "972508750632";
    const waHref = (title: string, price: number) =>
        `https://wa.me/${waNumber}?text=` +
        encodeURIComponent(i18n.t("advertise.waText", { plan: title, price }));

    const mailto = $derived(
        `mailto:${email}` +
        `?subject=${encodeURIComponent(i18n.t("advertise.mailSubject"))}` +
        `&body=${encodeURIComponent(i18n.t("advertise.mailBody"))}`
    );

    // פרסומת אחת בלבד באתר — אותה מודעה מוצגת בשני המסכים:
    // בדסקטופ בטור הימני, ובנייד למשך 5 שניות אחרי לחיצה על פריט.
    const placements = $derived([
        {
            icon: "🖥️",
            title: i18n.t("advertise.desktopTitle"),
            where: i18n.t("advertise.desktopWhere"),
            points: [i18n.t("advertise.desktopP1"), i18n.t("advertise.desktopP2"), i18n.t("advertise.desktopP3")],
        },
        {
            icon: "📱",
            title: i18n.t("advertise.mobileTitle"),
            where: i18n.t("advertise.mobileWhere"),
            points: [i18n.t("advertise.mobileP1"), i18n.t("advertise.mobileP2"), i18n.t("advertise.mobileP3")],
        },
    ]);
</script>

<svelte:head>
    <title>{i18n.t("footer.advertise")} | {i18n.t("site.name")}</title>
    <meta name="description" content={i18n.t("advertise.metaDesc")} />
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-8 md:py-12">
    <div class="rounded-3xl border border-[#3b5794] bg-[#16264d] shadow-2xl overflow-hidden">

        <!-- כותרת -->
        <div class="p-6 md:p-10 text-center">
            <div class="text-5xl mb-4">📢</div>
            <h1 class="text-3xl md:text-4xl font-black bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent mb-3">
                {i18n.t("advertise.heading")}
            </h1>
            <p class="text-gray-300 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
                {i18n.t("advertise.lede")}
            </p>
        </div>

        <!-- איפה הפרסומת (האחת) מופיעה -->
        <div class="mx-8 md:mx-12 border-t border-[#3b5794]"></div>
        <div class="grid md:grid-cols-2">
            {#each placements as p, i (p.title)}
                <div class="relative p-6 flex flex-col">
                    {#if i === 1}
                        <div class="absolute top-0 inset-x-8 border-t border-[#3b5794] md:top-6 md:bottom-6 md:inset-x-auto md:start-0 md:border-t-0 md:border-s" aria-hidden="true"></div>
                    {/if}
                    <div class="text-4xl mb-3">{p.icon}</div>
                    <h2 class="text-xl font-black text-white mb-1">{p.title}</h2>
                    <p class="text-sm text-amber-300 font-bold mb-4">{p.where}</p>
                    <ul class="space-y-2">
                        {#each p.points as point}
                            <li class="text-sm text-gray-300 flex items-start gap-2 leading-relaxed">
                                <span class="text-green-400 flex-shrink-0">✓</span>
                                {point}
                            </li>
                        {/each}
                    </ul>
                </div>
            {/each}
        </div>

        <!-- מחירון -->
        <div class="mx-8 md:mx-12 border-t border-[#3b5794]"></div>
        <div class="p-6 md:p-8" id="plans">
            <h2 class="text-2xl font-black text-white mb-2 text-center">{i18n.t("advertise.plansTitle")}</h2>
            <p class="text-sm text-gray-300 text-center mb-6">
                {i18n.t("advertise.plansLede")}
            </p>
            <ul class="max-w-md mx-auto space-y-2">
                {#each adPlans as plan (plan.days)}
                    <li class="flex items-center justify-between gap-3 rounded-xl bg-[#0f1c3d] border border-[#3b5794] px-4 py-3">
                        <span class="text-gray-200 text-sm md:text-base">{planTitle(plan, i18n.locale)}</span>
                        <span class="flex items-center gap-3">
                            <span class="text-amber-300 font-black text-base md:text-lg whitespace-nowrap">{plan.price} ₪</span>
                            <a
                                href={waHref(planTitle(plan, i18n.locale), plan.price)}
                                target="_blank"
                                rel="noopener noreferrer"
                                class="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-black text-white transition hover:opacity-90 whitespace-nowrap"
                            >💬 {i18n.t("advertise.arrange")}</a>
                        </span>
                    </li>
                {/each}
            </ul>
            <p class="mt-5 text-center text-sm text-gray-300">
                <a href="/about/advertise/terms" class="underline hover:text-white transition-colors">📜 {i18n.t("advertise.termsLink")}</a>
                — {i18n.t("advertise.termsNote")}
            </p>
        </div>

        <!-- איך מפרסמים -->
        <div class="mx-8 md:mx-12 border-t border-[#3b5794]"></div>
        <div class="p-6 md:p-8 text-center">
            <h2 class="text-2xl font-black text-white mb-6">{i18n.t("advertise.howTitle")}</h2>
            <ol class="text-start max-w-md mx-auto space-y-4 mb-8">
                <li class="flex items-start gap-3">
                    <span class="w-7 h-7 rounded-full bg-amber-400 text-black text-sm font-black flex items-center justify-center flex-shrink-0">1</span>
                    <span class="text-gray-200 text-sm md:text-base leading-relaxed">{i18n.t("advertise.step1")}</span>
                </li>
                <li class="flex items-start gap-3">
                    <span class="w-7 h-7 rounded-full bg-amber-400 text-black text-sm font-black flex items-center justify-center flex-shrink-0">2</span>
                    <span class="text-gray-200 text-sm md:text-base leading-relaxed">{i18n.t("advertise.step2")}</span>
                </li>
                <li class="flex items-start gap-3">
                    <span class="w-7 h-7 rounded-full bg-amber-400 text-black text-sm font-black flex items-center justify-center flex-shrink-0">3</span>
                    <span class="text-gray-200 text-sm md:text-base leading-relaxed">{i18n.t("advertise.step3")}</span>
                </li>
            </ol>
            <!-- הגעה מדף המחירים = רכישת מודעה *נוספת*, לא עריכה של הקיימת.
                 בלי הסימון הזה השרת מזהה "מפרסם חוזר" והאישור מוריד את המודעה
                 שכבר רצה - גם כשהמפרסם שילם בכוונה על שתיים. -->
            <a
                href={builderUrl}
                onclick={() => setAdIntent('new')}
                class="inline-block rounded-2xl bg-gradient-to-r from-amber-500 to-pink-600 px-8 py-4 font-black text-white text-lg shadow-xl transition hover:opacity-90 hover:scale-[1.02]"
            >
                🎨 {i18n.t("advertise.design")}
            </a>
            <p class="mt-4 text-sm text-gray-300">
                {i18n.t("advertise.haveAd")}
                <a href="/about/advertise/manage" class="font-bold text-amber-300 underline hover:text-amber-200 transition-colors">
                    {i18n.t("advertise.toDashboard")}
                </a>
            </p>
            <p class="mt-4 text-xs text-gray-400">
                {i18n.t("advertise.questions")}
                <a href={mailto} class="underline hover:text-white transition-colors" dir="ltr">{email}</a>
            </p>
        </div>

    </div>
</div>
