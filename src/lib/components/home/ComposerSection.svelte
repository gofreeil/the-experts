<script lang="ts">
    import FancyHeading from './FancyHeading.svelte';
    import { useI18n } from '$lib/i18n/context';

    const i18n = useI18n();
</script>

<section class="compose">
    <div class="inner">
        <div class="banner">
            <FancyHeading as="h2" title={i18n.t('compose.title')} />
            <p class="lede">{i18n.t('compose.lede')}</p>
            <div class="acts">
                <a class="btn btn-primary" href="/problems/new">{i18n.t('compose.title')}</a>
                <a class="btn btn-ghost" href="/problems">{i18n.t('compose.join')}</a>
            </div>
        </div>
    </div>
</section>

<style>
    .compose { padding-block: clamp(20px, 3.4cqi, 36px); }
    /* באנר מודגש: מסגרת ענבר, רקע חם, צל זוהר ופס עליון — כדי שיבלוט משאר הדף */
    .banner {
        position: relative; overflow: hidden;
        display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center;
        padding: clamp(18px, 3cqi, 30px); border: 2px solid var(--honey); border-radius: 14px;
        background: linear-gradient(180deg, color-mix(in srgb, var(--honey) 24%, #fff) 0%, color-mix(in srgb, var(--honey) 9%, #fff) 100%);
        box-shadow: 0 0 0 4px color-mix(in srgb, var(--honey) 20%, transparent), 0 14px 34px rgba(185, 119, 14, 0.32);
    }
    .banner::before {
        content: ""; position: absolute; inset-inline: 0; top: 0; height: 5px;
        background: linear-gradient(to right, #3b82f6, #8b5cf6, var(--honey), var(--honey-deep));
    }
    .lede { font-size: 16px; font-weight: 600; color: var(--fg); }
    .acts { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }
    .banner .btn-primary {
        font-size: 16px; padding: 11px 26px;
        box-shadow: 0 6px 16px rgba(185, 119, 14, 0.45); transition: transform 0.15s, box-shadow 0.15s, background 0.15s;
    }
    .banner .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 22px rgba(185, 119, 14, 0.55); }
    .banner .btn-ghost { background: var(--surface); border-color: var(--honey-deep); }
</style>
