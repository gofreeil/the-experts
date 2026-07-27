<script lang="ts">
    // דף "פרסם אצלנו" — היעד של הקישור בפוטר ובבאנרי הפרסום הפנויים.
    // אין באתר הזה בילדר פרסומות, ולכן הפרסום מתואם ישירות מול המערכת.
    import { adPlans } from "$lib/adPlans";

    const email = "freedomhasbegun@gmail.com";
    const waNumber = "972508750632";
    const waHref = (planTitle: string, price: number) =>
        `https://wa.me/${waNumber}?text=` +
        encodeURIComponent(`שלום, אני מעוניין לפרסם באתר "המומחים של העם" — ${planTitle} (${price} ₪)`);

    const mailto =
        `mailto:${email}` +
        `?subject=${encodeURIComponent('פרסום באתר המומחים של העם')}` +
        `&body=${encodeURIComponent(
            'שלום,\nאשמח לפרסם באתר המומחים של העם.\n\n' +
            'שם העסק / הארגון:\n' +
            'טלפון לחזרה:\n' +
            'המסלול המבוקש:\n'
        )}`;

    // פרסומת אחת בלבד באתר — אותה מודעה מוצגת בשני המסכים:
    // בדסקטופ בטור הימני, ובנייד למשך 5 שניות אחרי לחיצה על פריט.
    const placements = [
        {
            icon: "🖥️",
            title: "בדסקטופ — הטור הימני",
            where: "עמודה קבועה בצד ימין של האתר, בכל הדפים",
            points: [
                "מוצגת לכל גולשי הדסקטופ לאורך כל הביקור",
                "המודעות מתחלפות במחזור — כל מודעה מקבלת את הבמה",
                "נשארת על המסך גם בזמן גלילה",
            ],
        },
        {
            icon: "📱",
            title: "בנייד — 5 שניות אחרי לחיצה על פריט",
            where: "אותה פרסומת, במסך מלא",
            points: [
                "מסך מלא למשך 5 שניות — חשיפה מלאה ללא הסחות",
                "מוצגת בדיוק כשהגולש ממוקד",
                "לחיצה על המודעה פותחת את האתר שלכם",
            ],
        },
    ];
</script>

<svelte:head>
    <title>פרסם אצלנו | המומחים של העם</title>
    <meta name="description" content="פרסום באתר המומחים של העם — טור פרסומות בדסקטופ ופרסומת מסך-מלא בנייד. מחירון לפי תקופה, בתשלום מראש." />
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-8 md:py-12" dir="rtl">
    <div class="rounded-3xl border border-[#3b5794] bg-[#16264d] shadow-2xl overflow-hidden">

        <!-- כותרת -->
        <div class="p-6 md:p-10 text-center">
            <div class="text-5xl mb-4">📢</div>
            <h1 class="text-3xl md:text-4xl font-black bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent mb-3">
                פרסמו במומחים של העם
            </h1>
            <p class="text-gray-300 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
                גולשים מגיעים לכאן כדי למצוא בעלי מקצוע ופתרונות. המודעה שלכם
                פוגשת אותם בדיוק ברגע החיפוש — וההכנסות מהפרסום עוזרות להחזיק
                את האתר פתוח וחינמי לציבור.
            </p>
        </div>

        <!-- איפה הפרסומת (האחת) מופיעה -->
        <div class="mx-8 md:mx-12 border-t border-[#3b5794]"></div>
        <div class="grid md:grid-cols-2">
            {#each placements as p, i (p.title)}
                <div class="relative p-6 flex flex-col">
                    {#if i === 1}
                        <div class="absolute top-0 right-8 left-8 border-t border-[#3b5794] md:top-6 md:bottom-6 md:right-0 md:left-auto md:border-t-0 md:border-r" aria-hidden="true"></div>
                    {/if}
                    <div class="text-4xl mb-3">{p.icon}</div>
                    <h2 class="text-xl font-black text-white mb-1">{p.title}</h2>
                    <p class="text-sm text-amber-300 font-bold mb-4">{p.where}</p>
                    <ul class="space-y-2">
                        {#each p.points as point}
                            <li class="text-sm text-gray-300 flex items-start gap-2 leading-relaxed">
                                <span class="text-green-400 flex-shrink-0">✓</span>
                                {point}
                            </li>
                        {/each}
                    </ul>
                </div>
            {/each}
        </div>

        <!-- מחירון -->
        <div class="mx-8 md:mx-12 border-t border-[#3b5794]"></div>
        <div class="p-6 md:p-8">
            <h2 class="text-2xl font-black text-white mb-2 text-center">לבחור ולשלם מראש</h2>
            <p class="text-sm text-gray-300 text-center mb-6">
                פרסומת אחת באתר — בדסקטופ בטור הימני ובנייד אחרי לחיצה על פריט. בוחרים תקופה ומשלמים מראש.
            </p>
            <ul class="max-w-md mx-auto space-y-2">
                {#each adPlans as plan (plan.days)}
                    <li class="flex items-center justify-between gap-3 rounded-xl bg-[#0f1c3d] border border-[#3b5794] px-4 py-3">
                        <span class="text-gray-200 text-sm md:text-base">{plan.title}</span>
                        <span class="flex items-center gap-3">
                            <span class="text-amber-300 font-black text-base md:text-lg whitespace-nowrap">{plan.price} ₪</span>
                            <a
                                href={waHref(plan.title, plan.price)}
                                target="_blank"
                                rel="noopener noreferrer"
                                class="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-black text-white transition hover:opacity-90 whitespace-nowrap"
                            >💬 לתיאום</a>
                        </span>
                    </li>
                {/each}
            </ul>
            <p class="mt-5 text-center text-sm text-gray-300">
                <a href="/about/advertise/terms" class="underline hover:text-white transition-colors">📜 תנאי הפרסום</a>
                — מומלץ לקרוא לפני התשלום
            </p>
        </div>

        <!-- איך מפרסמים -->
        <div class="mx-8 md:mx-12 border-t border-[#3b5794]"></div>
        <div class="p-6 md:p-8 text-center">
            <h2 class="text-2xl font-black text-white mb-6">איך מפרסמים?</h2>
            <ol class="text-right max-w-md mx-auto space-y-4 mb-8">
                <li class="flex items-start gap-3">
                    <span class="w-7 h-7 rounded-full bg-amber-400 text-black text-sm font-black flex items-center justify-center flex-shrink-0">1</span>
                    <span class="text-gray-200 text-sm md:text-base leading-relaxed">בוחרים מסלול מהמחירון ופונים אלינו בוואטסאפ או במייל.</span>
                </li>
                <li class="flex items-start gap-3">
                    <span class="w-7 h-7 rounded-full bg-amber-400 text-black text-sm font-black flex items-center justify-center flex-shrink-0">2</span>
                    <span class="text-gray-200 text-sm md:text-base leading-relaxed">שולחים את חומרי הפרסומת (תמונה, כותרת, קישור) ומשלמים מראש.</span>
                </li>
                <li class="flex items-start gap-3">
                    <span class="w-7 h-7 rounded-full bg-amber-400 text-black text-sm font-black flex items-center justify-center flex-shrink-0">3</span>
                    <span class="text-gray-200 text-sm md:text-base leading-relaxed">הפרסומת עוברת אישור — ומיד עולה לאוויר.</span>
                </li>
            </ol>
            <p class="mt-4 text-xs text-gray-400">
                שאלות? כתבו לנו:
                <a href={mailto} class="underline hover:text-white transition-colors" dir="ltr">{email}</a>
            </p>
        </div>

    </div>
</div>
