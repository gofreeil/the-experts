<script lang="ts">
    // מזריק סכמת schema.org (JSON-LD) ל-<head> — מרונדר גם ב-SSR.
    // כל "<" בטקסט מוחלף ב-< כדי שסגירת תגית בתוך התוכן לא תשבור את הסקריפט.
    let { schema }: { schema: object | object[] } = $props();
    const json = $derived(JSON.stringify(schema).replace(/</g, '\\u003c'));
</script>

<svelte:head>
    {@html `<script type="application/ld+json">${json}</` + 'script>'}
</svelte:head>
