<script lang="ts">
    import { onMount } from 'svelte';
    import '$lib/components/home/home.css';
    import PageHero from '$lib/components/home/PageHero.svelte';
    import { problemsStore, seedProblems } from '$lib/problemsStore.svelte';
    import { teamBySlug } from '$lib/teamsData';
    import { CATS, catColor, fmt } from '$lib/homeData';

    // הרינדור הראשון משתמש בבעיות ההתחלתיות (זהה בשרת ובלקוח), אחריו עוברים לנתוני הדפדפן
    let mounted = $state(false);
    onMount(() => {
        problemsStore.refresh();
        mounted = true;
    });
    const open = $derived((mounted ? problemsStore.items : seedProblems).filter((p) => p.status === 'open'));
</script>

<div class="home" dir="rtl">
    <PageHero href="/categories">
        {#snippet actions()}<a class="btn btn-primary btn-sm" href="/problems/new">העלו בעיה</a>{/snippet}
    </PageHero>

    <section class="section compact">
        <div class="inner">
            <div class="cats">
                {#each CATS as c}
                    {@const team = teamBySlug(c.slug)}
                    {@const ps = open.filter((p) => p.category === c.slug)}
                    {@const sum = ps.reduce((s, p) => s + p.bounty, 0)}
                    <article class="cat" style="--c:{catColor(c.slug)}">
                        <div class="top">
                            <span class="ico" aria-hidden="true">
                                {#if team?.image}<img src={team.image} alt="" width="56" height="56" loading="lazy" decoding="async" />{:else}{team?.emoji ?? ''}{/if}
                            </span>
                            <h2><a class="name" href="/categories/{c.slug}">{team?.name ?? c.short}</a></h2>
                        </div>
                        {#if team?.desc}<p class="desc">{team.desc}</p>{/if}
                        <dl class="stats">
                            <div><dt>בעיות פתוחות</dt><dd class="num">{ps.length}</dd></div>
                            <div><dt>סך הפרסים</dt><dd class="num">{fmt(sum)}</dd></div>
                            <div><dt>מומחים בצוות</dt><dd class="num">{c.experts}</dd></div>
                            <div><dt>זמן פתרון חציוני</dt><dd>{c.days} ימים</dd></div>
                        </dl>
                        <div class="acts">
                            <a class="btn btn-primary btn-sm" href="/problems?cat={c.slug}">בעיות בתחום</a>
                            <a class="btn btn-ghost btn-sm" href="/categories/{c.slug}">דף הצוות</a>
                        </div>
                    </article>
                {/each}
            </div>
        </div>
    </section>
</div>

<style>
    .compact { padding-block: clamp(20px, 3.4cqi, 36px); }
    .cats { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
    .cat { display: flex; flex-direction: column; gap: 10px; background: var(--surface); border: 1px solid var(--line); border-top: 4px solid var(--c); border-radius: 8px; padding: 16px 18px; min-width: 0; }
    .top { display: flex; align-items: center; gap: 12px; }
    .ico { width: 52px; height: 52px; flex: none; display: grid; place-items: center; font-size: 24px; background: color-mix(in srgb, var(--c) 38%, var(--surface)); border-radius: 14px; overflow: hidden; }
    .ico img { width: 100%; height: 100%; object-fit: cover; }
    h2 { font-size: 19px; font-weight: 800; line-height: 1.25; }
    .name:hover { color: var(--honey-text); text-decoration: underline; text-underline-offset: 3px; }
    .desc { color: var(--fg-mute); font-size: 14.5px; white-space: pre-line; text-wrap: pretty; }
    .stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; margin: 0; padding-top: 10px; border-top: 1px solid var(--line-soft); }
    .stats dt { color: var(--fg-faint); font-size: 12px; line-height: 1.3; }
    .stats dd { margin: 2px 0 0; font-family: var(--font-display); font-weight: 900; font-size: 17px; line-height: 1.2; }
    .acts { display: flex; flex-wrap: wrap; gap: 8px; margin-top: auto; }

    @container home (max-width: 820px) {
        .cats { grid-template-columns: minmax(0, 1fr); }
    }
    @container home (max-width: 420px) {
        .stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
</style>
