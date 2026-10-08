<script lang="ts">
    import { goto } from '$app/navigation';
    import type { Problem, ProblemType } from '$lib/problemsStore.svelte';
    import { CATS, catColor, catMeta, fmt, fmtShort } from '$lib/homeData';
    import { teamBySlug } from '$lib/teamsData';

    let { problems }: { problems: Problem[] } = $props();

    let title = $state('');
    let category = $state('law');
    let type = $state<ProblemType>('community');
    let slider = $state(40);
    let hint = $state('');

    // הסליידר לוגריתמי: 100 עד 50,000 ש״ח
    const bounty = $derived.by(() => {
        const raw = 100 * Math.pow(500, slider / 100);
        const step = raw < 1000 ? 50 : raw < 5000 ? 100 : raw < 20000 ? 500 : 1000;
        return Math.max(100, Math.round(raw / step) * step);
    });

    const meta = $derived(catMeta(category));
    const rank = $derived(problems.filter((p) => p.bounty > bounty).length + 1);
    const sameCat = $derived(problems.filter((p) => p.category === category));
    const avg = $derived(sameCat.length ? Math.round(sameCat.reduce((s, p) => s + p.bounty, 0) / sameCat.length / 50) * 50 : 0);
    const maxB = $derived(problems.reduce((m, p) => Math.max(m, p.bounty), 1));
    const RMAX = 80;
    const R = $derived(Math.max(16, RMAX * Math.sqrt(bounty / maxB)));
    const hexPts = (r: number) => [-90, -30, 30, 90, 150, 210].map((a) => `${(r * Math.cos((a * Math.PI) / 180)).toFixed(1)},${(r * Math.sin((a * Math.PI) / 180)).toFixed(1)}`).join(' ');

    function submit(e: SubmitEvent) {
        e.preventDefault();
        if (title.trim().length < 5) {
            hint = 'כתבו במשפט קצר מה הבעיה (לפחות כמה מילים).';
            return;
        }
        hint = '';
        // ממשיכים לטופס המלא, עם מה שכבר מילאנו
        const q = new URLSearchParams({ title: title.trim(), category, type, bounty: String(bounty) });
        goto(`/problems/new?${q.toString()}`);
    }
</script>

<section class="section alt" id="compose">
    <div class="inner">
        <div class="sec-head">
            <div>
                <div class="eyebrow">העלו בעיה</div>
                <h2 class="title">שתי דקות, והתא שלכם בכוורת</h2>
                <p class="lede">הזיזו את הפרס וראו איך הבעיה שלכם מדורגת מול כל הבעיות הפתוחות.</p>
            </div>
        </div>

        <div class="composer">
            <form class="form" onsubmit={submit} novalidate>
                <div class="fld">
                    <label for="cTitle">מה הבעיה, במשפט אחד?</label>
                    <input type="text" id="cTitle" maxlength="120" placeholder="למשל: צריך עורך דין לבדוק חוזה שכירות" autocomplete="off" bind:value={title} />
                    <div class="hint" role="alert">{hint}</div>
                </div>

                <div class="two">
                    <div class="fld">
                        <label for="cCat">תחום</label>
                        <select id="cCat" bind:value={category}>
                            {#each CATS as c}
                                <option value={c.slug}>{teamBySlug(c.slug)?.name ?? c.short}</option>
                            {/each}
                        </select>
                    </div>
                    <div class="fld">
                        <span class="lab" id="visLab">מי רואה</span>
                        <div class="vis" role="group" aria-labelledby="visLab">
                            <button type="button" aria-pressed={type === 'community'} onclick={() => (type = 'community')}><b>ציבורית</b><small>כולם רואים ויכולים להצטרף לפרס</small></button>
                            <button type="button" aria-pressed={type === 'individual'} onclick={() => (type = 'individual')}><b>פרטית</b><small>רק מומחים מאומתים</small></button>
                        </div>
                    </div>
                </div>

                <div class="fld">
                    <div class="range-row"><label for="cBounty" style="margin:0">הפרס</label><span class="big-amt"><span class="num">{fmt(bounty)}</span></span></div>
                    <input type="range" id="cBounty" min="0" max="100" step="1" bind:value={slider} />
                    <div class="range-scale"><span>₪100</span><span>₪50,000</span></div>
                </div>

                <div class="formfoot">
                    <button class="btn btn-primary" type="submit">המשיכו לפרטי הבעיה</button>
                    <span class="note">עוד שלושה שדות קצרים ומפרסמים.</span>
                </div>
            </form>

            <aside class="preview" aria-label="תצוגה מקדימה">
                <h3>ככה תיראה הבעיה בכוורת</h3>
                <div class="pv-hex">
                    <svg viewBox="0 0 300 210" aria-hidden="true">
                        <g transform="translate(150,105)">
                            <polygon points={hexPts(RMAX)} class="ghost" />
                            <text y={RMAX + 14} class="cap">הגדולה בלוח {fmtShort(maxB)}</text>
                            <polygon points={hexPts(R)} class="mine" style="fill:{catColor(category)}; stroke:{catColor(category)}" />
                            <text y={R > 28 ? 7 : -R - 8} class="amt" font-size={R > 28 ? Math.min(24, 11 + R / 5) : 14}>{fmtShort(bounty)}</text>
                        </g>
                    </svg>
                </div>
                <ul class="pv-list">
                    <li><span>דירוג בין הבעיות הפתוחות</span><b>מקום {rank} מתוך {problems.length + 1}</b></li>
                    <li><span>פרס ממוצע בתחום</span><b>{avg ? fmt(avg) : 'עוד אין נתון'}</b></li>
                    <li><span>זמן פתרון בתחום</span><b>{meta.days} ימים בחציון</b></li>
                    <li><span>מומחים בתחום שיקבלו התראה</span><b>{meta.experts} מומחים</b></li>
                </ul>
                <p class="pv-note">הדירוג והממוצעים מחושבים לפי הבעיות שמופיעות בלוח עכשיו.</p>
            </aside>
        </div>
    </div>
</section>

<style>
    .composer { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); border: 1px solid var(--line); border-radius: 10px; background: var(--surface); overflow: hidden; }
    .form { padding: clamp(18px, 3.4cqi, 36px); display: flex; flex-direction: column; gap: 18px; min-width: 0; }
    .fld label, .fld .lab { display: block; font-size: 14px; font-weight: 700; margin-bottom: 7px; }
    .fld input[type='text'], .fld select { width: 100%; background: var(--surface-2); color: var(--fg); border: 1px solid var(--line); border-radius: 6px; padding: 12px 14px; font: inherit; font-size: 16px; }
    .fld input[type='text']:focus, .fld select:focus { outline: 2px solid var(--honey); outline-offset: 1px; border-color: var(--honey-deep); }
    .hint { color: var(--bad); font-size: 13px; margin-top: 6px; }
    .hint:empty { display: none; }
    .two { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 14px; }
    .vis { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .vis button { text-align: right; background: var(--surface-2); border: 1px solid var(--line); border-radius: 6px; padding: 11px 14px; display: flex; flex-direction: column; gap: 2px; }
    .vis button b { font-size: 15px; }
    .vis button small { color: var(--fg-faint); font-size: 12.5px; line-height: 1.35; }
    .vis button[aria-pressed='true'] { border-color: var(--honey-deep); background: color-mix(in srgb, var(--honey) 14%, var(--surface)); }
    .range-row { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
    .big-amt { font-family: var(--font-display); font-weight: 900; color: var(--honey-text); font-size: 40px; line-height: 1; }
    input[type='range'] { width: 100%; accent-color: var(--honey); height: 28px; margin: 6px 0 0; }
    .range-scale { display: flex; justify-content: space-between; color: var(--fg-faint); font-size: 12.5px; direction: ltr; }
    .formfoot { display: flex; flex-wrap: wrap; align-items: center; gap: 12px 18px; }
    .note { color: var(--fg-faint); font-size: 14px; }

    .preview { background: var(--surface-2); border-inline-start: 1px solid var(--line); padding: clamp(18px, 3.4cqi, 36px); display: flex; flex-direction: column; gap: 16px; min-width: 0; }
    .preview h3 { font-size: 15px; font-weight: 800; }
    .pv-hex { height: 210px; display: grid; place-items: center; background: radial-gradient(circle, rgba(245, 165, 36, 0.12), transparent 65%), var(--surface); border: 1px solid var(--line-soft); border-radius: 6px; }
    .pv-hex svg { width: 100%; height: 100%; display: block; }
    .pv-hex text { text-anchor: middle; }
    .ghost { fill: none; stroke: var(--fg-faint); stroke-opacity: 0.55; stroke-width: 1.2; stroke-dasharray: 4 5; }
    .mine { fill-opacity: 0.28; stroke-width: 2; transition: all 0.25s; }
    .cap { font-size: 11px; font-weight: 500; fill: var(--fg-faint); }
    .amt { font-family: var(--font-display); font-weight: 900; fill: var(--fg); }
    .pv-list { list-style: none; margin: 0; padding: 0; }
    .pv-list li { display: flex; justify-content: space-between; gap: 12px; padding: 9px 0; border-top: 1px solid var(--line-soft); font-size: 14px; color: var(--fg-mute); }
    .pv-list li:first-child { border-top: 0; }
    .pv-list b { color: var(--fg); font-weight: 700; text-align: left; }
    .pv-note { font-size: 13px; color: var(--fg-faint); }

    @container home (max-width: 820px) {
        .composer { grid-template-columns: minmax(0, 1fr); }
        .preview { border-inline-start: 0; border-top: 1px solid var(--line); }
    }
    @container home (max-width: 480px) {
        .two, .vis { grid-template-columns: minmax(0, 1fr); }
    }
</style>
