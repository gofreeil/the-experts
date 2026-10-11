<script lang="ts">
    import type { Problem } from '$lib/problemsStore.svelte';
    import { formatTimeAgo } from '$lib/problemsStore.svelte';
    import { NEED_PREFIX, catColor, catShort, fmt, handsOf, backersOf, PLEDGE_AMOUNTS } from '$lib/homeData';
    import { adThenGo } from './nav';
    import FancyHeading from './FancyHeading.svelte';
    import Stamp from './Stamp.svelte';
    import OrnamentDivider from './OrnamentDivider.svelte';

    let {
        wanted,
        recent,
        selectedId = $bindable(null),
        onpledge
    }: {
        wanted: Problem[];
        recent: Problem[];
        selectedId?: string | null;
        onpledge?: (id: string, amount: number) => void;
    } = $props();

    let hoverId = $state<string | null>(null);

    // אישור קצר אחרי הוספה לפרס, במקום הכפתורים של אותו כרטיס
    let thanks = $state<{ id: string; amt: number } | null>(null);
    let thanksTimer: ReturnType<typeof setTimeout> | undefined;
    $effect(() => () => clearTimeout(thanksTimer));

    function pledge(p: Problem, amt: number) {
        onpledge?.(p.id, amt);
        thanks = { id: p.id, amt };
        clearTimeout(thanksTimer);
        thanksTimer = setTimeout(() => (thanks = null), 2200);
    }

    const byId = $derived(new Map([...wanted, ...recent].map((p) => [p.id, p])));
    const top = $derived(wanted[0] ?? recent[0] ?? null);
    const pickedId = $derived(selectedId ?? top?.id ?? null);
    const shown = $derived(byId.get(hoverId ?? pickedId ?? '') ?? top);

    // איור לכל תחום: static/images/problems/<תחום>.svg
    const ART = ['law', 'economy', 'education', 'agriculture', 'technology', 'health', 'ethics', 'rights'];
    const artOf = (category: string) => (ART.includes(category) ? category : 'ethics');
</script>

{#snippet group(list: Problem[], label: string)}
    <div class="grid" role="group" aria-label={label} onmouseleave={() => (hoverId = null)}>
        {#each list as p (p.id)}
            <div class="cell" style="--c:{catColor(p.category)}">
                <button
                    class="card"
                    class:sel={p.id === pickedId}
                    type="button"
                    aria-label="{p.title}, פרס {p.bounty} שקלים"
                    aria-pressed={p.id === pickedId}
                    onmouseenter={() => (hoverId = p.id)}
                    onfocus={() => (hoverId = p.id)}
                    onblur={() => (hoverId = null)}
                    onclick={() => (selectedId = p.id)}
                >
                    <span class="c-media">
                        <img class="c-img" src="/images/problems/{artOf(p.category)}.svg" alt="" width="400" height="260" loading="lazy" decoding="async" />
                        <span class="c-price"><span class="num">{fmt(p.bounty)}</span></span>
                    </span>
                    <span class="c-body">
                        <span class="c-cat">
                            <span class="dot"></span>{catShort(p.category)}
                            <span class="c-sub">{p.type === 'community' ? `${backersOf(p)} תורמים` : 'פרטית'}</span>
                        </span>
                        <span class="c-title"><span class="need">{NEED_PREFIX}</span> {p.title}</span>
                    </span>
                </button>
                <div class="pledge">
                    {#if p.type !== 'community'}
                        <span class="pl-l">בעיה פרטית, הפרס ממבקש יחיד</span>
                    {:else if thanks?.id === p.id}
                        <span class="thanks" role="status">✓ נוספו <span class="num">{fmt(thanks.amt)}</span> לפרס, תודה!</span>
                    {:else}
                        <span class="pl-l">הוסיפו לפרס</span>
                        {#each PLEDGE_AMOUNTS as amt}
                            <button class="pl-b" type="button" aria-label="הוסיפו {amt} שקלים לפרס: {p.title}" onclick={() => pledge(p, amt)}>+{amt}</button>
                        {/each}
                    {/if}
                </div>
            </div>
        {/each}
    </div>
{/snippet}

<div class="mapbox">
    <Stamp text="מבוקש: פתרון" />
    <FancyHeading title="המבוקשים ביותר" />
    {@render group(wanted, 'המבוקשים ביותר')}

    <OrnamentDivider />

    <FancyHeading title="האחרונות שהועלו" />
    {@render group(recent, 'האחרונות שהועלו')}

    <div class="all-row"><a class="all-link" href="/problems">לכל הבעיות</a></div>

    {#if shown}
        <div class="map-sel" aria-live="polite">
            <div class="sel-text">
                <div class="meta">
                    <span class="dot" style="--c:{catColor(shown.category)}"></span>
                    <b>{catShort(shown.category)}</b>
                    <span>·</span>
                    <span>{shown.type === 'community' ? 'ציבורית' : 'פרטית'}</span>
                    <span>·</span>
                    <span>{formatTimeAgo(shown.createdAt)}</span>
                </div>
                <h3><span class="need">{NEED_PREFIX}</span> {shown.title}</h3>
                <p>{shown.type === 'individual' ? 'בעיה פרטית. פרטי המבקש גלויים רק למומחים מאומתים.' : shown.description}</p>
            </div>
            <div class="amt">
                <div class="big-amt"><span class="num">{fmt(shown.bounty)}</span></div>
                <div class="sub">{backersOf(shown)} תורמים · {handsOf(shown)} ידיים</div>
            </div>
            <div class="acts">
                <a class="btn btn-sm btn-primary" href="/problems/{shown.id}" onclick={(e) => adThenGo(e, `/problems/${shown.id}`)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 11V6a2 2 0 0 0-4 0M14 10V4a2 2 0 0 0-4 0v2M10 10.5V6a2 2 0 0 0-4 0v8" /><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-6-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" /></svg>
                    אני יכול לפתור
                </a>
                <a class="btn btn-sm btn-ghost" href="/problems">הראו בלוח</a>
            </div>
        </div>
    {/if}
</div>

<style>
    .mapbox { min-width: 0; max-width: 1000px; margin-inline: auto; }
    .all-row { margin-top: 14px; text-align: left; }
    .all-link { color: var(--honey-text); font-size: 14px; font-weight: 700; text-decoration: underline; text-underline-offset: 3px; }

    /* כל הבעיות באותו גודל ובאותה צורה: שלוש בשורה */
    .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-auto-rows: 1fr; gap: 10px; margin-top: 14px; }
    .cell { display: flex; flex-direction: column; gap: 6px; min-width: 0; transition: opacity 0.25s; }
    .card {
        display: flex; flex-direction: column; align-items: stretch; gap: 6px; min-width: 0; flex: 1;
        padding: 8px 8px 12px; text-align: right; color: var(--fg); cursor: pointer;
        background: var(--surface-2); border: 1px solid var(--line); border-radius: 14px;
        transition: border-color 0.15s, background 0.15s;
    }
    .card:hover, .card:focus-visible { border-color: var(--honey-deep); background: #fff; outline: none; }
    .card.sel { background: #fff; border-color: var(--honey-deep); box-shadow: inset 0 0 0 2px var(--honey-deep); }
    .c-media { position: relative; display: block; flex: none; }
    .c-img { display: block; width: 100%; height: auto; aspect-ratio: 16 / 10; object-fit: cover; border-radius: 9px; }
    .c-price { position: absolute; inset-block-end: 6px; inset-inline-start: 6px; padding: 2px 10px; border-radius: 999px; background: var(--honey); color: var(--honey-ink); font-family: var(--font-display); font-weight: 900; font-size: 16px; line-height: 1.4; box-shadow: 0 2px 6px rgba(10, 45, 80, 0.25); }
    .c-body { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
    .c-cat { display: flex; align-items: center; gap: 6px; padding-inline: 4px; font-size: 12px; font-weight: 700; color: var(--fg-mute); }
    .c-cat .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--c); flex: none; }
    .c-sub { margin-inline-start: auto; font-weight: 500; color: var(--fg-faint); }
    .c-title { padding-inline: 4px; font-size: 13.5px; font-weight: 700; line-height: 1.3; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 5; line-clamp: 5; overflow: hidden; text-wrap: balance; }

    .pledge { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; min-height: 32px; padding-inline: 4px; }
    .pl-l { margin-inline-end: auto; font-size: 12.5px; color: var(--fg-mute); }
    .pl-b { padding: 4px 11px; border-radius: 6px; border: 1px solid var(--line); background: var(--surface-2); font-size: 13px; font-weight: 700; line-height: 1.4; transition: border-color 0.15s, color 0.15s; }
    .pl-b:hover { border-color: var(--honey-deep); color: var(--honey-text); }
    .thanks { font-size: 13px; font-weight: 700; color: var(--ok); }

    .map-sel { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 8px 20px; align-items: center; padding: 14px 4px 4px; }
    .sel-text { min-width: 0; }
    .meta { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; font-size: 13px; color: var(--fg-mute); }
    .meta b { color: var(--fg); }
    .map-sel h3 { font-size: 17px; font-weight: 800; line-height: 1.35; margin-top: 4px; text-wrap: balance; }
    .map-sel p { color: var(--fg-mute); font-size: 14px; margin-top: 4px; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .amt { text-align: left; }
    .big-amt { font-family: var(--font-display); font-weight: 900; color: var(--honey-text); font-size: 34px; line-height: 1; }
    .amt .sub { font-size: 12.5px; color: var(--fg-faint); margin-top: 4px; }
    .acts { grid-column: 1 / -1; display: flex; flex-wrap: wrap; gap: 8px; margin-top: 6px; }

    @container home (min-width: 800px) {
        .c-img { aspect-ratio: 16 / 8; }
        .c-title { font-size: 15.5px; }
    }
    @container home (max-width: 560px) {
        .map-sel { grid-template-columns: minmax(0, 1fr); }
        .amt { text-align: right; }
        /* בנייד: כרטיס בשורה, תמונה בצד */
        .grid { grid-template-columns: minmax(0, 1fr); grid-auto-rows: auto; }
        .card { flex-direction: row; align-items: center; gap: 10px; padding: 8px; }
        .c-media { width: 42%; }
        .c-body { flex: 1; }
        .c-title { font-size: 14px; }
    }
</style>
