<script lang="ts">
    // "הנכסים שלי" — רשימת הפרסומות של המפרסם המחובר.
    // כל שורה: תצוגה מקדימה, סטטוס, ומדדי-על. הניהול המלא בדף הנכס.
    import { statusView, fmtDate, needsRenewal, isExpired, type AdStatusKind } from '$lib/adOwner';
    import { adImgFit, parseAdImageFit } from '$lib/adImageFit';
    import MyAdAdminActions from '$lib/components/MyAdAdminActions.svelte';
    import { useI18n } from '$lib/i18n/context';

    let { data, form } = $props();

    const i18n = useI18n();

    const TONE: Record<string, string> = {
        amber: 'border-amber-500/40 bg-amber-500/10 text-amber-200',
        emerald: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200',
        rose: 'border-rose-500/40 bg-rose-500/10 text-rose-200',
        slate: 'border-[#3b5794] bg-[#1e293b] text-gray-300',
    };
</script>

<svelte:head><title>{i18n.t('manage.title')} | {i18n.t('site.name')}</title></svelte:head>

<section class="mx-auto max-w-4xl px-3 py-6 md:px-4">
    <div class="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
            <h1 class="text-2xl font-black text-white md:text-3xl">📢 {i18n.t('manage.title')}</h1>
            <!-- גלולה כהה — טקסט אפור ישירות על הרקע הוורוד אינו קריא -->
            <p class="mt-2 inline-block rounded-full border border-[#3b5794] bg-[#1e293b] px-3 py-1 text-xs font-semibold text-gray-100 shadow-md">
                {i18n.tn('manage.count', data.ads.length, { email: data.user.email })}
            </p>
        </div>
        <a href="/about/advertise" class="rounded-full border border-[#3b5794] bg-[#1e293b] px-3.5 py-1.5 text-sm font-bold text-gray-100 shadow-md transition-colors hover:bg-[#334155] hover:text-white">
            ➕ {i18n.t('manage.newAd')}
        </a>
    </div>

    <!-- תוצאת קיצור ניהול (אישור/דחייה/השהיה...) — מעל הרשימה -->
    {#if form?.message}
        <p class="mb-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 text-sm font-bold text-emerald-200">{form.message}</p>
    {:else if form?.error}
        <p class="mb-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2.5 text-sm font-bold text-rose-200">{form.error}</p>
    {/if}

    {#if data.loadFailed}
        <div class="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-5 py-4 text-sm font-bold text-rose-200">
            {i18n.t('manage.loadFailed')}
        </div>
    {:else if data.ads.length === 0}
        <div class="rounded-2xl border border-[#3b5794] bg-[#16264d] px-6 py-12 text-center shadow-lg">
            <div class="mb-4 text-5xl" aria-hidden="true">📢</div>
            <p class="text-lg font-bold text-white">{i18n.t('manage.emptyTitle')}</p>
            <p class="mt-2 text-sm text-gray-300">{i18n.t('manage.emptyBody')}</p>
            <a href="/about/advertise" class="mt-5 inline-block rounded-xl bg-gradient-to-r from-amber-500 to-pink-600 px-6 py-3 font-bold text-white transition hover:opacity-90">
                {i18n.t('manage.toAdvertise')}
            </a>
        </div>
    {:else}
        <div class="flex flex-col gap-4">
            {#each data.ads as ad (ad.id)}
                {@const sv = statusView(ad.status as AdStatusKind, ad.expiresAt, ad.paused, i18n.locale)}
                {@const live = ad.status === 'approved' && !ad.paused && !isExpired('approved', ad.expiresAt)}
                <article class="overflow-hidden rounded-2xl border border-[#3b5794] bg-[#16264d] transition-all hover:border-[#40527a] hover:bg-[#16203a]">
                    <a href="/about/advertise/manage/{ad.id}" class="flex items-stretch gap-4 p-4">
                        <div class="min-w-0 flex-1">
                            <div class="flex flex-wrap items-center gap-2">
                                <h2 class="text-lg font-black leading-tight text-white">{ad.title}</h2>
                                <span class="rounded-full border px-2 py-0.5 text-xs font-bold {TONE[sv.tone]}">{sv.label}</span>
                                {#if needsRenewal(ad.status as AdStatusKind, ad.expiresAt)}
                                    <span class="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-200">⏳ {i18n.t('manage.renew')}</span>
                                {/if}
                            </div>
                            {#if ad.subtitle}
                                <p class="mt-1 line-clamp-2 text-sm text-gray-300">{ad.subtitle}</p>
                            {/if}
                            <p class="mt-1 text-xs text-gray-400">{sv.hint}{ad.expiresAt ? ` · ${i18n.t('manage.until', { date: fmtDate(ad.expiresAt, i18n.locale) })}` : ''}
                                <!-- "עדכון ל..." רק כל עוד ממתינה — אחרי האישור היא *היא* הפרסומת -->
                                {#if ad.status === 'pending' && ad.replacesTitle}· {i18n.t('manage.updateTo', { title: ad.replacesTitle })}{/if}
                            </p>

                            <dl class="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs">
                                <div class="flex items-baseline gap-1.5">
                                    <dt class="text-gray-400">{i18n.t('manage.views')}</dt>
                                    <dd class="font-black tabular-nums text-white">{ad.totals.impressions}</dd>
                                </div>
                                <div class="flex items-baseline gap-1.5">
                                    <dt class="text-gray-400">{i18n.t('manage.clicks')}</dt>
                                    <dd class="font-black tabular-nums text-white">{ad.totals.clicks}</dd>
                                </div>
                                <div class="flex items-baseline gap-1.5">
                                    <dt class="text-gray-400">{i18n.t('manage.landing')}</dt>
                                    <dd class="font-black tabular-nums text-white">{ad.totals.landing}</dd>
                                </div>
                                <div class="flex items-baseline gap-1.5">
                                    <dt class="text-gray-400">{i18n.t('manage.leads')}</dt>
                                    <dd class="font-black tabular-nums text-emerald-300">{ad.totals.leads}</dd>
                                </div>
                            </dl>
                            <p class="mt-3 text-sm font-bold text-blue-300">{i18n.t('manage.manageAd')}</p>
                        </div>

                        <!-- ב-RTL האיבר האחרון יושב בצד שמאל -->
                        <div
                            class="relative flex min-h-[130px] w-2/5 max-w-[190px] flex-shrink-0 items-center justify-center self-stretch overflow-hidden rounded-xl border border-[#3b5794]"
                            style="background: {ad.gradient || 'linear-gradient(135deg, #f59e0b, #ea580c)'}"
                        >
                            {#if ad.mainImage}
                                <img src={ad.mainImage} alt="" class="h-full w-full object-cover" use:adImgFit={parseAdImageFit(ad.mainImageFit)} />
                            {:else}
                                <span class="text-4xl" aria-hidden="true">📢</span>
                            {/if}
                        </div>
                    </a>
                    <!-- שורת הפעולות מחוץ לקישור — טפסים לא יושבים בתוך <a> -->
                    {#if data.isAdmin || live}
                        <div class="border-t border-white/10 px-4 py-2">
                            <MyAdAdminActions {ad} isAdmin={data.isAdmin} {live} />
                        </div>
                    {/if}
                </article>
            {/each}
        </div>
    {/if}
</section>
