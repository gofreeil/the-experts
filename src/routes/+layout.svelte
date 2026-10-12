<script lang="ts">
	import "../app.css";
	import "flag-icons/css/flag-icons.min.css";
	import { setI18n } from "$lib/i18n/context";
	import { LOCALE_META } from "$lib/i18n";
	import Header from "$lib/components/Header.svelte";
	import RightAdBanner from "$lib/components/RightAdBanner.svelte";
	import AdsSidebar from "$lib/components/AdsSidebar.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import BuildNotice from "$lib/components/BuildNotice.svelte";
	import CoinAnimation from "$lib/components/CoinAnimation.svelte";
	import MobileAdsDrawer from "$lib/components/MobileAdsDrawer.svelte";
	import MobileAdPopup from "$lib/components/MobileAdPopup.svelte";
	import ScrollTopButton from "$lib/components/ScrollTopButton.svelte";
	import WelcomeScreen from "$lib/components/WelcomeScreen.svelte";
	import AdInterstitial from "$lib/components/AdInterstitial.svelte";
	import { beforeNavigate } from "$app/navigation";
	import { navigating } from "$app/state";
	import { closeAdPopup } from "$lib/adPopupStore";

	let { children, data } = $props();

	// השפה מגיעה מהשרת (+layout.server.ts ← hooks.server.ts) ולכן כבר נכונה ב-SSR.
	// ההקשר קורא את data.locale בכל שימוש, כך שהחלפת שפה מעדכנת את כל האתר.
	const i18n = setI18n(() => data.locale);

	// מחליף שפה בלי רענון מלא: ה-SSR קבע את lang/dir הראשוניים, וכאן הם מתעדכנים בניווט הבא
	$effect(() => {
		document.documentElement.lang = i18n.locale;
		document.documentElement.dir = i18n.dir;
	});

	beforeNavigate(() => {
		closeAdPopup();
	});

	// המשתמש המחובר, כפי שההדר והמגירה בנייד מציגים אותו (null = אנונימי)
	const currentUser = $derived(
		data.user ? { username: data.user.name || data.user.email, avatar_url: data.user.image || null } : null
	);
</script>

<svelte:head>
	<title>{i18n.t('site.name')}</title>
	<meta property="og:type" content="website" />
	<meta property="og:title" content={i18n.t('site.name')} />
	<meta property="og:description" content={i18n.t('site.name')} />
	<meta property="og:locale" content={LOCALE_META[i18n.locale].ogLocale} />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={i18n.t('site.name')} />
	<meta name="twitter:description" content={i18n.t('site.name')} />
</svelte:head>

<a href="#main-content" class="skip-link">{i18n.t('site.skipLink')}</a>

<!-- פס התקדמות בזמן ניווט: SvelteKit נשאר על הדף הקודם עד שהחדש מוכן, ובלי סימן כלשהו הלחיצה מרגישה כאילו לא קרה כלום. הפס נדלק מיידית עם הלחיצה — משוב תוך כדי הטעינה, גם במחיר הבהוב קצר בניווט מהיר. -->
{#if navigating.to}
	<div class="nav-progress" role="status" aria-label={i18n.t('site.loading')}></div>
{/if}

<!-- מסך פתיחה אחרי הרשמה / זיהוי ראשון — גלובלי, מופעל ע"י ?welcome ב-URL -->
<WelcomeScreen />

<CoinAnimation />
<MobileAdsDrawer currentUser={currentUser ?? undefined} />
<MobileAdPopup />
<div class="site-bg min-h-screen flex flex-col">
	<BuildNotice />
	<Header {currentUser} />

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

<ScrollTopButton />

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
		0% { transform: scaleX(0.04); opacity: 1; }
		25% { transform: scaleX(0.55); }
		60% { transform: scaleX(0.82); }
		100% { transform: scaleX(0.97); opacity: 1; }
	}
	@media (prefers-reduced-motion: reduce) {
		.nav-progress { animation-duration: 0s; transform: scaleX(1); opacity: 1; }
	}

	/* רקע האתר: כחול בהיר יותר, לא כמעט שחור */
	.site-bg {
		background: linear-gradient(180deg, #2c4a78 0%, #3b5f93 100%);
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

	/* באנגלית (LTR) הטורים נשארים במקומם הפיזי: הפרסומות בימין ואתרי הרשת בשמאל,
	   כפי שמובטח למפרסמים ("הטור הימני"). בנייד הם ממילא בעמודה אחת. */
	@media (min-width: 1025px) {
		:global(html[dir='ltr']) .layout-container {
			flex-direction: row-reverse;
		}
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
