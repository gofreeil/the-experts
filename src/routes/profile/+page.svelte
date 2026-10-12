<script lang="ts">
	import { signOut } from '@auth/sveltekit/client';
	import { useI18n } from '$lib/i18n/context';

	let { data } = $props();

	const i18n = useI18n();
</script>

<svelte:head><title>{i18n.t('profile.title')}</title></svelte:head>

<div class="min-h-[80vh] flex items-center justify-center px-4 py-12">
	<div class="w-full max-w-md rounded-3xl border border-white/10 bg-[#0f172a] p-8 text-center shadow-2xl">
		<div class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-pink-600 text-3xl">
			👤
		</div>
		<h1 class="text-2xl font-black text-white">{data.user.name || i18n.t('profile.welcome')}</h1>
		<p class="mt-1 text-sm text-gray-400">{data.user.email}</p>

		<div class="mt-8 flex flex-col gap-3">
			<a href="https://community.gofreeil.com/profile" class="rounded-2xl bg-gradient-to-r from-amber-500 to-pink-600 px-4 py-3 font-bold text-white transition hover:opacity-90">
				{i18n.t('profile.full')}
			</a>
			<button
				type="button"
				onclick={() => signOut({ callbackUrl: '/' })}
				class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-bold text-gray-300 transition hover:bg-white/10"
			>
				{i18n.t('profile.logout')}
			</button>
		</div>
	</div>
</div>
