<script lang="ts">
    import type { Snippet } from 'svelte';

    // כותרת קומפקטית לדפי פרט (רזומה של מומחה, דף צוות): תמונה וכותרת בשורה אחת, משפט תיאור, כפתורים קטנים.
    let { title, lede = '', meta = '', backHref, backLabel, lead, actions }: {
        title: string;
        lede?: string;
        meta?: string;
        backHref: string;
        backLabel: string;
        lead?: Snippet;
        actions?: Snippet;
    } = $props();
</script>

<svelte:head>
    <title>{title} | כוורת המומחים</title>
    <meta name="description" content={meta || lede} />
</svelte:head>

<header class="phead">
    <div class="inner">
        <div class="row">
            <h1>{@render lead?.()}<span>{title}</span></h1>
            <div class="acts">
                {@render actions?.()}
                <a class="btn btn-ghost btn-sm" href={backHref}>{backLabel}</a>
            </div>
        </div>
        {#if lede}<p>{lede}</p>{/if}
    </div>
</header>

<style>
    .phead { padding-block: clamp(14px, 2.6cqi, 24px); border-bottom: 1px solid var(--line-soft); }
    .row { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px 16px; }
    h1 { display: flex; align-items: center; gap: 12px; min-width: 0; font-family: var(--font-display); font-weight: 900; font-size: clamp(24px, 3.8cqi, 36px); line-height: 1.15; }
    .acts { display: flex; flex-wrap: wrap; gap: 8px; }
    p { color: var(--fg-mute); margin-top: 6px; font-size: 15px; white-space: pre-line; text-wrap: pretty; max-width: 80ch; }
</style>
