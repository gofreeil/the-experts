<script lang="ts">
    import { LEDGER, SOLVED_COUNT, catColor, catShort, fmt } from '$lib/homeData';

    let { rows, label = 'פתרונות אחרונים ששולמו' }: { rows: typeof LEDGER; label?: string } = $props();

    const sum = $derived(rows.reduce((s, r) => s + r.amt, 0));
</script>

<div class="ledger" role="table" aria-label={label}>
    <div class="lg-row lg-head" role="row">
        <span role="columnheader">הבעיה</span><span role="columnheader">הפותר</span><span role="columnheader">נפתר תוך</span><span role="columnheader" class="end">שולם</span>
    </div>
    {#each rows as r}
        <div class="lg-row" role="row">
            <div class="lg-t" role="cell"><b>{r.t}</b><small><span class="dot" style="--c:{catColor(r.c)}"></span>{catShort(r.c)}</small></div>
            <div class="lg-who" role="cell">{r.who}</div>
            <div class="lg-days" role="cell">{r.days} ימים</div>
            <div class="lg-amt" role="cell"><span class="num">{fmt(r.amt)}</span></div>
        </div>
    {:else}
        <div class="lg-empty">אין פתרונות בתחום הזה עדיין.</div>
    {/each}
    <div class="lg-foot"><span>{rows.length} מתוך <b class="num">{SOLVED_COUNT}</b> פתרונות</span><span>סך הכול בשורות האלה: <b class="num">{fmt(sum)}</b></span></div>
</div>

<style>
    .ledger { border: 1px solid var(--line); border-radius: 8px; background: var(--surface); overflow: hidden; min-width: 0; }
    .lg-row { display: grid; grid-template-columns: minmax(0, 1fr) 120px 76px 88px; gap: 14px; align-items: center; padding: 14px 20px; border-top: 1px solid var(--line-soft); }
    .lg-row:first-child { border-top: 0; }
    .lg-head { font-size: 12.5px; color: var(--fg-faint); font-weight: 700; letter-spacing: 0.05em; padding-block: 11px; background: var(--surface-2); }
    .lg-head .end { text-align: left; }
    .lg-t { min-width: 0; }
    .lg-t b { display: block; font-weight: 700; font-size: 15px; line-height: 1.35; }
    .lg-t small { display: flex; align-items: center; gap: 7px; margin-top: 2px; color: var(--fg-faint); font-size: 12.5px; }
    .lg-who { font-size: 14px; color: var(--fg-mute); line-height: 1.35; }
    .lg-days { font-size: 14px; color: var(--fg-mute); }
    .lg-amt { font-family: var(--font-display); font-weight: 900; color: var(--honey-text); font-size: 19px; text-align: left; }
    .lg-empty { padding: 28px 20px; text-align: center; color: var(--fg-mute); border-top: 1px solid var(--line-soft); }
    .lg-foot { padding: 14px 20px; border-top: 1px solid var(--line); display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; color: var(--fg-mute); font-size: 14px; }

    @container home (max-width: 600px) {
        .lg-head { display: none; }
        .lg-row { grid-template-columns: minmax(0, 1fr) auto; gap: 4px 12px; }
        .lg-days { font-size: 13px; color: var(--fg-faint); }
        .lg-amt { grid-column: 2; grid-row: 1 / span 3; align-self: center; }
    }
</style>
