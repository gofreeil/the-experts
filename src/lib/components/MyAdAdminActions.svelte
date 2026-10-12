<script lang="ts">
    // שורת הפעולות של פרסומת ב"הנכסים שלי" (/advertise/manage): קיצורי
    // הניהול לאדמין — הפעולות השכיחות ישר מכאן, בלי לעבור למסך הניהול.
    // המסלול = מה שנבחר בשליחה; שינוי מסלול, מקום בטור וקציבה — במסך
    // הניהול. הפעולות עצמן ב-$lib/server/myAdsActions. "צפה" מוצג לכל
    // מפרסם כשהפרסומת באוויר.
    import { enhance } from '$app/forms';
    import { useI18n } from '$lib/i18n/context';

    const i18n = useI18n();

    interface AdLike {
        id: string;
        status: string;
        paused: boolean;
        requestedDurationDays: number | null;
    }

    let { ad, isAdmin, live }: { ad: AdLike; isAdmin: boolean; live: boolean } = $props();

    // כפתורים קטנים זה לצד זה, נשברים לשורה בנייד (flex-wrap)
    const BTN = 'whitespace-nowrap rounded-lg border px-2 py-0.5 text-[11px] font-bold transition-colors';
    const OK = `${BTN} border-emerald-500/45 bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/30`;
    const GHOST = `${BTN} border-white/15 bg-white/5 text-gray-200 hover:bg-white/15`;
    const DANGER = `${BTN} border-rose-500/40 bg-rose-500/10 text-rose-200 hover:bg-rose-500/25`;

    function askReason(e: MouseEvent & { currentTarget: HTMLButtonElement }) {
        const reason = prompt(i18n.t('adminActions.reasonPrompt'), '');
        if (reason === null) {
            e.preventDefault();
            return;
        }
        const input = e.currentTarget.form?.elements.namedItem('reason');
        if (input instanceof HTMLInputElement) input.value = reason;
    }
</script>

{#if isAdmin || live}
    <div class="flex flex-wrap items-center gap-1.5">
        {#if isAdmin}
            {#if ad.status === 'pending'}
                <form method="POST" action="?/approve" class="contents" use:enhance>
                    <input type="hidden" name="id" value={ad.id} />
                    <input type="hidden" name="durationDays" value={ad.requestedDurationDays ?? ''} />
                    <button type="submit" class={OK} title={i18n.t('adminActions.approveTitle')}>✅ {i18n.t('adminActions.approve')}</button>
                </form>
            {:else if ad.status === 'approved' && !live && !ad.paused}
                <!-- פג התוקף: אישור מחדש = תקופה חדשה מהיום, באותו מקום -->
                <form method="POST" action="?/approve" class="contents" use:enhance>
                    <input type="hidden" name="id" value={ad.id} />
                    <input type="hidden" name="durationDays" value={ad.requestedDurationDays ?? ''} />
                    <button type="submit" class={OK} title={i18n.t('adminActions.renewTitle')}>🔄 {i18n.t('adminActions.renew')}</button>
                </form>
            {/if}
            {#if ad.status === 'approved'}
                {#if ad.paused}
                    <form method="POST" action="?/resume" class="contents" use:enhance>
                        <input type="hidden" name="id" value={ad.id} />
                        <button type="submit" class={OK} title={i18n.t('adminActions.resumeTitle')}>▶ {i18n.t('adminActions.resume')}</button>
                    </form>
                {:else if live}
                    <form method="POST" action="?/pause" class="contents" use:enhance>
                        <input type="hidden" name="id" value={ad.id} />
                        <button
                            type="submit"
                            class={GHOST}
                            title={i18n.t('adminActions.pauseTitle')}
                            onclick={(e) => {
                                if (!confirm(i18n.t('adminActions.pauseConfirm'))) e.preventDefault();
                            }}
                        >⏸ {i18n.t('adminActions.pause')}</button>
                    </form>
                {/if}
                <form method="POST" action="?/unapprove" class="contents" use:enhance>
                    <input type="hidden" name="id" value={ad.id} />
                    <button
                        type="submit"
                        class={GHOST}
                        title={i18n.t('adminActions.unapproveTitle')}
                        onclick={(e) => {
                            if (!confirm(i18n.t('adminActions.unapproveConfirm'))) e.preventDefault();
                        }}
                    >⬇ {i18n.t('adminActions.unapprove')}</button>
                </form>
            {/if}
            {#if ad.status !== 'rejected'}
                <form method="POST" action="?/reject" class="contents" use:enhance>
                    <input type="hidden" name="id" value={ad.id} />
                    <input type="hidden" name="reason" value="" />
                    <button type="submit" class={DANGER} title={i18n.t('adminActions.rejectTitle')} onclick={askReason}>❌ {i18n.t('adminActions.reject')}</button>
                </form>
            {/if}
        {/if}
        {#if live}
            <a class={GHOST} href="/ads/{ad.id}" target="_blank" title={i18n.t('adminActions.viewTitle')}>👁 {i18n.t('adminActions.view')}</a>
        {/if}
    </div>
{/if}
