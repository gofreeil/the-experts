<script lang="ts">
    import '$lib/components/home/home.css';
    import PageHero from '$lib/components/home/PageHero.svelte';
    import { STEPS } from '$lib/homeData';
    import { useI18n } from '$lib/i18n/context';

    const i18n = useI18n();
    const steps = $derived(i18n.l(STEPS));
</script>

<div class="home">
    <PageHero href="/how-it-works">
        {#snippet actions()}<a class="btn btn-primary btn-sm" href="/problems/new">{i18n.t('common.postProblem')}</a>{/snippet}
    </PageHero>

    <section class="section compact">
        <div class="inner">
            <ol class="steps">
                {#each steps as s, i}
                    <li class="step">
                        <div class="step-n">{i + 1}</div>
                        <div class="step-body">
                            <h2>{s.t}</h2>
                            <p>{s.d}</p>
                            <ul>
                                {#each s.more as m}<li>{m}</li>{/each}
                            </ul>
                        </div>
                    </li>
                {/each}
            </ol>

            <p class="trust">
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 2l6.5 2.5v5c0 4-2.7 6.8-6.5 8.5-3.8-1.7-6.5-4.5-6.5-8.5v-5z" /><path d="M7 10l2.2 2.2L13.2 8" /></svg>
                <span>{i18n.t('how.trust')}</span>
            </p>

            <div class="cta">
                <a class="btn btn-primary" href="/problems/new">{i18n.t('home.cta')}</a>
            </div>
        </div>
    </section>
</div>

<style>
    .compact { padding-block: clamp(20px, 3.4cqi, 36px); }
    .steps { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
    .step { display: flex; gap: 14px; background: var(--surface); border: 1px solid var(--line); border-radius: 8px; padding: 16px 18px; min-width: 0; }
    .step-n { flex: none; width: 40px; height: 40px; display: grid; place-items: center; background: var(--surface-2); color: var(--honey-text); border-radius: 50%; font-family: var(--font-display); font-weight: 900; font-size: 20px; box-shadow: 0 0 0 1px var(--line); }
    .step-body { min-width: 0; }
    .step h2 { font-size: 18px; font-weight: 800; }
    .step p { color: var(--fg-mute); font-size: 14.5px; margin-top: 2px; text-wrap: pretty; }
    .step ul { margin: 8px 0 0; padding: 0; list-style: none; border-top: 1px solid var(--line-soft); }
    .step li { position: relative; padding: 6px 0 0; padding-inline-start: 16px; font-size: 14px; color: var(--fg); }
    .step li::before { content: ""; position: absolute; inset-inline-start: 0; top: 0.95em; width: 8px; height: 8px; border-radius: 50%; background: var(--honey); }
    .trust { display: flex; gap: 10px; align-items: flex-start; margin-top: 18px; color: var(--fg-mute); font-size: 14.5px; }
    .trust svg { width: 18px; height: 18px; flex: none; margin-top: 3px; color: var(--ok); }
    .cta { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 18px; }

    @container home (max-width: 760px) {
        .steps { grid-template-columns: minmax(0, 1fr); }
    }
</style>
