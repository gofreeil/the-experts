<script lang="ts">
    import OrnamentDivider from './OrnamentDivider.svelte';

    // סוף כל נושא בדף הבית: מחיצה בעיצוב חכמי העדה, ובאמצעה קישור לדף המלא של אותו נושא.
    let { href, label, note = '' }: { href: string; label: string; note?: string } = $props();
</script>

<div class="inner floor">
    <OrnamentDivider>
        <a class="floor-link" {href}>
            לדף המלא: {label}
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 10H4M9 5l-5 5 5 5" /></svg>
        </a>
        {#if note}<span class="note">{note}</span>{/if}
    </OrnamentDivider>
</div>

<style>
    .floor-link { display: inline-flex; align-items: center; gap: 6px; color: var(--honey-text); font-size: 16px; font-weight: 800; text-decoration: underline; text-decoration-thickness: 1.5px; text-underline-offset: 4px; }
    .floor-link:hover { text-decoration-thickness: 2.5px; }
    .floor-link svg { width: 16px; height: 16px; flex: none; }
    .note { color: var(--fg-mute); font-size: 13px; line-height: 1.3; text-wrap: balance; }
</style>
