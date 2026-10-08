<script lang="ts">
    import type { Problem } from '$lib/problemsStore.svelte';
    import { formatTimeAgo } from '$lib/problemsStore.svelte';
    import { layoutHive, type HivePos } from '$lib/hiveLayout';
    import { catColor, catShort, fmt, fmtShort, handsOf, backersOf } from '$lib/homeData';
    import { adThenGo } from './nav';

    let {
        problems,
        isVisible,
        selectedId = $bindable(null),
        onshow
    }: {
        problems: Problem[];
        isVisible: (p: Problem) => boolean;
        selectedId?: string | null;
        onshow?: (id: string) => void;
    } = $props();

    let W = $state(0);
    let H = $state(0);
    let hoverId = $state<string | null>(null);

    const memory = new Map<string, HivePos>();
    let lastSize: { w: number; h: number } | null = null;

    const nodes = $derived.by(() => {
        if (!W || !H) return [];
        const res = layoutHive(problems.map((p) => ({ id: p.id, value: p.bounty })), W, H, memory, lastSize);
        lastSize = { w: W, h: H };
        return res;
    });

    const byId = $derived(new Map(problems.map((p) => [p.id, p])));
    const top = $derived([...problems].sort((a, b) => b.bounty - a.bounty)[0] ?? null);
    const pickedId = $derived(selectedId ?? top?.id ?? null);
    const shown = $derived(byId.get(hoverId ?? pickedId ?? '') ?? top);

    // שורות התווית בתוך תא גדול: עד שתי שורות, חיתוך במילה
    function labelLines(title: string, r: number): string[] {
        const maxChars = Math.floor((r * 1.55) / 6.3);
        const lines: string[] = [];
        let cur = '';
        for (const w of title.split(' ')) {
            if (lines.length >= 2) break;
            if ((cur + ' ' + w).trim().length > maxChars) {
                if (cur) lines.push(cur);
                cur = w;
            } else {
                cur = (cur + ' ' + w).trim();
            }
        }
        if (lines.length < 2 && cur) lines.push(cur);
        if (lines.join(' ').length < title.length && lines.length) lines[lines.length - 1] += '…';
        return lines;
    }
</script>

<div class="hivebox">
    <div class="hive-top">
        <h2>מפת הבעיות הפתוחות</h2>
        <small>גודל התא = גובה הפרס. לחצו על תא.</small>
    </div>

    <div class="hive-canvas" bind:clientWidth={W} bind:clientHeight={H} role="group" aria-label="מפת כוורת של הבעיות הפתוחות, גודל כל תא לפי גובה הפרס" onmouseleave={() => (hoverId = null)}>
        {#if W && H}
            <svg viewBox="0 0 {W} {H}" width={W} height={H}>
                {#each [...nodes].sort((a, b) => b.r - a.r) as n (n.id)}
                    {@const p = byId.get(n.id)}
                    {#if p}
                        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
                        <g
                            class="hg"
                            class:dim={!isVisible(p)}
                            class:sel={n.id === pickedId}
                            style="--c:{catColor(p.category)}; transform: translate({n.x.toFixed(1)}px, {n.y.toFixed(1)}px)"
                            role="button"
                            tabindex="0"
                            aria-label="{p.title}, פרס {p.bounty} שקלים"
                            onmouseenter={() => (hoverId = p.id)}
                            onfocus={() => (hoverId = p.id)}
                            onblur={() => (hoverId = null)}
                            onclick={() => (selectedId = p.id)}
                            onkeydown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    selectedId = p.id;
                                }
                            }}
                        >
                            <polygon class="hex" points="0,-1 0.866,-0.5 0.866,0.5 0,1 -0.866,0.5 -0.866,-0.5" style="transform: scale({n.r.toFixed(1)})" />
                            {#if n.r >= 52}
                                {@const lines = labelLines(p.title, n.r)}
                                <text class="t-amt" y={-n.r * 0.1} font-size={Math.max(20, Math.min(30, n.r * 0.3))}>{fmt(p.bounty)}</text>
                                {#each lines as l, i}
                                    <text class="t-sub" y={n.r * 0.2 + i * 14}>{l}</text>
                                {/each}
                            {:else if n.r >= 20}
                                <text class="t-amt" y={n.r * 0.14} font-size={Math.max(11, Math.min(16, n.r * 0.5))}>{fmtShort(p.bounty)}</text>
                            {/if}
                        </g>
                    {/if}
                {/each}
            </svg>
        {/if}
    </div>

    {#if shown}
        <div class="hive-sel" aria-live="polite">
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
    .hivebox { background: linear-gradient(180deg, var(--surface) 0%, var(--hive-end) 100%); border: 1px solid var(--line); border-radius: 8px; padding: clamp(12px, 2cqi, 18px); min-width: 0; }
    .hive-top { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px 16px; padding: 2px 4px 12px; }
    .hive-top h2 { font-size: 16px; font-weight: 800; }
    .hive-top small { color: var(--fg-faint); font-size: 13px; }
    .hive-canvas { position: relative; width: 100%; height: clamp(360px, 52cqi, 500px); background: radial-gradient(circle at 50% 50%, rgba(245, 165, 36, 0.09), transparent 60%), var(--bg); border: 1px solid var(--line-soft); border-radius: 4px; overflow: hidden; }
    .hive-canvas svg { display: block; width: 100%; height: 100%; }

    .hg { cursor: pointer; outline: none; transition: transform 0.55s cubic-bezier(0.3, 0.8, 0.3, 1), opacity 0.25s; }
    .hg .hex { fill: color-mix(in srgb, var(--c) 20%, var(--hexbase)); stroke: var(--c); stroke-width: 1.5; vector-effect: non-scaling-stroke; stroke-linejoin: round; transition: transform 0.55s cubic-bezier(0.3, 0.8, 0.3, 1), fill 0.2s, filter 0.2s; }
    .hg:hover .hex, .hg:focus-visible .hex, .hg.sel .hex { fill: color-mix(in srgb, var(--c) 42%, var(--hexbase)); filter: drop-shadow(0 0 10px color-mix(in srgb, var(--c) 60%, transparent)); }
    .hg.sel .hex { stroke-width: 3; }
    .hg.dim { opacity: 0.16; }
    .hg text { fill: var(--fg); pointer-events: none; text-anchor: middle; }
    .hg .t-amt { font-family: var(--font-display); font-weight: 900; }
    .hg .t-sub { font-size: 11px; font-weight: 500; fill: color-mix(in srgb, var(--fg) 80%, transparent); }

    .hive-sel { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 8px 20px; align-items: center; padding: 14px 4px 4px; }
    .sel-text { min-width: 0; }
    .meta { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; font-size: 13px; color: var(--fg-mute); }
    .meta b { color: var(--fg); }
    .hive-sel h3 { font-size: 17px; font-weight: 800; line-height: 1.35; margin-top: 4px; text-wrap: balance; }
    .hive-sel p { color: var(--fg-mute); font-size: 14px; margin-top: 4px; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .amt { text-align: left; }
    .big-amt { font-family: var(--font-display); font-weight: 900; color: var(--honey-text); font-size: 34px; line-height: 1; }
    .amt .sub { font-size: 12.5px; color: var(--fg-faint); margin-top: 4px; }
    .acts { grid-column: 1 / -1; display: flex; flex-wrap: wrap; gap: 8px; margin-top: 6px; }

    @container home (max-width: 560px) {
        .hive-sel { grid-template-columns: minmax(0, 1fr); }
        .amt { text-align: right; }
    }
</style>
