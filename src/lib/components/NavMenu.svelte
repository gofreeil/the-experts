<script lang="ts">
    import { page } from '$app/state';
    import { NAV_ITEMS, isNavActive } from '$lib/navMenu';
    import { useI18n } from '$lib/i18n/context';

    // תפריט נפתח עם כל דפי האתר. desktop = כפתור עם מילה, mobile = כפתור אייקון בלבד.
    let { variant = 'desktop' }: { variant?: 'desktop' | 'mobile' } = $props();

    const i18n = useI18n();
    const items = $derived(i18n.l(NAV_ITEMS));

    let open = $state(false);
    let root = $state<HTMLElement>();
    let btn = $state<HTMLButtonElement>();

    const pathname = $derived(page.url.pathname);

    // ניווט לדף אחר סוגר את התפריט
    $effect(() => {
        void pathname;
        open = false;
    });

    function onWindowClick(e: MouseEvent) {
        if (open && root && !root.contains(e.target as Node)) open = false;
    }
    function onWindowKey(e: KeyboardEvent) {
        if (open && e.key === 'Escape') {
            open = false;
            btn?.focus();
        }
    }
</script>

<svelte:window onclick={onWindowClick} onkeydown={onWindowKey} />

<div bind:this={root} class={variant === 'desktop' ? 'relative' : ''}>
    <button
        bind:this={btn}
        type="button"
        class={variant === 'desktop'
            ? 'flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-white/20'
            : 'flex h-[38px] w-[38px] items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-white/20 active:bg-white/30'}
        aria-expanded={open}
        aria-controls="nav-menu-{variant}"
        aria-label={i18n.t('nav.menu')}
        onclick={() => (open = !open)}
    >
        <svg class="h-5 w-5 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true">
            {#if open}
                <path d="M6 6l12 12M18 6L6 18" />
            {:else}
                <path d="M4 7h16M4 12h16M4 17h16" />
            {/if}
        </svg>
        {#if variant === 'desktop'}<span>{i18n.t('nav.menu')}</span>{/if}
    </button>

    {#if open}
        <nav
            id="nav-menu-{variant}"
            aria-label={i18n.t('nav.menu')}
            class="absolute z-[160] grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-[#0f172a] p-2 shadow-2xl {variant === 'desktop'
                ? 'start-0 top-full mt-2 w-[26rem] max-w-[90vw]'
                : 'inset-x-1 top-full mt-1'}"
        >
            {#each items as item (item.href)}
                {@const active = isNavActive(item.href, pathname)}
                <a
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    class="flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 text-sm text-white transition-colors hover:bg-white/10 {active
                        ? 'bg-white/15 font-bold ring-1 ring-purple-400/50'
                        : ''}"
                >
                    <span class="w-5 flex-none text-center text-base" aria-hidden="true">{item.icon}</span>
                    <span class="min-w-0 leading-tight">{item.title}</span>
                </a>
            {/each}
        </nav>
    {/if}
</div>
