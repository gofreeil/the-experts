<script lang="ts">
    import { page } from '$app/state';
    import { CATS, DEMO_DATA, catColor, catShort, fmtShort } from '$lib/homeData';
    import { EXPERTS } from '$lib/expertsData';
    import { teamBySlug } from '$lib/teamsData';
    import SectionHead from './SectionHead.svelte';

    // preview = גרסת דף הבית (4 מומחים). הדף המלא מציג את כולם עם סינון לפי תחום (?cat=...).
    let { preview = false }: { preview?: boolean } = $props();

    const fromUrl = page.url.searchParams.get('cat');
    let cat = $state(fromUrl && CATS.some((c) => c.slug === fromUrl) ? fromUrl : 'all');
    const list = $derived(preview ? EXPERTS.slice(0, 4) : EXPERTS.filter((e) => cat === 'all' || e.c === cat));
</script>

<section class="section" id="experts">
    <div class="inner">
        {#if preview}
            <SectionHead title="המומחים המדורגים ביותר" lede="הדירוג מבוסס על בעיות שאושרו כפתורות, לא על כמות ההצעות. אפשר לראות לכל מומחה את ההיסטוריה המלאה." demo />
        {:else}
            <div class="toolbar">
                <div class="chips" role="group" aria-label="סינון לפי תחום">
                    <button class="chip" type="button" aria-pressed={cat === 'all'} onclick={() => (cat = 'all')}>הכל <span class="num cnt">{EXPERTS.length}</span></button>
                    {#each CATS as c}
                        <button class="chip" type="button" style="--c:{catColor(c.slug)}" aria-pressed={cat === c.slug} onclick={() => (cat = cat === c.slug ? 'all' : c.slug)}>
                            <span class="dot" style="--c:{catColor(c.slug)}"></span>{c.short}
                        </button>
                    {/each}
                </div>
                {#if DEMO_DATA}<span class="demo-tag" style="margin:0">נתוני הדגמה</span>{/if}
            </div>
            <p class="rank-note">הדירוג מבוסס על בעיות שאושרו כפתורות, לא על כמות ההצעות.</p>
        {/if}

        <div class="experts">
            {#each list as e}
                <article class="ex">
                    <div class="ex-top">
                        <span class="mini-av big" style="--c2:{catColor(e.c)}">{e.ini}</span>
                        <div class="who">
                            <b><a class="cv-link" href="/experts/{e.slug}">{e.n}</a></b>
                            <small><span class="dot" style="--c:{catColor(e.c)}"></span>{teamBySlug(e.c)?.name ?? catShort(e.c)}</small>
                        </div>
                    </div>
                    <div class="ex-stats">
                        <div><b class="num">{e.solved}</b><span>בעיות שנפתרו</span></div>
                        <div><b class="g"><span class="num">{fmtShort(e.earned)}</span></b><span>הרוויח בכוורת</span></div>
                        <div><b class="num">{e.rate}</b><span>דירוג</span></div>
                        <div><b>{e.rt}</b><span>זמן תגובה</span></div>
                    </div>
                    <div class="ex-foot">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 11V6a2 2 0 0 0-4 0M14 10V4a2 2 0 0 0-4 0v2M10 10.5V6a2 2 0 0 0-4 0v8" /><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-6-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" /></svg>
                        יד מורמת כרגע על {e.open} בעיות
                        <span class="cv">לרזומה ←</span>
                    </div>
                </article>
            {:else}
                <div class="empty">אין עדיין מומחים בתחום הזה בדוגמה.</div>
            {/each}
        </div>

        <div class="join">
            <p><b>מומחים בתחום שלכם?</b> מגישים תעודות וניסיון, עוברים אימות, ומתחילים להרים יד על בעיות עם פרס. אין דמי הצטרפות.</p>
            <a class="btn btn-primary" href="/register">הצטרפו כמומחים</a>
        </div>
    </div>
</section>

<style>
    .toolbar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px 16px; }
    .chips { display: flex; flex-wrap: wrap; gap: 8px; min-width: 0; }
    .cnt { color: var(--fg-faint); }
    .rank-note { color: var(--fg-mute); font-size: 14px; margin: 10px 0 18px; }
    .empty { grid-column: 1 / -1; text-align: center; color: var(--fg-mute); padding: 32px 0; border: 1px dashed var(--line); border-radius: 6px; }
    .experts { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
    .ex { position: relative; background: var(--surface); border: 1px solid var(--line); border-radius: 6px; padding: 18px; display: flex; flex-direction: column; gap: 12px; min-width: 0; transition: border-color 0.2s; }
    .ex:hover { border-color: var(--honey-deep); }
    .cv-link::after { content: ""; position: absolute; inset: 0; border-radius: 6px; }
    .cv { margin-inline-start: auto; color: var(--honey-text); font-weight: 700; }
    .ex-top { display: flex; align-items: center; gap: 12px; }
    .mini-av.big { width: 48px; height: 54px; font-size: 17px; }
    .who { min-width: 0; }
    .who b { display: block; font-weight: 800; font-size: 16px; line-height: 1.25; }
    .who small { color: var(--fg-faint); font-size: 13px; display: flex; align-items: center; gap: 6px; }
    .ex-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; border-top: 1px solid var(--line-soft); padding-top: 12px; }
    .ex-stats b { display: block; font-family: var(--font-display); font-weight: 900; font-size: 22px; line-height: 1.1; }
    .ex-stats b.g { color: var(--honey-text); }
    .ex-stats > div > span { color: var(--fg-faint); font-size: 12.5px; }
    .ex-foot { color: var(--fg-mute); font-size: 13.5px; display: flex; align-items: center; gap: 6px; }
    .ex-foot svg { width: 14px; height: 14px; color: var(--honey-text); }
    .join { margin-top: 20px; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px 24px; border: 1px dashed var(--honey-deep); background: rgba(245, 165, 36, 0.08); border-radius: 8px; padding: 18px 22px; }
    .join p { max-width: 62ch; color: var(--fg-mute); }
    .join p b { color: var(--fg); }

    @container home (max-width: 900px) {
        .experts { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @container home (max-width: 480px) {
        .experts { grid-template-columns: minmax(0, 1fr); gap: 8px; }
        /* סינון בשורה אחת שנגללת הצידה, במקום תשעה צ'יפים שמתפרסים על כמה שורות */
        .toolbar { gap: 6px; }
        .chips { flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; flex: 1 1 100%; margin-inline: -16px; padding-inline: 16px; }
        .chips::-webkit-scrollbar { display: none; }
        .chips .chip { flex: none; }
        .rank-note { margin: 6px 0 10px; font-size: 13px; }
        /* כרטיס מומחה קצר: ארבעת הנתונים בשורה אחת */
        .ex { padding: 10px 12px; gap: 8px; }
        .mini-av.big { width: 38px; height: 42px; font-size: 14px; }
        .ex-stats { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 4px; padding-top: 8px; }
        .ex-stats b { font-size: 17px; }
        .ex-stats > div > span { font-size: 11.5px; line-height: 1.25; display: block; }
        .ex-foot { font-size: 12.5px; }
        .join { margin-top: 12px; padding: 12px 14px; gap: 10px; }
        .join .btn { width: 100%; }
    }
</style>
