<script lang="ts">
    import '$lib/components/home/home.css';
    import DetailHero from '$lib/components/home/DetailHero.svelte';
    import { DEMO_DATA, catColor, fmt, fmtShort } from '$lib/homeData';
    import { publicSolvedBy, privateSolvedCount, expertBySlug } from '$lib/expertsData';
    import { teamBySlug } from '$lib/teamsData';
    import { useI18n } from '$lib/i18n/context';
    import type { PageProps } from './$types';

    let { data }: PageProps = $props();

    const i18n = useI18n();
    // data.slug מגיע מה-load (כולל 404); הרזומה נפתר בשפה הנוכחית
    const source = $derived(expertBySlug(data.slug)!);
    const e = $derived(i18n.l(source));
    const team = $derived(teamBySlug(e.c, i18n.locale));
    const pub = $derived(i18n.l(publicSolvedBy(e.slug)));
    const priv = $derived(privateSolvedCount(source));
</script>

<div class="home">
    <DetailHero
        title={e.n}
        lede={e.role}
        meta={i18n.t('expert.metaDesc', { name: e.n, role: e.role, solved: e.solved })}
        backHref="/experts?cat={e.c}"
        backLabel={i18n.t('expert.backToAll')}
    >
        {#snippet lead()}<span class="av" style="--c2:{catColor(e.c)}" aria-hidden="true">{e.ini}</span>{/snippet}
        {#snippet actions()}<a class="btn btn-primary btn-sm" href="/problems/new?category={e.c}">{i18n.t('expert.postInField')}</a>{/snippet}
    </DetailHero>

    <section class="section compact">
        <div class="inner">
            <p class="meta">
                <a class="team" href="/categories/{e.c}"><span class="dot" style="--c:{catColor(e.c)}"></span>{team?.name ?? e.c}</a>
                <span>{i18n.t('expert.since', { year: String(e.since) })}</span>
                {#if DEMO_DATA}<span class="demo-tag" style="margin:0">{i18n.t('common.demoData')}</span>{/if}
            </p>
            <p class="bio">{e.bio}</p>

            <div class="stats">
                <div><b class="num">{e.solved}</b><span>{i18n.t('experts.statSolved')}</span></div>
                <div><b class="g"><span class="num">{fmtShort(e.earned)}</span></b><span>{i18n.t('experts.statEarned')}</span></div>
                <div><b class="num">{e.rate}</b><span>{i18n.t('experts.statRating')}</span></div>
                <div><b>{e.rt}</b><span>{i18n.t('experts.statResponse')}</span></div>
                <div><b class="num">{e.open}</b><span>{i18n.t('expert.handsNow')}</span></div>
            </div>

            <div class="grid">
                <section class="main" aria-labelledby="pub-h">
                    <h2 id="pub-h">{i18n.t('cats.publicSolved')} <span class="num cnt">{pub.length}</span></h2>
                    {#if pub.length}
                        <ul class="solved">
                            {#each pub as s (s.t)}
                                <li>
                                    <div class="sv-top">
                                        <h3>{s.t}</h3>
                                        <b class="amt"><span class="num">{fmt(s.amt)}</span></b>
                                    </div>
                                    {#if s.d}<p>{s.d}</p>{/if}
                                    <small>{i18n.t('expert.solvedWithin', { days: s.days })}</small>
                                </li>
                            {/each}
                        </ul>
                    {:else}
                        <p class="empty">{i18n.t('expert.noPublic')}</p>
                    {/if}
                    {#if priv > 0}
                        <p class="priv"><b class="num">{priv}</b> {i18n.t('expert.privNote')}</p>
                    {/if}
                </section>

                <aside class="side">
                    <div class="box">
                        <h2>{i18n.t('expert.skills')}</h2>
                        <div class="skills">
                            {#each e.skills as s}<span class="chip">{s}</span>{/each}
                        </div>
                    </div>
                    <div class="box">
                        <h2>{i18n.t('expert.credentials')}</h2>
                        <ul class="creds">
                            {#each e.creds as c}<li>{c}</li>{/each}
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    </section>
</div>

<style>
    .compact { padding-block: clamp(16px, 2.8cqi, 30px); }
    .av { width: 48px; height: 54px; display: grid; place-items: center; flex: none; font-family: system-ui, sans-serif; font-size: 17px; font-weight: 800; color: #0a1d33; background: var(--c2, var(--honey)); border-radius: 50%; box-shadow: 0 0 0 2px var(--surface); }
    .meta { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 16px; color: var(--fg-mute); font-size: 14.5px; }
    .team { display: inline-flex; align-items: center; gap: 7px; font-weight: 700; color: var(--fg); }
    .team:hover { color: var(--honey-text); text-decoration: underline; text-underline-offset: 3px; }
    .bio { margin-top: 8px; max-width: 70ch; color: var(--fg); text-wrap: pretty; }

    .stats { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 10px; margin-top: 16px; padding: 14px 0; border-block: 1px solid var(--line-soft); }
    .stats b { display: block; font-family: var(--font-display); font-weight: 900; font-size: 22px; line-height: 1.1; }
    .stats b.g { color: var(--honey-text); }
    .stats > div > span { color: var(--fg-faint); font-size: 12.5px; }

    .grid { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 4fr); gap: clamp(18px, 3cqi, 34px); margin-top: 20px; align-items: start; }
    h2 { font-size: 18px; font-weight: 800; line-height: 1.3; }
    .cnt { color: var(--fg-faint); font-weight: 500; }

    .solved { list-style: none; margin: 12px 0 0; padding: 0; display: grid; gap: 10px; }
    .solved li { background: var(--surface); border: 1px solid var(--line); border-radius: 8px; padding: 14px 16px; }
    .sv-top { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
    .sv-top h3 { font-size: 16px; font-weight: 800; line-height: 1.35; }
    .amt { flex: none; font-family: var(--font-display); font-weight: 900; font-size: 18px; color: var(--honey-text); }
    .solved p { margin-top: 4px; color: var(--fg-mute); font-size: 14.5px; text-wrap: pretty; }
    .solved small { display: block; margin-top: 6px; color: var(--fg-faint); font-size: 12.5px; }
    .empty { margin-top: 12px; padding: 24px 0; text-align: center; color: var(--fg-mute); border: 1px dashed var(--line); border-radius: 6px; }
    .priv { margin-top: 12px; color: var(--fg-faint); font-size: 13.5px; }
    .priv b { color: var(--fg-mute); }

    .side { display: grid; gap: 14px; }
    .box { background: var(--surface); border: 1px solid var(--line); border-radius: 8px; padding: 14px 16px; }
    .skills { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
    .skills .chip { padding: 4px 11px; font-size: 13.5px; }
    .creds { list-style: none; margin: 8px 0 0; padding: 0; display: grid; gap: 6px; color: var(--fg-mute); font-size: 14.5px; }
    .creds li { padding-inline-start: 14px; position: relative; }
    .creds li::before { content: ""; position: absolute; inset-inline-start: 0; top: 0.7em; width: 5px; height: 5px; border-radius: 50%; background: var(--honey); }

    @container home (max-width: 760px) {
        .grid { grid-template-columns: minmax(0, 1fr); }
    }
    @container home (max-width: 560px) {
        .stats { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    }
    @container home (max-width: 400px) {
        .stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
</style>
