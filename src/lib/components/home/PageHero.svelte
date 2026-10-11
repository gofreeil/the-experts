<script lang="ts">
    import type { Snippet } from 'svelte';
    import { navItem } from '$lib/navMenu';

    // כותרת קומפקטית לדפים הנפרדים: אייקון וכותרת בשורה אחת, משפט אחד, כפתורים קטנים.
    let { href, actions }: { href: string; actions?: Snippet } = $props();

    const item = $derived(navItem(href));
</script>

<svelte:head>
    <title>{item.title} | כוורת המומחים</title>
    <meta name="description" content={item.lede} />
</svelte:head>

<header class="phead">
    <div class="inner">
        <div class="row">
            <h1><span class="ico" aria-hidden="true">{item.icon}</span>{item.title}</h1>
            <div class="acts">
                {@render actions?.()}
                <a class="btn btn-ghost btn-sm" href="/">← לדף הבית</a>
            </div>
        </div>
        <p>{item.lede}</p>
    </div>
</header>

<style>
    .phead { padding-block: clamp(14px, 2.6cqi, 24px); border-bottom: 1px solid var(--line-soft); }
    .row { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px 16px; }
    h1 { display: flex; align-items: center; gap: 10px; font-family: var(--font-display); font-weight: 900; font-size: clamp(24px, 3.8cqi, 36px); line-height: 1.15; }
    .ico { font-size: 0.8em; }
    .acts { display: flex; flex-wrap: wrap; gap: 8px; }
    p { color: var(--fg-mute); margin-top: 4px; font-size: 15px; }

    @container home (max-width: 520px) {
        /* בנייד: כותרת וכפתור הפעולה בשורה אחת; "לדף הבית" מוסתר כי הלוגו בהדר מוביל הביתה */
        .phead { padding-block: 10px; }
        .row { flex-wrap: nowrap; gap: 8px; }
        h1 { font-size: 22px; gap: 8px; min-width: 0; }
        .acts a[href="/"] { display: none; }
        p { font-size: 14px; line-height: 1.4; }
    }
</style>
