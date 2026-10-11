<script lang="ts">
    import { RECS, THREADS, DEMO_DATA, catColor, catShort } from '$lib/homeData';
    import SectionHead from './SectionHead.svelte';

    // preview = גרסת דף הבית (2 מפגשים ו-3 דיונים). הדף המלא מציג הכול.
    // headTitle = כותרת נושא בדף הבית (בעיצוב חכמי העדה).
    let { preview = false, headTitle = '' }: { preview?: boolean; headTitle?: string } = $props();

    const recs = $derived(preview ? RECS.slice(0, 2) : RECS);
    const threads = $derived(preview ? THREADS.slice(0, 3) : THREADS);
</script>

<section class="section alt" id="archive">
    <div class="inner">
        {#if headTitle}<SectionHead title={headTitle} />{/if}
        <div class="arch">
        <div class="col">
            <div class="sub-h"><h3>ארכיון מפגשים{#if DEMO_DATA}<span class="demo-tag">נתוני הדגמה</span>{/if}</h3></div>
            {#each recs as r}
                <article class="rec">
                    <div class="thumb" style="--c:{catColor(r.c)}">
                        <span class="play"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 1l11 6-11 6z" /></svg></span>
                        <span class="dur">{r.dur}</span>
                    </div>
                    <div class="rec-body">
                        <div class="rec-n">{r.n}</div>
                        <h4>{r.t}</h4>
                        <div class="rec-m"><span>{r.date}</span><span>{r.att} משתתפים</span></div>
                        <p class="rec-d"><b>{r.dec} החלטות.</b> {r.d}</p>
                    </div>
                </article>
            {/each}
        </div>

        <div class="col">
            <div class="sub-h"><h3>דיונים פעילים{#if DEMO_DATA}<span class="demo-tag">נתוני הדגמה</span>{/if}</h3></div>
            {#each threads as t}
                <article class="thread">
                    <b>{t.t}</b>
                    <small>
                        <span class="tag-c"><span class="dot" style="--c:{catColor(t.c)}"></span>{catShort(t.c)}</span>
                        <span>{t.last}</span>
                        {#if t.hot}<span class="hot">דיון חם</span>{/if}
                    </small>
                    <div class="replies"><b class="num">{t.r}</b><span>תגובות</span></div>
                </article>
            {/each}
        </div>
        </div>
    </div>
</section>

<style>
    .arch { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); gap: clamp(20px, 3cqi, 40px); align-items: start; }
    .col { min-width: 0; }
    .sub-h { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; margin-bottom: 14px; }
    .sub-h h3 { font-size: 20px; font-weight: 800; }
    .rec { display: grid; grid-template-columns: 168px minmax(0, 1fr); gap: 16px; padding: 14px 0; border-top: 1px solid var(--line-soft); align-items: center; }
    .rec:first-of-type { border-top: 0; padding-top: 0; }
    .thumb { position: relative; aspect-ratio: 16 / 10; max-width: 100%; border-radius: 4px; overflow: hidden; background: linear-gradient(135deg, color-mix(in srgb, var(--c) 45%, #0a1d33), #0a1d33); border: 1px solid var(--line); display: grid; place-items: center; }
    .thumb::before { content: ""; position: absolute; inset: 0; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 56 97'%3E%3Cpath d='M28 66L0 50V16L28 0l28 16v34L28 66zm0 0v31M0 82l28 15 28-15' fill='none' stroke='%23ffffff' stroke-opacity='.1' stroke-width='2'/%3E%3C/svg%3E"); }
    .play { position: relative; width: 42px; height: 42px; border-radius: 50%; background: rgba(6, 22, 40, 0.75); display: grid; place-items: center; }
    .play svg { width: 14px; height: 14px; fill: #ffc65c; transform: scaleX(-1); }
    .dur { position: absolute; bottom: 6px; inset-inline-start: 6px; color: #fff; background: rgba(6, 22, 40, 0.85); font-size: 12px; padding: 1px 6px; border-radius: 3px; font-variant-numeric: tabular-nums; direction: ltr; }
    .rec-body { min-width: 0; }
    .rec-n { color: var(--honey-text); font-size: 12.5px; font-weight: 700; letter-spacing: 0.04em; }
    h4 { font-size: 17px; font-weight: 800; line-height: 1.3; margin: 2px 0 6px; text-wrap: balance; }
    .rec-m { display: flex; flex-wrap: wrap; gap: 4px 14px; color: var(--fg-faint); font-size: 13.5px; }
    .rec-d { margin-top: 6px; color: var(--fg-mute); font-size: 14px; text-wrap: pretty; }
    .rec-d b { color: var(--ok); font-weight: 700; }

    .thread { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 4px 14px; padding: 13px 0; border-top: 1px solid var(--line-soft); align-items: center; }
    .thread:first-of-type { border-top: 0; padding-top: 0; }
    .thread > b { font-weight: 700; font-size: 15.5px; line-height: 1.35; }
    .thread small { grid-column: 1; color: var(--fg-faint); font-size: 13px; display: flex; flex-wrap: wrap; align-items: center; gap: 4px 10px; }
    .tag-c { display: inline-flex; align-items: center; gap: 7px; font-weight: 600; color: var(--fg-mute); }
    .replies { grid-column: 2; grid-row: 1 / span 2; text-align: center; min-width: 46px; }
    .replies b { display: block; font-family: var(--font-display); font-weight: 900; font-size: 22px; color: var(--fg); line-height: 1.1; }
    .replies span { font-size: 12px; color: var(--fg-faint); }
    .hot { color: var(--warn); font-weight: 700; }

    @container home (max-width: 860px) {
        .arch { grid-template-columns: minmax(0, 1fr); }
    }
    @container home (max-width: 520px) {
        /* בנייד: התמונה הממוזערת קטנה בצד הטקסט, לא בלוק שלם מעליו */
        .rec { grid-template-columns: 96px minmax(0, 1fr); gap: 10px; padding: 10px 0; }
        .thumb { max-width: none; }
        .play { width: 30px; height: 30px; }
        .play svg { width: 11px; height: 11px; }
        .dur { bottom: 3px; inset-inline-start: 3px; font-size: 10.5px; padding: 0 4px; }
        h4 { font-size: 15px; margin: 0 0 3px; }
        .rec-m { font-size: 12.5px; gap: 2px 10px; }
        .rec-d { font-size: 13px; margin-top: 3px; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .sub-h { margin-bottom: 8px; }
        .sub-h h3 { font-size: 18px; }
        .thread { padding: 9px 0; }
        .thread > b { font-size: 14.5px; }
    }
</style>
