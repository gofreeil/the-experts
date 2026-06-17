<script lang="ts">
    import { teams } from '$lib/teamsData';

    // המרכז = הצוות הראשון; שאר ה-8 מסביב כתאי כוורת
    const hiveCenter = teams[0];
    const hiveCells = teams.slice(1);
</script>

<svelte:head>
    <title>כוורת המומחים</title>
</svelte:head>

<section dir="rtl" class="page">
    <div class="header">
        <h1 class="title">כוורת המומחים</h1>
        <p class="subtitle">העבירו את העכבר על כל תא לקבלת פרטים</p>
    </div>

    <div class="hive-wrapper">
        <div class="hive">
            <!-- שורה עליונה -->
            <a class="cell" style="--c:{hiveCells[0].color}" href="/experts/{hiveCells[0].slug}" aria-label={hiveCells[0].name}>
                <div class="cell-face">
                    {#if hiveCells[0].image}<img src={hiveCells[0].image} alt={hiveCells[0].name} loading="lazy" />{:else}<span class="emoji">{hiveCells[0].emoji}</span>{/if}
                </div>
                <div class="cell-text">
                    <div class="cell-title">{hiveCells[0].name}</div>
                    <div class="cell-desc">{hiveCells[0].desc}</div>
                </div>
            </a>
            <a class="cell" style="--c:{hiveCells[1].color}" href="/experts/{hiveCells[1].slug}" aria-label={hiveCells[1].name}>
                <div class="cell-face">
                    {#if hiveCells[1].image}<img src={hiveCells[1].image} alt={hiveCells[1].name} loading="lazy" />{:else}<span class="emoji">{hiveCells[1].emoji}</span>{/if}
                </div>
                <div class="cell-text">
                    <div class="cell-title">{hiveCells[1].name}</div>
                    <div class="cell-desc">{hiveCells[1].desc}</div>
                </div>
            </a>

            <!-- שורה אמצעית: שמאל | מרכז | ימין -->
            <a class="cell" style="--c:{hiveCells[2].color}" href="/experts/{hiveCells[2].slug}" aria-label={hiveCells[2].name}>
                <div class="cell-face">
                    {#if hiveCells[2].image}<img src={hiveCells[2].image} alt={hiveCells[2].name} loading="lazy" />{:else}<span class="emoji">{hiveCells[2].emoji}</span>{/if}
                </div>
                <div class="cell-text">
                    <div class="cell-title">{hiveCells[2].name}</div>
                    <div class="cell-desc">{hiveCells[2].desc}</div>
                </div>
            </a>

            <a class="cell cell-center" style="--c:{hiveCenter.color}" href="/experts/{hiveCenter.slug}" aria-label={hiveCenter.name}>
                <div class="cell-face">
                    {#if hiveCenter.image}<img src={hiveCenter.image} alt={hiveCenter.name} loading="lazy" />{:else}<span class="emoji">{hiveCenter.emoji}</span>{/if}
                </div>
                <div class="cell-text">
                    <div class="cell-title">{hiveCenter.name}</div>
                    <div class="cell-desc">{hiveCenter.desc}</div>
                </div>
            </a>

            <a class="cell" style="--c:{hiveCells[3].color}" href="/experts/{hiveCells[3].slug}" aria-label={hiveCells[3].name}>
                <div class="cell-face">
                    {#if hiveCells[3].image}<img src={hiveCells[3].image} alt={hiveCells[3].name} loading="lazy" />{:else}<span class="emoji">{hiveCells[3].emoji}</span>{/if}
                </div>
                <div class="cell-text">
                    <div class="cell-title">{hiveCells[3].name}</div>
                    <div class="cell-desc">{hiveCells[3].desc}</div>
                </div>
            </a>

            <!-- שורת ביניים: ימין רחוק + שמאל רחוק (במישור הגובה של המרכז) -->
            <a class="cell" style="--c:{hiveCells[4].color}" href="/experts/{hiveCells[4].slug}" aria-label={hiveCells[4].name}>
                <div class="cell-face">
                    {#if hiveCells[4].image}<img src={hiveCells[4].image} alt={hiveCells[4].name} loading="lazy" />{:else}<span class="emoji">{hiveCells[4].emoji}</span>{/if}
                </div>
                <div class="cell-text">
                    <div class="cell-title">{hiveCells[4].name}</div>
                    <div class="cell-desc">{hiveCells[4].desc}</div>
                </div>
            </a>
            <a class="cell" style="--c:{hiveCells[5].color}" href="/experts/{hiveCells[5].slug}" aria-label={hiveCells[5].name}>
                <div class="cell-face">
                    {#if hiveCells[5].image}<img src={hiveCells[5].image} alt={hiveCells[5].name} loading="lazy" />{:else}<span class="emoji">{hiveCells[5].emoji}</span>{/if}
                </div>
                <div class="cell-text">
                    <div class="cell-title">{hiveCells[5].name}</div>
                    <div class="cell-desc">{hiveCells[5].desc}</div>
                </div>
            </a>

            <!-- שורה תחתונה -->
            <a class="cell" style="--c:{hiveCells[6].color}" href="/experts/{hiveCells[6].slug}" aria-label={hiveCells[6].name}>
                <div class="cell-face">
                    {#if hiveCells[6].image}<img src={hiveCells[6].image} alt={hiveCells[6].name} loading="lazy" />{:else}<span class="emoji">{hiveCells[6].emoji}</span>{/if}
                </div>
                <div class="cell-text">
                    <div class="cell-title">{hiveCells[6].name}</div>
                    <div class="cell-desc">{hiveCells[6].desc}</div>
                </div>
            </a>
            <a class="cell" style="--c:{hiveCells[7].color}" href="/experts/{hiveCells[7].slug}" aria-label={hiveCells[7].name}>
                <div class="cell-face">
                    {#if hiveCells[7].image}<img src={hiveCells[7].image} alt={hiveCells[7].name} loading="lazy" />{:else}<span class="emoji">{hiveCells[7].emoji}</span>{/if}
                </div>
                <div class="cell-text">
                    <div class="cell-title">{hiveCells[7].name}</div>
                    <div class="cell-desc">{hiveCells[7].desc}</div>
                </div>
            </a>
        </div>
    </div>
</section>

<style>
    .page {
        min-height: 80vh;
        padding: 2.5rem 1rem 4rem;
    }

    .header {
        text-align: center;
        margin-bottom: 2.5rem;
    }

    .title {
        font-size: clamp(2rem, 5vw, 3.25rem);
        font-weight: 800;
        background: linear-gradient(to right, #fbbf24, #f59e0b, #ea580c);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        margin-bottom: 0.5rem;
    }

    .subtitle {
        color: #9ca3af;
        font-size: 0.95rem;
    }

    .hive-wrapper {
        display: flex;
        justify-content: center;
    }

    /* רשת הכוורת: 5 עמודות × 5 שורות (כל תא = חצי גובה משושה כדי לקבל הצמדה) */
    .hive {
        --cell-w: clamp(8rem, 14vw, 11rem);
        --cell-h: calc(var(--cell-w) * 1.1547); /* יחס משושה: 2/sqrt(3) */
        --gap-x: 0.45rem;
        --gap-y: -0.15rem; /* חפיפה אנכית כדי שהמשושים יתחברו בלי רווח */

        display: grid;
        grid-template-columns: repeat(5, var(--cell-w));
        grid-auto-rows: calc(var(--cell-h) / 2);
        gap: var(--gap-y) var(--gap-x);
        justify-content: center;
    }

    /* מיקום ידני של 9 התאים על רשת המשושים */
    /* שורה עליונה - שני משושים */
    .cell:nth-child(1) { grid-column: 2; grid-row: 1 / span 2; }
    .cell:nth-child(2) { grid-column: 4; grid-row: 1 / span 2; }

    /* שורה אמצעית - שלושה משושים (שמאל, מרכז, ימין) - מוסטים חצי משושה למטה */
    .cell:nth-child(3) { grid-column: 1; grid-row: 2 / span 2; }
    .cell:nth-child(4) { grid-column: 3; grid-row: 2 / span 2; } /* מרכז */
    .cell:nth-child(5) { grid-column: 5; grid-row: 2 / span 2; }

    /* שורת ביניים - שני משושים */
    .cell:nth-child(6) { grid-column: 2; grid-row: 3 / span 2; }
    .cell:nth-child(7) { grid-column: 4; grid-row: 3 / span 2; }

    /* שורה תחתונה - שני משושים */
    .cell:nth-child(8) { grid-column: 1; grid-row: 4 / span 2; }
    .cell:nth-child(9) { grid-column: 5; grid-row: 4 / span 2; }

    .cell {
        position: relative;
        display: block;
        width: var(--cell-w);
        height: var(--cell-h);
        text-decoration: none;
        color: inherit;
        cursor: pointer;
        clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
        filter:
            drop-shadow(0 6px 14px rgba(0, 0, 0, 0.45));
        transition: transform 0.3s ease, filter 0.3s ease;
    }

    .cell:hover {
        z-index: 5;
        transform: scale(1.06);
        filter:
            drop-shadow(0 10px 22px rgba(0, 0, 0, 0.55))
            drop-shadow(0 0 16px var(--c, #f59e0b));
    }

    .cell-center {
        z-index: 3;
    }

    .cell-face,
    .cell-text {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity 0.3s ease;
    }

    .cell-face {
        background:
            radial-gradient(circle at 30% 30%,
                color-mix(in srgb, var(--c, #f59e0b) 70%, white 10%),
                color-mix(in srgb, var(--c, #f59e0b) 70%, black 35%));
        /* מסגרת זהב פנימית - אפקט תא דבש */
        box-shadow:
            inset 0 0 0 3px rgba(0, 0, 0, 0.55),
            inset 0 0 0 5px color-mix(in srgb, var(--c, #f59e0b) 80%, #fde047 20%);
    }

    .cell-face img {
        width: 78%;
        height: 78%;
        object-fit: cover;
        clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    }

    .emoji {
        font-size: clamp(1.8rem, 4.5vw, 3rem);
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4));
    }

    .cell-text {
        flex-direction: column;
        text-align: center;
        padding: 0.75rem;
        background: linear-gradient(135deg,
            rgba(0, 0, 0, 0.94),
            color-mix(in srgb, var(--c, #f59e0b) 25%, rgba(0, 0, 0, 0.94)));
        color: white;
        opacity: 0;
        gap: 0.25rem;
        box-shadow:
            inset 0 0 0 3px rgba(0, 0, 0, 0.6),
            inset 0 0 0 5px color-mix(in srgb, var(--c, #f59e0b) 80%, #fde047 20%);
    }

    .cell:hover .cell-face { opacity: 0; }
    .cell:hover .cell-text { opacity: 1; }

    .cell-title {
        font-weight: 800;
        font-size: clamp(0.7rem, 1.5vw, 0.95rem);
        line-height: 1.1;
    }

    .cell-desc {
        font-size: clamp(0.55rem, 1vw, 0.7rem);
        line-height: 1.2;
        opacity: 0.9;
        white-space: pre-line;
    }

    .cell-center .cell-title { font-size: clamp(0.8rem, 1.8vw, 1.05rem); }
    .cell-center .cell-desc { font-size: clamp(0.6rem, 1.2vw, 0.8rem); }

    @media (max-width: 640px) {
        .hive {
            --cell-w: 5.5rem;
            --gap-x: 0.3rem;
        }
        .cell-desc { display: none; }
    }

    @media (prefers-reduced-motion: reduce) {
        .cell { transition: none; }
    }
</style>
