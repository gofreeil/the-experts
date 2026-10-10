<script lang="ts">
    import '$lib/components/home/home.css';
    import PageHero from '$lib/components/home/PageHero.svelte';
    import PaidSection from '$lib/components/home/PaidSection.svelte';
    import LedgerTable from '$lib/components/home/LedgerTable.svelte';
    import { LEDGER, DEMO_DATA } from '$lib/homeData';

    const FLOW = [
        { t: 'נשמר בנאמנות', d: 'ברגע שמציבים פרס הכסף נשמר, ולא עובר לאף אחד.' },
        { t: 'משתחרר באישור', d: 'הפרס עובר למומחה רק אחרי שמי שהעלה את הבעיה אישר שהיא נפתרה.' },
        { t: 'מתועד לציבור', d: 'כל תשלום מופיע ברשימת הפתרונות, ואפשר ללמוד ממנו.' }
    ];
</script>

<div class="home" dir="rtl">
    <PageHero href="/paid">
        {#snippet actions()}<a class="btn btn-primary btn-sm" href="/problems/new">העלו בעיה</a>{/snippet}
    </PageHero>

    <PaidSection />

    <section class="section alt compact">
        <div class="inner">
            <div class="sec-head">
                <div>
                    <div class="eyebrow">תשלומים אחרונים{#if DEMO_DATA}<span class="demo-tag">נתוני הדגמה</span>{/if}</div>
                    <h2 class="title">מי קיבל, על מה, ובכמה</h2>
                </div>
                <a class="btn btn-ghost btn-sm" href="/solved">לכל הפתרונות</a>
            </div>
            <LedgerTable rows={LEDGER} label="תשלומים אחרונים לפותרי בעיות" />
        </div>
    </section>

    <section class="section compact">
        <div class="inner">
            <div class="sec-head">
                <div><div class="eyebrow">איך הכסף עובר</div></div>
            </div>
            <ol class="flow">
                {#each FLOW as f, i}
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
