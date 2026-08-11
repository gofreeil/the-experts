<script lang="ts">
    import { onMount } from "svelte";

    let currentGroup = $state(0);
    let totalSwaps = $state(0);

    const ads = [
        {
            text: "מקום פרסום",
            description: "יכול להיות שלך",
            borderColor: "border-orange-500/30",
            bgColor: "bg-orange-900/10",
            hoverBorder: "hover:border-orange-500",
            hoverBg: "hover:bg-orange-900/20",
            textColor: "text-orange-400",
            hoverText: "group-hover:text-orange-200",
            buttonColor: "bg-orange-600 hover:bg-orange-500",
        },
        {
            text: "מקום פרסום",
            description: "יכול להיות שלך",
            borderColor: "border-blue-500/30",
            bgColor: "bg-blue-900/10",
            hoverBorder: "hover:border-blue-500",
            hoverBg: "hover:bg-blue-900/20",
            textColor: "text-blue-400",
            hoverText: "group-hover:text-blue-200",
            buttonColor: "bg-blue-600 hover:bg-blue-500",
        },
        {
            text: "מקום פרסום",
            description: "יכול להיות שלך",
            borderColor: "border-green-500/30",
            bgColor: "bg-green-900/10",
            hoverBorder: "hover:border-green-500",
            hoverBg: "hover:bg-green-900/20",
            textColor: "text-green-400",
            hoverText: "group-hover:text-green-200",
            buttonColor: "bg-green-600 hover:bg-green-500",
        },
        {
            text: "מקום פרסום",
            description: "יכול להיות שלך",
            borderColor: "border-amber-500/30",
            bgColor: "bg-amber-900/10",
            hoverBorder: "hover:border-amber-500",
            hoverBg: "hover:bg-amber-900/20",
            textColor: "text-amber-400",
            hoverText: "group-hover:text-amber-200",
            buttonColor: "bg-amber-600 hover:bg-amber-500",
        },
        {
            text: "מקום פרסום",
            description: "יכול להיות שלך",
            borderColor: "border-purple-500/30",
            bgColor: "bg-purple-900/10",
            hoverBorder: "hover:border-purple-500",
            hoverBg: "hover:bg-purple-900/20",
            textColor: "text-purple-400",
            hoverText: "group-hover:text-purple-200",
            buttonColor: "bg-purple-600 hover:bg-purple-500",
        },
        {
            text: "מקום פרסום",
            description: "יכול להיות שלך",
            borderColor: "border-red-500/30",
            bgColor: "bg-red-900/10",
            hoverBorder: "hover:border-red-500",
            hoverBg: "hover:bg-red-900/20",
            textColor: "text-red-400",
            hoverText: "group-hover:text-red-200",
            buttonColor: "bg-red-600 hover:bg-red-500",
        },
        {
            text: "מקום פרסום",
            description: "יכול להיות שלך",
            borderColor: "border-indigo-500/30",
            bgColor: "bg-indigo-900/10",
            hoverBorder: "hover:border-indigo-500",
            hoverBg: "hover:bg-indigo-900/20",
            textColor: "text-indigo-400",
            hoverText: "group-hover:text-indigo-200",
            buttonColor: "bg-indigo-600 hover:bg-indigo-500",
        },
        {
            text: "מקום פרסום",
            description: "יכול להיות שלך",
            borderColor: "border-teal-500/30",
            bgColor: "bg-teal-900/10",
            hoverBorder: "hover:border-teal-500",
            hoverBg: "hover:bg-teal-900/20",
            textColor: "text-teal-400",
            hoverText: "group-hover:text-teal-200",
            buttonColor: "bg-teal-600 hover:bg-teal-500",
        },
        {
            text: "מקום פרסום",
            description: "יכול להיות שלך",
            borderColor: "border-pink-500/30",
            bgColor: "bg-pink-900/10",
            hoverBorder: "hover:border-pink-500",
            hoverBg: "hover:bg-pink-900/20",
            textColor: "text-pink-400",
            hoverText: "group-hover:text-pink-200",
            buttonColor: "bg-pink-600 hover:bg-pink-500",
        },
        {
            text: "מקום פרסום",
            description: "יכול להיות שלך",
            borderColor: "border-yellow-500/30",
            bgColor: "bg-yellow-900/10",
            hoverBorder: "hover:border-yellow-500",
            hoverBg: "hover:bg-yellow-900/20",
            textColor: "text-yellow-400",
            hoverText: "group-hover:text-yellow-200",
            buttonColor: "bg-yellow-600 hover:bg-yellow-500",
        },
        {
            text: "מקום פרסום",
            description: "יכול להיות שלך",
            borderColor: "border-emerald-500/30",
            bgColor: "bg-emerald-900/10",
            hoverBorder: "hover:border-emerald-500",
            hoverBg: "hover:bg-emerald-900/20",
            textColor: "text-emerald-400",
            hoverText: "group-hover:text-emerald-200",
            buttonColor: "bg-emerald-600 hover:bg-emerald-500",
        },
        {
            text: "מקום פרסום",
            description: "יכול להיות שלך",
            borderColor: "border-fuchsia-500/30",
            bgColor: "bg-fuchsia-900/10",
            hoverBorder: "hover:border-fuchsia-500",
            hoverBg: "hover:bg-fuchsia-900/20",
            textColor: "text-fuchsia-400",
            hoverText: "group-hover:text-fuchsia-200",
            buttonColor: "bg-fuchsia-600 hover:bg-fuchsia-500",
        },
        {
            text: "מקום פרסום",
            description: "יכול להיות שלך",
            borderColor: "border-cyan-500/30",
            bgColor: "bg-cyan-900/10",
            hoverBorder: "hover:border-cyan-500",
            hoverBg: "hover:bg-cyan-900/20",
            textColor: "text-cyan-400",
            hoverText: "group-hover:text-cyan-200",
            buttonColor: "bg-cyan-600 hover:bg-cyan-500",
        },
        {
            text: "מקום פרסום",
            description: "יכול להיות שלך",
            borderColor: "border-rose-500/30",
            bgColor: "bg-rose-900/10",
            hoverBorder: "hover:border-rose-500",
            hoverBg: "hover:bg-rose-900/20",
            textColor: "text-rose-400",
            hoverText: "group-hover:text-rose-200",
            buttonColor: "bg-rose-600 hover:bg-rose-500",
        },
        {
            text: "מקום פרסום",
            description: "יכול להיות שלך",
            borderColor: "border-lime-500/30",
            bgColor: "bg-lime-900/10",
            hoverBorder: "hover:border-lime-500",
            hoverBg: "hover:bg-lime-900/20",
            textColor: "text-lime-400",
            hoverText: "group-hover:text-lime-200",
            buttonColor: "bg-lime-600 hover:bg-lime-500",
        },
        {
            text: "מקום פרסום",
            description: "יכול להיות שלך",
            borderColor: "border-sky-500/30",
            bgColor: "bg-sky-900/10",
            hoverBorder: "hover:border-sky-500",
            hoverBg: "hover:bg-sky-900/20",
            textColor: "text-sky-400",
            hoverText: "group-hover:text-sky-200",
            buttonColor: "bg-sky-600 hover:bg-sky-500",
        },
    ];

    const VIEW_MS = 7000;    // כמה זמן כל קבוצה נשארת על המסך — חצי מהקצב הישן (14 ש׳)
    // מספר הקבוצות נגזר מאורך המערך: 16 תבניות בקבוצות של 4 ⇒ 4 קבוצות
    const GROUP_COUNT = Math.ceil(ads.length / 4);
    // עצירה אחרי 3 סבבים מלאים של כל הקבוצות (המקורית + 11 החלפות = 12 צעדים)
    const MAX_SWAPS = 3 * GROUP_COUNT - 1;

    onMount(() => {
        // ההחלפה עצמה היא מיזוג שקיפות (crossfade) שקורה כולו ב-CSS —
        // כאן רק מקדמים את מספר הקבוצה, בלי מכונת מצבים של דעיכה.
        const interval = setInterval(() => {
            if (totalSwaps < MAX_SWAPS) {
                currentGroup = (currentGroup + 1) % GROUP_COUNT;
                totalSwaps++;
            } else {
                clearInterval(interval);
            }
        }, VIEW_MS);

        return () => clearInterval(interval);
    });

    // המערך בקבוצות של 4 (1-4, 5-8, 9-12, 13-16). כל הקבוצות מרונדרות
    // זו על גבי זו ורק הפעילה נראית, כך שההחלפה היא מיזוג עדין בין שתי
    // שכבות ולא החלפת תוכן מול העין.
    let groups = $derived(
        Array.from({ length: GROUP_COUNT }, (_, g) => ads.slice(g * 4, (g + 1) * 4)),
    );
</script>

<!-- RightAdBanner.svelte -->
<aside
    aria-label="פרסומות"
    class="hidden xl:block w-36 flex-shrink-0 sticky top-4 h-fit pb-8 text-center"
>
    <h4
        class="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2 px-2"
    >
        תוכן שיווקי
    </h4>
    <!-- כל הקבוצות שוכבות זו על זו באותו תא grid; ההחלפה היא מיזוג
         שקיפות איטי בין השכבות - בלי רגע ריק ובלי קפיצות תוכן. -->
    <div class="ads-stage">
        {#each groups as grp, gi}
        <div class="space-y-3 ads-group" class:active={gi === currentGroup}>
        {#each grp as ad, index}
            <a
                href="/about/advertise"
                aria-label="מקום פרסום פנוי — לפרטים על פרסום באתר"
                class="h-[490px] flex flex-col items-center justify-center rounded-2xl border-2 border-dashed {ad.borderColor} {ad.bgColor} p-3 text-center transition-all {ad.hoverBorder} {ad.hoverBg} group duration-700 relative overflow-hidden"
            >
                <!-- Ad Numbering -->
                <div
                    class="absolute top-3 right-3 text-sm font-black text-white/60 bg-white/10 px-3 py-1 rounded-full border border-white/5 backdrop-blur-sm shadow-sm"
                >
                    {gi * 4 + index + 1}
                </div>

                <div
                    class="flex flex-col items-center justify-between h-full py-6 relative overflow-hidden w-full"
                >
                    <div
                        class="text-3xl mt-4 z-10 transition-transform group-hover:scale-125 duration-300"
                    >
                        📢
                    </div>

                    <div
                        class="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                        <div
                            class="-rotate-90 flex items-center gap-3 whitespace-nowrap transform origin-center"
                        >
                            <span
                                class="text-2xl font-black {ad.textColor} {ad.hoverText} tracking-wider drop-shadow-sm"
                            >
                                {ad.text} זה
                            </span>
                            <span
                                class="text-base font-bold {ad.textColor} {ad.hoverText} opacity-90 drop-shadow-sm"
                            >
                                - {ad.description}
                            </span>
                        </div>
                    </div>

                    <span
                        class="mb-4 z-10 rounded-full {ad.buttonColor} px-5 py-2 text-sm font-bold text-white shadow-xl transition-transform hover:scale-105"
                    >
                        לפרטים
                    </span>
                </div>
            </a>
        {/each}
        </div>
        {/each}
    </div>
</aside>

<style>
    /* מעבר עדין בין קבוצות הלוח: כל הקבוצות שוכבות זו על זו באותו תא
       grid, וההחלפה היא מיזוג שקיפות איטי (crossfade) - הקבוצה הנכנסת
       מופיעה בהדרגה בזמן שהיוצאת נמוגה. אין רגע שבו הטור ריק, אין הבזק
       ואין שום תזוזה. */
    .ads-stage {
        display: grid;
    }
    .ads-group {
        grid-area: 1 / 1;
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        transition:
            opacity 1800ms ease-in-out,
            visibility 0s linear 1800ms;
    }
    .ads-group.active {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
        transition: opacity 1800ms ease-in-out;
    }
    @media (prefers-reduced-motion: reduce) {
        .ads-group,
        .ads-group.active {
            transition: none;
        }
    }
</style>
