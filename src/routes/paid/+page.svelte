<script lang="ts">
    import '$lib/components/home/home.css';
    import PageHero from '$lib/components/home/PageHero.svelte';
    import PaidSection from '$lib/components/home/PaidSection.svelte';
    import LedgerTable from '$lib/components/home/LedgerTable.svelte';
    import { LEDGER, DEMO_DATA } from '$lib/homeData';
    import { useI18n } from '$lib/i18n/context';

    const i18n = useI18n();

    const FLOW = [
        { t: { he: 'נשמר בנאמנות', en: 'Held in escrow' }, d: { he: 'ברגע שמציבים פרס הכסף נשמר, ולא עובר לאף אחד.', en: 'As soon as a reward is set, the money is held, and goes to no one.' } },
        { t: { he: 'משתחרר באישור', en: 'Released on approval' }, d: { he: 'הפרס עובר למומחה רק אחרי שמי שהעלה את הבעיה אישר שהיא נפתרה.', en: 'The reward goes to the expert only after whoever posted the problem confirms it was solved.' } },
        { t: { he: 'מתועד לציבור', en: 'Documented publicly' }, d: { he: 'כל תשלום מופיע ברשימת הפתרונות, ואפשר ללמוד ממנו.', en: 'Every payment appears in the solutions list, so you can learn from it.' } }
    ];
    const flow = $derived(i18n.l(FLOW));
</script>

<div class="home">
    <PageHero href="/paid">
        {#snippet actions()}<a class="btn btn-primary btn-sm" href="/problems/new">{i18n.t('common.postProblem')}</a>{/snippet}
    </PageHero>

    <PaidSection />

    <section class="section alt compact">
        <div class="inner">
            <div class="sec-head">
                <div>
                    <div class="eyebrow">{i18n.t('paid.latestPayments')}{#if DEMO_DATA}<span class="demo-tag">{i18n.t('common.demoData')}</span>{/if}</div>
                    <h2 class="title">{i18n.t('paid.whoWhatHow')}</h2>
                </div>
                <a class="btn btn-ghost btn-sm" href="/solved">{i18n.t('paid.allSolutions')}</a>
            </div>
            <LedgerTable rows={LEDGER} label={i18n.t('paid.ledgerLabel')} />
        </div>
    </section>

    <section class="section compact">
        <div class="inner">
            <div class="sec-head">
                <div><div class="eyebrow">{i18n.t('paid.howMoneyMoves')}</div></div>
            </div>
            <ol class="flow">
                {#each flow as f, i}
                    <li><span class="n">{i + 1}</span><div><b>{f.t}</b><p>{f.d}</p></div></li>
                {/each}
            </ol>
        </div>
    </section>
</div>

<style>
    .compact { padding-block: clamp(20px, 3.4cqi, 36px); }
    .flow { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
    .flow li { display: flex; gap: 12px; background: var(--surface); border: 1px solid var(--line); border-radius: 8px; padding: 14px 16px; }
    .n { flex: none; width: 32px; height: 32px; display: grid; place-items: center; border-radius: 50%; background: var(--surface-2); color: var(--honey-text); font-family: var(--font-display); font-weight: 900; box-shadow: 0 0 0 1px var(--line); }
    .flow b { font-size: 16px; font-weight: 800; }
    .flow p { color: var(--fg-mute); font-size: 14px; margin-top: 2px; text-wrap: pretty; }

    @container home (max-width: 760px) {
        .flow { grid-template-columns: minmax(0, 1fr); }
    }
</style>
