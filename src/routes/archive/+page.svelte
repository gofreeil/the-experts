<script lang="ts">
    import '$lib/components/home/home.css';
    import PageHero from '$lib/components/home/PageHero.svelte';
    import ArchiveSection from '$lib/components/home/ArchiveSection.svelte';
    import { useI18n } from '$lib/i18n/context';

    const i18n = useI18n();
</script>

<div class="home">
    <PageHero href="/archive">
        {#snippet actions()}<a class="btn btn-primary btn-sm" href="/meetup">{i18n.t('archive.toNext')}</a>{/snippet}
    </PageHero>

    <ArchiveSection />
</div>
