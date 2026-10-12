<script lang="ts">
	import { enhance } from '$app/forms';
	import { useI18n } from '$lib/i18n/context';

	let { data, form } = $props();

	const i18n = useI18n();

	let password = $state('');
	let confirm = $state('');
	let show = $state(false);
	let loading = $state(false);

	// מד חוזק פשוט: אורך + גיוון. לא חוסם דבר (המינימום היחיד הוא 6 תווים) - רק מכוון לסיסמה טובה יותר.
	const strength = $derived.by(() => {
		if (!password) return 0;
		let s = 0;
		if (password.length >= 6) s++;
		if (password.length >= 10) s++;
		if (/[a-zא-ת]/i.test(password) && /\d/.test(password)) s++;
		if (/[^a-zA-Z0-9א-ת]/.test(password) || (/[A-Z]/.test(password) && /[a-z]/.test(password))) s++;
		return Math.min(s, 4);
	});
	const LABELS = $derived(['', i18n.t('reset.strength1'), i18n.t('reset.strength2'), i18n.t('reset.strength3'), i18n.t('reset.strength4')]);
	const BAR = ['bg-white/10', 'bg-red-500', 'bg-amber-500', 'bg-lime-500', 'bg-green-500'];
	const mismatch = $derived(confirm.length > 0 && password !== confirm);
	const canSubmit = $derived(password.length >= 6 && password === confirm && !loading);
	const invalidLink = $derived(!data.code || !!form?.expired);
</script>

<svelte:head>
	<title>{i18n.t('reset.pageTitle')} | {i18n.t('site.name')}</title>
	<meta name="robots" content="noindex, follow" />
</svelte:head>

<div class="flex min-h-[70vh] items-center justify-center px-4 py-12">
	<div class="w-full max-w-md rounded-3xl border border-white/10 bg-[#0f172a] p-8 text-start shadow-2xl">
		{#if invalidLink}
			<div class="mb-5 text-center">
				<div class="mb-3 text-5xl">⏳</div>
				<h1 class="text-2xl font-black text-white">{i18n.t('reset.invalidTitle')}</h1>
			</div>
			<p class="mb-6 text-center text-sm leading-relaxed text-gray-300">
				{form?.error || i18n.t('reset.missing')}
				{i18n.t('reset.invalidBody')}
			</p>
			<a href="/forgot-password" class="block w-full rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-4 py-3.5 text-center font-bold text-white transition">
				{i18n.t('reset.newLink')}
			</a>
			<p class="mt-5 text-center text-sm"><a href="/login" class="text-purple-400 hover:text-purple-300">{i18n.t('forgot.backToLogin')}</a></p>
		{:else}
			<div class="mb-6 text-center">
				<div class="mb-3 text-5xl">🔒</div>
				<h1 class="text-2xl font-black text-white">{i18n.t('reset.pageTitle')}</h1>
				<p class="mt-2 text-sm leading-relaxed text-gray-400">{i18n.t('reset.chooseBody')}</p>
			</div>

			<form
				method="POST"
				class="space-y-4"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						await update({ reset: false });
						loading = false;
					};
				}}
			>
				<input type="hidden" name="code" value={data.code} />

				<label class="block">
					<span class="mb-1.5 block text-sm text-gray-300">{i18n.t('reset.newPw')}</span>
					<span class="relative block">
						<!-- svelte-ignore a11y_autofocus -->
						<input
							type={show ? 'text' : 'password'}
							name="password"
							bind:value={password}
							autocomplete="new-password"
							minlength="6"
							placeholder={i18n.t('reset.atLeast6')}
							autofocus
							required
							class="w-full rounded-xl border border-white/10 bg-[#1e293b] py-3 ps-4 pe-16 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
						/>
						<button
							type="button"
							onclick={() => (show = !show)}
							aria-pressed={show}
							class="absolute top-1/2 end-2 -translate-y-1/2 rounded-lg bg-white/10 px-2.5 py-1 text-xs text-gray-200 hover:bg-white/20"
						>
							{show ? i18n.t('reset.hide') : i18n.t('reset.show')}
						</button>
					</span>
				</label>

				{#if password}
					<div class="-mt-1 flex items-center gap-3" aria-live="polite">
						<div class="flex flex-1 gap-1">
							{#each [1, 2, 3, 4] as n}
								<i class="h-1.5 flex-1 rounded-full transition-colors {strength >= n ? BAR[strength] : 'bg-white/10'}"></i>
							{/each}
						</div>
						<span class="min-w-12 text-xs text-gray-400">{LABELS[strength]}</span>
					</div>
				{/if}

				<label class="block">
					<span class="mb-1.5 block text-sm text-gray-300">{i18n.t('reset.confirm')}</span>
					<input
						type={show ? 'text' : 'password'}
						name="confirm"
						bind:value={confirm}
						autocomplete="new-password"
						placeholder={i18n.t('reset.samePw')}
						required
						class="w-full rounded-xl border border-white/10 bg-[#1e293b] px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
					/>
				</label>
				{#if mismatch}<p role="alert" class="-mt-2 text-sm text-red-400">{i18n.t('reset.mismatch')}</p>{/if}

				{#if form?.error}
					<div role="alert" class="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-400">
						{form.error}
					</div>
				{/if}

				<button
					type="submit"
					disabled={!canSubmit}
					class="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-4 py-3.5 font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
				>
					{loading ? i18n.t('reset.saving') : i18n.t('reset.save')}
				</button>
			</form>
		{/if}
	</div>
</div>
