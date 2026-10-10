<script lang="ts">
    import type { Problem } from '$lib/problemsStore.svelte';
    import { formatTimeAgo } from '$lib/problemsStore.svelte';
    import { layoutTreemap, MORE_ID } from '$lib/treemapLayout';
    import { catColor, catShort, fmt, fmtShort, handsOf, backersOf } from '$lib/homeData';
    import { adThenGo } from './nav';

    let {
        problems,
        isVisible,
        selectedId = $bindable(null),
        onshow,
        onmore
    }: {
        problems: Problem[];
        isVisible: (p: Problem) => boolean;
        selectedId?: string | null;
        onshow?: (id: string) => void;
        onmore?: () => void;
    } = $props();

    let W = $state(0);
    let H = $state(0);
    let hoverId = $state<string | null>(null);

    const tiles = $derived(layoutTreemap(problems.map((p) => ({ id: p.id, value: p.bounty })), W, H, 6));

    const byId = $derived(new Map(problems.map((p) => [p.id, p])));
    const top = $derived([...problems].sort((a, b) => b.bounty - a.bounty)[0] ?? null);
    const pickedId = $derived(selectedId ?? top?.id ?? null);
    const shown = $derived(byId.get(hoverId ?? pickedId ?? '') ?? top);

    type Size = 'lg' | 'md' | 'sm' | 'xs';
    function sizeOf(w: number, h: number): Size {
        if (w >= 170 && h >= 118) return 'lg';
        if (w >= 92 && h >= 72) return 'md';
        if (w >= 64 && h >= 42) return 'sm';
        return 'xs';
    }
    // כמה שורות כותרת נכנסות במשבצת
    function linesOf(size: Size, h: number): number {
        if (size === 'lg') return Math.max(1, Math.min(4, Math.floor((h - 88) / 19)));
        if (size === 'md') return Math.max(1, Math.min(3, Math.floor((h - 58) / 16)));
        return 0;
    }
</script>

<div class="mapbox">
    <div class="map-top">
        <h2>מפת הבעיות הפתוחות</h2>
        <small>גודל המשבצת = גובה הפרס. לחצו על משבצת.</small>
    </div>

    <div class="map-canvas" bind:clientWidth={W} bind:clientHeight={H} role="group" aria-label="מפת הבעיות הפתוחות, גודל כל משבצת לפי גובה הפרס" onmouseleave={() => (hoverId = null)}>
        {#each tiles as t (t.id)}
            {#if t.id === MORE_ID}
                <button class="tile more" type="button" style="left:{t.x.toFixed(1)}px; top:{t.y.toFixed(1)}px; width:{t.w.toFixed(1)}px; height:{t.h.toFixed(1)}px" onclick={() => onmore?.()}>
                    <b>+{t.more}</b>
                    <span>עוד בלוח</span>
                </button>
            {:else}
                {@const p = byId.get(t.id)}
                {#if p}
                    {@const size = sizeOf(t.w, t.h)}
                    <button
                        class="tile {size}"
                        class:dim={!isVisible(p)}
                        class:sel={t.id === pickedId}
                        type="button"
                        style="--c:{catColor(p.category)}; --lines:{linesOf(size, t.h)}; --amt:{Math.max(11, Math.min(19, (t.w - 14) / 3.3)).toFixed(1)}px; left:{t.x.toFixed(1)}px; top:{t.y.toFixed(1)}px; width:{t.w.toFixed(1)}px; height:{t.h.toFixed(1)}px"
                        aria-label="{p.title}, פרס {p.bounty} שקלים"
                        aria-pressed={t.id === pickedId}
                        onmouseenter={() => (hoverId = p.id)}
                        onfocus={() => (hoverId = p.id)}
                        onblur={() => (hoverId = null)}
                        onclick={() => (selectedId = p.id)}
                    >
                        <span class="t-amt"><span class="num">{size === 'lg' || (size === 'md' && t.w >= 124) ? fmt(p.bounty) : fmtShort(p.bounty)}</span></span>
                        {#if size === 'lg' || size === 'md'}<span class="t-title">{p.title}</span>{/if}
                        {#if size === 'lg'}<span class="t-cat">{catShort(p.category)}</span>{/if}
                    </button>
                {/if}
            {/if}
        {/each}
    </div>

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
    .mapbox { background: var(--surface); border: 1px solid var(--line); border-radius: 18px; padding: clamp(12px, 2cqi, 18px); min-width: 0; box-shadow: 0 8px 28px rgba(10, 45, 80, 0.1); }
    .map-top { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 6px 16px; padding: 2px 4px 12px; }
    .map-top h2 { font-size: 16px; font-weight: 800; }
    .map-top small { color: var(--fg-faint); font-size: 13px; }
    .map-canvas { position: relative; width: 100%; height: clamp(380px, 50cqi, 470px); border-radius: 12px; overflow: hidden; }

    .tile {
        position: absolute; display: flex; flex-direction: column; align-items: flex-start; justify-content: flex-start; gap: 4px;
        padding: 10px 12px; text-align: right; border-radius: 12px; overflow: hidden; cursor: pointer; color: var(--fg);
        background: linear-gradient(155deg, color-mix(in srgb, var(--c) 30%, #fff) 0%, color-mix(in srgb, var(--c) 14%, #fff) 100%);
        border: 1px solid color-mix(in srgb, var(--c) 38%, transparent);
        box-shadow: 0 1px 2px rgba(10, 29, 51, 0.06);
        transition: transform 0.18s, box-shadow 0.18s, filter 0.18s, opacity 0.25s;
    }
    .tile:hover, .tile:focus-visible { transform: translateY(-2px); box-shadow: 0 8px 20px color-mix(in srgb, var(--c) 32%, transparent); filter: saturate(1.15); z-index: 2; outline: none; }
    .tile.sel { box-shadow: inset 0 0 0 2.5px var(--c), 0 6px 18px color-mix(in srgb, var(--c) 30%, transparent); background: linear-gradient(155deg, color-mix(in srgb, var(--c) 42%, #fff) 0%, color-mix(in srgb, var(--c) 22%, #fff) 100%); z-index: 1; }
    .tile.dim { opacity: 0.2; filter: grayscale(0.7); }

    .t-amt { font-family: var(--font-display); font-weight: 900; line-height: 1.05; color: color-mix(in srgb, var(--c) 35%, #0a1d33); }
    .t-title { font-weight: 600; color: var(--fg); display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: var(--lines, 2); line-clamp: var(--lines, 2); overflow: hidden; text-wrap: balance; }
    .t-cat { margin-top: auto; display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; color: var(--fg-mute); }
    .t-cat::before { content: ""; width: 8px; height: 8px; border-radius: 50%; background: var(--c); }

    .lg { padding: 14px 16px; border-radius: 16px; }
    .lg .t-amt { font-size: clamp(26px, 3.2cqi, 34px); }
    .lg .t-title { font-size: 15px; line-height: 1.3; }
    .md .t-amt { font-size: 20px; }
    .md .t-title { font-size: 12.5px; line-height: 1.3; }
    .sm { padding: 6px 8px; align-items: center; justify-content: center; border-radius: 10px; }
    .sm .t-amt, .xs .t-amt { font-size: var(--amt); }
    .xs { padding: 3px 4px; align-items: center; justify-content: center; border-radius: 8px; }

    .tile.more { align-items: center; justify-content: center; gap: 2px; background: transparent; border: 2px dashed var(--line); box-shadow: none; color: var(--fg-mute); }
    .tile.more b { font-family: var(--font-display); font-size: 20px; font-weight: 900; color: var(--fg); line-height: 1.1; direction: ltr; }
    .tile.more span { font-size: 12px; font-weight: 600; text-align: center; line-height: 1.2; white-space: nowrap; }
    .tile.more:hover { border-color: var(--honey-deep); color: var(--honey-text); box-shadow: none; filter: none; }

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

    @container home (max-width: 560px) {
        .map-sel { grid-template-columns: minmax(0, 1fr); }
        .amt { text-align: right; }
    }
    @media (prefers-reduced-motion: reduce) {
        .tile:hover, .tile:focus-visible { transform: none; }
    }
</style>
