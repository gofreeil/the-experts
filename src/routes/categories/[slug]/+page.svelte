<script lang="ts">
    import { onMount } from 'svelte';
    import '$lib/components/home/home.css';
    import DetailHero from '$lib/components/home/DetailHero.svelte';
    import { problemsStore, seedProblems } from '$lib/problemsStore.svelte';
    import { CATS, DEMO_DATA, catColor, fmt, fmtShort } from '$lib/homeData';
    import { teamExperts, publicSolvedBy } from '$lib/expertsData';
    import { teamBySlug } from '$lib/teamsData';
    import { useI18n } from '$lib/i18n/context';
    import type { PageProps } from './$types';

    let { data }: PageProps = $props();

    const i18n = useI18n();

    // הרינדור הראשון משתמש בבעיות ההתחלתיות (זהה בשרת ובלקוח), אחריו עוברים לנתוני הדפדפן
    let mounted = $state(false);
    onMount(() => {
        problemsStore.refresh();
        mounted = true;
    });

    // data.slug מגיע מה-load (כולל 404); הצוות עצמו נפתר בשפה הנוכחית
    const team = $derived(teamBySlug(data.slug, i18n.locale)!);
    const meta = $derived(CATS.find((c) => c.slug === team.slug));
    const open = $derived((mounted ? problemsStore.items : seedProblems).filter((p) => p.status === 'open' && p.category === team.slug));
    const sum = $derived(open.reduce((s, p) => s + p.bounty, 0));
    const experts = $derived(i18n.l(teamExperts(team.slug)));

    const SHOWN = 3; // כמה בעיות ציבוריות מוצגות בכרטיס של כל מומחה
</script>

<div class="home" style="--c:{catColor(team.slug)}">
    <DetailHero
        title={team.name}
        lede={team.desc}
        meta={team.desc.replace(/\s*\n\s*/g, ' ')}
        backHref="/categories"
        backLabel={i18n.t('cats.backToAll')}
    >
        {#snippet lead()}
            <span class="ico" aria-hidden="true">
                {#if team.image}<img src={team.image} alt="" width="52" height="52" decoding="async" />{:else}{team.emoji}{/if}
            </span>
        {/snippet}
        {#snippet actions()}<a class="btn btn-primary btn-sm" href="/problems?cat={team.slug}">{i18n.t('cats.problemsInField')}</a>{/snippet}
    </DetailHero>

    <section class="section compact">
        <div class="inner">
            {#if meta}
                <dl class="stats">
                    <div><dt>{i18n.t('cats.openProblems')}</dt><dd class="num">{open.length}</dd></div>
                    <div><dt>{i18n.t('cats.totalRewards')}</dt><dd class="num">{fmt(sum)}</dd></div>
                    <div><dt>{i18n.t('cats.teamExperts')}</dt><dd class="num">{meta.experts}</dd></div>
                    <div><dt>{i18n.t('paid.median')}</dt><dd>{i18n.tn('ledger.days', meta.days)}</dd></div>
                </dl>
            {/if}

            <div class="head">
                <h2>{i18n.t('cats.topExperts')}{#if DEMO_DATA}<span class="demo-tag">{i18n.t('common.demoData')}</span>{/if}</h2>
                <p>{i18n.t('cats.topExpertsNote')}</p>
            </div>

            <div class="experts">
                {#each experts as e, i (e.slug)}
                    {@const pub = publicSolvedBy(e.slug)}
                    <article class="ex">
                        <span class="rank num" aria-label={i18n.t('cats.rank', { n: i + 1 })}>{i + 1}</span>
                        <div class="ex-top">
                            <span class="mini-av big" style="--c2:{catColor(e.c)}" aria-hidden="true">{e.ini}</span>
                            <div class="who">
                                <b><a class="cv-link" href="/experts/{e.slug}">{e.n}</a></b>
                                <small>{e.role}</small>
                            </div>
                        </div>
                        <div class="ex-stats">
                            <div><b class="num">{e.solved}</b><span>{i18n.t('experts.statSolved')}</span></div>
                            <div><b class="g"><span class="num">{fmtShort(e.earned)}</span></b><span>{i18n.t('experts.statEarned')}</span></div>
                            <div><b class="num">{e.rate}</b><span>{i18n.t('experts.statRating')}</span></div>
                        </div>
                        <div class="solved">
                            <small>{i18n.t('cats.publicSolved')}</small>
                            <ul>
                                {#each pub.slice(0, SHOWN) as s (s.t.he)}<li>{i18n.l(s.t)}</li>{/each}
                            </ul>
                            <span class="cv">{pub.length > SHOWN ? i18n.t('cats.moreInResume', { n: pub.length - SHOWN }) : i18n.t('cats.fullResume')}</span>
                        </div>
                    </article>
                {:else}
                    <div class="empty">{i18n.t('cats.noSolutions')}</div>
                {/each}
            </div>

            {#if experts.length}
                <p class="all"><a href="/experts?cat={team.slug}">{i18n.t('cats.allExperts')}</a></p>
            {/if}
        </div>
    </section>
</div>

<style>
    .compact { padding-block: clamp(16px, 2.8cqi, 30px); }
    .ico { width: 52px; height: 52px; flex: none; display: grid; place-items: center; font-size: 26px; background: color-mix(in srgb, var(--c) 38%, var(--surface)); border-radius: 14px; overflow: hidden; }
    .ico img { width: 100%; height: 100%; object-fit: cover; }

    .stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; margin: 0; padding-bottom: 14px; border-bottom: 1px solid var(--line-soft); }
    .stats dt { color: var(--fg-faint); font-size: 12.5px; line-height: 1.3; }
    .stats dd { margin: 2px 0 0; font-family: var(--font-display); font-weight: 900; font-size: 20px; line-height: 1.2; }

    .head { margin: 18px 0 14px; }
    .head h2 { font-size: 20px; font-weight: 800; line-height: 1.3; }
    .head p { color: var(--fg-mute); font-size: 14.5px; margin-top: 2px; }

    .experts { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
    .ex { position: relative; display: flex; flex-direction: column; gap: 12px; min-width: 0; background: var(--surface); border: 1px solid var(--line); border-top: 4px solid var(--c); border-radius: 6px; padding: 16px 18px; transition: border-color 0.2s; }
    .ex:hover { border-color: var(--honey-deep); border-top-color: var(--c); }
    .cv-link::after { content: ""; position: absolute; inset: 0; border-radius: 6px; }
    .rank { position: absolute; top: 12px; inset-inline-end: 14px; font-family: var(--font-display); font-weight: 900; font-size: 26px; line-height: 1; color: var(--line); }
    .ex-top { display: flex; align-items: center; gap: 12px; padding-inline-end: 28px; }
    .mini-av.big { width: 48px; height: 54px; font-size: 17px; }
    .who { min-width: 0; }
    .who b { display: block; font-weight: 800; font-size: 16px; line-height: 1.25; }
    .who small { display: block; color: var(--fg-faint); font-size: 13px; line-height: 1.35; }
    .ex-stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; border-top: 1px solid var(--line-soft); padding-top: 12px; }
    .ex-stats b { display: block; font-family: var(--font-display); font-weight: 900; font-size: 20px; line-height: 1.1; }
    .ex-stats b.g { color: var(--honey-text); }
    .ex-stats > div > span { color: var(--fg-faint); font-size: 12px; }
    .solved { border-top: 1px solid var(--line-soft); padding-top: 10px; display: flex; flex-direction: column; gap: 6px; flex: 1; }
    .solved small { color: var(--fg-faint); font-size: 12.5px; font-weight: 700; }
    .solved ul { margin: 0; padding: 0; list-style: none; display: grid; gap: 4px; }
    .solved li { position: relative; padding-inline-start: 14px; font-size: 14px; line-height: 1.4; }
    .solved li::before { content: ""; position: absolute; inset-inline-start: 0; top: 0.6em; width: 5px; height: 5px; border-radius: 50%; background: var(--c); }
    .cv { margin-top: auto; padding-top: 4px; color: var(--honey-text); font-size: 13.5px; font-weight: 700; }
    .empty { grid-column: 1 / -1; text-align: center; color: var(--fg-mute); padding: 32px 0; border: 1px dashed var(--line); border-radius: 6px; }
    .all { margin-top: 14px; text-align: end; }
    .all a { color: var(--honey-text); font-size: 14px; font-weight: 700; text-decoration: underline; text-underline-offset: 3px; }

    @container home (max-width: 720px) {
        .experts { grid-template-columns: minmax(0, 1fr); }
    }
    @container home (max-width: 560px) {
        .stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
</style>
