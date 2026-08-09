<script lang="ts">
    import { problemsStore, formatTimeAgo, formatBounty, type ProblemType } from '$lib/problemsStore.svelte';
    import { teams, teamBySlug } from '$lib/teamsData';
    import { triggerAdPopup } from '$lib/adPopupStore';
    import { onMount } from 'svelte';

    onMount(() => problemsStore.refresh());

    // בנייד: פרסומת ביניים קצרה בדרך לדף הבעיה (כמו באתר הקהילה).
    // triggerAdPopup מחזיר false בדסקטופ - ואז הקישור מנווט כרגיל.
    function adThenGo(e: MouseEvent, href: string) {
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
        if (triggerAdPopup(href)) e.preventDefault();
    }

    let typeFilter = $state<'all' | ProblemType>('all');
    let categoryFilter = $state<string>('all');
    let sortBy = $state<'newest' | 'bounty'>('newest');

    let filtered = $derived(() => {
        let list = [...problemsStore.items];
        if (typeFilter !== 'all') list = list.filter((p) => p.type === typeFilter);
        if (categoryFilter !== 'all') list = list.filter((p) => p.category === categoryFilter);
        if (sortBy === 'bounty') list.sort((a, b) => b.bounty - a.bounty);
        else list.sort((a, b) => b.createdAt - a.createdAt);
        return list;
    });

    let totalBounty = $derived(filtered().reduce((s, p) => s + p.bounty, 0));
</script>

<svelte:head><title>בעיות לפתרון - לוח התקציבים</title></svelte:head>

<section dir="rtl" class="page">
    <div class="hero">
        <h1 class="title">בעיות לפתרון</h1>
        <p class="subtitle">לוח בעיות פתוחות עם תקציב - מציעים פתרון, מרוויחים</p>

        <div class="cta-row">
            <a href="/problems/new" class="btn btn-primary">
                ➕ העלאת בעיה חדשה
            </a>
            <a href="/" class="btn btn-ghost">
                לכוורת המומחים →
            </a>
        </div>
    </div>

    <div class="stats">
        <div class="stat">
            <div class="stat-num">{filtered().length}</div>
            <div class="stat-label">בעיות פעילות</div>
        </div>
        <div class="stat">
            <div class="stat-num">{formatBounty(totalBounty)}</div>
            <div class="stat-label">סה״כ תקציב פנוי</div>
        </div>
        <div class="stat">
            <div class="stat-num">{filtered().reduce((s,p)=>s+p.solutions.length,0)}</div>
            <div class="stat-label">הצעות פתרון שהוגשו</div>
        </div>
    </div>

    <div class="filters">
        <div class="filter-group">
            <span class="filter-label">סוג מעלה:</span>
            <div class="chips">
                <button class:active={typeFilter==='all'} onclick={()=>typeFilter='all'}>הכל</button>
                <button class:active={typeFilter==='individual'} onclick={()=>typeFilter='individual'}>👤 פרטי</button>
                <button class:active={typeFilter==='community'} onclick={()=>typeFilter='community'}>🏘️ קהילה</button>
            </div>
        </div>

        <div class="filter-group">
            <label for="catFilter" class="filter-label">תחום:</label>
            <select id="catFilter" bind:value={categoryFilter} class="select">
                <option value="all">כל התחומים</option>
                {#each teams as t}
                    <option value={t.slug}>{t.name}</option>
                {/each}
            </select>
        </div>

        <div class="filter-group">
            <label for="sortBy" class="filter-label">מיון:</label>
            <select id="sortBy" bind:value={sortBy} class="select">
                <option value="newest">חדשות קודם</option>
                <option value="bounty">תקציב גבוה קודם</option>
            </select>
        </div>
    </div>

    {#if filtered().length === 0}
        <div class="empty">
            <div class="empty-emoji">📭</div>
            <p>אין בעיות פתוחות במסננים האלה</p>
            <a href="/problems/new" class="btn btn-primary">העלאת בעיה ראשונה</a>
        </div>
    {:else}
        <div class="cards">
            {#each filtered() as p (p.id)}
                {@const team = teamBySlug(p.category)}
                <a class="card" href="/problems/{p.id}" onclick={(e) => adThenGo(e, `/problems/${p.id}`)} style="--c:{team?.color ?? '#f59e0b'}">
                    <div class="card-head">
                        <span class="badge badge-{p.type}">
                            {p.type === 'community' ? '🏘️ קהילה' : '👤 פרטי'}
                        </span>
                        <span class="bounty">{formatBounty(p.bounty)}</span>
                    </div>

                    <h3 class="card-title">{p.title}</h3>
                    <p class="card-desc">{p.description}</p>

                    <div class="card-foot">
                        <div class="cat">
                            {#if team?.image}<img src={team.image} alt={team.name} loading="lazy" />{:else}<span>{team?.emoji ?? '🔧'}</span>{/if}
                            <span>{team?.name ?? p.category}</span>
                        </div>
                        <div class="meta">
                            <span>{p.solutions.length} הצעות</span>
                            <span>•</span>
                            <span>{formatTimeAgo(p.createdAt)}</span>
                        </div>
                    </div>
                </a>
            {/each}
        </div>
    {/if}
</section>

<style>
    .page {
        padding: 2rem 1rem 4rem;
        max-width: 1100px;
        margin: 0 auto;
    }

    .hero { text-align: center; margin-bottom: 2rem; }

    .title {
        font-size: clamp(1.8rem, 4.5vw, 2.8rem);
        font-weight: 800;
        background: linear-gradient(to right, #fbbf24, #f59e0b, #ea580c);
        -webkit-background-clip: text; background-clip: text; color: transparent;
        margin-bottom: 0.4rem;
    }

    .subtitle { color: #94a3b8; font-size: 1rem; margin-bottom: 1.4rem; }

    .cta-row {
        display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;
    }

    .btn {
        display: inline-flex; align-items: center; gap: 0.4rem;
        padding: 0.75rem 1.4rem; border-radius: 0.75rem;
        text-decoration: none; font-weight: 700;
        transition: transform 0.2s, box-shadow 0.2s;
    }
    .btn:hover { transform: translateY(-2px); }

    .btn-primary {
        background: linear-gradient(135deg, #f59e0b, #ea580c);
        color: #1a0c00;
        box-shadow: 0 4px 14px rgba(245, 158, 11, 0.4);
    }
    .btn-primary:hover { box-shadow: 0 6px 20px rgba(245, 158, 11, 0.6); }

    .btn-ghost {
        background: rgba(255, 255, 255, 0.08);
        color: #e2e8f0;
        border: 1px solid rgba(255, 255, 255, 0.15);
    }

    .stats {
        display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;
        margin-bottom: 2rem;
    }
    .stat {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 0.75rem;
        padding: 1rem;
        text-align: center;
    }
    .stat-num {
        font-size: clamp(1.2rem, 3vw, 1.8rem);
        font-weight: 800;
        color: #fbbf24;
    }
    .stat-label { color: #94a3b8; font-size: 0.85rem; }

    .filters {
        display: flex; gap: 1.5rem; flex-wrap: wrap;
        margin-bottom: 1.5rem;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 0.75rem; padding: 1rem;
    }
    .filter-group { display: flex; flex-direction: column; gap: 0.4rem; }
    .filter-group label, .filter-label { color: #94a3b8; font-size: 0.8rem; font-weight: 600; }

    .chips { display: flex; gap: 0.4rem; flex-wrap: wrap; }
    .chips button {
        padding: 0.4rem 0.8rem; border-radius: 999px;
        background: rgba(255, 255, 255, 0.08); color: #e2e8f0;
        border: 1px solid transparent; font-size: 0.85rem; cursor: pointer;
        transition: all 0.2s;
    }
    .chips button:hover { background: rgba(255, 255, 255, 0.15); }
    .chips button.active {
        background: linear-gradient(135deg, #f59e0b, #ea580c);
        color: #1a0c00; font-weight: 700;
    }

    .select {
        background: rgba(255, 255, 255, 0.08);
        color: #e2e8f0;
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 0.5rem;
        padding: 0.45rem 0.7rem;
        font-size: 0.9rem;
    }

    .cards {
        display: grid; gap: 1rem;
        grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
    }

    .card {
        display: block;
        background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.7));
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-right: 4px solid var(--c, #f59e0b);
        border-radius: 0.85rem;
        padding: 1.1rem;
        color: inherit;
        text-decoration: none;
        transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
    }
    .card:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 24px rgba(0, 0, 0, 0.4), 0 0 0 1px var(--c, #f59e0b);
    }

    .card-head {
        display: flex; justify-content: space-between; align-items: center;
        margin-bottom: 0.7rem;
    }
    .badge {
        font-size: 0.75rem; font-weight: 700; padding: 0.25rem 0.6rem;
        border-radius: 999px;
    }
    .badge-individual { background: rgba(96, 165, 250, 0.2); color: #93c5fd; }
    .badge-community  { background: rgba(34, 197, 94, 0.2); color: #86efac; }

    .bounty {
        font-weight: 800; color: #fbbf24; font-size: 1.05rem;
    }

    .card-title {
        font-size: 1.05rem; font-weight: 700; color: #f1f5f9;
        margin-bottom: 0.5rem; line-height: 1.3;
    }
    .card-desc {
        color: #94a3b8; font-size: 0.85rem; line-height: 1.4;
        display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
        overflow: hidden; margin-bottom: 0.9rem;
    }

    .card-foot {
        display: flex; justify-content: space-between; align-items: center;
        padding-top: 0.7rem;
        border-top: 1px solid rgba(255, 255, 255, 0.06);
        font-size: 0.78rem;
    }
    .cat { display: flex; align-items: center; gap: 0.4rem; color: #cbd5e1; }
    .cat img { width: 22px; height: 22px; border-radius: 50%; object-fit: cover; }
    .cat span:last-child { font-weight: 600; }

    .meta { display: flex; align-items: center; gap: 0.35rem; color: #64748b; }

    .empty {
        text-align: center; padding: 3rem 1rem;
        background: rgba(255, 255, 255, 0.03);
        border: 1px dashed rgba(255, 255, 255, 0.15);
        border-radius: 0.85rem;
    }
    .empty-emoji { font-size: 3rem; margin-bottom: 0.6rem; }
    .empty p { color: #94a3b8; margin-bottom: 1rem; }

    @media (max-width: 640px) {
        .stats { grid-template-columns: 1fr; }
        .filters { flex-direction: column; gap: 0.75rem; }
    }
</style>
