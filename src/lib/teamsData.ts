// נתוני צוותי המומחים - מקור יחיד לכוורת המומחים
// פריט ראשון = מרכז הכוורת; שמונת הבאים = תאי הכוורת סביב
export type Team = {
    slug: string;
    name: string;
    desc: string;
    emoji: string;
    color: string;
    image?: string;
};

export const teams: Team[] = [
    { slug: 'admin',        name: 'צוות מנהל',                   desc: 'תפקידם לקדם את ועדי השכונות להגשמת החזון: לעצמאות, חופש, רווחה, וחברה סולידרית! בכפוף להצבעות הועדים.', emoji: '👥', color: '#f59e0b', image: '/images/teams/admin.png' },
    { slug: 'law',          name: 'צוות עורכי דין',              desc: 'תפקידם לסייע לועדי השכונות למצות את הזכויות שלהם מול הרשויות.', emoji: '⚖️', color: '#3b82f6', image: '/images/teams/law.png' },
    { slug: 'economy',      name: 'צוות כלכלה',                  desc: 'תפקידם לנתח הצעה ליעול מערכות או מוצרים לצורך הפרוייקטים שלנו.', emoji: '💰', color: '#06b6d4', image: '/images/teams/economy.png' },
    { slug: 'education',    name: 'צוות חינוך',                  desc: 'תפקידם לקדם:\n1. ועד הורים ארצי שיהיה מעורב בתכני הלימוד של הילדים שלנו.\n2. לייצר פתרונות לקידום חינוך עצמאי מוסרי ומקצועי.', emoji: '🎓', color: '#22c55e', image: '/images/teams/education.png' },
    { slug: 'agriculture',  name: 'צוות חקלאות',                 desc: 'תפקידו:\n1. לסייע בפרוייקט שיעשיר את הערים בגינות מאכל.\n2. יפתח מוצרים עזר לגידול ביתי ובכלל לחקלאות.', emoji: '🌾', color: '#84cc16', image: '/images/teams/agriculture.png' },
    { slug: 'technology',   name: 'צוות טכנולוגיה',              desc: 'תפקידם לפתח מוצרים שיועילו לכלל.', emoji: '💻', color: '#8b5cf6', image: '/images/teams/technology.png' },
    { slug: 'health',       name: 'צוות בריאות טבעית',           desc: 'לקדם ידע, מניעה, בריאות וריפוי הטובים ביותר, והזולים ביותר לכלל האוכלוסיה!', emoji: '🌿', color: '#10b981', image: '/images/teams/health.png' },
    { slug: 'ethics',       name: 'צוות מוסר',                   desc: 'לקדם קהילתיות, חברה צדק ואחווה שלום ורעות בין כלל הזרמים בחברה בישראל.', emoji: '🕊️', color: '#e2e8f0', image: '/images/teams/ethics.jpg' },
    { slug: 'rights',       name: 'צוות מיצוי זכויות',           desc: 'תפקידם לסייע לתושבים ולוועדים למצות את הזכויות המגיעות להם מול הרשויות והמדינה - תוך מחקר, ליווי וייעוץ.', emoji: '🔍', color: '#ef4444', image: '/images/teams/rights.png' }
];

export const teamBySlug = (slug: string): Team | undefined => teams.find((t) => t.slug === slug);
