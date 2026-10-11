<script lang="ts">
    // חותמת מעוטרת וממורכזת מעל כותרת קומה: ענבר ("מבוקש: פתרון") או ירוק ("נמצא פתרון").
    let { text, tone = 'honey' }: { text: string; tone?: 'honey' | 'ok' } = $props();
</script>

<div class="stamp-row">
    <div class="stamp" class:ok={tone === 'ok'}>
        {#if tone === 'ok'}
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 10.5l4 4 8-9" /></svg>
        {:else}
            <svg viewBox="0 0 11 11" aria-hidden="true"><circle cx="5.5" cy="5.5" r="5.5" fill="currentColor" /></svg>
        {/if}{text}
    </div>
</div>

<style>
    .stamp-row { text-align: center; margin-bottom: 8px; }
    .stamp { --tone: var(--honey-text); --edge: var(--honey-deep); display: inline-flex; align-items: center; gap: 10px; border: 1.5px solid var(--edge); color: var(--tone); padding: 5px 14px; border-radius: 4px; font-family: var(--font-display); font-weight: 900; font-size: 17px; letter-spacing: 0.04em; transform: rotate(-1.5deg); }
    .stamp.ok { --tone: var(--ok); --edge: var(--ok); }
    .stamp svg { width: 11px; height: 11px; flex: none; }
    .stamp.ok svg { width: 15px; height: 15px; }
</style>
