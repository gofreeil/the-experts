<script lang="ts">
    import type { Problem } from '$lib/problemsStore.svelte';
    import { NEED_PREFIX, catColor, catShort, fmt, backersOf, PLEDGE_AMOUNTS } from '$lib/homeData';
    import { adThenGo } from './nav';
    import FancyHeading from './FancyHeading.svelte';
    import Stamp from './Stamp.svelte';

    let { wanted, onpledge }: { wanted: Problem[]; onpledge?: (id: string, amount: number) => void } = $props();

    // אישור קצר אחרי הוספה לפרס, במקום הכפתורים של אותו כרטיס
    let thanks = $state<{ id: string; amt: number } | null>(null);
    let thanksTimer: ReturnType<typeof setTimeout> | undefined;
    $effect(() => () => clearTimeout(thanksTimer));

    function pledge(p: Problem, amt: number) {
        onpledge?.(p.id, amt);
        thanks = { id: p.id, amt };
        clearTimeout(thanksTimer);
        thanksTimer = setTimeout(() => (thanks = null), 2200);
    }

    // תמונה של הבעיה עצמה אם יש, אחרת איור לכל תחום: static/images/problems/<תחום>.svg
    const ART = ['law', 'economy', 'education', 'agriculture', 'technology', 'health', 'ethics', 'rights'];
    const artOf = (p: Problem) => p.image ?? `/images/problems/${ART.includes(p.category) ? p.category : 'ethics'}.svg`;
</script>

{#snippet group(list: Problem[], label: string)}
    <div class="grid" role="group" aria-label={label}>
        {#each list as p (p.id)}
            <div class="cell" style="--c:{catColor(p.category)}">
                <a class="card" href="/problems/{p.id}" aria-label="{p.title}, פרס {p.bounty} שקלים" onclick={(e) => adThenGo(e, `/problems/${p.id}`)}>
                    <span class="c-media">
                        <img class="c-img" src={artOf(p)} alt="" width="400" height="260" loading="lazy" decoding="async" />
                        <span class="c-price"><span class="num">{fmt(p.bounty)}</span></span>
                        <span class="c-stamp"><Stamp text="מבוקש: פתרון" compact /></span>
                    </span>
                    <span class="c-body">
                        <span class="c-cat">
                            <span class="dot"></span>{catShort(p.category)}
                            <span class="c-sub">{p.type === 'community' ? `${backersOf(p)} תורמים` : 'פרטית'}</span>
                        </span>
                        <span class="c-title"><span class="need">{NEED_PREFIX}</span> {p.title}</span>
                    </span>
                </a>
                <div class="pledge">
                    {#if p.type !== 'community'}
                        <span class="pl-l">בעיה פרטית, הפרס ממבקש יחיד</span>
                    {:else if thanks?.id === p.id}
                        <span class="thanks" role="status">✓ נוספו <span class="num">{fmt(thanks.amt)}</span> לפרס, תודה!</span>
                    {:else}
                        <span class="pl-l">הוסיפו לפרס</span>
                        {#each PLEDGE_AMOUNTS as amt}
                            <button class="pl-b" type="button" aria-label="הוסיפו {amt} שקלים לפרס: {p.title}" onclick={() => pledge(p, amt)}>+{amt}</button>
                        {/each}
                    {/if}
                </div>
            </div>
        {/each}
    </div>
{/snippet}

<div class="mapbox">
    <FancyHeading title="המבוקשים ביותר" />
    {@render group(wanted, 'המבוקשים ביותר')}

</div>

<style>
    .mapbox { min-width: 0; max-width: 1000px; margin-inline: auto; }

    /* כל הבעיות באותו גודל ובאותה צורה: שלוש בשורה */
    .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-auto-rows: 1fr; gap: 10px; margin-top: 14px; }
    .cell { display: flex; flex-direction: column; gap: 6px; min-width: 0; transition: opacity 0.25s; }
    .card {
        display: flex; flex-direction: column; align-items: stretch; gap: 6px; min-width: 0; flex: 1;
        padding: 8px 8px 12px; text-align: right; color: var(--fg); cursor: pointer;
        background: var(--surface-2); border: 1px solid var(--line); border-radius: 14px;
        transition: border-color 0.15s, background 0.15s;
    }
    .card:hover, .card:focus-visible { border-color: var(--honey-deep); background: #fff; outline: none; }
    .c-media { position: relative; display: block; flex: none; }
    .c-img { display: block; width: 100%; height: auto; aspect-ratio: 16 / 10; object-fit: cover; border-radius: 9px; }
    .c-stamp { position: absolute; inset-block-start: 6px; inset-inline-end: 6px; }
    .c-price { position: absolute; inset-block-end: 6px; inset-inline-start: 6px; padding: 2px 10px; border-radius: 999px; background: var(--honey); color: var(--honey-ink); font-family: var(--font-display); font-weight: 900; font-size: 16px; line-height: 1.4; box-shadow: 0 2px 6px rgba(10, 45, 80, 0.25); }
    .c-body { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
    .c-cat { display: flex; align-items: center; gap: 6px; padding-inline: 4px; font-size: 12px; font-weight: 700; color: var(--fg-mute); }
    .c-cat .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--c); flex: none; }
    .c-sub { margin-inline-start: auto; font-weight: 500; color: var(--fg-faint); }
    .c-title { padding-inline: 4px; font-size: 13.5px; font-weight: 700; line-height: 1.3; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 5; line-clamp: 5; overflow: hidden; text-wrap: balance; }

    .pledge { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; min-height: 32px; padding-inline: 4px; }
    .pl-l { margin-inline-end: auto; font-size: 12.5px; color: var(--fg-mute); }
    .pl-b { padding: 4px 11px; border-radius: 6px; border: 1px solid var(--line); background: var(--surface-2); font-size: 13px; font-weight: 700; line-height: 1.4; transition: border-color 0.15s, color 0.15s; }
    .pl-b:hover { border-color: var(--honey-deep); color: var(--honey-text); }
    .thanks { font-size: 13px; font-weight: 700; color: var(--ok); }


    @container home (min-width: 800px) {
        .c-img { aspect-ratio: 16 / 8; }
        .c-title { font-size: 15.5px; }
    }
    @container home (max-width: 560px) {
        /* בנייד: כרטיס בשורה, תמונה בצד */
        .grid { grid-template-columns: minmax(0, 1fr); grid-auto-rows: auto; }
        .card { flex-direction: row; align-items: center; gap: 10px; padding: 8px; }
        .c-media { width: 42%; }
        .c-body { flex: 1; }
        .c-title { font-size: 14px; }
        .c-stamp { inset-block-start: 4px; inset-inline-end: 4px; transform: scale(0.88); transform-origin: top right; }
        /* כפתורי הוספה לפרס: יעד לחיצה נוח לאגודל */
        .pledge { gap: 8px; }
        .pl-b { min-height: 38px; padding-inline: 14px; font-size: 14px; }
    }
</style>
