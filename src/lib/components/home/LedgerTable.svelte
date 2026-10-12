<script lang="ts">
    import { SOLVED_COUNT, catColor, catShort, fmt, type Solved } from '$lib/homeData';
    import { expertBySlug } from '$lib/expertsData';
    import { useI18n } from '$lib/i18n/context';

    let { rows, label = '' }: { rows: Solved[]; label?: string } = $props();

    const i18n = useI18n();
    const list = $derived(i18n.l(rows));
    const sum = $derived(rows.reduce((s, r) => s + r.amt, 0));
</script>

<div class="ledger" role="table" aria-label={label || i18n.t('ledger.label')}>
    <div class="lg-row lg-head" role="row">
        <span role="columnheader">{i18n.t('ledger.problem')}</span><span role="columnheader">{i18n.t('ledger.solver')}</span><span role="columnheader">{i18n.t('ledger.solvedWithin')}</span><span role="columnheader" class="end">{i18n.t('ledger.paid')}</span>
    </div>
    {#each list as r}
        {@const ex = expertBySlug(r.ex)}
        <div class="lg-row" role="row">
            <div class="lg-t" role="cell"><b>{r.t}</b><small><span class="dot" style="--c:{catColor(r.c)}"></span>{catShort(r.c, i18n.locale)}</small></div>
            <div class="lg-who" role="cell">{#if ex}<a href="/experts/{ex.slug}">{i18n.l(ex.n)}</a>{/if}</div>
            <div class="lg-days" role="cell">{i18n.tn('ledger.days', r.days)}</div>
            <div class="lg-amt" role="cell"><span class="num">{fmt(r.amt)}</span></div>
        </div>
    {:else}
        <div class="lg-empty">{i18n.t('ledger.empty')}</div>
    {/each}
    <div class="lg-foot"><span>{i18n.t('ledger.ofTotal', { n: rows.length })} <b class="num">{SOLVED_COUNT}</b> {i18n.t('ledger.solutions')}</span><span>{i18n.t('ledger.sum')} <b class="num">{fmt(sum)}</b></span></div>
</div>

<style>
    .ledger { min-width: 0; }
    .lg-row { display: grid; grid-template-columns: minmax(0, 1fr) 120px 76px 88px; gap: 14px; align-items: center; padding: 14px 20px; border-top: 1px solid var(--line-soft); }
    .lg-row:first-child { border-top: 0; }
    .lg-head { font-size: 12.5px; color: var(--fg-faint); font-weight: 700; letter-spacing: 0.05em; padding-block: 11px; }
    .lg-head .end { text-align: end; }
    .lg-t { min-width: 0; }
    .lg-t b { display: block; font-weight: 700; font-size: 15px; line-height: 1.35; }
    .lg-t small { display: flex; align-items: center; gap: 7px; margin-top: 2px; color: var(--fg-faint); font-size: 12.5px; }
    .lg-who { font-size: 14px; color: var(--fg-mute); line-height: 1.35; }
    .lg-who a:hover { color: var(--honey-text); text-decoration: underline; text-underline-offset: 3px; }
    .lg-days { font-size: 14px; color: var(--fg-mute); }
    .lg-amt { font-family: var(--font-display); font-weight: 900; color: var(--honey-text); font-size: 19px; text-align: end; }
    .lg-empty { padding: 28px 20px; text-align: center; color: var(--fg-mute); border-top: 1px solid var(--line-soft); }
    .lg-foot { padding: 14px 20px; border-top: 1px solid var(--line); display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; color: var(--fg-mute); font-size: 14px; }

    @container home (max-width: 600px) {
        .lg-head { display: none; }
        /* שורה קצרה: הכותרת למעלה, והפותר וזמן הפתרון זה ליד זה מתחתיה; הסכום בקצה */
        .lg-row { grid-template-columns: auto minmax(0, 1fr) auto; gap: 2px 8px; }
        .lg-t { grid-column: 1 / 3; }
        .lg-who { grid-column: 1; }
        .lg-days { grid-column: 2; font-size: 13px; color: var(--fg-faint); }
        .lg-days::before { content: "·"; margin-inline-end: 8px; }
        .lg-amt { grid-column: 3; grid-row: 1 / span 2; align-self: center; }
        .lg-row { padding: 9px 12px; }
        .lg-t b { font-size: 14px; }
        .lg-who { font-size: 13px; }
        .lg-amt { font-size: 17px; }
        .lg-foot { padding: 10px 12px; font-size: 13px; gap: 4px 12px; }
    }
</style>
