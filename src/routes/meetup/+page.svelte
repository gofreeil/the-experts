<script lang="ts">
    import '$lib/components/home/home.css';
    import PageHero from '$lib/components/home/PageHero.svelte';
    import MeetupSection from '$lib/components/home/MeetupSection.svelte';
    import ArchiveSection from '$lib/components/home/ArchiveSection.svelte';
    import FloorLink from '$lib/components/home/FloorLink.svelte';
    import { MEETUP } from '$lib/homeData';

    const ABOUT = [
        { t: 'מתי', d: `אחת ל-${MEETUP.periodDays} ימים, בזום, 90 דקות.` },
        { t: 'איזה בעיות עולות', d: 'הבעיות לדיון נבחרות לפי גובה הפרס והצבעת הקהילה.' },
        { t: 'מה יוצא מזה', d: 'בסוף המפגש מצביעים איזה פתרון מקבל את הפרס.' }
    ];
</script>

<div class="home" dir="rtl">
    <PageHero href="/meetup">
        {#snippet actions()}<a class="btn btn-ghost btn-sm" href="/archive">מפגשים קודמים</a>{/snippet}
    </PageHero>

    <MeetupSection />

    <section class="section alt compact">
        <div class="inner">
            <div class="sec-head">
                <div><div class="eyebrow">על המפגש</div></div>
                <a class="btn btn-ghost btn-sm" href="/archive">לארכיון המפגשים</a>
            </div>
            <ul class="about">
                {#each ABOUT as a}
                    <li><b>{a.t}</b><p>{a.d}</p></li>
                {/each}
            </ul>
        </div>
    </section>

    <ArchiveSection preview headTitle="ארכיון ודיונים" />
    <FloorLink href="/archive" label="ארכיון ודיונים" note="כל המפגשים הקודמים והדיונים הפעילים" />
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
</style>
