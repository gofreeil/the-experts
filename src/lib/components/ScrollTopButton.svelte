<script lang="ts">
	import { onMount } from 'svelte';
	import { useI18n } from '$lib/i18n/context';

	const i18n = useI18n();

	// כפתור "חזרה למעלה" לנייד: הדפים ארוכים, וגלילה חזרה באצבע מעייפת.
	// מופיע רק אחרי גלילה של כמה מסכים, ובלי להיות מוצג בדסקטופ.
	let show = $state(false);

	onMount(() => {
		const update = () => {
			show = window.scrollY > 900;
		};
		update();
		window.addEventListener('scroll', update, { passive: true });
		return () => window.removeEventListener('scroll', update);
	});

	function toTop() {
		const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		window.scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' });
	}
</script>

{#if show}
	<button type="button" class="to-top" onclick={toTop} aria-label={i18n.t('common.backToTop')}>
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
			<path d="M6 14l6-6 6 6" />
		</svg>
	</button>
{/if}

<style>
	.to-top {
		position: fixed;
		/* בצד הימני (צד האגודל ברוב המכשירים) כדי לא להתנגש בלשונית ההטבות שבצד שמאל */
		right: 14px;
		bottom: calc(18px + env(safe-area-inset-bottom, 0px));
		z-index: 60;
		display: grid;
		place-items: center;
		width: 46px;
		height: 46px;
		padding: 0;
		border: 1px solid rgba(255, 255, 255, 0.25);
		border-radius: 50%;
		color: #fff;
		background: linear-gradient(135deg, #4f46e5, #7c3aed);
		box-shadow: 0 6px 18px rgba(15, 23, 42, 0.45);
		cursor: pointer;
		touch-action: manipulation;
		animation: to-top-in 0.18s ease-out;
	}
	.to-top svg {
		width: 22px;
		height: 22px;
	}
	.to-top:active {
		transform: scale(0.94);
	}
	@keyframes to-top-in {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
	}
	@media (min-width: 1024px) {
		.to-top {
			display: none;
		}
	}
</style>
