<script lang="ts">
    import { formatTimeAgo, type Problem } from '$lib/problemsStore.svelte';
    import { catColor, catShort, fmt } from '$lib/homeData';
    import { EXPERTS } from '$lib/expertsData';
    import { adThenGo } from './nav';
    import SectionHead from './SectionHead.svelte';
    import Stamp from './Stamp.svelte';

    // הצעות הפתרון האחרונות שהועלו לבעיות פתוחות, מהחדשה לישנה. הבחירה והתשלום מגיעים אחר כך.
    let { problems, limit = 3 }: { problems: Problem[]; limit?: number } = $props();

    const recent = $derived(
        problems
            .flatMap((p) => p.solutions.map((s) => ({ s, p })))
            .sort((a, b) => b.s.createdAt - a.s.createdAt)
            .slice(0, limit)
    );
    const expertOf = (name: string) => EXPERTS.find((e) => e.n === name);
</script>

<section class="section" id="recent-solutions">
    <div class="inner">
        <SectionHead title="פתרונות אחרונים שהועלו" lede="הצעות שמומחים הגישו לבעיות פתוחות בימים האחרונים. בעלי הבעיה והשותפים בה בוחרים ביניהן." demo />

        <div class="rs-grid">
            {#each recent as { s, p } (s.id)}
                {@const ex = expertOf(s.solverName)}
                <article class="rs" style="--c:{catColor(p.category)}">
                    <div class="rs-top">
                        <span class="tag-c"><span class="dot" style="--c:{catColor(p.category)}"></span>{catShort(p.category)}</span>
                        <Stamp text="נמצא פתרון" tone="ok" compact />
                    </div>
                    <small class="rs-lbl">הבעיה</small>
                    <h3><a href="/problems/{p.id}" onclick={(e) => adThenGo(e, `/problems/${p.id}`)}>{p.title}</a></h3>
                    <small class="rs-lbl">ההצעה</small>
                    <p>{s.proposal}</p>
                    <div class="rs-foot">
                        <span class="rs-who">{#if ex}<a href="/experts/{ex.slug}">{s.solverName}</a>{:else}{s.solverName}{/if}<span class="rs-age">{formatTimeAgo(s.createdAt)}</span></span>
                        <span class="rs-ask"><span class="num">{fmt(s.askingPrice)}</span></span>
                    </div>
                </article>
            {:else}
                <div class="empty">עדיין לא הוגשו הצעות פתרון. הראשון שיגיש יופיע כאן.</div>
            {/each}
        </div>
    </div>
</section>

<style>
    .rs-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
    .rs { display: flex; flex-direction: column; gap: 4px; min-width: 0; background: var(--surface); border: 1px solid var(--line); border-radius: 6px; padding: 14px 18px 12px; transition: border-color 0.2s; }
    .rs:hover { border-color: color-mix(in srgb, var(--c) 60%, var(--line)); }
    .rs-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; font-size: 13px; }
    .tag-c { display: inline-flex; align-items: center; gap: 7px; font-weight: 700; color: var(--fg); }
    .rs-age { display: block; margin-top: 1px; font-size: 12.5px; font-weight: 400; color: var(--fg-faint); }
    .rs-lbl { display: block; color: var(--fg-faint); font-size: 12px; font-weight: 700; letter-spacing: 0.05em; margin-top: 6px; }
    h3 { font-size: 16.5px; font-weight: 800; line-height: 1.35; text-wrap: balance; }
    h3 a:hover { color: var(--honey-text); }
    p { color: var(--fg-mute); font-size: 14.5px; text-wrap: pretty; display: -webkit-box; -webkit-line-clamp: 3; line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
    .rs-foot { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: auto; padding-top: 10px; border-top: 1px dashed var(--line); }
    .rs-who { font-size: 14px; font-weight: 700; color: var(--fg); }
    .rs-who a:hover { color: var(--honey-text); text-decoration: underline; text-underline-offset: 3px; }
    .rs-ask { font-family: var(--font-display); font-weight: 900; font-size: 18px; color: var(--honey-text); }
    .empty { grid-column: 1 / -1; text-align: center; color: var(--fg-mute); padding: 28px 0; border: 1px dashed var(--line); border-radius: 6px; }

    @container home (max-width: 900px) {
        .rs-grid { grid-template-columns: minmax(0, 1fr); }
    }
    @container home (max-width: 520px) {
        /* בנייד: כרטיס קצר — בלי תוויות "הבעיה"/"ההצעה", ותיאור של שורתיים */
        .rs-grid { gap: 8px; }
        .rs { padding: 10px 12px 8px; gap: 2px; }
        .rs-lbl { display: none; }
        h3 { font-size: 15px; line-height: 1.3; }
        p { font-size: 13.5px; -webkit-line-clamp: 2; line-clamp: 2; }
        .rs-foot { padding-top: 6px; margin-top: 4px; }
        .rs-ask { font-size: 16px; }
    }
</style>
