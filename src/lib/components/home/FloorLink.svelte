<script lang="ts">
    // פס הפרדה בסוף כל קומה בדף הבית, עם קישור לדף המלא של אותו נושא.
    let { href, label, note = '' }: { href: string; label: string; note?: string } = $props();
</script>

<div class="floor-end">
    <div class="inner row">
        {#if note}<span class="note">{note}</span>{/if}
        <a class="btn btn-primary btn-sm" {href}>
            לדף המלא: {label}
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 10H4M9 5l-5 5 5 5" /></svg>
        </a>
    </div>
</div>

<style>
    .floor-end {
        background: color-mix(in srgb, var(--honey) 13%, var(--bg));
        border-block: 1px solid color-mix(in srgb, var(--honey-deep) 45%, transparent);
    }
    .row { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px 16px; padding-block: 10px; }
    .note { color: var(--fg-mute); font-size: 14px; min-width: 0; }
    .row :global(.btn) { margin-inline-start: auto; }
</style>
