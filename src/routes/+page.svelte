<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import '$lib/components/home/home.css';
    import { problemsStore, seedProblems } from '$lib/problemsStore.svelte';
    import { teamBySlug } from '$lib/teamsData';
    import { CATS, STEPS, catColor, fmt } from '$lib/homeData';
    import ProblemMap from '$lib/components/home/ProblemMap.svelte';
    import SmartSearch from '$lib/components/home/SmartSearch.svelte';
    import PaidSection from '$lib/components/home/PaidSection.svelte';
    import MeetupSection from '$lib/components/home/MeetupSection.svelte';
    import RecentSolutions from '$lib/components/home/RecentSolutions.svelte';
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

    // בדף הבית רק דוגמאות. את שאר הבעיות רואים בלוח המלא (/problems)

    const totalOpen = $derived(all.reduce((s, p) => s + p.bounty, 0));

    // בדוגמאות: שלוש הבעיות עם הפרס הגבוה ביותר. האחרונות שהועלו רק בלוח המלא
    const wanted = $derived([...all].sort((a, b) => b.bounty - a.bounty).slice(0, 3));

    // כרטיס תחום: פותח את לוח הבעיות המלא כשהסינון לפי התחום כבר דלוק
    const openCat = (slug: string) => goto(`/problems?cat=${slug}`);
</script>

<svelte:head>
    <title>המומחים של העם</title>
    <meta name="description" content="מעלים בעיה, ציבורית או פרטית, ומציבים עליה פרס. מומחים מרימים יד, מציעים פתרון, והכסף עובר למי שפתר." />
</svelte:head>

<div class="home" dir="rtl">
    <!-- ═════ גיבור ═════ -->
    <section class="hero">
        <div class="inner hero-title">
            <h1>הציבו אתגר למומחים של העם, <em>ותנו לחכמת ההמונים לחשוב על פתרון!</em></h1>
            <img class="hero-logo" src="/images/experts-logo.webp" alt="לוגו המומחים של העם" width="108" height="108" fetchpriority="high" decoding="async" />
            <div class="how-frame"><FancyHeading title="איך זה עובד" as="h2" /></div>
        </div>
        <div class="inner hero-grid">
            <div class="hero-text">
                <p class="hero-lede">מעלים בעיה, ציבורית או פרטית, ומציבים עליה פרס. מומחים מרימים יד, מציעים פתרון, והכסף נשמר במערכת ומחולק לנותני הפתרון.</p>
                <div class="hero-cta">
                    <a class="btn btn-primary" href="#compose">העלו בעיה והציבו פרס</a>
                </div>
            </div>

            <a class="howbox" href="/about" aria-label="אודות">
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
            </a>
        </div>
    </section>

    <!-- ═════ חיפוש חכם ═════ -->
    <SmartSearch problems={all} />

    <!-- ═════ דוגמאות: המבוקשים ביותר והאחרונות ═════ -->
    <section class="section alt examples-sec">
        <div class="inner">
            <ProblemMap {wanted} onpledge={(id, amt) => problemsStore.addToBounty(id, amt)} />
        </div>
    </section>
    <FloorLink href="/problems" label="לוח הבעיות" />

    <PaidSection headTitle="כסף שחולק" preview />
    <FloorLink href="/paid" label="כסף שחולק" />

    <MeetupSection headTitle="מפגשי המומחים" preview />
    <FloorLink href="/meetup" label="מפגשי המומחים" />

    <RecentSolutions problems={all} />
    <FloorLink href="/problems" label="לוח הבעיות" />

    <!-- ═════ תחומים ═════ -->
    <section class="section" id="cats">
        <div class="inner">
            <SectionHead title="צוותי המומחים שלנו" lede="בחרו תחום כדי לסנן את לוח הבעיות. הפס מראה כמה מכלל הפרסים הפתוחים יושבים בתחום." />
            <div class="cats">
                {#each CATS as c}
                    {@const team = teamBySlug(c.slug)}
                    {@const ps = all.filter((p) => p.category === c.slug)}
                    {@const sum = ps.reduce((s, p) => s + p.bounty, 0)}
                    <button class="cat" type="button" style="--c:{catColor(c.slug)}" onclick={() => openCat(c.slug)}>
                        <span class="cat-ico" aria-hidden="true">
                            {#if team?.image}<img src={team.image} alt="" width="56" height="56" loading="lazy" decoding="async" />{:else}{team?.emoji ?? ''}{/if}
                        </span>
                        <b>{team?.name ?? c.short}</b>
                        <small><span class="c-line">{ps.length} בעיות פתוחות · <span class="num">{fmt(sum)}</span></span><span class="c-ex">{c.experts} מומחים בצוות</span></small>
                        <span class="cat-bar" aria-hidden="true"><i style="width:{Math.max(3, Math.round((sum / (totalOpen || 1)) * 100))}%"></i></span>
                    </button>
                {/each}
            </div>
        </div>
    </section>
    <FloorLink href="/categories" label="תחומים" />

    <ComposerSection />
</div>

<style>
    /* ───── גיבור ───── */
    .hero { position: relative; padding-block: clamp(30px, 6cqi, 64px) clamp(4px, 0.8cqi, 10px); overflow: hidden; isolation: isolate; }
    .hero-title { display: flex; flex-direction: column; align-items: center; text-align: center; margin-bottom: clamp(18px, 3cqi, 32px); }
    /* padding באחוזים נמדד מרוחב ההורה ולא מהתמונה — בגלל זה הלוגו נעלם; לכן מחושב מגודל הלוגו עצמו */
    .hero-logo { --logo: clamp(80px, 11cqi, 108px); box-sizing: border-box; width: var(--logo); height: auto; aspect-ratio: 1; margin-top: 10px; padding: calc(var(--logo) * 0.1); border-radius: 50%; background: #fff; box-shadow: 0 0 0 2px var(--line); object-fit: contain; }
    .hero-grid { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: clamp(16px, 2.6cqi, 28px); align-items: stretch; }
    /* שני כרטיסים שווי גובה: מבוא ופעולה מימין, "איך זה עובד" משמאל */
    .hero-text, .howbox { min-width: 0; display: flex; flex-direction: column; padding: clamp(18px, 2.8cqi, 28px); background: var(--surface); border: 1px solid var(--line); border-radius: 14px; box-shadow: 0 8px 24px rgba(10, 45, 80, 0.1); }
    h1 { font-family: var(--font-display); font-weight: 900; font-size: clamp(28px, 4.6cqi, 48px); line-height: 1.12; letter-spacing: -0.01em; text-wrap: balance; }
    h1 em { display: block; font-style: normal; color: var(--honey-text); }
    .hero-lede { color: var(--fg); font-size: clamp(16px, 1.9cqi, 18px); line-height: 1.55; text-wrap: pretty; }
    .hero-cta { display: flex; margin-top: 16px; }
    .hero-cta .btn { width: 100%; padding: 13px 24px; font-size: 16px; box-shadow: 0 6px 16px rgba(185, 119, 14, 0.35); }

    /* ───── איך זה עובד (בכרטיס בגיבור): ציר זמן עם קו מחבר בין השלבים ───── */
    .how-frame { margin-top: 12px; max-width: 100%; }
    .how { list-style: none; margin: 0; padding: 0; display: grid; }
    .how li { position: relative; display: flex; align-items: flex-start; gap: 14px; padding-bottom: 16px; }
    .how li:last-child { padding-bottom: 0; }
    .how li:not(:last-child)::before { content: ""; position: absolute; inset-inline-start: 18px; top: 42px; bottom: 4px; width: 2px; border-radius: 2px; background: linear-gradient(var(--honey), var(--line)); }
    .step-n { flex: none; width: 38px; height: 38px; display: grid; place-items: center; background: var(--honey); color: var(--honey-ink); border-radius: 50%; font-family: var(--font-display); font-weight: 900; font-size: 19px; box-shadow: 0 0 0 4px color-mix(in srgb, var(--honey) 22%, transparent); }
    .how h3 { font-size: 16.5px; font-weight: 800; line-height: 1.3; margin-bottom: 2px; }
    .how p { color: var(--fg-mute); font-size: 14.5px; line-height: 1.45; text-wrap: pretty; }
    /* כל הכרטיס הוא כפתור שמוביל לדף אודות */
    .howbox { color: inherit; text-decoration: none; cursor: pointer; transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s; }
    .howbox:hover { border-color: var(--honey); box-shadow: 0 10px 28px rgba(185, 119, 14, 0.22); transform: translateY(-2px); }
    .howbox:focus-visible { outline: 3px solid var(--honey); outline-offset: 2px; }
    .examples-sec { padding-block: clamp(26px, 4cqi, 48px); }

    /* הנושאים מופרדים במחיצות ❦ (בסוף כל נושא), לכן בלי פסי רקע מתחלפים, ובריווח קומפקטי */
    .home :global(.section) { padding-block: clamp(16px, 2.6cqi, 30px); }

    /* ───── תחומים ───── */
    .cats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
    .cat { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 4px 14px; align-items: center; text-align: right; background: var(--surface); border: 1px solid var(--line); border-radius: 6px; padding: 16px 16px 14px; transition: border-color 0.2s, transform 0.2s; width: 100%; }
    .cat:hover { border-color: var(--c); transform: translateY(-2px); }
    .cat-ico { grid-row: 1 / span 2; width: 56px; height: 56px; display: grid; place-items: center; font-size: 24px; background: color-mix(in srgb, var(--c) 38%, var(--surface)); border-radius: 16px; overflow: hidden; }
    .cat-ico img { width: 100%; height: 100%; object-fit: cover; }
    .cat b { font-size: 16px; font-weight: 800; line-height: 1.25; }
    .cat small { color: var(--fg-faint); font-size: 13px; line-height: 1.35; }
    .cat .c-line, .cat .c-ex { display: block; }
    .cat-bar { grid-column: 1 / -1; height: 4px; background: var(--line-soft); border-radius: 2px; margin-top: 10px; overflow: hidden; }
    .cat-bar i { display: block; height: 100%; background: var(--c); }

    @container home (max-width: 1150px) {
        .cats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @container home (max-width: 900px) {
        .hero-grid { grid-template-columns: minmax(0, 1fr); }
    }
    @container home (max-width: 520px) {
        /* בנייד ההדר כבר מציג את הלוגו, אז כאן מוסתר. הגיבור קומפקטי: כותרת קטנה, ושלבי "איך זה עובד" ברשת 2×2 בלי תיאורים */
        .hero { padding-block: 12px 0; }
        .hero-title { margin-bottom: 10px; }
        .hero-logo { display: none; }
        h1 { font-size: 23px; line-height: 1.2; }
        h1 em { font-size: 0.87em; }
        .how-frame { margin-top: 6px; }
        .hero-grid { gap: 10px; }
        .hero-text, .howbox { padding: 12px 14px; border-radius: 12px; }
        .hero-lede { font-size: 14.5px; line-height: 1.45; }
        .hero-cta { margin-top: 10px; }
        .hero-cta .btn { padding: 9px 16px; font-size: 15px; }
        .how { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px 8px; }
        .how li { align-items: center; gap: 8px; padding-bottom: 0; }
        .how li:not(:last-child)::before { display: none; }
        .step-n { width: 28px; height: 28px; font-size: 15px; box-shadow: none; }
        .how h3 { font-size: 14px; line-height: 1.25; margin: 0; }
        .how p { display: none; }
        .examples-sec { padding-block: 16px; }

        /* תחומים: שתי עמודות קטנות במקום כרטיס גדול לכל תחום */
        .cats { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
        .cat { grid-template-columns: auto minmax(0, 1fr); gap: 4px 8px; padding: 10px; }
        .cat-ico { grid-row: auto; width: 36px; height: 36px; font-size: 18px; border-radius: 10px; }
        .cat b { font-size: 14.5px; }
        .cat small { grid-column: 1 / -1; font-size: 12px; line-height: 1.3; }
        .cat .c-ex { display: none; }
        .cat-bar { margin-top: 4px; }
    }
</style>
