<script lang="ts">
    import { FEATURED, LEDGER, CATS, DEMO_DATA, catColor, fmt } from '$lib/homeData';
    import LedgerTable from './LedgerTable.svelte';
    import SectionHead from './SectionHead.svelte';

    // preview = גרסת דף הבית (כרטיס מרכזי + 4 שורות). בדף המלא יש את כל השורות וסינון לפי תחום.
    let { preview = false }: { preview?: boolean } = $props();

    let cat = $state('all');
    const rows = $derived(preview ? LEDGER.slice(0, 4) : LEDGER.filter((r) => cat === 'all' || r.c === cat));
</script>

<section class="section alt" id="solved">
    <div class="inner">
        {#if preview}
            <SectionHead title="בעיות שנסגרו, ומי קיבל על זה כסף" lede="כל שורה כאן היא בעיה שנפתרה, אושרה על ידי מי שהעלה אותה, ושולמה. אפשר ללמוד מהן לפני שמעלים בעיה חדשה." demo />
        {:else if DEMO_DATA}
            <p class="demo-line"><span class="demo-tag" style="margin:0">נתוני הדגמה</span></p>
        {/if}

        <div class="solved-grid">
            <article class="feature">
                <span class="stamp">
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 10.5l4 4 8-9" /></svg>נפתר
                </span>
                <h3>{FEATURED.title}</h3>
                <div class="ba">
                    <div><small>הבעיה</small><p>{FEATURED.problem}</p></div>
                    <div><small>הפתרון</small><p>{FEATURED.solution}</p></div>
                </div>
                <blockquote>״{FEATURED.quote}״<footer>{FEATURED.by}</footer></blockquote>
                <div class="feat-meta">
                    <div><b><span class="num">{fmt(FEATURED.paid)}</span></b><span>שולם למומחית</span></div>
                    <div><b>{FEATURED.days} יום</b><span>מהעלאה עד אישור</span></div>
                    <div><b><span class="num">{FEATURED.rating}</span></b><span>דירוג</span></div>
                </div>
            </article>

            <div class="right">
                {#if !preview}
                    <div class="chips" role="group" aria-label="סינון לפי תחום">
                        <button class="chip" type="button" aria-pressed={cat === 'all'} onclick={() => (cat = 'all')}>הכל</button>
                        {#each CATS as c}
                            <button class="chip" type="button" style="--c:{catColor(c.slug)}" aria-pressed={cat === c.slug} onclick={() => (cat = cat === c.slug ? 'all' : c.slug)}>
                                <span class="dot" style="--c:{catColor(c.slug)}"></span>{c.short}
                            </button>
                        {/each}
                    </div>
                {/if}
                <LedgerTable {rows} />
            </div>
        </div>
    </div>
</section>

<style>
    .demo-line { margin-bottom: 14px; }
    .solved-grid { display: grid; grid-template-columns: minmax(0, 4fr) minmax(0, 8fr); gap: clamp(18px, 3cqi, 36px); align-items: start; }
    .right { min-width: 0; display: flex; flex-direction: column; gap: 14px; }
    .chips { display: flex; flex-wrap: wrap; gap: 8px; }
    .feature { min-width: 0; }
    .stamp { display: inline-flex; align-items: center; gap: 8px; color: var(--ok); border: 2px solid var(--ok); border-radius: 4px; padding: 3px 12px; font-family: var(--font-display); font-weight: 900; font-size: 18px; transform: rotate(-2deg); letter-spacing: 0.06em; }
    .stamp svg { width: 18px; height: 18px; }
    .feature h3 { font-family: var(--font-display); font-weight: 900; font-size: 26px; line-height: 1.2; margin-top: 18px; text-wrap: balance; }
    .ba { display: grid; gap: 12px; margin-top: 18px; }
    .ba > div { border-top: 1px solid var(--line-soft); padding-top: 10px; }
    .ba small { display: block; color: var(--fg-faint); font-size: 12.5px; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 3px; }
    .ba p { color: var(--fg); font-size: 15px; text-wrap: pretty; }
    blockquote { margin: 20px 0 0; padding: 0; color: var(--fg-mute); font-size: 15px; }
    blockquote footer { margin-top: 8px; color: var(--fg-faint); font-size: 13px; }
    .feat-meta { display: flex; flex-wrap: wrap; gap: 18px 28px; margin-top: 20px; padding-top: 16px; border-top: 1px dashed var(--line); }
    .feat-meta b { display: block; font-family: var(--font-display); font-weight: 900; font-size: 24px; color: var(--honey-text); line-height: 1.1; }
    .feat-meta span { font-size: 12.5px; color: var(--fg-faint); }

    @container home (max-width: 860px) {
        .solved-grid { grid-template-columns: minmax(0, 1fr); }
    }
    @container home (max-width: 520px) {
        .demo-line { margin-bottom: 8px; }
        .stamp { font-size: 15px; padding: 2px 10px; }
        .feature h3 { font-size: 20px; margin-top: 10px; }
        .ba { gap: 8px; margin-top: 10px; }
        .ba > div { padding-top: 6px; }
        .ba p, blockquote { font-size: 14px; }
        blockquote { margin-top: 10px; }
        .feat-meta { gap: 8px 20px; margin-top: 12px; padding-top: 10px; }
        .feat-meta b { font-size: 19px; }
        .right { gap: 8px; }
        /* סינון בשורה אחת שנגללת הצידה */
        .chips { flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; margin-inline: -16px; padding-inline: 16px; }
        .chips::-webkit-scrollbar { display: none; }
        .chips .chip { flex: none; }
    }
</style>
