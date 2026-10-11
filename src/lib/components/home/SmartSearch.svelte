<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import { formatTimeAgo, type Problem } from '$lib/problemsStore.svelte';
    import { catColor, catShort, fmt, handsOf } from '$lib/homeData';
    import { teamBySlug } from '$lib/teamsData';
    import { smartSearch, type SmartResult } from '$lib/smartSearch';
    import { adThenGo } from './nav';

    // חיפוש חכם אחד לבעיות, מומחים ותחומים. מבין סכומים וסינונים בשפה חופשית,
    // מתקן טעויות הקלדה ופריסת מקלדת, ומכיר מילים נרדפות לכל תחום (ראו smartSearch.ts).
    let { problems }: { problems: Problem[] } = $props();

    let q = $state('');
    // /?q=... פותח את הדף עם חיפוש מוכן (קישורים, בדיקות)
    onMount(() => {
        q = page.url.searchParams.get('q') ?? '';
    });
    let root: HTMLElement | undefined = $state();

    const trimmed = $derived(q.trim());
    const res = $derived(trimmed ? smartSearch(trimmed, problems) : null);

    function links(): HTMLAnchorElement[] {
        return root ? Array.from(root.querySelectorAll<HTMLAnchorElement>('.hit')) : [];
    }
    function onKey(e: KeyboardEvent) {
        if (e.key === 'Escape') q = '';
        else if (e.key === 'Enter') {
            e.preventDefault();
            links()[0]?.click();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            links()[0]?.focus();
        }
    }
    function onHitKey(e: KeyboardEvent) {
        const all = links();
        const i = all.indexOf(e.currentTarget as HTMLAnchorElement);
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            all[Math.min(i + 1, all.length - 1)]?.focus();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (i <= 0) root?.querySelector<HTMLInputElement>('input')?.focus();
            else all[i - 1].focus();
        } else if (e.key === 'Escape') {
            q = '';
            root?.querySelector<HTMLInputElement>('input')?.focus();
        }
    }
</script>

{#snippet problemsBlock(res: SmartResult)}
    {#if res.problems.length}
        <div class="grp">
            <h3>בעיות <span class="n">{res.totalProblems}</span></h3>
            {#each res.problems as { p, related } (p.id)}
                <a class="hit" href="/problems/{p.id}" style="--c:{catColor(p.category)}" onclick={(e) => adThenGo(e, `/problems/${p.id}`)} onkeydown={onHitKey}>
                    <span class="h-main">
                        <b>{p.title}</b>
                        <small>
                            <span class="dot" style="--c:{catColor(p.category)}"></span>{catShort(p.category)}
                            <span>· {handsOf(p)} ידיים</span>
                            <span>· {formatTimeAgo(p.createdAt)}</span>
                            {#if related}<span class="rel">קשור לתחום</span>{/if}
                        </small>
                    </span>
                    <span class="h-amt"><span class="num">{fmt(p.bounty)}</span></span>
                </a>
            {/each}
            {#if res.totalProblems > res.problems.length}
                <a class="more" href="/problems">ועוד {res.totalProblems - res.problems.length} בלוח הבעיות</a>
            {/if}
        </div>
    {/if}
{/snippet}

{#snippet expertsBlock(res: SmartResult)}
    {#if res.experts.length}
        <div class="grp">
            <h3>מומחים <span class="n">{res.totalExperts}</span></h3>
            {#each res.experts as { e, related } (e.slug)}
                <a class="hit" href="/experts/{e.slug}" style="--c:{catColor(e.c)}" onkeydown={onHitKey}>
                    <span class="av" style="--c:{catColor(e.c)}">{e.ini}</span>
                    <span class="h-main">
                        <b>{e.n}</b>
                        <small>{e.role}{#if related} <span class="rel">קשור לתחום</span>{/if}</small>
                    </span>
                    <span class="h-amt sm">{e.solved} נפתרו</span>
                </a>
            {/each}
            {#if res.totalExperts > res.experts.length}
                <a class="more" href="/experts">ועוד {res.totalExperts - res.experts.length} ברשימת המומחים</a>
            {/if}
        </div>
    {/if}
{/snippet}

<section class="section search-sec" id="search" bind:this={root}>
    <div class="inner">
        <form class="box" role="search" onsubmit={(e) => e.preventDefault()}>
            <svg class="mag" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" /><path d="M13 13l4 4" /></svg>
            <label class="sr" for="smartQ">חיפוש חכם</label>
            <input id="smartQ" type="search" enterkeyhint="search" autocomplete="off" spellcheck="false" placeholder="חפשו בעיה, מומחה או תחום. למשל: עורך דין מעל 5000" bind:value={q} onkeydown={onKey} />
            {#if q}<button class="clear" type="button" aria-label="נקו חיפוש" onclick={() => (q = '')}>×</button>{/if}
        </form>

        {#if res}
            <div class="panel" aria-live="polite">
                {#if res.parsed.chips.length || res.concepts.length}
                    <div class="understood">
                        <span class="lbl">הבנתי:</span>
                        {#each res.parsed.chips as c}<span class="tag">{c}</span>{/each}
                        {#each res.concepts as t}<span class="tag" style="--c:{catColor(t.slug)}"><span class="dot" style="--c:{catColor(t.slug)}"></span>תחום: {catShort(t.slug)}</span>{/each}
                    </div>
                {/if}

                {#if res.corrected}
                    <p class="fix">
                        {#if res.usedCorrection}
                            מציג תוצאות עבור <b>{res.corrected}</b>. <button type="button" onclick={() => (q = trimmed)}>לחפשו כפי שהוקלד</button>
                        {:else}
                            האם התכוונת ל: <button type="button" onclick={() => (q = res.corrected ?? '')}>{res.corrected}</button>
                        {/if}
                    </p>
                {/if}

                {#if res.expertsFirst}
                    {@render expertsBlock(res)}
                    {@render problemsBlock(res)}
                {:else}
                    {@render problemsBlock(res)}
                    {@render expertsBlock(res)}
                {/if}

                {#if res.teams.length}
                    <div class="teams">
                        <span class="lbl">תחומים:</span>
                        {#each res.teams as t (t.slug)}
                            <a class="chip" href="/categories/{t.slug}" style="--c:{catColor(t.slug)}"><span class="dot" style="--c:{catColor(t.slug)}"></span>{teamBySlug(t.slug)?.name}</a>
                        {/each}
                    </div>
                {/if}

                {#if res.empty}
                    <div class="none">
                        לא נמצא כלום עבור <b>{trimmed}</b>.
                        <a href="#compose">אולי זו בעיה חדשה? אפשר להעלות אותה ולהציב עליה פרס.</a>
                    </div>
                {/if}
            </div>
        {/if}
    </div>
</section>

<style>
    .search-sec { padding-block: clamp(10px, 1.8cqi, 20px); }
    .box { position: relative; display: flex; align-items: center; max-width: 760px; margin-inline: auto; background: var(--surface); border: 1.5px solid var(--line); border-radius: 999px; padding-inline: 18px 12px; transition: border-color 0.15s, box-shadow 0.15s; }
    .box:focus-within { border-color: var(--honey-deep); box-shadow: 0 0 0 3px rgba(245, 165, 36, 0.28); }
    .mag { width: 20px; height: 20px; flex: none; color: var(--honey-text); }
    input { flex: 1; min-width: 0; border: 0; background: transparent; color: var(--fg); font: inherit; font-size: 16px; padding: 12px 10px; outline: none; }
    input::placeholder { color: var(--fg-faint); }
    input::-webkit-search-cancel-button { display: none; }
    .clear { flex: none; width: 28px; height: 28px; border-radius: 50%; border: 0; background: var(--surface-2); color: var(--fg-mute); font-size: 20px; line-height: 1; }
    .clear:hover { color: var(--fg); }
    .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }

    .chip { display: inline-flex; align-items: center; gap: 6px; background: var(--surface); border: 1px solid var(--line); border-radius: 999px; padding: 3px 12px; color: var(--fg-mute); font-size: 13.5px; transition: border-color 0.15s, color 0.15s; }
    .chip:hover { border-color: var(--honey-deep); color: var(--honey-text); }

    .panel { max-width: 760px; margin: 12px auto 0; display: flex; flex-direction: column; gap: 12px; }
    .understood, .teams { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 8px; font-size: 13.5px; }
    .lbl { color: var(--fg-faint); font-weight: 700; }
    .tag { display: inline-flex; align-items: center; gap: 6px; background: color-mix(in srgb, var(--honey) 16%, var(--surface)); border: 1px solid var(--honey-deep); color: var(--honey-text); border-radius: 6px; padding: 2px 10px; font-weight: 700; }
    .fix { color: var(--fg-mute); font-size: 14.5px; }
    .fix button { color: var(--honey-text); font-weight: 800; text-decoration: underline; text-underline-offset: 3px; background: none; border: 0; padding: 0; font: inherit; font-weight: 800; }

    .grp { background: var(--surface); border: 1px solid var(--line); border-radius: 10px; overflow: hidden; }
    .grp h3 { font-size: 13px; font-weight: 800; color: var(--fg-faint); letter-spacing: 0.05em; padding: 8px 16px 6px; }
    .grp h3 .n { color: var(--honey-text); }
    .hit { display: flex; align-items: center; gap: 12px; padding: 9px 16px; border-top: 1px solid var(--line-soft); transition: background 0.12s; }
    .hit:hover, .hit:focus-visible { background: var(--surface-2); outline: none; }
    .h-main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
    .h-main b { font-size: 15.5px; font-weight: 800; line-height: 1.3; text-wrap: balance; }
    .h-main small { display: flex; flex-wrap: wrap; align-items: center; gap: 2px 6px; color: var(--fg-faint); font-size: 12.5px; }
    .h-amt { flex: none; font-family: var(--font-display); font-weight: 900; font-size: 17px; color: var(--honey-text); }
    .h-amt.sm { font-family: inherit; font-size: 12.5px; font-weight: 700; color: var(--fg-faint); }
    .av { flex: none; width: 34px; height: 34px; display: grid; place-items: center; border-radius: 50%; background: color-mix(in srgb, var(--c) 30%, var(--surface)); border: 1.5px solid var(--c); font-weight: 800; font-size: 13px; }
    .rel { background: var(--surface-2); border: 1px dashed var(--line); border-radius: 4px; padding: 0 6px; color: var(--fg-mute); }
    .more { display: block; padding: 8px 16px; border-top: 1px solid var(--line-soft); color: var(--honey-text); font-size: 13.5px; font-weight: 700; text-decoration: underline; text-underline-offset: 3px; }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--c); flex: none; display: inline-block; }
    .none { text-align: center; color: var(--fg-mute); padding: 18px 12px; border: 1px dashed var(--line); border-radius: 10px; }
    .none a { display: block; margin-top: 4px; color: var(--honey-text); font-weight: 700; text-decoration: underline; text-underline-offset: 3px; }
</style>
