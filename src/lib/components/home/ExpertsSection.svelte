<script lang="ts">
    import { EXPERTS, DEMO_DATA, catColor, catShort, fmtShort } from '$lib/homeData';
    import { teamBySlug } from '$lib/teamsData';
</script>

<section class="section" id="experts">
    <div class="inner">
        <div class="sec-head">
            <div>
                <div class="eyebrow">המומחים{#if DEMO_DATA}<span class="demo-tag">נתוני הדגמה</span>{/if}</div>
                <h2 class="title">מי מרים יד הכי הרבה, ומי באמת פותר</h2>
                <p class="lede">הדירוג מבוסס על בעיות שאושרו כפתורות, לא על כמות ההצעות. אפשר לראות לכל מומחה את ההיסטוריה המלאה.</p>
            </div>
        </div>

        <div class="experts">
            {#each EXPERTS as e}
                <article class="ex">
                    <div class="ex-top">
                        <span class="mini-av big" style="--c2:{catColor(e.c)}">{e.ini}</span>
                        <div class="who">
                            <b>{e.n}</b>
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
                    </div>
                </article>
            {/each}
        </div>

        <div class="join">
            <p><b>מומחים בתחום שלכם?</b> מגישים תעודות וניסיון, עוברים אימות, ומתחילים להרים יד על בעיות עם פרס. אין דמי הצטרפות.</p>
            <a class="btn btn-primary" href="/register">הצטרפו כמומחים</a>
        </div>
    </div>
</section>

<style>
    .experts { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
    .ex { background: var(--surface); border: 1px solid var(--line); border-radius: 6px; padding: 18px; display: flex; flex-direction: column; gap: 12px; min-width: 0; }
    .ex-top { display: flex; align-items: center; gap: 12px; }
    .mini-av.big { width: 48px; height: 54px; font-size: 17px; }
    .who { min-width: 0; }
    .who b { display: block; font-weight: 800; font-size: 16px; line-height: 1.25; }
    .who small { color: var(--fg-faint); font-size: 13px; display: flex; align-items: center; gap: 6px; }
    .ex-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; border-top: 1px solid var(--line-soft); padding-top: 12px; }
    .ex-stats b { display: block; font-family: var(--font-display); font-weight: 900; font-size: 22px; line-height: 1.1; }
    .ex-stats b.g { color: var(--honey-text); }
    .ex-stats span { color: var(--fg-faint); font-size: 12.5px; }
    .ex-foot { color: var(--fg-mute); font-size: 13.5px; display: flex; align-items: center; gap: 6px; }
    .ex-foot svg { width: 14px; height: 14px; color: var(--honey-text); }
    .join { margin-top: 20px; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px 24px; border: 1px dashed var(--honey-deep); background: rgba(245, 165, 36, 0.08); border-radius: 8px; padding: 18px 22px; }
    .join p { max-width: 62ch; color: var(--fg-mute); }
    .join p b { color: var(--fg); }

    @container home (max-width: 900px) {
        .experts { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @container home (max-width: 480px) {
        .experts { grid-template-columns: minmax(0, 1fr); }
    }
</style>
