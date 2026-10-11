<script lang="ts">
    import type { Snippet } from 'svelte';
    import { DEMO_DATA } from '$lib/homeData';
    import FancyHeading from './FancyHeading.svelte';

    // כותרת נושא בדף הבית בעיצוב חכמי העדה: כותרת ❦ ממורכזת, משפט הסבר אחד, ופעולות (אופציונלי).
    let { title, lede = '', demo = false, children }: { title: string; lede?: string; demo?: boolean; children?: Snippet } = $props();
</script>

<header class="sec-fancy">
    <FancyHeading as="h2" {title} />
    {#if lede || (demo && DEMO_DATA)}
        <p class="lede">{#if demo && DEMO_DATA}<span class="demo-tag" style="margin:0 0 0 8px">נתוני הדגמה</span>{/if}{lede}</p>
    {/if}
    {#if children}<div class="acts">{@render children()}</div>{/if}
</header>

<style>
    .sec-fancy { text-align: center; margin-bottom: clamp(14px, 2.4cqi, 24px); }
    .lede { max-width: 62ch; margin-inline: auto; margin-top: 8px; font-size: 15px; }
    .acts { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-top: 10px; }

    @container home (max-width: 520px) {
        .sec-fancy { margin-bottom: 10px; }
        .sec-fancy .lede { margin-top: 4px; font-size: 13.5px; line-height: 1.4; }
    }
</style>
