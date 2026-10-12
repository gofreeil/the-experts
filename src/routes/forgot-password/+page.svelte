<script lang="ts">
	import { enhance } from '$app/forms';
	import { useI18n } from '$lib/i18n/context';

	let { data, form } = $props();

	const i18n = useI18n();

	let email = $state(data.email || '');
	let loading = $state(false);
	// בפועל השרת מגביל לשליחה אחת ל-45 שניות לכתובת; מעט מעל כדי שהלחיצה החוזרת תמיד תשלח.
	const COOLDOWN = 50;
	let cooldown = $state(0);

	// נשאר במסך "נשלח" גם כששליחה חוזרת נכשלת (השגיאה מוצגת שם)
	let sentTo = $state('');
	const sent = $derived(!!sentTo);

	// כל שליחה מוצלחת (form.at חדש) מאפסת את הספירה לאחור של "שלח שוב".
	$effect(() => {
		if (!form?.sent) return;
		sentTo = form.email;
		cooldown = COOLDOWN;
		const timer = setInterval(() => {
			cooldown -= 1;
			if (cooldown <= 0) clearInterval(timer);
		}, 1000);
		return () => clearInterval(timer);
	});

	/** קיצור "פתח את תיבת המייל" לספקים נפוצים, לפי הדומיין של הכתובת. */
	const MAIL_APPS: Record<string, ['walla' | string, string]> = {
		'gmail.com': ['Gmail', 'https://mail.google.com/'],
		'googlemail.com': ['Gmail', 'https://mail.google.com/'],
		'outlook.com': ['Outlook', 'https://outlook.live.com/mail/'],
		'hotmail.com': ['Outlook', 'https://outlook.live.com/mail/'],
		'live.com': ['Outlook', 'https://outlook.live.com/mail/'],
		'yahoo.com': ['Yahoo Mail', 'https://mail.yahoo.com/'],
		'walla.co.il': ['walla', 'https://mail.walla.co.il/'],
		'walla.com': ['walla', 'https://mail.walla.co.il/']
	};
	const mailApp = $derived.by(() => {
		const hit = MAIL_APPS[(sentTo.split('@')[1] || '').toLowerCase()];
		return hit ? ([hit[0] === 'walla' ? i18n.t('forgot.walla') : hit[0], hit[1]] as [string, string]) : null;
	});
</script>

<svelte:head>
	<title>{i18n.t('forgot.pageTitle')} | {i18n.t('site.name')}</title>
	<meta name="robots" content="noindex, follow" />
</svelte:head>

<div class="flex min-h-[70vh] items-center justify-center px-4 py-12">
	<div class="w-full max-w-md">
		<div class="rounded-3xl border border-white/10 bg-[#0f172a] p-8 text-start shadow-2xl">
			{#if sent}
				<div class="mb-5 text-center">
					<div class="mb-3 text-5xl">📬</div>
					<h1 class="text-2xl font-black text-white">{i18n.t('forgot.sentTitle')}</h1>
				</div>

				<p class="mb-5 text-center text-sm leading-relaxed text-gray-300">
					{i18n.t('forgot.sentA')} <strong class="break-all text-amber-200" dir="ltr">{sentTo}</strong> {i18n.t('forgot.sentB')}
				</p>

				{#if mailApp}
					<a
						href={mailApp[1]}
						target="_blank"
						rel="noopener noreferrer"
						class="mb-4 block w-full rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-4 py-3.5 text-center font-bold text-white transition"
					>
						{i18n.t('forgot.openMail', { app: mailApp[0] })}
					</a>
				{/if}

				<ul class="mb-5 list-disc space-y-1 rounded-xl bg-white/5 py-3 ps-8 pe-4 text-xs leading-relaxed text-gray-400">
					<li>{i18n.t('forgot.tip1')}</li>
					<li>{@html i18n.t('forgot.tip2')}</li>
					<li>{i18n.t('forgot.tip3')}</li>
				</ul>

				<form
					method="POST"
					action="?/send"
					use:enhance={() => {
						loading = true;
						return async ({ update }) => {
							await update({ reset: false });
							loading = false;
						};
					}}
				>
					<input type="hidden" name="email" value={sentTo} />
					<button
						type="submit"
						disabled={loading || cooldown > 0}
						class="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-bold text-gray-200 transition hover:bg-white/10 disabled:cursor-default disabled:text-gray-500 disabled:hover:bg-white/5"
					>
						{#if loading}{i18n.t('forgot.sending')}{:else if cooldown > 0}{i18n.t('forgot.resendIn', { n: cooldown })}{:else}{i18n.t('forgot.resend')}{/if}
					</button>
				</form>

				{#if form?.error}
					<div role="alert" class="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-400">
						{form.error}
					</div>
				{/if}

				<p class="mt-5 text-center text-sm text-gray-400">
					{i18n.t('forgot.wrongAddr')}
					<a href="/forgot-password?email={encodeURIComponent(sentTo)}" data-sveltekit-reload class="font-bold text-purple-400 hover:text-purple-300">{i18n.t('forgot.retype')}</a>
				</p>
			{:else}
				<div class="mb-6 text-center">
					<div class="mb-3 text-5xl">🔑</div>
					<h1 class="text-2xl font-black text-white">{i18n.t('forgot.askTitle')}</h1>
					<p class="mt-2 text-sm leading-relaxed text-gray-400">
						{i18n.t('forgot.askBody')}
					</p>
				</div>

				<form
					method="POST"
					action="?/send"
					class="space-y-4"
					use:enhance={() => {
						loading = true;
						return async ({ update }) => {
							await update({ reset: false });
							loading = false;
						};
					}}
				>
					<label class="block">
						<span class="mb-1.5 block text-sm text-gray-300">{i18n.t('forgot.yourEmail')}</span>
						<!-- svelte-ignore a11y_autofocus -->
						<input
							type="email"
							name="email"
							bind:value={email}
							placeholder="name@example.com"
							autocomplete="email"
							inputmode="email"
							dir="ltr"
							autofocus
							required
							class="w-full rounded-xl border border-white/10 bg-[#1e293b] px-4 py-3 text-left text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
						/>
					</label>

					{#if form?.error}
						<div role="alert" class="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-400">
							{form.error}
						</div>
					{/if}

					<button
						type="submit"
						disabled={loading}
						class="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-4 py-3.5 font-bold text-white transition disabled:cursor-wait disabled:opacity-60"
					>
						{loading ? i18n.t('forgot.sending') : i18n.t('forgot.sendLink')}
					</button>
				</form>

				<p class="mt-5 text-center text-sm"><a href="/login" class="text-purple-400 hover:text-purple-300">{i18n.t('forgot.backToLogin')}</a></p>
			{/if}
		</div>

		<div class="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-center text-sm leading-relaxed text-gray-400">
			<strong class="text-gray-200">{i18n.t('forgot.oauthQ')}</strong>
			{i18n.t('forgot.oauthBody')}
			<a href="/login" class="font-bold text-purple-400 hover:text-purple-300">{i18n.t('forgot.oauthLink')}</a>.
		</div>
	</div>
</div>
