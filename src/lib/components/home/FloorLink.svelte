<script lang="ts">
    import OrnamentDivider from './OrnamentDivider.svelte';
    import { useI18n } from '$lib/i18n/context';

    // סוף כל נושא בדף הבית: קישור לדף המלא של אותו נושא, ומתחתיו מחיצה בעיצוב חכמי העדה.
    let { href, label, note = '' }: { href: string; label: string; note?: string } = $props();

    const i18n = useI18n();
</script>

<div class="inner floor">
    <div class="above">
        <a class="floor-link" {href}>
            {i18n.t('home.fullPage', { label })}
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 10H4M9 5l-5 5 5 5" /></svg>
        </a>
        {#if note}<span class="note">{note}</span>{/if}
    </div>
    <OrnamentDivider />
</div>

<style>
    /* שוליים שליליים: מקרבים את המחיצה לקישור שמעליה (למחיצה בלי תוכן יש שוליים גדולים משלה) */
    .above { display: flex; flex-direction: column; align-items: center; gap: 4px; margin-top: 14px; margin-bottom: -10px; text-align: center; }
    .floor-link { display: inline-flex; align-items: center; gap: 6px; color: var(--honey-text); font-size: 16px; font-weight: 800; text-decoration: none; }
    .floor-link:hover { color: var(--honey-deep); }
    .floor-link svg { width: 16px; height: 16px; flex: none; }
    /* החץ מצויר מצביע שמאלה (קדימה בעברית); באנגלית הוא מצביע ימינה */
    :global(html[dir='ltr']) .floor-link svg { transform: scaleX(-1); }
    .note { color: var(--fg-mute); font-size: 13px; line-height: 1.3; text-wrap: balance; }

    @container home (max-width: 520px) {
        .above { margin-top: 6px; margin-bottom: -6px; }
        .floor-link { font-size: 15px; }
    }
</style>
