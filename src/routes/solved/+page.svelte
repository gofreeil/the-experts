<script lang="ts">
    import '$lib/components/home/home.css';
    import PageHero from '$lib/components/home/PageHero.svelte';
    import SolvedSection from '$lib/components/home/SolvedSection.svelte';
    import { navItem } from '$lib/navMenu';
    import { useI18n } from '$lib/i18n/context';

    const i18n = useI18n();
</script>

<div class="home">
    <PageHero href="/solved">
        {#snippet actions()}<a class="btn btn-ghost btn-sm" href="/paid">{i18n.l(navItem('/paid').title)}</a>{/snippet}
    </PageHero>

    <SolvedSection />
</div>
