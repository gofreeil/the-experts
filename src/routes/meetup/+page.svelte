<script lang="ts">
    import '$lib/components/home/home.css';
    import PageHero from '$lib/components/home/PageHero.svelte';
    import MeetupSection from '$lib/components/home/MeetupSection.svelte';
    import ArchiveSection from '$lib/components/home/ArchiveSection.svelte';
    import FloorLink from '$lib/components/home/FloorLink.svelte';
    import { MEETUP } from '$lib/homeData';
    import { navItem } from '$lib/navMenu';
    import { useI18n } from '$lib/i18n/context';

    const i18n = useI18n();

    const about = $derived([
        { t: i18n.t('meetup.aboutWhen'), d: i18n.t('meetup.aboutWhenBody', { days: MEETUP.periodDays }) },
        { t: i18n.t('meetup.aboutWhich'), d: i18n.t('meetup.aboutWhichBody') },
        { t: i18n.t('meetup.aboutResult'), d: i18n.t('meetup.aboutResultBody') }
    ]);
</script>

<div class="home">
    <PageHero href="/meetup">
        {#snippet actions()}<a class="btn btn-ghost btn-sm" href="/archive">{i18n.t('meetup.previous')}</a>{/snippet}
    </PageHero>

    <MeetupSection />

    <section class="section alt compact">
        <div class="inner">
            <div class="sec-head">
                <div><div class="eyebrow">{i18n.t('meetup.about')}</div></div>
                <a class="btn btn-ghost btn-sm" href="/archive">{i18n.t('meetup.toArchive')}</a>
            </div>
            <ul class="about">
                {#each about as a}
                    <li><b>{a.t}</b><p>{a.d}</p></li>
                {/each}
            </ul>
        </div>
    </section>

    <ArchiveSection preview headTitle={i18n.l(navItem('/archive').title)} />
    <FloorLink href="/archive" label={i18n.l(navItem('/archive').title)} note={i18n.t('meetup.archiveNote')} />
</div>

<style>
    .compact { padding-block: clamp(20px, 3.4cqi, 36px); }
    .about { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
    .about li { background: var(--surface); border: 1px solid var(--line); border-radius: 8px; padding: 14px 16px; }
    .about b { font-size: 16px; font-weight: 800; }
    .about p { color: var(--fg-mute); font-size: 14.5px; margin-top: 2px; text-wrap: pretty; }

    @container home (max-width: 760px) {
        .about { grid-template-columns: minmax(0, 1fr); }
    }
    @container home (max-width: 520px) {
        .compact { padding-block: 12px; }
        .about { gap: 6px; }
        .about li { padding: 8px 12px; }
        .about b { font-size: 15px; }
        .about p { font-size: 13.5px; margin-top: 0; }
    }
</style>
