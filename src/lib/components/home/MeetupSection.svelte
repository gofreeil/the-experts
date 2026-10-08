<script lang="ts">
    import { onMount } from 'svelte';
    import { MEETUP, DEMO_DATA, catColor } from '$lib/homeData';

    // מרחק בין עכשיו ליעד, בחודשי לוח + ימים + שעות + דקות + שניות
    function diffParts(now: Date, target: Date) {
        let m = (target.getFullYear() - now.getFullYear()) * 12 + target.getMonth() - now.getMonth();
        let anchor = new Date(now.getTime());
        anchor.setMonth(anchor.getMonth() + m);
        if (anchor > target) {
            m--;
            anchor = new Date(now.getTime());
            anchor.setMonth(anchor.getMonth() + m);
        }
        const rest = Math.max(0, target.getTime() - anchor.getTime());
        return {
            m: Math.max(0, m),
            d: Math.floor(rest / 864e5),
            h: Math.floor((rest % 864e5) / 36e5),
            i: Math.floor((rest % 36e5) / 6e4),
            s: Math.floor((rest % 6e4) / 1e3)
        };
    }
    const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);
    const two = (n: number) => String(n).padStart(2, '0');

    let target = $state(new Date(MEETUP.first));
    let parts = $state<ReturnType<typeof diffParts> | null>(null);
    let registered = $state(false);

    const whenLabel = $derived(
        target.toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jerusalem' }) + ' · 20:00 · בזום, 90 דקות'
    );

    onMount(() => {
        // אם המועד עבר, מגלגלים למפגש הבא באותו מחזור
        let t = new Date(MEETUP.first);
        while (t.getTime() < Date.now()) t = new Date(t.getTime() + MEETUP.periodDays * 864e5);
        target = t;
        const tick = () => (parts = diffParts(new Date(), target));
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    });

    const cells = $derived(
        parts
            ? [
                  { v: parts.m, one: 'חודש', many: 'חודשים' },
                  { v: parts.d, one: 'יום', many: 'ימים' },
                  { v: parts.h, one: 'שעה', many: 'שעות' },
                  { v: parts.i, one: 'דקה', many: 'דקות' },
                  { v: parts.s, one: 'שנייה', many: 'שניות' }
              ]
            : [
                  { v: null, one: 'חודש', many: 'חודשים' },
                  { v: null, one: 'יום', many: 'ימים' },
                  { v: null, one: 'שעה', many: 'שעות' },
                  { v: null, one: 'דקה', many: 'דקות' },
                  { v: null, one: 'שנייה', many: 'שניות' }
              ]
    );
</script>

<section class="section" id="meet">
    <div class="inner">
        <div class="meet">
            <div class="meet-main">
                <span class="live-pill"><i></i>המפגש הוירטואלי הבא · מפגש {MEETUP.number}{#if DEMO_DATA}<span class="demo-tag">נתוני הדגמה</span>{/if}</span>
                <h2>שלוש הבעיות הכי גדולות, בשידור חי מול מומחים</h2>
                <p class="when">{whenLabel}</p>

                <div class="count" role="timer" aria-label="הזמן שנותר למפגש">
                    {#each cells as c}
                        <div>
                            <b>{c.v === null ? '--' : two(c.v)}</b>
                            <span>{c.v === null ? c.many : plural(c.v, c.one, c.many)}</span>
                        </div>
                    {/each}
                </div>

                <div class="meet-cta">
                    <button class="btn btn-primary" type="button" aria-pressed={registered} onclick={() => (registered = !registered)}>
                        {registered ? 'נרשמתם, נשלח תזכורת' : 'שריינו לי מקום'}
                    </button>
                    <span class="reg-note"><b class="num">{MEETUP.registered + (registered ? 1 : 0)}</b> נרשמו, ויש מקום ל-{MEETUP.capacity}</span>
                </div>

                <div class="speakers">
                    {#each MEETUP.speakers as s}
                        <div class="spk">
                            <span class="mini-av big" style="--c2:{catColor(s.team)}">{s.ini}</span>
                            <div><b>{s.name}</b><small>מרצה במפגש</small></div>
                        </div>
                    {/each}
                </div>
            </div>

            <div class="agenda">
                <h3>סדר המפגש</h3>
                <div class="sub">90 דקות בזום. הבעיות לדיון נבחרו לפי גובה הפרס והצבעת הקהילה.</div>
                <ol>
                    {#each MEETUP.agenda as a}
                        <li>
                            <time>{a.time}</time>
                            <span>{a.t}<small>{a.s}</small></span>
                            <span class="bt"><span class="num">{a.amt}</span></span>
                        </li>
                    {/each}
                </ol>
            </div>
        </div>
    </div>
</section>

<style>
    .meet {
        --fg: #eef6fc; --fg-mute: #a9c3da; --fg-faint: #86a3bf; --line: #27517a; --line-soft: #1c3d5e; --honey-text: #ffc65c; --bg: #0a1d33;
        color: var(--fg);
        position: relative; overflow: hidden; isolation: isolate;
        border: 1px solid #1d4a75; border-radius: 10px;
        background: linear-gradient(135deg, #123a63 0%, #0c2744 55%, #0a1d33 100%);
        padding: clamp(20px, 4cqi, 44px);
        display: grid; grid-template-columns: minmax(0, 6fr) minmax(0, 5fr); gap: clamp(22px, 4cqi, 52px);
    }
    .meet::before {
        content: ""; position: absolute; inset: 0; z-index: -1;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='97' viewBox='0 0 56 97'%3E%3Cpath d='M28 66L0 50V16L28 0l28 16v34L28 66zm0 0v31M0 82l28 15 28-15M28 0v-1' fill='none' stroke='%23f5a524' stroke-opacity='.09' stroke-width='1'/%3E%3C/svg%3E");
        mask-image: linear-gradient(90deg, #000, transparent 70%); -webkit-mask-image: linear-gradient(90deg, #000, transparent 70%);
    }
    .meet-main { min-width: 0; }
    .live-pill { display: inline-flex; flex-wrap: wrap; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; color: var(--honey-text); border: 1px solid #7a6020; background: rgba(245, 165, 36, 0.1); padding: 4px 12px; border-radius: 999px; }
    .live-pill i { width: 8px; height: 8px; border-radius: 50%; background: var(--honey-text); box-shadow: 0 0 0 0 rgba(255, 198, 92, 0.6); animation: beat 2s infinite; }
    .live-pill .demo-tag { border-color: #7a6020; color: #ffc65c; margin-inline-start: 4px; }
    @keyframes beat { 70% { box-shadow: 0 0 0 9px rgba(255, 198, 92, 0); } 100% { box-shadow: 0 0 0 0 rgba(255, 198, 92, 0); } }
    h2 { font-family: var(--font-display); font-weight: 900; font-size: clamp(26px, 4.4cqi, 44px); line-height: 1.12; margin-top: 16px; text-wrap: balance; }
    .when { color: var(--fg-mute); margin-top: 10px; font-size: 16px; }
    .count { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 8px; margin-top: 26px; max-width: 560px; }
    .count > div { background: rgba(6, 22, 40, 0.6); border: 1px solid #2a5886; border-radius: 6px; padding: 12px 6px 9px; text-align: center; min-width: 0; }
    .count b { display: block; font-family: var(--font-display); font-weight: 900; font-size: clamp(28px, 5cqi, 48px); line-height: 1; color: var(--honey-text); font-variant-numeric: tabular-nums; direction: ltr; }
    .count span { display: block; font-size: 13px; color: var(--fg-mute); margin-top: 6px; }
    .meet-cta { display: flex; flex-wrap: wrap; align-items: center; gap: 12px 16px; margin-top: 26px; }
    .reg-note { color: var(--fg-mute); font-size: 14px; }
    .speakers { display: flex; flex-wrap: wrap; gap: 14px 22px; margin-top: 28px; }
    .spk { display: flex; align-items: center; gap: 10px; min-width: 0; }
    .mini-av.big { width: 40px; height: 44px; font-size: 14px; }
    .spk b { display: block; font-size: 15px; font-weight: 700; line-height: 1.25; }
    .spk small { display: block; color: var(--fg-faint); font-size: 12.5px; }
    .agenda { background: rgba(6, 22, 40, 0.55); border: 1px solid var(--line); border-radius: 8px; padding: 20px 22px; align-self: start; min-width: 0; }
    .agenda h3 { font-size: 15px; font-weight: 800; margin-bottom: 4px; }
    .agenda .sub { color: var(--fg-faint); font-size: 13px; }
    ol { list-style: none; margin: 14px 0 0; padding: 0; }
    li { display: grid; grid-template-columns: 52px minmax(0, 1fr) auto; gap: 12px; align-items: baseline; padding: 11px 0; border-top: 1px solid var(--line-soft); font-size: 15px; }
    li:first-child { border-top: 0; }
    time { font-variant-numeric: tabular-nums; color: var(--honey-text); font-weight: 700; direction: ltr; text-align: right; }
    li small { display: block; color: var(--fg-faint); font-size: 12.5px; }
    .bt { font-family: var(--font-display); font-weight: 900; color: var(--honey-text); font-size: 16px; }

    @container home (max-width: 820px) {
        .meet { grid-template-columns: minmax(0, 1fr); }
    }
    @container home (max-width: 440px) {
        .count { gap: 5px; }
        .count > div { padding-inline: 2px; }
        .count span { font-size: 11.5px; }
    }
</style>
