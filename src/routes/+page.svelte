<script lang="ts">
    import { onMount, tick } from 'svelte';
    import '$lib/components/home/home.css';
    import { problemsStore, seedProblems, type Problem, type ProblemType } from '$lib/problemsStore.svelte';
    import { teamBySlug } from '$lib/teamsData';
    import { CATS, STEPS, PAID_TOTAL, SOLVED_COUNT, DEMO_DATA, catColor, fmt, fmtCompact, handsOf } from '$lib/homeData';
    import ProblemMap from '$lib/components/home/ProblemMap.svelte';
    import ProblemCard from '$lib/components/home/ProblemCard.svelte';
    import PaidSection from '$lib/components/home/PaidSection.svelte';
    import MeetupSection from '$lib/components/home/MeetupSection.svelte';
    import RecentSolutions from '$lib/components/home/RecentSolutions.svelte';
    import SolvedSection from '$lib/components/home/SolvedSection.svelte';
    import ArchiveSection from '$lib/components/home/ArchiveSection.svelte';
    import ExpertsSection from '$lib/components/home/ExpertsSection.svelte';
    import ComposerSection from '$lib/components/home/ComposerSection.svelte';
    import FloorLink from '$lib/components/home/FloorLink.svelte';
    import FancyHeading from '$lib/components/home/FancyHeading.svelte';
    import SectionHead from '$lib/components/home/SectionHead.svelte';

    // הרינדור הראשון משתמש בבעיות ההתחלתיות (זהה בשרת ובלקוח). אחרי הטעינה עוברים לנתוני הדפדפן.
    let mounted = $state(false);
    onMount(() => {
        problemsStore.refresh();
        mounted = true;
    });

    const all = $derived((mounted ? problemsStore.items : seedProblems).filter((p) => p.status === 'open'));

    let cat = $state<string>('all');
    let scope = $state<'all' | ProblemType>('all');
    let sort = $state<'bounty' | 'hands' | 'new'>('bounty');
    // בדף הבית רק דוגמאות. את שאר הבעיות רואים בלוח המלא (/problems)
    const PREVIEW = 4;
    let shown = $state(PREVIEW);
    let selectedId = $state<string | null>(null);
    let flashId = $state<string | null>(null);

    const isVisible = (p: Problem) => (cat === 'all' || p.category === cat) && (scope === 'all' || p.type === scope);
    const visible = $derived(all.filter(isVisible));
    const sorted = $derived.by(() => {
        const list = [...visible];
        if (sort === 'bounty') list.sort((a, b) => b.bounty - a.bounty);
        else if (sort === 'hands') list.sort((a, b) => handsOf(b) - handsOf(a) || b.bounty - a.bounty);
        else list.sort((a, b) => b.createdAt - a.createdAt);
        return list;
    });
    const totalOpen = $derived(all.reduce((s, p) => s + p.bounty, 0));

    // בהדר: שלוש הבעיות עם הפרס הגבוה ביותר, ומתחתן שלוש האחרונות שהועלו (בלי כפילויות)
    const wanted = $derived([...all].sort((a, b) => b.bounty - a.bounty).slice(0, 3));
    const recent = $derived([...all].filter((p) => !wanted.includes(p)).sort((a, b) => b.createdAt - a.createdAt).slice(0, 3));

    function setCat(c: string) {
        cat = cat === c ? 'all' : c;
        shown = PREVIEW;
    }
    function gotoBoard() {
        document.getElementById('board')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // "הראו בלוח": מוודא שהכרטיס מוצג (מאפס סינון אם צריך), גולל אליו ומדגיש אותו
    async function showInBoard(id: string) {
        const p = all.find((x) => x.id === id);
        if (!p) return;
        if (!isVisible(p)) {
            cat = 'all';
            scope = 'all';
        }
        const idx = sorted.findIndex((x) => x.id === id);
        if (idx >= shown) shown = idx + 1;
        await tick();
        document.getElementById(`p-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        flashId = id;
        setTimeout(() => (flashId = null), 1600);
    }
</script>

<svelte:head>
    <title>כוורת המומחים</title>
    <meta name="description" content="מעלים בעיה, ציבורית או פרטית, ומציבים עליה פרס. מומחים מרימים יד, מציעים פתרון, והכסף עובר למי שפתר." />
</svelte:head>

<div class="home" dir="rtl">
    <!-- ═════ גיבור ═════ -->
    <section class="hero">
        <div class="inner hero-title">
            <div class="wanted">
                <svg width="11" height="11" viewBox="0 0 11 11" aria-hidden="true"><circle cx="5.5" cy="5.5" r="5.5" fill="currentColor" /></svg>מבוקש: פתרון
            </div>
            <h1>יש בעיה? <em>שימו עליה פרס.</em></h1>
            <img class="hero-logo" src="/images/experts-logo.webp" alt="לוגו המומחים של העם" width="400" height="344" fetchpriority="high" decoding="async" />
        </div>
        <div class="inner hero-grid">
            <div class="hero-text">
                <p class="hero-lede">מעלים בעיה, ציבורית או פרטית, ומציבים עליה פרס. מומחים מרימים יד, מציעים פתרון, והכסף עובר למי שפתר.</p>
                <div class="hero-cta">
                    <a class="btn btn-primary" href="#compose">העלו בעיה והציבו פרס</a>
                </div>
                <p class="trust">
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 2l6.5 2.5v5c0 4-2.7 6.8-6.5 8.5-3.8-1.7-6.5-4.5-6.5-8.5v-5z" /><path d="M7 10l2.2 2.2L13.2 8" /></svg>
                    <span>הפרס נשמר בנאמנות. הוא עובר למומחה רק אחרי שאישרתם שהבעיה נפתרה.</span>
                </p>
                <div class="hero-stats">
                    <div><div class="stat-n gold"><span class="num">{fmtCompact(totalOpen)}</span></div><div class="stat-l">פרסים פתוחים כרגע</div></div>
                    <div><div class="stat-n gold"><span class="num">{fmtCompact(PAID_TOTAL)}</span></div><div class="stat-l">חולקו עד היום לפותרים</div></div>
                    <div><div class="stat-n"><span class="num">{SOLVED_COUNT}</span></div><div class="stat-l">בעיות שנפתרו</div></div>
                </div>
                {#if DEMO_DATA}<p class="hero-demo"><span class="demo-tag" style="margin:0">נתוני הדגמה</span> הסכומים שחולקו ומספר הפתרונות הם דוגמה עד חיבור לשרת.</p>{/if}
            </div>

            <div class="howbox">
                <FancyHeading title="איך זה עובד" />
                <ol class="how">
                    {#each STEPS as s, i}
                        <li>
                            <span class="step-n">{i + 1}</span>
                            <div>
                                <h3>{s.t}</h3>
                                <p>{s.d}</p>
                            </div>
                        </li>
                    {/each}
                </ol>
                <div class="how-more"><a href="/how-it-works">איך זה עובד, בפירוט</a></div>
            </div>
        </div>
    </section>

    <!-- ═════ דוגמאות: המבוקשים ביותר והאחרונות ═════ -->
    <section class="section alt examples-sec">
        <div class="inner">
            <ProblemMap {wanted} {recent} {isVisible} bind:selectedId onshow={showInBoard} onmore={gotoBoard} onpledge={(id, amt) => problemsStore.addToBounty(id, amt)} />
        </div>
    </section>
    <FloorLink href="/problems" label="לוח הבעיות" note="שלוש עם הפרס הגבוה ביותר ושלוש האחרונות שהועלו" />

    <PaidSection headTitle="כסף שחולק" />
    <FloorLink href="/paid" label="כסף שחולק" note="חלוקה לפי חודשים ותחומים, ותשלומים אחרונים" />

    <!-- ═════ לוח הבעיות ═════ -->
    <section class="section alt" id="board">
        <div class="inner">
            <SectionHead title="בעיות שמחכות ליד מורמת" lede="הסכום אינו רק מחיר. כשהרבה אנשים מוסיפים לפרס, זה סימן שהבעיה כואבת, והמומחים רואים אותה ראשונה.">
                <a class="btn btn-primary btn-sm" href="#compose">העלו בעיה</a>
            </SectionHead>

            <div class="controls">
                <div class="chips" role="group" aria-label="סינון לפי תחום">
                    <button class="chip" type="button" aria-pressed={cat === 'all'} onclick={() => { cat = 'all'; shown = PREVIEW; }}>הכל <span class="num cnt">{all.length}</span></button>
                    {#each CATS as c}
                        <button class="chip" type="button" style="--c:{catColor(c.slug)}" aria-pressed={cat === c.slug} onclick={() => setCat(c.slug)}>
                            <span class="dot" style="--c:{catColor(c.slug)}"></span>{c.short} <span class="num cnt">{all.filter((p) => p.category === c.slug).length}</span>
                        </button>
                    {/each}
                </div>
                <div class="ctrl-right">
                    <div class="seg" role="group" aria-label="סוג בעיה">
                        <button type="button" aria-pressed={scope === 'all'} onclick={() => { scope = 'all'; shown = PREVIEW; }}>הכל</button>
                        <button type="button" aria-pressed={scope === 'community'} onclick={() => { scope = 'community'; shown = PREVIEW; }}>ציבוריות</button>
                        <button type="button" aria-pressed={scope === 'individual'} onclick={() => { scope = 'individual'; shown = PREVIEW; }}>פרטיות</button>
                    </div>
                    <label class="sr" for="sortSel">מיון</label>
                    <select class="sel" id="sortSel" bind:value={sort} onchange={() => (shown = PREVIEW)}>
                        <option value="bounty">מיון: פרס גבוה</option>
                        <option value="hands">מיון: הכי הרבה ידיים</option>
                        <option value="new">מיון: חדשות</option>
                    </select>
                </div>
            </div>

            <div class="cards">
                {#each sorted.slice(0, shown) as p (p.id)}
                    <ProblemCard {p} flash={flashId === p.id} onpledge={(id, amt) => problemsStore.addToBounty(id, amt)} />
                {:else}
                    <div class="empty">אין כרגע בעיות בסינון הזה. אפשר להיות הראשונים להעלות אחת.</div>
                {/each}
            </div>
        </div>
    </section>
    <FloorLink href="/problems" label="לוח הבעיות" note="מוצגות {Math.min(shown, sorted.length)} מתוך {sorted.length} בעיות פתוחות" />

    <MeetupSection headTitle="מפגש מומחים" />
    <FloorLink href="/meetup" label="מפגש מומחים" note="מועד, סדר יום ומה קורה במפגש" />

    <RecentSolutions problems={all} />
    <FloorLink href="/problems" label="לוח הבעיות" note="כל הצעת פתרון מופיעה בדף הבעיה שלה" />

    <SolvedSection preview />
    <FloorLink href="/solved" label="פתרונות שהתקבלו" note="מוצגים 4 מתוך {SOLVED_COUNT} פתרונות" />

    <!-- ═════ תחומים ═════ -->
    <section class="section" id="cats">
        <div class="inner">
            <SectionHead title="שמונה צוותי מומחים, שמונה סוגי בעיות" lede="בחרו תחום כדי לסנן את לוח הבעיות. הפס מראה כמה מכלל הפרסים הפתוחים יושבים בתחום." />
            <div class="cats">
                {#each CATS as c}
                    {@const team = teamBySlug(c.slug)}
                    {@const ps = all.filter((p) => p.category === c.slug)}
                    {@const sum = ps.reduce((s, p) => s + p.bounty, 0)}
                    <button class="cat" type="button" style="--c:{catColor(c.slug)}" aria-pressed={cat === c.slug} onclick={() => { setCat(c.slug); gotoBoard(); }}>
                        <span class="cat-ico" aria-hidden="true">
                            {#if team?.image}<img src={team.image} alt="" width="56" height="56" loading="lazy" decoding="async" />{:else}{team?.emoji ?? ''}{/if}
                        </span>
                        <b>{team?.name ?? c.short}</b>
                        <small>{ps.length} בעיות פתוחות · <span class="num">{fmt(sum)}</span><br />{c.experts} מומחים בצוות</small>
                        <span class="cat-bar" aria-hidden="true"><i style="width:{Math.max(3, Math.round((sum / (totalOpen || 1)) * 100))}%"></i></span>
                    </button>
                {/each}
            </div>
        </div>
    </section>
    <FloorLink href="/categories" label="תחומים" note="תיאור כל צוות, בעיות פתוחות ומומחים" />

    <ArchiveSection preview headTitle="ארכיון ודיונים" />
    <FloorLink href="/archive" label="ארכיון ודיונים" note="כל המפגשים הקודמים והדיונים הפעילים" />

    <ExpertsSection preview />
    <FloorLink href="/experts" label="המומחים" note="הדירוג המלא וההיסטוריה של כל מומחה" />

    <ComposerSection problems={all} />
    <FloorLink href="/problems/new" label="העלאת בעיה" note="הטופס המלא, עם כל השדות" />
</div>

<style>
    /* ───── גיבור ───── */
    .hero { position: relative; padding-block: clamp(30px, 6cqi, 64px) clamp(34px, 6cqi, 70px); overflow: hidden; isolation: isolate; }
    .hero-title { display: flex; flex-direction: column; align-items: center; text-align: center; margin-bottom: clamp(18px, 3cqi, 32px); }
    .hero-logo { height: clamp(64px, 9cqi, 92px); width: auto; margin-top: 10px; object-fit: contain; }
    .hero-grid { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: clamp(24px, 4cqi, 52px); align-items: center; }
    .hero-text { min-width: 0; }
    .wanted { display: inline-flex; align-items: center; gap: 10px; border: 1.5px solid var(--honey-deep); color: var(--honey-text); padding: 5px 14px; border-radius: 4px; font-family: var(--font-display); font-weight: 900; font-size: 17px; letter-spacing: 0.04em; transform: rotate(-1.5deg); margin-bottom: 14px; }
    h1 { font-family: var(--font-display); font-weight: 900; font-size: clamp(38px, 6.6cqi, 68px); line-height: 1.04; letter-spacing: -0.01em; text-wrap: balance; }
    h1 em { font-style: normal; color: var(--honey-text); }
    .hero-lede { color: var(--fg-mute); font-size: clamp(16px, 2cqi, 18.5px); max-width: 46ch; text-wrap: pretty; }
    .hero-cta { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
    .hero-cta .btn { padding: 14px 24px; font-size: 16px; }
    .trust { display: flex; gap: 10px; align-items: flex-start; margin-top: 22px; color: var(--fg-faint); font-size: 14px; max-width: 46ch; }
    .trust svg { width: 18px; height: 18px; flex: none; margin-top: 3px; color: var(--ok); }
    .hero-stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); margin-top: 34px; border-top: 1px solid var(--line); }
    .hero-stats > div { padding: 16px 0 0; padding-inline-end: 12px; }
    .hero-stats > div + div { padding-inline-start: 16px; border-inline-start: 1px solid var(--line); }
    .stat-n { font-family: var(--font-display); font-weight: 900; font-size: clamp(20px, 3cqi, 28px); line-height: 1.1; color: var(--fg); }
    .stat-n.gold { color: var(--honey-text); }
    .stat-l { color: var(--fg-faint); font-size: 13px; margin-top: 4px; line-height: 1.35; }
    .hero-demo { margin-top: 14px; color: var(--fg-faint); font-size: 12.5px; }

    /* ───── איך זה עובד (בכרטיס בגיבור) ───── */
    .howbox { min-width: 0; }
    .how { list-style: none; margin: 18px 0 0; padding: 0; display: grid; gap: 14px; }
    .how li { display: flex; align-items: flex-start; gap: 14px; }
    .how li + li { border-top: 1px solid var(--line-soft); padding-top: 14px; }
    .step-n { flex: none; width: 38px; height: 38px; display: grid; place-items: center; background: var(--surface-2); color: var(--honey-text); border-radius: 50%; font-family: var(--font-display); font-weight: 900; font-size: 19px; box-shadow: 0 0 0 1px var(--line); }
    .how h3 { font-size: 16.5px; font-weight: 800; margin-bottom: 2px; }
    .how p { color: var(--fg-mute); font-size: 14.5px; text-wrap: pretty; }
    .how-more { margin-top: 14px; text-align: left; }
    .how-more a { color: var(--honey-text); font-size: 14px; font-weight: 700; text-decoration: underline; text-underline-offset: 3px; }
    .examples-sec { padding-block: clamp(26px, 4cqi, 48px); }

    /* הנושאים מופרדים במחיצות ❦ (בסוף כל נושא), לכן בלי פסי רקע מתחלפים, ובריווח קומפקטי */
    .home :global(.section) { padding-block: clamp(16px, 2.6cqi, 30px); }

    /* ───── לוח הבעיות ───── */
    .controls { display: flex; flex-wrap: wrap; gap: 14px 22px; align-items: center; justify-content: space-between; padding-bottom: 18px; margin-bottom: 22px; border-bottom: 1px solid var(--line-soft); }
    .chips { display: flex; flex-wrap: wrap; gap: 8px; min-width: 0; }
    .cnt { color: var(--fg-faint); }
    .ctrl-right { display: flex; flex-wrap: wrap; gap: 10px 14px; align-items: center; }
    .seg { display: inline-flex; border: 1px solid var(--line); border-radius: 6px; overflow: hidden; background: var(--surface); }
    .seg button { background: transparent; border: 0; padding: 7px 14px; color: var(--fg-mute); font-size: 14px; font-weight: 500; }
    .seg button + button { border-inline-start: 1px solid var(--line); }
    .seg button[aria-pressed='true'] { background: var(--surface-2); color: var(--fg); font-weight: 700; box-shadow: inset 0 -2px 0 var(--honey); }
    .sel { background: var(--surface); color: var(--fg); border: 1px solid var(--line); border-radius: 6px; padding: 7px 12px; font: inherit; font-size: 14px; }
    .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
    .cards { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
    .empty { grid-column: 1 / -1; text-align: center; color: var(--fg-mute); padding: 40px 0; border: 1px dashed var(--line); border-radius: 6px; }

    /* ───── תחומים ───── */
    .cats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
    .cat { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 4px 14px; align-items: center; text-align: right; background: var(--surface); border: 1px solid var(--line); border-radius: 6px; padding: 16px 16px 14px; transition: border-color 0.2s, transform 0.2s; width: 100%; }
    .cat:hover { border-color: var(--c); transform: translateY(-2px); }
    .cat[aria-pressed='true'] { border-color: var(--c); background: color-mix(in srgb, var(--c) 9%, var(--surface)); }
    .cat-ico { grid-row: 1 / span 2; width: 56px; height: 56px; display: grid; place-items: center; font-size: 24px; background: color-mix(in srgb, var(--c) 38%, var(--surface)); border-radius: 16px; overflow: hidden; }
    .cat-ico img { width: 100%; height: 100%; object-fit: cover; }
    .cat b { font-size: 16px; font-weight: 800; line-height: 1.25; }
    .cat small { color: var(--fg-faint); font-size: 13px; line-height: 1.35; }
    .cat-bar { grid-column: 1 / -1; height: 4px; background: var(--line-soft); border-radius: 2px; margin-top: 10px; overflow: hidden; }
    .cat-bar i { display: block; height: 100%; background: var(--c); }

    @container home (max-width: 1150px) {
        .cats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @container home (max-width: 900px) {
        .hero-grid { grid-template-columns: minmax(0, 1fr); }
        .cards { grid-template-columns: minmax(0, 1fr); }
    }
    @container home (max-width: 520px) {
        .cats { grid-template-columns: minmax(0, 1fr); }
    }
</style>
