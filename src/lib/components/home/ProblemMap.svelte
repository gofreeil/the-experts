<script lang="ts">
    import type { Problem } from '$lib/problemsStore.svelte';
    import { formatTimeAgo } from '$lib/problemsStore.svelte';
    import { catColor, catShort, fmt, handsOf, backersOf } from '$lib/homeData';
    import { adThenGo } from './nav';
    import FancyHeading from './FancyHeading.svelte';
    import OrnamentDivider from './OrnamentDivider.svelte';

    let {
        wanted,
        recent,
        isVisible,
        selectedId = $bindable(null),
        onshow,
        onmore
    }: {
        wanted: Problem[];
        recent: Problem[];
        isVisible: (p: Problem) => boolean;
        selectedId?: string | null;
        onshow?: (id: string) => void;
        onmore?: () => void;
    } = $props();

    let hoverId = $state<string | null>(null);

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
            <button
                class="card"
                class:dim={!isVisible(p)}
                class:sel={p.id === pickedId}
                type="button"
                style="--c:{catColor(p.category)}"
                aria-label="{p.title}, פרס {p.bounty} שקלים"
                aria-pressed={p.id === pickedId}
                onmouseenter={() => (hoverId = p.id)}
                onfocus={() => (hoverId = p.id)}
                onblur={() => (hoverId = null)}
                onclick={() => (selectedId = p.id)}
            >
                <img class="c-img" src="/images/problems/{artOf(p.category)}.svg" alt="" width="400" height="260" loading="lazy" decoding="async" />
                <span class="c-body">
                    <span class="c-cat"><span class="dot"></span>{catShort(p.category)}</span>
                    <span class="c-title">{p.title}</span>
                </span>
            </button>
        {/each}
    </div>
{/snippet}

<div class="mapbox">
    <FancyHeading title="המבוקשים ביותר" />
    {@render group(wanted, 'המבוקשים ביותר')}

    <OrnamentDivider />

    <FancyHeading title="האחרונות שהועלו" />
    {@render group(recent, 'האחרונות שהועלו')}

    <div class="all-row"><button class="all-link" type="button" onclick={() => onmore?.()}>לכל הבעיות</button></div>

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
                <h3>{shown.title}</h3>
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
                <button class="btn btn-sm btn-ghost" type="button" onclick={() => onshow?.(shown.id)}>הראו בלוח</button>
            </div>
        </div>
    {/if}
</div>

<style>
    .mapbox { background: var(--surface); border: 1px solid var(--line); border-radius: 18px; padding: clamp(12px, 2cqi, 18px); min-width: 0; max-width: 1000px; margin-inline: auto; box-shadow: 0 8px 28px rgba(10, 45, 80, 0.1); }
    .all-row { margin-top: 14px; text-align: left; }
    .all-link { background: none; border: 0; padding: 0; color: var(--honey-text); font-size: 14px; font-weight: 700; text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }

    /* כל הבעיות באותו גודל ובאותה צורה: שלוש בשורה */
    .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-auto-rows: 1fr; gap: 10px; margin-top: 14px; }
    .card {
        display: flex; flex-direction: column; align-items: stretch; gap: 6px; min-width: 0;
        padding: 8px 8px 12px; text-align: right; color: var(--fg); cursor: pointer;
        background: var(--surface-2); border: 1px solid var(--line); border-radius: 14px;
        transition: border-color 0.15s, background 0.15s, opacity 0.25s;
    }
    .card:hover, .card:focus-visible { border-color: var(--honey-deep); background: #fff; outline: none; }
    .card.sel { background: #fff; border-color: var(--honey-deep); box-shadow: inset 0 0 0 2px var(--honey-deep); }
    .card.dim { opacity: 0.25; filter: grayscale(0.7); }
    .c-img { display: block; width: 100%; height: auto; aspect-ratio: 16 / 10; object-fit: cover; border-radius: 9px; flex: none; }
    .c-body { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
    .c-cat { display: inline-flex; align-items: center; gap: 6px; padding-inline: 4px; font-size: 12px; font-weight: 700; color: var(--fg-mute); }
    .c-cat .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--c); flex: none; }
    .c-title { padding-inline: 4px; font-size: 13.5px; font-weight: 700; line-height: 1.3; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 4; line-clamp: 4; overflow: hidden; text-wrap: balance; }

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
        .c-img { width: 42%; }
        .c-body { flex: 1; }
        .c-title { font-size: 14px; }
    }
</style>
