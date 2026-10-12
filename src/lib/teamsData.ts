// נתוני צוותי המומחים - מקור יחיד לכוורת המומחים
// פריט ראשון = מרכז הכוורת; שמונת הבאים = תאי הכוורת סביב
import { resolve, type L10n, type Locale } from '$lib/i18n';

export type TeamSource = {
    slug: string;
    name: L10n;
    desc: L10n;
    emoji: string;
    color: string;
    image?: string;
};

/** צוות כפי שמוצג: השם והתיאור כבר בשפה הנוכחית */
export type Team = { slug: string; name: string; desc: string; emoji: string; color: string; image?: string };

export const teamSources: TeamSource[] = [
    {
        slug: 'admin', emoji: '👥', color: '#f59e0b', image: '/images/teams/admin.webp',
        name: { he: 'צוות מנהל', en: 'Management team' },
        desc: {
            he: 'תפקידם לקדם את ועדי השכונות להגשמת החזון: לעצמאות, חופש, רווחה, וחברה סולידרית! בכפוף להצבעות הועדים.',
            en: 'Their role is to help the neighborhood committees realize the vision: independence, freedom, well-being and a society built on solidarity. Subject to the committees’ votes.'
        }
    },
    {
        slug: 'law', emoji: '⚖️', color: '#3b82f6', image: '/images/teams/law.webp',
        name: { he: 'צוות עורכי דין', en: 'Lawyers team' },
        desc: {
            he: 'תפקידם לסייע לועדי השכונות למצות את הזכויות שלהם מול הרשויות.',
            en: 'Their role is to help the neighborhood committees secure their rights in dealings with the authorities.'
        }
    },
    {
        slug: 'economy', emoji: '💰', color: '#06b6d4', image: '/images/teams/economy.webp',
        name: { he: 'צוות כלכלה', en: 'Economics team' },
        desc: {
            he: 'תפקידם לנתח הצעה ליעול מערכות או מוצרים לצורך הפרוייקטים שלנו.',
            en: 'Their role is to analyze proposals for making systems or products more efficient, for the sake of our projects.'
        }
    },
    {
        slug: 'education', emoji: '🎓', color: '#22c55e', image: '/images/teams/education.webp',
        name: { he: 'צוות חינוך', en: 'Education team' },
        desc: {
            he: 'תפקידם לקדם:\n1. ועד הורים ארצי שיהיה מעורב בתכני הלימוד של הילדים שלנו.\n2. לייצר פתרונות לקידום חינוך עצמאי מוסרי ומקצועי.',
            en: 'Their role is to advance:\n1. A national parents’ committee that is involved in what our children are taught.\n2. Solutions for independent education that is both ethical and professional.'
        }
    },
    {
        slug: 'agriculture', emoji: '🌾', color: '#84cc16', image: '/images/teams/agriculture.webp',
        name: { he: 'צוות חקלאות', en: 'Agriculture team' },
        desc: {
            he: 'תפקידו:\n1. לסייע בפרוייקט שיעשיר את הערים בגינות מאכל.\n2. יפתח מוצרים עזר לגידול ביתי ובכלל לחקלאות.',
            en: 'Its role:\n1. To help with a project that will enrich our cities with edible gardens.\n2. To develop supporting products for home growing and for agriculture in general.'
        }
    },
    {
        slug: 'technology', emoji: '💻', color: '#8b5cf6', image: '/images/teams/technology.webp',
        name: { he: 'צוות טכנולוגיה', en: 'Technology team' },
        desc: {
            he: 'תפקידם לפתח מוצרים שיועילו לכלל.',
            en: 'Their role is to develop products that benefit everyone.'
        }
    },
    {
        slug: 'health', emoji: '🌿', color: '#10b981', image: '/images/teams/health.webp',
        name: { he: 'צוות בריאות טבעית', en: 'Natural health team' },
        desc: {
            he: 'לקדם ידע, מניעה, בריאות וריפוי הטובים ביותר, והזולים ביותר לכלל האוכלוסיה!',
            en: 'To promote the best and most affordable knowledge, prevention, health and healing for the entire population!'
        }
    },
    {
        slug: 'ethics', emoji: '🕊️', color: '#e2e8f0', image: '/images/teams/ethics.webp',
        name: { he: 'צוות מוסר', en: 'Ethics team' },
        desc: {
            he: 'לקדם קהילתיות, חברה צדק ואחווה שלום ורעות בין כלל הזרמים בחברה בישראל.',
            en: 'To promote community life, a just society, brotherhood, peace and friendship among all the streams of Israeli society.'
        }
    },
    {
        slug: 'rights', emoji: '🔍', color: '#ef4444', image: '/images/teams/rights.webp',
        name: { he: 'צוות מיצוי זכויות', en: 'Rights team' },
        desc: {
            he: 'תפקידם לסייע לתושבים ולוועדים למצות את הזכויות המגיעות להם מול הרשויות והמדינה - תוך מחקר, ליווי וייעוץ.',
            en: 'Their role is to help residents and committees secure the rights they are owed from the authorities and the state, through research, guidance and advice.'
        }
    }
];

/** הצוותים בשפה שנבחרה */
export const teamsFor = (locale: Locale): Team[] => resolve(teamSources, locale);

export const teamBySlug = (slug: string, locale: Locale): Team | undefined => teamsFor(locale).find((t) => t.slug === slug);
