<script lang="ts">
    import '$lib/components/home/home.css';
    import PageHero from '$lib/components/home/PageHero.svelte';
    import ExpertsSection from '$lib/components/home/ExpertsSection.svelte';
    import { useI18n } from '$lib/i18n/context';

    const i18n = useI18n();
</script>

<div class="home">
    <PageHero href="/experts">
        {#snippet actions()}<a class="btn btn-primary btn-sm" href="/register">{i18n.t('experts.joinCta')}</a>{/snippet}
    </PageHero>

    <ExpertsSection />
</div>
