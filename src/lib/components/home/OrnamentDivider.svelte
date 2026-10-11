<script lang="ts">
    import type { Snippet } from 'svelte';

    // הפרדה בעיצוב של אתר חכמי העדה: שני חיצי ענבר מתחדדים עם ❦ באמצע.
    // עם תוכן (children) - התוכן יושב באמצע בין שני ❦, למשל קישור לדף המלא של הנושא.
    let { children }: { children?: Snippet } = $props();
</script>

<div class="divider" class:has-mid={!!children} aria-hidden={children ? undefined : 'true'}>
    <div class="arrow a" aria-hidden="true"></div>
    <span class="orn" aria-hidden="true">❦</span>
    {#if children}
        <div class="mid">{@render children()}</div>
        <span class="orn" aria-hidden="true">❦</span>
    {/if}
    <div class="arrow b" aria-hidden="true"></div>
</div>

<style>
    .divider { display: flex; align-items: center; gap: 12px; margin-block: 22px; }
    .divider.has-mid { margin-block: 14px; }
    .arrow { flex: 1; min-width: 12px; height: 8px; box-shadow: 0 1px 2px rgba(120, 53, 15, 0.35); }
    .a { background: linear-gradient(to left, transparent, rgba(245, 158, 11, 0.7), #b45309); clip-path: polygon(0% 0%, 0% 100%, 100% 50%); }
    .b { background: linear-gradient(to right, transparent, rgba(245, 158, 11, 0.7), #b45309); clip-path: polygon(0% 50%, 100% 0%, 100% 100%); }
    .orn { flex: none; font-size: 24px; color: #b45309; text-shadow: 0 1px 1px rgba(120, 53, 15, 0.4); }
    .mid { flex: 0 1 auto; min-width: 0; display: flex; flex-direction: column; align-items: center; gap: 4px; text-align: center; }

    @container home (max-width: 520px) {
        .has-mid { gap: 6px; }
        .has-mid .orn { font-size: 18px; }
    }
</style>
