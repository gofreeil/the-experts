<script lang="ts">
    import { problemsStore, type ProblemType } from '$lib/problemsStore.svelte';
    import { teamSources, teamsFor } from '$lib/teamsData';
    import { goto } from '$app/navigation';
    import { page } from '$app/state';
    import { useI18n } from '$lib/i18n/context';

    const i18n = useI18n();
    const teams = $derived(teamsFor(i18n.locale));

    // הטופס המהיר בדף הבית מעביר לכאן כותרת, תחום, סוג ותקציב ב-query string
    const q = page.url.searchParams;
    const qCategory = q.get('category');
    const qType = q.get('type');
    const qBounty = Number(q.get('bounty'));

    let title = $state((q.get('title') ?? '').slice(0, 120));
    let description = $state('');
    let category = $state(teamSources.some((t) => t.slug === qCategory) ? (qCategory as string) : 'law');
    let type = $state<ProblemType>(qType === 'community' ? 'community' : 'individual');
    let posterName = $state('');
    let contact = $state('');
    let bounty = $state<number | null>(qBounty > 0 && qBounty <= 1_000_000 ? Math.round(qBounty) : null);

    let submitting = $state(false);
    let error = $state('');

    let isValid = $derived(
        title.trim().length >= 5 &&
        description.trim().length >= 20 &&
        posterName.trim().length >= 2 &&
        contact.trim().length >= 5 &&
        typeof bounty === 'number' && bounty > 0
    );

    function submit() {
        if (!isValid) {
            error = i18n.t('newProblem.invalid');
            return;
        }
        error = '';
        submitting = true;
        const created = problemsStore.addProblem({
            title: title.trim(),
            description: description.trim(),
            category,
            type,
            posterName: posterName.trim(),
            contact: contact.trim(),
            bounty: bounty as number
        });
        goto(`/problems/${created.id}`);
    }
</script>

<svelte:head><title>{i18n.t('newProblem.title')}</title></svelte:head>

<section class="page">
    <a href="/problems" class="back">{i18n.t('board.back')}</a>

    <h1 class="title">{i18n.t('newProblem.title')}</h1>
    <p class="subtitle">{i18n.t('newProblem.subtitle')}</p>

    <form class="form" onsubmit={(e) => { e.preventDefault(); submit(); }}>
        <div class="field">
            <label for="type">{i18n.t('newProblem.who')}</label>
            <div class="type-chips">
                <button type="button" class:active={type==='individual'} onclick={()=>type='individual'}>
                    <span class="big-emoji">👤</span>
                    <span class="chip-label">{i18n.t('newProblem.private')}</span>
                    <span class="chip-desc">{i18n.t('newProblem.privateDesc')}</span>
                </button>
                <button type="button" class:active={type==='community'} onclick={()=>type='community'}>
                    <span class="big-emoji">🏘️</span>
                    <span class="chip-label">{i18n.t('newProblem.community')}</span>
                    <span class="chip-desc">{i18n.t('newProblem.communityDesc')}</span>
                </button>
            </div>
        </div>

        <div class="field">
            <label for="title">{i18n.t('newProblem.problemTitle')}</label>
            <input id="title" type="text" bind:value={title}
                   placeholder={i18n.t('newProblem.titlePh')}
                   maxlength="120" />
        </div>

        <div class="field">
            <label for="description">{i18n.t('newProblem.description')}</label>
            <textarea id="description" bind:value={description}
                      placeholder={i18n.t('newProblem.descriptionPh')}
                      rows="5" maxlength="2000"></textarea>
            <small>{description.length} / 2000</small>
        </div>

        <div class="row">
            <div class="field">
                <label for="category">{i18n.t('board.filterFieldPlain')}</label>
                <select id="category" bind:value={category}>
                    {#each teams as t}
                        <option value={t.slug}>{t.emoji} {t.name}</option>
                    {/each}
                </select>
            </div>

            <div class="field">
                <label for="bounty">{i18n.t('newProblem.budget')}</label>
                <input id="bounty" type="number" bind:value={bounty} min="1" step="50"
                       placeholder={i18n.t('newProblem.budgetPh')} />
            </div>
        </div>

        <div class="row">
            <div class="field">
                <label for="posterName">{i18n.t('newProblem.displayName')}</label>
                <input id="posterName" type="text" bind:value={posterName}
                       placeholder={i18n.t('newProblem.displayNamePh')} />
            </div>

            <div class="field">
                <label for="contact">{i18n.t('newProblem.contact')}</label>
                <input id="contact" type="text" bind:value={contact}
                       placeholder={i18n.t('newProblem.contactPh')} />
            </div>
        </div>

        {#if error}
            <div class="error">{error}</div>
        {/if}

        <div class="actions">
            <button type="submit" class="btn-primary" disabled={!isValid || submitting}>
                {submitting ? i18n.t('newProblem.posting') : `🚀 ${i18n.t('newProblem.publish')}`}
            </button>
            <a href="/problems" class="btn-ghost">{i18n.t('common.cancel')}</a>
        </div>
    </form>
</section>

<style>
    .page {
        max-width: 720px; margin: 0 auto;
        padding: 1.5rem 1rem 4rem;
    }

    .back {
        display: inline-block; margin-bottom: 1rem;
        color: #fbbf24; text-decoration: none; font-size: 0.9rem;
    }
    .back:hover { color: #fde047; }

    .title {
        font-size: clamp(1.6rem, 4vw, 2.3rem);
        font-weight: 800;
        background: linear-gradient(to right, #fbbf24, #f59e0b, #ea580c);
        -webkit-background-clip: text; background-clip: text; color: transparent;
        margin-bottom: 0.4rem;
    }
    .subtitle { color: #94a3b8; margin-bottom: 1.8rem; }

    .form {
        display: flex; flex-direction: column; gap: 1.2rem;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 0.85rem;
        padding: 1.5rem;
    }

    .field { display: flex; flex-direction: column; gap: 0.4rem; }
    .field label { color: #cbd5e1; font-weight: 600; font-size: 0.9rem; }
    .field small { color: #64748b; font-size: 0.75rem; text-align: left; }

    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

    input, textarea, select {
        background: rgba(15, 23, 42, 0.6);
        color: #f1f5f9;
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 0.5rem;
        padding: 0.7rem 0.85rem;
        font-size: 0.95rem;
        font-family: inherit;
        transition: border-color 0.2s, box-shadow 0.2s;
    }
    input:focus, textarea:focus, select:focus {
        outline: none;
        border-color: #f59e0b;
        box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);
    }
    textarea { resize: vertical; min-height: 110px; }

    .type-chips { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; }
    .type-chips button {
        background: rgba(15, 23, 42, 0.6);
        border: 2px solid rgba(255, 255, 255, 0.1);
        border-radius: 0.7rem;
        padding: 1rem;
        color: #e2e8f0;
        cursor: pointer;
        display: flex; flex-direction: column; gap: 0.3rem;
        align-items: center; text-align: center;
        transition: all 0.2s;
    }
    .type-chips button:hover { border-color: rgba(245, 158, 11, 0.5); }
    .type-chips button.active {
        border-color: #f59e0b;
        background: linear-gradient(135deg, rgba(245, 158, 11, 0.18), rgba(234, 88, 12, 0.1));
        box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);
    }
    .big-emoji { font-size: 2rem; }
    .chip-label { font-weight: 700; }
    .chip-desc { font-size: 0.78rem; color: #94a3b8; }

    .error {
        background: rgba(239, 68, 68, 0.15);
        border: 1px solid rgba(239, 68, 68, 0.4);
        color: #fecaca;
        padding: 0.7rem 0.9rem;
        border-radius: 0.5rem;
        font-size: 0.88rem;
    }

    .actions { display: flex; gap: 0.7rem; flex-wrap: wrap; }

    .btn-primary {
        background: linear-gradient(135deg, #f59e0b, #ea580c);
        color: #1a0c00;
        padding: 0.85rem 1.6rem;
        border: none; border-radius: 0.7rem;
        font-weight: 800; font-size: 1rem;
        cursor: pointer;
        box-shadow: 0 4px 14px rgba(245, 158, 11, 0.4);
        transition: transform 0.2s, box-shadow 0.2s;
    }
    .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(245, 158, 11, 0.6); }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

    .btn-ghost {
        background: rgba(255, 255, 255, 0.08);
        color: #e2e8f0;
        padding: 0.85rem 1.4rem;
        border-radius: 0.7rem;
        text-decoration: none;
        font-weight: 600;
        border: 1px solid rgba(255, 255, 255, 0.12);
        display: inline-flex; align-items: center;
    }

    @media (max-width: 640px) {
        .row { grid-template-columns: 1fr; }
        .type-chips { grid-template-columns: 1fr 1fr; }
    }
</style>
