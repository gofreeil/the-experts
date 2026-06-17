<script lang="ts">
    import { page } from '$app/state';
    import { problemsStore, formatTimeAgo, formatBounty } from '$lib/problemsStore.svelte';
    import { teamBySlug } from '$lib/teamsData';
    import { onMount } from 'svelte';

    onMount(() => problemsStore.refresh());

    let id = $derived(page.params.id);
    let problem = $derived(problemsStore.items.find((p) => p.id === id));
    let team = $derived(problem ? teamBySlug(problem.category) : undefined);

    // טופס הצעת פתרון
    let solverName = $state('');
    let contact = $state('');
    let proposal = $state('');
    let askingPrice = $state<number | null>(null);
    let showForm = $state(false);
    let justSubmitted = $state(false);

    let canSubmit = $derived(
        solverName.trim().length >= 2 &&
        contact.trim().length >= 5 &&
        proposal.trim().length >= 30 &&
        typeof askingPrice === 'number' && askingPrice > 0
    );

    function submitSolution() {
        if (!problem || !canSubmit) return;
        problemsStore.addSolution(problem.id, {
            solverName: solverName.trim(),
            contact: contact.trim(),
            proposal: proposal.trim(),
            askingPrice: askingPrice as number
        });
        solverName = '';
        contact = '';
        proposal = '';
        askingPrice = null;
        showForm = false;
        justSubmitted = true;
        setTimeout(() => (justSubmitted = false), 4000);
    }
</script>

<svelte:head>
    <title>{problem ? problem.title : 'בעיה'} - בעיות לפתרון</title>
</svelte:head>

<section dir="rtl" class="page">
    <a href="/problems" class="back">← חזרה ללוח הבעיות</a>

    {#if !problem}
        <div class="not-found">
            <div class="emoji-big">🤔</div>
            <h2>בעיה לא נמצאה</h2>
            <p>ייתכן שהיא נמחקה או שהקישור שגוי.</p>
            <a href="/problems" class="btn-primary">לכל הבעיות</a>
        </div>
    {:else}
        <article class="problem" style="--c:{team?.color ?? '#f59e0b'}">
            <div class="head">
                <span class="badge badge-{problem.type}">
                    {problem.type === 'community' ? '🏘️ קהילה' : '👤 פרטי'}
                </span>
                <span class="status status-{problem.status}">
                    {problem.status === 'open' ? '🟢 פתוח' : problem.status === 'in-progress' ? '🟡 בטיפול' : '⚪ נפתר'}
                </span>
                <span class="bounty">{formatBounty(problem.bounty)}</span>
            </div>

            <h1 class="ptitle">{problem.title}</h1>

            <div class="poster">
                <div class="team-chip">
                    {#if team?.image}<img src={team.image} alt={team.name} loading="lazy" />{:else}<span class="t-emoji">{team?.emoji ?? '🔧'}</span>{/if}
                    <span>{team?.name ?? problem.category}</span>
                </div>
                <div class="poster-info">
                    <strong>{problem.posterName}</strong>
                    <span class="dim">•</span>
                    <span class="dim">{formatTimeAgo(problem.createdAt)}</span>
                </div>
            </div>

            <p class="pdesc">{problem.description}</p>

            <div class="contact-box">
                <span class="contact-label">📞 פרטי קשר של המעלה:</span>
                <span class="contact-value">{problem.contact}</span>
            </div>
        </article>

        <!-- אזור הצעות פתרון -->
        <section class="solutions">
            <div class="sol-head">
                <h2>הצעות פתרון ({problem.solutions.length})</h2>
                {#if !showForm}
                    <button class="btn-primary" onclick={() => showForm = true}>
                        ✍️ הצעת פתרון
                    </button>
                {/if}
            </div>

            {#if justSubmitted}
                <div class="ok">✅ ההצעה שלך נשלחה! המעלה יכול ליצור איתך קשר.</div>
            {/if}

            {#if showForm}
                <form class="solform" onsubmit={(e) => { e.preventDefault(); submitSolution(); }}>
                    <h3>הצעת הפתרון שלך</h3>

                    <div class="srow">
                        <div class="sfield">
                            <label for="solverName">שמך</label>
                            <input id="solverName" type="text" bind:value={solverName} placeholder="שם מלא" />
                        </div>
                        <div class="sfield">
                            <label for="solverContact">פרטי קשר</label>
                            <input id="solverContact" type="text" bind:value={contact} placeholder="טלפון / אימייל" />
                        </div>
                    </div>

                    <div class="sfield">
                        <label for="proposal">תיאור הפתרון המוצע</label>
                        <textarea id="proposal" bind:value={proposal} rows="4"
                                  placeholder="כיצד תפתור את הבעיה? באיזה לוח זמנים? איזה ניסיון רלוונטי יש לך?"
                                  maxlength="1500"></textarea>
                        <small>{proposal.length} / 1500</small>
                    </div>

                    <div class="sfield">
                        <label for="askingPrice">מחיר מבוקש (₪)</label>
                        <input id="askingPrice" type="number" bind:value={askingPrice} min="1" step="50"
                               placeholder="מתוך תקציב של {formatBounty(problem.bounty)}" />
                    </div>

                    <div class="sactions">
                        <button type="submit" class="btn-primary" disabled={!canSubmit}>שלח הצעה</button>
                        <button type="button" class="btn-ghost" onclick={() => showForm = false}>ביטול</button>
                    </div>
                </form>
            {/if}

            {#if problem.solutions.length === 0}
                <div class="no-sol">
                    <p>טרם הוגשו הצעות. תהיה הראשון! 🚀</p>
                </div>
            {:else}
                <div class="sol-list">
                    {#each problem.solutions as s (s.id)}
                        <div class="sol-card">
                            <div class="sol-top">
                                <strong>{s.solverName}</strong>
                                <span class="ask">{formatBounty(s.askingPrice)}</span>
                            </div>
                            <p class="sol-text">{s.proposal}</p>
                            <div class="sol-bot">
                                <span class="dim">📞 {s.contact}</span>
                                <span class="dim">{formatTimeAgo(s.createdAt)}</span>
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}
        </section>
    {/if}
</section>

<style>
    .page {
        max-width: 820px; margin: 0 auto;
        padding: 1.5rem 1rem 4rem;
    }

    .back {
        display: inline-block; margin-bottom: 1rem;
        color: #fbbf24; text-decoration: none; font-size: 0.9rem;
    }
    .back:hover { color: #fde047; }

    .not-found { text-align: center; padding: 3rem 1rem; }
    .emoji-big { font-size: 3.5rem; margin-bottom: 0.5rem; }
    .not-found h2 { color: #f1f5f9; margin-bottom: 0.4rem; }
    .not-found p { color: #94a3b8; margin-bottom: 1.5rem; }

    .problem {
        background: linear-gradient(135deg, rgba(15, 23, 42, 0.85), rgba(30, 41, 59, 0.7));
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-right: 5px solid var(--c, #f59e0b);
        border-radius: 0.85rem;
        padding: 1.5rem;
        margin-bottom: 1.8rem;
    }

    .head {
        display: flex; gap: 0.6rem; align-items: center;
        flex-wrap: wrap; margin-bottom: 1rem;
    }

    .badge, .status {
        font-size: 0.78rem; font-weight: 700;
        padding: 0.28rem 0.7rem; border-radius: 999px;
    }
    .badge-individual { background: rgba(96, 165, 250, 0.2); color: #93c5fd; }
    .badge-community  { background: rgba(34, 197, 94, 0.2); color: #86efac; }

    .status-open { background: rgba(34, 197, 94, 0.15); color: #86efac; }
    .status-in-progress { background: rgba(234, 179, 8, 0.15); color: #fde047; }
    .status-solved { background: rgba(148, 163, 184, 0.15); color: #cbd5e1; }

    .bounty {
        margin-right: auto;
        font-weight: 800; font-size: 1.4rem;
        color: #fbbf24;
    }

    .ptitle {
        font-size: clamp(1.4rem, 3.5vw, 2rem);
        font-weight: 800; color: #f8fafc;
        margin-bottom: 0.9rem; line-height: 1.25;
    }

    .poster {
        display: flex; gap: 1rem; flex-wrap: wrap;
        align-items: center; margin-bottom: 1rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.07);
    }
    .team-chip {
        display: flex; align-items: center; gap: 0.5rem;
        background: rgba(255, 255, 255, 0.07);
        padding: 0.35rem 0.7rem;
        border-radius: 999px;
        color: #cbd5e1; font-size: 0.85rem; font-weight: 600;
    }
    .team-chip img { width: 24px; height: 24px; border-radius: 50%; object-fit: cover; }
    .t-emoji { font-size: 1.1rem; }
    .poster-info { color: #cbd5e1; font-size: 0.9rem; }
    .dim { color: #64748b; }

    .pdesc {
        color: #e2e8f0; line-height: 1.6;
        white-space: pre-wrap;
        margin-bottom: 1.2rem;
    }

    .contact-box {
        background: rgba(245, 158, 11, 0.08);
        border: 1px solid rgba(245, 158, 11, 0.25);
        border-radius: 0.6rem;
        padding: 0.8rem 1rem;
        display: flex; gap: 0.7rem; flex-wrap: wrap; align-items: center;
    }
    .contact-label { color: #fbbf24; font-weight: 700; font-size: 0.9rem; }
    .contact-value { color: #f1f5f9; font-weight: 600; }

    /* פתרונות */
    .solutions {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 0.85rem; padding: 1.4rem;
    }
    .sol-head {
        display: flex; justify-content: space-between; align-items: center;
        margin-bottom: 1rem; gap: 0.7rem; flex-wrap: wrap;
    }
    .sol-head h2 {
        color: #f1f5f9; font-size: 1.25rem; font-weight: 800;
    }

    .ok {
        background: rgba(34, 197, 94, 0.15);
        border: 1px solid rgba(34, 197, 94, 0.4);
        color: #86efac;
        padding: 0.7rem 0.9rem;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
    }

    .no-sol {
        text-align: center; padding: 1.5rem;
        color: #64748b;
    }

    .sol-list { display: flex; flex-direction: column; gap: 0.8rem; }
    .sol-card {
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 0.7rem;
        padding: 1rem;
    }
    .sol-top {
        display: flex; justify-content: space-between; align-items: center;
        margin-bottom: 0.5rem;
    }
    .sol-top strong { color: #f1f5f9; }
    .ask { color: #fbbf24; font-weight: 800; }
    .sol-text { color: #e2e8f0; line-height: 1.5; margin-bottom: 0.6rem; white-space: pre-wrap; }
    .sol-bot {
        display: flex; justify-content: space-between;
        font-size: 0.8rem;
    }

    /* טופס הצעה */
    .solform {
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(245, 158, 11, 0.3);
        border-radius: 0.7rem;
        padding: 1.2rem;
        margin-bottom: 1.2rem;
        display: flex; flex-direction: column; gap: 0.9rem;
    }
    .solform h3 {
        color: #fbbf24; font-size: 1rem; font-weight: 700;
    }
    .srow { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; }
    .sfield { display: flex; flex-direction: column; gap: 0.35rem; }
    .sfield label { color: #cbd5e1; font-size: 0.85rem; font-weight: 600; }
    .sfield small { color: #64748b; font-size: 0.75rem; text-align: left; }

    .solform input, .solform textarea {
        background: rgba(15, 23, 42, 0.8);
        color: #f1f5f9;
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 0.5rem;
        padding: 0.65rem 0.85rem;
        font-size: 0.93rem;
        font-family: inherit;
    }
    .solform input:focus, .solform textarea:focus {
        outline: none;
        border-color: #f59e0b;
        box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);
    }
    .solform textarea { resize: vertical; min-height: 100px; }

    .sactions { display: flex; gap: 0.6rem; }

    .btn-primary {
        background: linear-gradient(135deg, #f59e0b, #ea580c);
        color: #1a0c00;
        padding: 0.7rem 1.3rem;
        border: none; border-radius: 0.6rem;
        font-weight: 800;
        cursor: pointer;
        text-decoration: none;
        display: inline-block;
        box-shadow: 0 4px 14px rgba(245, 158, 11, 0.4);
        transition: transform 0.2s;
    }
    .btn-primary:hover:not(:disabled) { transform: translateY(-2px); }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

    .btn-ghost {
        background: rgba(255, 255, 255, 0.08);
        color: #e2e8f0;
        padding: 0.7rem 1.1rem;
        border-radius: 0.6rem;
        font-weight: 600;
        border: 1px solid rgba(255, 255, 255, 0.12);
        cursor: pointer;
    }

    @media (max-width: 640px) {
        .srow { grid-template-columns: 1fr; }
    }
</style>
