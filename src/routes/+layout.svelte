<script lang="ts">
	import "../app.css";
	import "flag-icons/css/flag-icons.min.css";
	import "$lib/i18n";
	import Header from "$lib/components/Header.svelte";
	import RightAdBanner from "$lib/components/RightAdBanner.svelte";
	import AdsSidebar from "$lib/components/AdsSidebar.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import CoinAnimation from "$lib/components/CoinAnimation.svelte";
	import MobileAdsDrawer from "$lib/components/MobileAdsDrawer.svelte";
	import MobileAdPopup from "$lib/components/MobileAdPopup.svelte";
	import WelcomeScreen from "$lib/components/WelcomeScreen.svelte";
	import AdInterstitial from "$lib/components/AdInterstitial.svelte";
	import { beforeNavigate } from "$app/navigation";
	import { navigating } from "$app/state";
	import { closeAdPopup } from "$lib/adPopupStore";

	let { children, data } = $props();

	beforeNavigate(() => {
		closeAdPopup();
	});
</script>

<svelte:head>
	<title>המומחים של העם</title>
	<link rel="icon" href="/images/experts-logo.png" type="image/png" />
	<link rel="apple-touch-icon" href="/images/experts-logo.png" />
</svelte:head>

<a href="#main-content" class="skip-link">דלג לתוכן הראשי</a>

<!-- פס התקדמות בזמן ניווט: SvelteKit נשאר על הדף הקודם עד שהחדש מוכן, ובלי סימן כלשהו הלחיצה מרגישה כאילו לא קרה כלום. הפס מופיע רק אחרי ~150ms, כך שניווט מיידי לא מהבהב. -->
{#if navigating.to}
	<div class="nav-progress" role="status" aria-label="טוען…"></div>
{/if}

<!-- מסך פתיחה אחרי הרשמה / זיהוי ראשון — גלובלי, מופעל ע"י ?welcome ב-URL -->
<WelcomeScreen />

<CoinAnimation />
<MobileAdsDrawer />
<MobileAdPopup />
<div class="min-h-screen flex flex-col bg-[#0f172a]">
	<Header currentUser={data.user ? { username: data.user.name || data.user.email } : null} />

	<div class="layout-container flex-grow">
		<RightAdBanner />
		<main id="main-content" tabindex="-1" class="main-content">
			{@render children()}
		</main>
		<AdsSidebar />
	</div>

	<Footer />
</div>

<!-- פרסומת-הביניים (נייד) — שכבה גלובלית; נפתחת רק דרך adGate -->
<AdInterstitial />

<style>
	/* פס ההתקדמות של הניווט */
	.nav-progress {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 3px;
		z-index: 100;
		transform-origin: left center;
		background: linear-gradient(90deg, #4f46e5, #7c3aed, #f5d57a);
		animation: nav-progress 8s cubic-bezier(0.15, 0.85, 0.25, 1) forwards;
	}
	:global(html[dir="rtl"]) .nav-progress {
		transform-origin: right center;
	}
	@keyframes nav-progress {
		0% { transform: scaleX(0); opacity: 0; }
		2% { transform: scaleX(0.06); opacity: 0; }
		4% { opacity: 1; }
		25% { transform: scaleX(0.55); }
		60% { transform: scaleX(0.82); }
		100% { transform: scaleX(0.97); opacity: 1; }
	}
	@media (prefers-reduced-motion: reduce) {
		.nav-progress { animation-duration: 0s; transform: scaleX(1); opacity: 1; }
	}

	.layout-container {
		max-width: 1440px;
		margin: 0 auto;
		display: flex;
		gap: 2rem;
		padding: 2rem 2rem 0 2rem;
		width: 100%;
	}

	.main-content {
		flex: 1;
		min-width: 0;
	}

	@media (max-width: 1024px) {
		.layout-container {
			padding: 0;
			gap: 0;
			flex-direction: column;
			max-width: 100vw;
			overflow-x: hidden;
		}
		.main-content {
			max-width: 100vw;
			overflow-x: hidden;
		}
	}
</style>
