<script lang="ts">
    import { MONTHS, PAID, PAID_TOTAL, SPLIT, SOLVED_COUNT, PAID_EXPERTS, MEDIAN_DAYS, DEMO_DATA, catColor, catShort, fmt } from '$lib/homeData';

    // תרשים עמודות. ציר הזמן מימין לשמאל (החודש הראשון בימין), כמו כיוון הקריאה.
    const W = 640, H = 250, PT = 24, PB = 30, PL = 8, PR = 52;
    const MAX = 200000;
    const bw = (W - PL - PR) / PAID.length;
    const innerW = bw * 0.62;
    const GRID = [0, 50000, 100000, 150000, 200000];
    const yOf = (v: number) => PT + (H - PT - PB) * (1 - v / MAX);

    const bars = PAID.map((v, i) => {
        const h = (H - PT - PB) * (v / MAX);
        const x = W - PR - (i + 1) * bw + (bw - innerW) / 2;
        return { v, x, y: H - PB - h, h, label: MONTHS[i], last: i === PAID.length - 1 };
    });
</script>

<section class="section" id="paid">
    <div class="inner paid">
        <div class="left">
            <div class="eyebrow">הספרים פתוחים{#if DEMO_DATA}<span class="demo-tag">נתוני הדגמה</span>{/if}</div>
            <div class="paid-total"><span class="num">{fmt(PAID_TOTAL)}</span></div>
            <p class="paid-cap">חולקו לפותרי בעיות מאז שהכוורת נפתחה. כל תשלום מתועד ומופיע ברשימת הפתרונות.</p>
            <div class="mini-grid">
                <div><div class="stat-n"><span class="num">{SOLVED_COUNT}</span></div><div class="stat-l">בעיות נפתרו</div></div>
                <div><div class="stat-n"><span class="num">{MEDIAN_DAYS}</span> <span class="unit">יום</span></div><div class="stat-l">זמן פתרון חציוני</div></div>
                <div><div class="stat-n"><span class="num">{PAID_EXPERTS}</span></div><div class="stat-l">מומחים שקיבלו תשלום</div></div>
            </div>
        </div>

        <div class="panel">
            <h3>כמה חולק בכל חודש</h3>
            <div class="sub">12 החודשים האחרונים, בשקלים. החודש האחרון מודגש.</div>
            <div class="chart">
                <svg viewBox="0 0 {W} {H}" role="img" aria-label="תרשים עמודות של סכומים שחולקו בכל חודש, בעלייה מתמדת">
                    {#each GRID as v}
                        <line x1={PL} x2={W - PR} y1={yOf(v)} y2={yOf(v)} class="grid" stroke-dasharray={v ? '3 4' : undefined} />
                        <text x={W - PR + 8} y={yOf(v) + 4}>{v ? '₪' + v / 1000 + 'K' : '0'}</text>
                    {/each}
                    {#each bars as b}
                        <rect x={b.x} y={b.y} width={innerW} height={b.h} rx="2" fill="#f5a524" fill-opacity={b.last ? 1 : 0.42} />
                        <text x={b.x + innerW / 2} y={H - 10} text-anchor="middle" class:strong={b.last}>{b.label}</text>
                        {#if b.last}
                            <text class="val" x={b.x + innerW / 2} y={b.y - 8} text-anchor="middle">₪{Math.round(b.v / 1000)}K</text>
                        {/if}
                    {/each}
                </svg>
            </div>

            <div class="split">
                <h3>לאן הלך הכסף</h3>
                <div class="split-bar" aria-hidden="true">
                    {#each SPLIT as s}<i style="--c:{catColor(s[0])}; flex:{s[1]}"></i>{/each}
                </div>
                <ul class="split-list">
                    {#each SPLIT as s}
                        <li><span class="dot" style="--c:{catColor(s[0])}"></span>{catShort(s[0])}<b class="num">{fmt(PAID_TOTAL * s[1])}</b></li>
                    {/each}
                </ul>
            </div>
        </div>
    </div>
</section>

<style>
    .paid { display: grid; grid-template-columns: minmax(0, 4fr) minmax(0, 8fr); gap: clamp(22px, 4cqi, 56px); align-items: start; }
    .left { min-width: 0; }
    .paid-total { font-family: var(--font-display); font-weight: 900; font-size: clamp(34px, 5.2cqi, 56px); line-height: 1; color: var(--honey-text); letter-spacing: -0.02em; }
    .paid-cap { color: var(--fg-mute); margin-top: 12px; max-width: 34ch; }
    .mini-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); margin-top: 30px; border-top: 1px solid var(--line); }
    .mini-grid > div { padding-top: 14px; padding-inline-end: 10px; }
    .mini-grid > div + div { padding-inline-start: 14px; border-inline-start: 1px solid var(--line); }
    .stat-n { font-family: var(--font-display); font-weight: 900; font-size: 26px; line-height: 1.1; }
    .stat-n .unit { font-size: 0.55em; font-weight: 700; }
    .stat-l { color: var(--fg-faint); font-size: 13px; margin-top: 4px; line-height: 1.35; }

    .panel { background: var(--surface); border: 1px solid var(--line); border-radius: 8px; padding: clamp(16px, 2.6cqi, 24px); min-width: 0; }
    .panel h3 { font-size: 15px; font-weight: 800; }
    .sub { color: var(--fg-faint); font-size: 13px; }
    .chart { margin-top: 12px; direction: ltr; }
    .chart svg { width: 100%; height: auto; display: block; overflow: visible; }
    .chart text { font-family: inherit; fill: var(--fg-faint); font-size: 12px; }
    .chart .grid { stroke: var(--line); stroke-width: 1; }
    .chart .strong { fill: var(--fg); font-weight: 700; }
    .chart .val { fill: var(--honey-text); font-weight: 800; font-size: 13px; }
    .split { margin-top: 22px; border-top: 1px solid var(--line-soft); padding-top: 18px; }
    .split-bar { display: flex; height: 12px; border-radius: 3px; overflow: hidden; gap: 2px; margin-top: 12px; }
    .split-bar i { display: block; background: var(--c); min-width: 3px; }
    .split-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px 28px; margin: 14px 0 0; padding: 0; list-style: none; }
    .split-list li { display: flex; align-items: center; gap: 8px; font-size: 14px; color: var(--fg-mute); min-width: 0; }
    .split-list li b { margin-inline-start: auto; color: var(--fg); font-weight: 700; padding-inline-start: 8px; }

    @container home (max-width: 820px) {
        .paid { grid-template-columns: minmax(0, 1fr); }
    }
    @container home (max-width: 520px) {
        .split-list { grid-template-columns: minmax(0, 1fr); }
        .stat-n { font-size: 22px; }
    }
</style>
