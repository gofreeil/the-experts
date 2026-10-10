<script lang="ts">
    import '$lib/components/home/home.css';
    import PageHero from '$lib/components/home/PageHero.svelte';
    import ExpertsSection from '$lib/components/home/ExpertsSection.svelte';
</script>

<div class="home" dir="rtl">
    <PageHero href="/experts">
        {#snippet actions()}<a class="btn btn-primary btn-sm" href="/register">הצטרפו כמומחים</a>{/snippet}
    </PageHero>

    <ExpertsSection />
</div>
