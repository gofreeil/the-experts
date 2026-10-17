<script lang="ts">
    import { onMount } from 'svelte';
    import { MEETUP, DEMO_DATA, catColor } from '$lib/homeData';
    import SectionHead from './SectionHead.svelte';
    import { useI18n } from '$lib/i18n/context';

    // headTitle = כותרת נושא בדף הבית (בעיצוב חכמי העדה). בדף המלא אין כותרת כזו, כי יש כותרת עמוד.
    // preview = גרסת דף הבית: בלי סדר המפגש המפורט, שנמצא רק בדף המלא.
    let { headTitle = '', preview = false }: { headTitle?: string; preview?: boolean } = $props();

    const i18n = useI18n();
    const meetup = $derived(i18n.l(MEETUP));

    // מרחק בין עכשיו ליעד, בחודשי לוח + ימים + שעות + דקות + שניות
    function diffParts(now: Date, target: Date) {
        let m = (target.getFullYear() - now.getFullYear()) * 12 + target.getMonth() - now.getMonth();
        let anchor = new Date(now.getTime());
        anchor.setMonth(anchor.getMonth() + m);
        if (anchor > target) {
            m--;
            anchor = new Date(now.getTime());
            anchor.setMonth(anchor.getMonth() + m);
        }
        const rest = Math.max(0, target.getTime() - anchor.getTime());
        return {
            m: Math.max(0, m),
            d: Math.floor(rest / 864e5),
            h: Math.floor((rest % 864e5) / 36e5),
            i: Math.floor((rest % 36e5) / 6e4),
            s: Math.floor((rest % 6e4) / 1e3)
        };
    }
    const two = (n: number) => String(n).padStart(2, '0');

    let target = $state(new Date(MEETUP.first));
    let parts = $state<ReturnType<typeof diffParts> | null>(null);
    let registered = $state(false);

    const whenLabel = $derived(
        i18n.date(target, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) + ' · ' + i18n.t('meetup.timeAndPlace')
    );

    onMount(() => {
        // אם המועד עבר, מגלגלים למפגש הבא באותו מחזור
        let t = new Date(MEETUP.first);
        while (t.getTime() < Date.now()) t = new Date(t.getTime() + MEETUP.periodDays * 864e5);
        target = t;
        const tick = () => (parts = diffParts(new Date(), target));
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    });

    const UNIT_KEYS = ['meetup.unitMonth', 'meetup.unitDay', 'meetup.unitHour', 'meetup.unitMinute', 'meetup.unitSecond'] as const;
    const cells = $derived(
        UNIT_KEYS.map((key, k) => {
            const v = parts ? [parts.m, parts.d, parts.h, parts.i, parts.s][k] : null;
            // לפני הטעינה (v ריק) מציגים את צורת הרבים
            return { v, label: i18n.tn(key, v ?? 2) };
        })
    );
</script>

<!-- המרצים: גלריה אנכית שנעה מלמטה למעלה. העותק השני (מוסתר מקוראי מסך) סוגר את הלולאה בלי קפיצה. -->
{#snippet speakers()}
    <div class="panel">
        <h3 class="panel-title">{i18n.t('meetup.panelTitle')}</h3>
        <div class="speakers" style="--n:{meetup.speakers.length}">
            <div class="track">
                {#each [0, 1] as copy}
                    <div class="copy" aria-hidden={copy === 1}>
                        {#each meetup.speakers as s}
                            <div class="spk">
                                <span class="mini-av big" style="--c2:{catColor(s.team)}">{s.ini}</span>
                                <div><b>{s.name}</b><small>{i18n.t('meetup.speaker')}</small></div>
                            </div>
                        {/each}
                    </div>
                {/each}
            </div>
        </div>
    </div>
{/snippet}

<section class="section" id="meet">
    <div class="inner">
        {#if headTitle}<SectionHead title={headTitle} />{/if}
        <div class="meet" class:solo={preview}>
            <div class="meet-main">
                <span class="live-pill"><i></i>{i18n.t('meetup.nextVirtual', { n: MEETUP.number })}{#if DEMO_DATA}<span class="demo-tag">{i18n.t('common.demoData')}</span>{/if}</span>
                <div class="titleline">
                    <h2>{i18n.t('meetup.title')}</h2>
                    <p class="tagline">{i18n.t('meetup.tagline')}</p>
                </div>
                <p class="when">{whenLabel}</p>

                <div class="count" role="timer" aria-label={i18n.t('meetup.timeLeft')}>
                    {#each cells as c}
                        <div>
                            <b>{c.v === null ? '--' : two(c.v)}</b>
                            <span>{c.label}</span>
                        </div>
                    {/each}
                </div>

                <div class="meet-foot">
                    <div class="meet-cta">
                        <button class="btn btn-primary" type="button" aria-pressed={registered} onclick={() => (registered = !registered)}>
                            {registered ? i18n.t('meetup.registered') : i18n.t('meetup.reserve')}
                        </button>
                        <span class="reg-note"><b class="num">{MEETUP.registered + (registered ? 1 : 0)}</b> {i18n.t('meetup.regNote', { cap: MEETUP.capacity })}</span>
                    </div>

                    {#if !preview}{@render speakers()}{/if}
                </div>
            </div>

            {#if preview}{@render speakers()}{/if}

            {#if !preview}
            <div class="agenda">
                <h3>{i18n.t('meetup.agendaTitle')}</h3>
                <div class="sub">{i18n.t('meetup.agendaSub')}</div>
                <ol>
                    {#each meetup.agenda as a}
                        <li>
                            <time>{a.time}</time>
                            <span>{a.t}<small>{a.s}</small></span>
                            <span class="bt"><span class="num">{a.amt}</span></span>
                        </li>
                    {/each}
                </ol>
            </div>
            {/if}
        </div>
    </div>
</section>

<style>
    .meet {
        display: grid; grid-template-columns: minmax(0, 6fr) minmax(0, 5fr); gap: clamp(22px, 4cqi, 52px);
    }
    .meet-main { min-width: 0; }
    .live-pill { display: inline-flex; flex-wrap: wrap; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; color: var(--honey-text); border: 1px solid var(--honey-deep); background: rgba(245, 165, 36, 0.1); padding: 4px 12px; border-radius: 999px; }
    .live-pill i { width: 8px; height: 8px; border-radius: 50%; background: var(--honey-text); box-shadow: 0 0 0 0 rgba(185, 119, 14, 0.6); animation: beat 2s infinite; }
    .live-pill .demo-tag { margin-inline-start: 4px; }
    @keyframes beat { 70% { box-shadow: 0 0 0 9px rgba(185, 119, 14, 0); } 100% { box-shadow: 0 0 0 0 rgba(185, 119, 14, 0); } }
    h2 { font-family: var(--font-display); font-weight: 900; font-size: clamp(26px, 4.4cqi, 44px); line-height: 1.12; margin-top: 16px; text-wrap: balance; }
    .tagline { margin-top: 6px; font-size: clamp(18px, 2.4cqi, 22px); font-weight: 700; color: var(--honey-text); }
    .when { color: var(--fg-mute); margin-top: 10px; font-size: 16px; }
    .count { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 8px; margin-top: 26px; max-width: 560px; }
    .count > div { background: var(--surface); border: 1px solid var(--line); border-radius: 6px; padding: 12px 6px 9px; text-align: center; min-width: 0; }
    .count b { display: block; font-family: var(--font-display); font-weight: 900; font-size: clamp(28px, 5cqi, 48px); line-height: 1; color: var(--honey-text); font-variant-numeric: tabular-nums; direction: ltr; }
    .count span { display: block; font-size: 13px; color: var(--fg-mute); margin-top: 6px; }
    .meet-cta { display: flex; flex-wrap: wrap; align-items: center; gap: 12px 16px; margin-top: 26px; }
    .reg-note { color: var(--fg-mute); font-size: 14px; }
    /* גלריית מרצים אנכית: חלון של כשתי שורות וחצי, והרשימה (פעמיים) גולשת מלמטה למעלה בלולאה */
    .panel { margin-top: 28px; max-width: 260px; min-width: 0; }
    .panel-title {
        display: flex; align-items: center; gap: 8px; margin-bottom: 12px;
        font-family: var(--font-display); font-size: 18px; font-weight: 900; line-height: 1.2; color: var(--fg);
    }
    .panel-title::before {
        content: ''; flex: none; width: 4px; height: 1.1em; border-radius: 2px;
        background: linear-gradient(var(--honey-bright), var(--honey-deep));
    }
    .speakers {
        --row: 56px;
        height: calc(var(--row) * min(2.5, var(--n))); overflow: hidden;
        mask-image: linear-gradient(to bottom, transparent, #000 20%, #000 80%, transparent);
    }
    .track { animation: spk-up calc(var(--n) * 3s) linear infinite; }
    .speakers:hover .track { animation-play-state: paused; }
    @keyframes spk-up { to { transform: translateY(-50%); } }
    .spk { display: flex; align-items: center; gap: 10px; min-width: 0; height: var(--row); }
    .mini-av.big { width: 40px; height: 44px; font-size: 14px; }
    .spk b { display: block; font-size: 15px; font-weight: 700; line-height: 1.25; }
    .spk small { display: block; color: var(--fg-faint); font-size: 12.5px; }
    /* גרסת דף הבית: ממורכזת וקומפקטית, עם אלמנטים זה לצד זה */
    .solo .meet-main { display: flex; flex-direction: column; align-items: center; text-align: center; }
    .solo .titleline { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: center; gap: 2px 14px; margin-top: 10px; }
    .solo h2 { margin-top: 0; font-size: clamp(22px, 3.4cqi, 32px); }
    .solo .tagline { margin-top: 0; font-size: clamp(16px, 2cqi, 19px); }
    .solo .when { margin-top: 4px; font-size: 15px; }
    .solo .count { width: 100%; max-width: 420px; gap: 6px; margin-top: 14px; }
    .solo .count > div { padding: 8px 4px 6px; }
    .solo .count b { font-size: clamp(22px, 3.6cqi, 32px); }
    .solo .count span { font-size: 12px; margin-top: 4px; }
    .solo .meet-foot { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 12px 32px; margin-top: 16px; }
    .solo .meet-cta { margin-top: 0; justify-content: center; gap: 8px 12px; }
    .solo .reg-note { font-size: 13px; }
    /* בדף הבית הגלריה עומדת בצד הסוף של הבאנר (שמאל בעברית), מופרדת בקו דק */
    .meet.solo { grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 24px; }
    .solo > .panel { margin-top: 0; padding-inline-start: 20px; border-inline-start: 1px solid var(--line-soft); }
    .solo .speakers { --row: 48px; }
    .solo .mini-av.big { width: 32px; height: 36px; font-size: 12px; }
    .solo .spk b { font-size: 14px; }
    .solo .spk small { font-size: 12px; }
    .agenda { align-self: start; min-width: 0; }
    .agenda h3 { font-size: 15px; font-weight: 800; margin-bottom: 4px; }
    .agenda .sub { color: var(--fg-faint); font-size: 13px; }
    ol { list-style: none; margin: 14px 0 0; padding: 0; }
    li { display: grid; grid-template-columns: 52px minmax(0, 1fr) auto; gap: 12px; align-items: baseline; padding: 11px 0; border-top: 1px solid var(--line-soft); font-size: 15px; }
    li:first-child { border-top: 0; }
    time { font-variant-numeric: tabular-nums; color: var(--honey-text); font-weight: 700; direction: ltr; text-align: right; }
    li small { display: block; color: var(--fg-faint); font-size: 12.5px; }
    .bt { font-family: var(--font-display); font-weight: 900; color: var(--honey-text); font-size: 16px; }

    @container home (max-width: 820px) {
        .meet { grid-template-columns: minmax(0, 1fr); }
    }
    /* צר: הגלריה יורדת מתחת לבאנר, ממורכזת ובגובה שתי שורות */
    @container home (max-width: 600px) {
        .meet.solo { grid-template-columns: minmax(0, 1fr); gap: 10px; }
        .solo > .panel { justify-self: center; padding-inline-start: 0; border-inline-start: 0; }
        .solo .panel-title { justify-content: center; }
        .solo .speakers { height: calc(var(--row) * min(2, var(--n))); }
    }
    /* בלי תנועה: רשימה סטטית מלאה, בלי העותק הכפול */
    @media (prefers-reduced-motion: reduce) {
        .speakers, .solo .speakers { height: auto; mask-image: none; }
        .copy[aria-hidden='true'] { display: none; }
    }
    @container home (max-width: 440px) {
        .count { gap: 5px; }
        .count > div { padding-inline: 2px; }
        .count span { font-size: 12px; }
    }
</style>
