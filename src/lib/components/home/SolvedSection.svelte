<script lang="ts">
    import { FEATURED, LEDGER, SOLVED_COUNT, DEMO_DATA, catColor, catShort, fmt } from '$lib/homeData';

    const ledgerSum = LEDGER.reduce((s, r) => s + r.amt, 0);
</script>

<section class="section alt" id="solved">
    <div class="inner">
        <div class="sec-head">
            <div>
                <div class="eyebrow">פתרונות שהתקבלו{#if DEMO_DATA}<span class="demo-tag">נתוני הדגמה</span>{/if}</div>
                <h2 class="title">בעיות שנסגרו, ומי קיבל על זה כסף</h2>
                <p class="lede">כל שורה כאן היא בעיה שנפתרה, אושרה על ידי מי שהעלה אותה, ושולמה. אפשר ללמוד מהן לפני שמעלים בעיה חדשה.</p>
            </div>
            <a class="btn btn-ghost" href="/problems">לוח הבעיות</a>
        </div>

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

            <div class="ledger" role="table" aria-label="פתרונות אחרונים ששולמו">
                <div class="lg-row lg-head" role="row">
                    <span role="columnheader">הבעיה</span><span role="columnheader">הפותר</span><span role="columnheader">נפתר תוך</span><span role="columnheader" class="end">שולם</span>
                </div>
                {#each LEDGER as r}
                    <div class="lg-row" role="row">
                        <div class="lg-t" role="cell"><b>{r.t}</b><small><span class="dot" style="--c:{catColor(r.c)}"></span>{catShort(r.c)}</small></div>
                        <div class="lg-who" role="cell">{r.who}</div>
                        <div class="lg-days" role="cell">{r.days} ימים</div>
                        <div class="lg-amt" role="cell"><span class="num">{fmt(r.amt)}</span></div>
                    </div>
                {/each}
                <div class="lg-foot"><span>{LEDGER.length} מתוך <b class="num">{SOLVED_COUNT}</b> פתרונות</span><span>סך הכול בשורות האלה: <b class="num">{fmt(ledgerSum)}</b></span></div>
            </div>
        </div>
    </div>
</section>

<style>
    .solved-grid { display: grid; grid-template-columns: minmax(0, 4fr) minmax(0, 8fr); gap: clamp(18px, 3cqi, 36px); align-items: start; }
    .feature { background: var(--surface); border: 1px solid var(--line); border-radius: 8px; padding: clamp(18px, 3cqi, 30px); min-width: 0; }
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

    .ledger { border: 1px solid var(--line); border-radius: 8px; background: var(--surface); overflow: hidden; min-width: 0; }
    .lg-row { display: grid; grid-template-columns: minmax(0, 1fr) 120px 76px 88px; gap: 14px; align-items: center; padding: 14px 20px; border-top: 1px solid var(--line-soft); }
    .lg-row:first-child { border-top: 0; }
    .lg-head { font-size: 12.5px; color: var(--fg-faint); font-weight: 700; letter-spacing: 0.05em; padding-block: 11px; background: var(--surface-2); }
    .lg-head .end { text-align: left; }
    .lg-t { min-width: 0; }
    .lg-t b { display: block; font-weight: 700; font-size: 15px; line-height: 1.35; }
    .lg-t small { display: flex; align-items: center; gap: 7px; margin-top: 2px; color: var(--fg-faint); font-size: 12.5px; }
    .lg-who { font-size: 14px; color: var(--fg-mute); line-height: 1.35; }
    .lg-days { font-size: 14px; color: var(--fg-mute); }
    .lg-amt { font-family: var(--font-display); font-weight: 900; color: var(--honey-text); font-size: 19px; text-align: left; }
    .lg-foot { padding: 14px 20px; border-top: 1px solid var(--line); display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; color: var(--fg-mute); font-size: 14px; }

    @container home (max-width: 860px) {
        .solved-grid { grid-template-columns: minmax(0, 1fr); }
    }
    @container home (max-width: 600px) {
        .lg-head { display: none; }
        .lg-row { grid-template-columns: minmax(0, 1fr) auto; gap: 4px 12px; }
        .lg-days { font-size: 13px; color: var(--fg-faint); }
        .lg-amt { grid-column: 2; grid-row: 1 / span 3; align-self: center; }
    }
</style>
