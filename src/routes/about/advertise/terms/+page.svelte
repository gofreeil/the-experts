<script lang="ts">
    // תנאי הפרסום — מקושרים מדף "פרסם אצלנו", לפני בחירת מסלול ותשלום.
    // זהה בתוכן לדף התנאים בשאר אתרי הרשת.
    import { adPlans, planTitle } from "$lib/adPlans";
    import { useI18n } from "$lib/i18n/context";

    const i18n = useI18n();

    const contactUrl = "https://freedom.gofreeil.com";
    const email = "freedomhasbegun@gmail.com";
</script>

<svelte:head>
    <title>{i18n.t("terms.title")} | {i18n.t("site.name")}</title>
    <meta name="description" content={i18n.t("terms.metaDesc")} />
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-8 md:py-12">
    <div class="rounded-3xl border border-[#3b5794] bg-[#16264d] shadow-2xl overflow-hidden">

        <!-- כותרת -->
        <div class="p-6 md:p-10 text-center">
            <div class="text-5xl mb-4">📜</div>
            <h1 class="text-3xl md:text-4xl font-black bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent mb-3">
                {i18n.t("terms.title")}
            </h1>
            <p class="text-gray-300 text-base leading-relaxed max-w-xl mx-auto">
                {i18n.t("terms.intro")}
            </p>
        </div>

        <!-- מה אסור לפרסם -->
        <div class="mx-8 md:mx-12 border-t border-[#3b5794]"></div>
        <section class="p-6 md:p-8">
            <h2 class="text-xl font-black text-white mb-3">{i18n.t("terms.s1Title")}</h2>
            <p class="text-gray-200 text-sm md:text-base leading-relaxed mb-3">{i18n.t("terms.s1Lead")}</p>
            <ul class="space-y-2 mb-4">
                <li class="text-sm md:text-base text-gray-200 flex items-start gap-2 leading-relaxed">
                    <span class="text-red-400 flex-shrink-0">✗</span> {i18n.t("terms.s1a")}
                </li>
                <li class="text-sm md:text-base text-gray-200 flex items-start gap-2 leading-relaxed">
                    <span class="text-red-400 flex-shrink-0">✗</span> {i18n.t("terms.s1b")}
                </li>
                <li class="text-sm md:text-base text-gray-200 flex items-start gap-2 leading-relaxed">
                    <span class="text-red-400 flex-shrink-0">✗</span> {i18n.t("terms.s1c")}
                </li>
            </ul>
            <p class="text-amber-300 font-black text-sm md:text-base">{i18n.t("terms.s1Rejected")}</p>
            <p class="text-gray-300 text-sm leading-relaxed mt-3">
                {i18n.t("terms.s1More")}
            </p>
        </section>

        <!-- אישור המודעה -->
        <div class="mx-8 md:mx-12 border-t border-[#3b5794]"></div>
        <section class="p-6 md:p-8">
            <h2 class="text-xl font-black text-white mb-3">{i18n.t("terms.s2Title")}</h2>
            <p class="text-gray-200 text-sm md:text-base leading-relaxed">
                {i18n.t("terms.s2Body")}
            </p>
            <p class="text-gray-300 text-sm leading-relaxed mt-3">
                {i18n.t("terms.s2Period")}
            </p>
        </section>

        <!-- תשלום ותקופת פרסום -->
        <div class="mx-8 md:mx-12 border-t border-[#3b5794]"></div>
        <section class="p-6 md:p-8">
            <h2 class="text-xl font-black text-white mb-3">{i18n.t("terms.s3Title")}</h2>
            <p class="text-gray-200 text-sm md:text-base leading-relaxed mb-4">
                {i18n.t("terms.s3Lead")}
            </p>
            <ul class="space-y-1.5 mb-4">
                {#each adPlans as plan (plan.days)}
                    <li class="flex items-baseline justify-between gap-3 rounded-xl bg-[#0f1c3d] border border-[#3b5794] px-4 py-2">
                        <span class="text-gray-200 text-sm md:text-base">{planTitle(plan, i18n.locale)}</span>
                        <span class="text-amber-300 font-black text-sm md:text-base whitespace-nowrap">{plan.price} ₪</span>
                    </li>
                {/each}
            </ul>
            <p class="text-gray-200 text-sm md:text-base leading-relaxed">
                {i18n.t("terms.s3NoShorten")}
            </p>
        </section>

        <!-- אחריות המפרסם -->
        <div class="mx-8 md:mx-12 border-t border-[#3b5794]"></div>
        <section class="p-6 md:p-8">
            <h2 class="text-xl font-black text-white mb-3">{i18n.t("terms.s4Title")}</h2>
            <ul class="space-y-2">
                <li class="text-sm md:text-base text-gray-200 flex items-start gap-2 leading-relaxed">
                    <span class="text-green-400 flex-shrink-0">✓</span>
                    {i18n.t("terms.s4a")}
                </li>
                <li class="text-sm md:text-base text-gray-200 flex items-start gap-2 leading-relaxed">
                    <span class="text-green-400 flex-shrink-0">✓</span>
                    {i18n.t("terms.s4b")}
                </li>
                <li class="text-sm md:text-base text-gray-200 flex items-start gap-2 leading-relaxed">
                    <span class="text-green-400 flex-shrink-0">✓</span>
                    {i18n.t("terms.s4c")}
                </li>
            </ul>
        </section>

        <!-- מיקום והצגה -->
        <div class="mx-8 md:mx-12 border-t border-[#3b5794]"></div>
        <section class="p-6 md:p-8">
            <h2 class="text-xl font-black text-white mb-3">{i18n.t("terms.s5Title")}</h2>
            <p class="text-gray-200 text-sm md:text-base leading-relaxed">
                {i18n.t("terms.s5Body")}
            </p>
        </section>

        <!-- שינויים והסרה -->
        <div class="mx-8 md:mx-12 border-t border-[#3b5794]"></div>
        <section class="p-6 md:p-8">
            <h2 class="text-xl font-black text-white mb-3">{i18n.t("terms.s6Title")}</h2>
            <p class="text-gray-200 text-sm md:text-base leading-relaxed">
                {i18n.t("terms.s6Body")}
            </p>
        </section>

        <!-- יצירת קשר -->
        <div class="mx-8 md:mx-12 border-t border-[#3b5794]"></div>
        <section class="p-6 md:p-8 text-center">
            <p class="text-amber-300 font-black text-lg mb-4">{i18n.t("terms.goodLuck")}</p>
            <p class="text-sm text-gray-300 leading-relaxed">
                {i18n.t("terms.contactLead")}
                <a href={"mailto:" + email} class="underline hover:text-white transition-colors" dir="ltr">{email}</a>
                <br />
                {i18n.t("terms.team")} <a href={contactUrl} target="_blank" rel="noopener noreferrer" class="underline hover:text-white transition-colors">{i18n.t("footer.movement")}</a>{i18n.t("terms.teamAfter")}
            </p>
            <a
                href="/about/advertise"
                class="mt-6 inline-block rounded-2xl bg-gradient-to-r from-amber-500 to-pink-600 px-8 py-4 font-black text-white text-lg shadow-xl transition hover:opacity-90 hover:scale-[1.02]"
            >
                📢 {i18n.t("terms.backToPrices")}
            </a>
        </section>

    </div>
</div>
