<script lang="ts">
    import '$lib/components/home/home.css';
    import PageHero from '$lib/components/home/PageHero.svelte';
    import ArchiveSection from '$lib/components/home/ArchiveSection.svelte';
</script>

<div class="home" dir="rtl">
    <PageHero href="/archive">
        {#snippet actions()}<a class="btn btn-primary btn-sm" href="/meetup">למפגש הבא</a>{/snippet}
    </PageHero>

    <ArchiveSection />
</div>
