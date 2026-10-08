<script lang="ts">
    import { RECS, THREADS, DEMO_DATA, catColor, catShort } from '$lib/homeData';
</script>

<section class="section alt" id="archive">
    <div class="inner arch">
        <div class="col">
            <div class="sub-h"><h3>ארכיון מפגשים{#if DEMO_DATA}<span class="demo-tag">נתוני הדגמה</span>{/if}</h3></div>
            {#each RECS as r}
                <article class="rec">
                    <div class="thumb" style="--c:{catColor(r.c)}">
                        <span class="play hex-clip"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 1l11 6-11 6z" /></svg></span>
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
            {#each THREADS as t}
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
    .play { position: relative; width: 38px; height: 42px; background: rgba(6, 22, 40, 0.75); display: grid; place-items: center; }
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
    .replies span { font-size: 11.5px; color: var(--fg-faint); }
    .hot { color: var(--warn); font-weight: 700; }

    @container home (max-width: 860px) {
        .arch { grid-template-columns: minmax(0, 1fr); }
    }
    @container home (max-width: 520px) {
        .rec { grid-template-columns: minmax(0, 1fr); }
        .thumb { max-width: 260px; }
    }
</style>
