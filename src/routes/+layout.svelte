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
