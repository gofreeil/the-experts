<script lang="ts">
    import '$lib/components/home/home.css';
    import PageHero from '$lib/components/home/PageHero.svelte';
    import SolvedSection from '$lib/components/home/SolvedSection.svelte';
</script>

<div class="home" dir="rtl">
    <PageHero href="/solved">
        {#snippet actions()}<a class="btn btn-ghost btn-sm" href="/paid">כסף שחולק</a>{/snippet}
    </PageHero>

    <SolvedSection />
</div>
