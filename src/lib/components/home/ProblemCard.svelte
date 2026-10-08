<script lang="ts">
    import type { Problem } from '$lib/problemsStore.svelte';
    import { formatTimeAgo } from '$lib/problemsStore.svelte';
    import { catColor, catShort, fmt, handsOf, backersOf, tierOf } from '$lib/homeData';
    import { adThenGo } from './nav';

    let { p, flash = false, onpledge }: { p: Problem; flash?: boolean; onpledge?: (id: string, amount: number) => void } = $props();

    let menuOpen = $state(false);
    let root: HTMLElement | undefined = $state();

    const isPrivate = $derived(p.type === 'individual');
    const tier = $derived(tierOf(p.bounty));
    const hands = $derived(handsOf(p));
    const avatarColors = ['var(--c-law)', 'var(--c-technology)', 'var(--c-agriculture)'];
    const initials = ['רכ', 'יש', 'של'];

    function pledge(amount: number) {
        onpledge?.(p.id, amount);
        menuOpen = false;
    }
</script>

<svelte:window onclick={(e) => { if (menuOpen && root && !root.contains(e.target as Node)) menuOpen = false; }} />

<div class="wrap">
    <article class="pcard" class:flash id="p-{p.id}" style="--c:{catColor(p.category)}" bind:this={root}>
        <div class="p-main">
            <div class="p-tags">
                <span class="tag-c"><span class="dot" style="--c:{catColor(p.category)}"></span>{catShort(p.category)}</span>
                <span class="tag-t" class:prv={isPrivate}>
                    {#if isPrivate}
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="1.5" /><path d="M5 7V5a3 3 0 0 1 6 0v2" /></svg>פרטית
                    {:else}
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="8" cy="8" r="6" /><path d="M2 8h12M8 2c2 2 2 10 0 12M8 2c-2 2-2 10 0 12" /></svg>ציבורית
                    {/if}
                </span>
                <span class="tag-age">{formatTimeAgo(p.createdAt)}</span>
            </div>

            <h3><a href="/problems/{p.id}" onclick={(e) => adThenGo(e, `/problems/${p.id}`)}>{p.title}</a></h3>
            <p>{isPrivate ? `הפרטים גלויים רק למומחים מאומתים בתחום ${catShort(p.category)}.` : p.description}</p>

            <div class="p-foot">
                <span class="hands">
                    <span class="stack">
                        {#each Array(Math.min(hands, 3)) as _, i}
                            <span class="mini-av" style="--c2:{avatarColors[i]}">{initials[i]}</span>
                        {/each}
                    </span>
                    <span><b class="num">{hands}</b> מומחים הרימו יד</span>
                </span>

                <a class="btn btn-sm btn-ghost" href="/problems/{p.id}" onclick={(e) => adThenGo(e, `/problems/${p.id}`)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 11V6a2 2 0 0 0-4 0M14 10V4a2 2 0 0 0-4 0v2M10 10.5V6a2 2 0 0 0-4 0v8" /><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-6-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" /></svg>
                    אני יכול לפתור
                </a>

                {#if !isPrivate}
                    <span class="pledge" class:open={menuOpen}>
                        <button class="btn btn-sm btn-ghost" type="button" aria-expanded={menuOpen} onclick={() => (menuOpen = !menuOpen)}>
                            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M10 4v12M4 10h12" /></svg>
                            הוסיפו לפרס
                        </button>
                        <span class="pledge-menu" role="group" aria-label="סכום להוספה">
                            {#each [50, 100, 500] as amt}
                                <button type="button" onclick={() => pledge(amt)}>+{amt}</button>
                            {/each}
                        </span>
                    </span>
                {/if}
            </div>
        </div>

        <div class="p-stub">
            <div class="stub-main">
                <span class="stub-l">הפרס</span>
                <div class="stub-amt"><span class="num">{fmt(p.bounty)}</span></div>
                <span class="pips" role="img" aria-label="גודל הבעיה {tier} מתוך 5">
                    {#each Array(5) as _, i}<i class:on={i < tier}></i>{/each}
                </span>
            </div>
            <span class="stub-s">{isPrivate ? 'מבקש יחיד' : `${backersOf(p)} תורמים`}</span>
        </div>
    </article>
</div>

<style>
    .wrap { container-type: inline-size; min-width: 0; }
    .pcard { position: relative; display: grid; grid-template-columns: minmax(0, 1fr) 150px; background: var(--surface); border: 1px solid var(--line); border-radius: 6px; min-width: 0; transition: border-color 0.2s, box-shadow 0.3s; }
    .pcard:hover { border-color: color-mix(in srgb, var(--c) 60%, var(--line)); }
    .pcard.flash { border-color: var(--honey-deep); box-shadow: 0 0 0 3px rgba(245, 165, 36, 0.35); }

    .p-main { padding: 18px 20px 16px; display: flex; flex-direction: column; gap: 10px; min-width: 0; }
    .p-tags { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px; font-size: 13px; color: var(--fg-mute); }
    .tag-c { display: inline-flex; align-items: center; gap: 7px; font-weight: 700; color: var(--fg); }
    .tag-t { display: inline-flex; align-items: center; gap: 5px; padding: 1px 8px; border: 1px solid var(--line); border-radius: 4px; font-size: 12.5px; }
    .tag-t svg { width: 13px; height: 13px; }
    .tag-t.prv { color: var(--warn); border-color: color-mix(in srgb, var(--warn) 45%, transparent); }
    .tag-age { margin-inline-start: auto; color: var(--fg-faint); }
    h3 { font-size: 18px; font-weight: 800; line-height: 1.35; text-wrap: balance; }
    h3 a:hover { color: var(--honey-text); }
    .p-main p { color: var(--fg-mute); font-size: 14.5px; text-wrap: pretty; display: -webkit-box; -webkit-line-clamp: 3; line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
    .p-foot { margin-top: auto; padding-top: 6px; display: flex; flex-wrap: wrap; align-items: center; gap: 10px 12px; }
    .hands { display: inline-flex; align-items: center; gap: 9px; font-size: 13.5px; color: var(--fg-mute); margin-inline-end: auto; }
    .stack { display: inline-flex; }
    .stack .mini-av { margin-inline-start: -7px; }
    .stack .mini-av:first-child { margin-inline-start: 0; }

    .p-stub { position: relative; border-inline-start: 2px dashed var(--line); padding: 18px 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 4px; background: linear-gradient(180deg, rgba(245, 165, 36, 0.09), transparent); }
    .p-stub::before, .p-stub::after { content: ""; position: absolute; inset-inline-start: -11px; width: 20px; height: 20px; border-radius: 50%; background: var(--bg-2); border: 1px solid var(--line); }
    .p-stub::before { top: -11px; clip-path: inset(50% 0 0 0); }
    .p-stub::after { bottom: -11px; clip-path: inset(0 0 50% 0); }
    .stub-main { display: flex; flex-direction: column; align-items: center; gap: 2px; }
    .stub-l { font-size: 12px; letter-spacing: 0.1em; color: var(--honey-text); font-weight: 700; }
    .stub-amt { font-family: var(--font-display); font-weight: 900; color: var(--honey-text); font-size: 32px; line-height: 1.05; }
    .pips { display: inline-flex; gap: 3px; margin-top: 4px; }
    .pips i { width: 11px; height: 12px; background: var(--line); clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%); }
    .pips i.on { background: var(--honey); }
    .stub-s { font-size: 12.5px; color: var(--fg-faint); line-height: 1.35; }

    .pledge { position: relative; }
    .pledge-menu { display: none; position: absolute; bottom: calc(100% + 8px); inset-inline-start: 0; background: var(--surface); border: 1px solid var(--line); border-radius: 6px; padding: 8px; gap: 6px; z-index: 5; box-shadow: var(--shadow); }
    .pledge.open .pledge-menu { display: flex; }
    .pledge-menu button { background: var(--surface-2); border: 1px solid var(--line); border-radius: 4px; padding: 7px 10px; font-weight: 700; font-size: 14px; }
    .pledge-menu button:hover { border-color: var(--honey-deep); color: var(--honey-text); }

    @container (max-width: 470px) {
        .pcard { grid-template-columns: minmax(0, 1fr); }
        .p-stub { border-inline-start: 0; border-top: 2px dashed var(--line); flex-direction: row; justify-content: space-between; padding: 12px 20px; text-align: right; }
        .p-stub::before, .p-stub::after { top: -11px; bottom: auto; }
        .p-stub::before { inset-inline-start: -11px; clip-path: inset(0 50% 0 0); }
        .p-stub::after { inset-inline-start: auto; inset-inline-end: -11px; clip-path: inset(0 0 0 50%); }
        .stub-amt { font-size: 28px; }
        .stub-main { align-items: flex-start; }
    }
</style>
