// ============================================================
// adsStore.ts — מאגר הפרסומות שמפרסמים מעלים בבילדר המקומי
// (/about/advertise/builder): שליחה → אישור/דחייה במסך /admin/ads →
// תצוגה בטור הימני ובפרסומת-הביניים + דף נחיתה /ads/[id].
//
// פורט מהגמ"ח הארצי (national-gemach) עם שינוי אחסון מכוון:
// במקום קטגוריה פנימית באוסף ה-items, הפרסומות נשמרות באוסף
// submitted-ads המשותף (אותו אוסף של קהילה בשכונה ושל index) —
// אפס שינוי סכמה בבאקאנד. מיפוי העמודות זהה לשלהם:
//   title / subtitle / hover_text / cta / gradient / logo / main_image /
//   ad_status / submitted_at / submitted_by_id|email|name / decided_at|by /
//   rejection_reason / expires_at / duration_days / landing (JSON)
// מושגים שאין להם עמודה חיים בתוך landing במפתחות-קו-תחתון, באותם
// שמות שכבר קיימים ברשת (ראו fromStrapi של index):
//   _site / _order / _paused / _pausedDaysLeft / _adStyle / _mainImageFit /
//   _payment / _codeRequested / _requestedDurationDays / _replacesAdId /
//   _replacesTitle / _supersededBy / _standalone / _editedAt / _imgV
// _site='experts' — שיוך קשיח לאתר הזה; בלעדיו הפרסומת לא קיימת כאן.
// זהירות: תמונות כ-data-URI — תקרת koa-body היא 1MB לבקשה,
// לכן הבילדר מכווץ תמונות לפני השליחה (600KB לכל המודעה).
// ============================================================

import { strapiGet, strapiPost, strapiPut, strapiDelete, StrapiContentTypeError } from './strapiClient.js';
import { DEFAULT_PLAN_DAYS, normalizePlanDays } from '../adPlans.js';
import { parseAdImageFit, type AdImageFit } from '../adImageFit.js';
import { parseAdStyle, type AdStyle } from '../adStyle.js';
import { AD_SLOT_COUNT } from '../rightAdsData.js';
import { imageStamp, decodeDataImage } from './inlineImage.js';

const ENDPOINT = '/api/submitted-ads';

// האוסף משותף לכל הרשת ואין בו עמודת אתר. השיוך נשמר ב-landing._site,
// והבדיקה קשיחה: רק 'experts' שייך לכאן. פרסומת בלי _site היא פרסומת
// ותיקה של "קהילה בשכונה" — לא מוצגת כאן.
const SITE_ID = 'experts';

/** האם הפרסומת שייכת לאתר הזה — שוויון קשיח בלבד. */
function belongsToThisSite(s: { landing?: unknown } | null | undefined): boolean {
    const site = (s?.landing as { _site?: unknown } | null | undefined)?._site;
    return site === SITE_ID;
}

export const DEFAULT_DURATION_DAYS = DEFAULT_PLAN_DAYS;
const DAY_MS = 24 * 60 * 60 * 1000;

export type AdStatus = 'pending' | 'approved' | 'rejected';

export interface AdLanding {
    headline: string;
    pitch: string;
    extended: string;
    image: string;
    advantages: [string, string, string];
    uniqueness: string;
    phone: string;
    whatsapp: string;
    website: string;
    email: string;
    address: string;
    hours: string;
    products: Array<{ id: number; name: string; price: string; image: string; description: string }>;
}

export interface SubmittedAd {
    id: string;                 // documentId
    status: AdStatus;
    title: string;
    subtitle: string;
    hoverText: string;
    cta: string;
    gradient: string;           // מחרוזת CSS מלאה (linear-gradient(...))
    logo: string;               // data URI
    mainImage: string;          // data URI
    /**
     * חותם התוכן של כל תמונות הפרסומת - משמש כ-?v= בכתובת שמגישה אותן,
     * כדי שקאש "לנצח" בדפדפן ובקצה יתחלף ברגע שתמונה מוחלפת. נשמר
     * בכתיבה (landing._imgV) ומחושב מחדש בקריאה כשחסר. ראה imageStamp.
     */
    imgVersion: string;
    /** מיקום+זום של התמונה הראשית במשבצת (מהבילדר) */
    mainImageFit: AdImageFit;
    /** העיצוב שנקבע בבילדר (לוגו, רצועה, כותרת). null = מודעה ותיקה */
    adStyle: AdStyle | null;
    landing: Partial<AdLanding>;
    submittedBy: { id: string; email: string; name: string };
    submittedAt: string;
    decidedAt: string;
    decidedBy: string;
    rejectionReason: string;
    /** עריכה אחרונה בידי המפרסם עצמו (דשבורד הנכס) — ריק אם לא נערכה */
    editedAt: string;
    expiresAt: string;
    durationDays: number;
    /** "code" = סומן כשולם; "pending" = תשלום לתיאום. הגשה תמיד נכנסת כ-pending. */
    payment: string;
    /** המפרסם הקליד את קוד הבעלים — בקשה לפרסום חינם שממתינה לאישור ידני */
    codeRequested: boolean;
    /** התקופה שהמפרסם ביקש בשליחה (אחד ממסלולי adPlans) — ברירת המחדל באישור */
    requestedDurationDays: number;
    /**
     * מספר המקום בלוח הפרסומות, 0-based (0 = מקום 1). המספר קבוע למודעה:
     * הוא לא זז כשמאשרים מודעות אחרות, ונשמר לה גם דרך השהיה ופקיעה.
     * undefined = מודעה ותיקה שטרם הוקצה לה מספר (מקבלת אחד בפעולת
     * הניהול/האישור הבאה, לפי מקומה הנוכחי על האתר).
     */
    slotOrder?: number;
    /** מושהית — יורדת מהאתר ושומרת את הימים שנותרו לה */
    paused?: boolean;
    /** הימים ששמורים לה מרגע ההשהיה — מהם היא ממשיכה בהפעלה מחדש */
    pausedDaysLeft?: number;

    // ----- מפרסם חוזר: גרסה מעודכנת שמחליפה את המודעה הקיימת שלו -----
    /** המודעה הקודמת של אותו מפרסם שהגרסה הזו באה להחליף */
    replacesAdId?: string;
    /** כותרת אותה גרסה קודמת — כדי שהמנהל יראה מה בדיוק מוחלף */
    replacesTitle?: string;
    /** מי החליפה אותה. מודעה מסומנת כך היא היסטוריה ולא מועמדת להחלפה נוספת */
    supersededBy?: string;
    /** מודעה נוספת שנקנתה בכוונה - האישור לא מוריד את מה שכבר רץ למפרסם */
    standalone?: boolean;
}

/** הצורה הרזה שמוזרמת לתצוגה הציבורית (טור ימני + פרסומת-ביניים) */
export interface ApprovedAdPublic {
    id: string;
    title: string;
    subtitle: string;
    cta: string;
    hover: string;
    gradient: string;
    /** לוגו המפרסם (ככתובת); ריק כשלא הועלה לוגו בבילדר */
    logo: string;
    mainImage: string;
    mainImageFit: AdImageFit;
    /** העיצוב מהבילדר; null במודעות שנשלחו לפני שהוא נשמר */
    adStyle: AdStyle | null;
    /** מספר המקום בלוח (1..16) — נקבע במסך הניהול, מחושב תמיד בשרת */
    slot: number;
}

// ----- הצורה השטוחה של Strapi 5 באוסף submitted-ads -----
interface StrapiAd {
    id: number;
    documentId: string;
    ad_status: AdStatus | null;
    title: string | null;
    subtitle: string | null;
    hover_text: string | null;
    cta: string | null;
    gradient: string | null;
    logo: string | null;
    main_image: string | null;
    landing: Record<string, any> | null;
    submitted_by_id: string | null;
    submitted_by_email: string | null;
    submitted_by_name: string | null;
    submitted_at: string | null;
    decided_at: string | null;
    decided_by: string | null;
    rejection_reason: string | null;
    expires_at: string | null;
    duration_days: number | null;
    createdAt?: string;
}

function emptyLanding(): AdLanding {
    return {
        headline: '', pitch: '', extended: '', image: '',
        advantages: ['', '', ''],
        uniqueness: '', phone: '', whatsapp: '', website: '', email: '',
        address: '', hours: '', products: [],
    };
}

/** חותם התמונות של רשומה — לכתיבה (landing._imgV) ולנפילה-אחורה בקריאה */

/**
 * כתובת אתר בטוחה להצמדה ל-href. Svelte לא מחטאת href, ולכן מפרסם
 * שהזין `javascript:...` בשדה האתר היה מקבל קוד שרץ בדומיין של האתר
 * ברגע שגולש לוחץ. מחזירה '' לכל מה שאינו http/https תקין (וגם
 * לכתובת שנושאת שם משתמש/סיסמה, שמשמשת להטעיה).
 */
function safeHttpUrl(value: unknown): string {
    const raw = String(value ?? '').trim();
    if (!raw) return '';
    try {
        const u = new URL(raw);
        if (u.protocol !== 'http:' && u.protocol !== 'https:') return '';
        if (u.username || u.password) return '';
        return u.toString().slice(0, 400);
    } catch {
        return '';
    }
}

/** מנקה את דף הנחיתה בקריאה: כל כתובת שנשלחת לדפדפן עוברת דרך safeHttpUrl */
function sanitizeLanding(l: Record<string, any> | null | undefined): Partial<AdLanding> {
    const src = (l ?? {}) as Record<string, any>;
    return { ...src, website: safeHttpUrl(src.website) } as Partial<AdLanding>;
}
function stampOf(logo: string, mainImage: string, landing: Record<string, any> | null | undefined): string {
    const landingImages: string[] = [
        typeof landing?.image === 'string' ? landing.image : '',
        ...(Array.isArray(landing?.products)
            ? landing.products.map((p: { image?: string }) => p?.image ?? '')
            : []),
    ];
    return imageStamp(logo, mainImage, ...landingImages);
}

function fromStrapi(row: StrapiAd | null | undefined): SubmittedAd | null {
    if (!row) return null;
    const l = (row.landing ?? {}) as Record<string, any>;
    const logo = row.logo ?? '';
    const mainImage = row.main_image ?? '';
    return {
        id: row.documentId,
        status: row.ad_status === 'approved' ? 'approved' : row.ad_status === 'rejected' ? 'rejected' : 'pending',
        title: row.title ?? '',
        subtitle: row.subtitle ?? '',
        hoverText: row.hover_text ?? '',
        cta: row.cta ?? '',
        gradient: row.gradient ?? '',
        logo,
        mainImage,
        // בכתיבה נשמר חותם מוכן; רשומה ותיקה בלעדיו מקבלת חישוב בזמן קריאה
        imgVersion: typeof l._imgV === 'string' && l._imgV
            ? l._imgV
            : stampOf(logo, mainImage, l),
        mainImageFit: parseAdImageFit(l._mainImageFit),
        // null במודעות שנשלחו לפני שהעיצוב נשמר — הצרכן נופל ל-legacyAdStyle
        adStyle: parseAdStyle(l._adStyle),
        landing: sanitizeLanding(row.landing ?? emptyLanding()),
        submittedBy: {
            id: row.submitted_by_id ?? '',
            email: row.submitted_by_email ?? '',
            name: row.submitted_by_name ?? '',
        },
        submittedAt: row.submitted_at ?? row.createdAt ?? '',
        decidedAt: row.decided_at ?? '',
        decidedBy: row.decided_by ?? '',
        rejectionReason: row.rejection_reason ?? '',
        editedAt: typeof l._editedAt === 'string' ? l._editedAt : '',
        expiresAt: row.expires_at ?? '',
        durationDays: Number(row.duration_days) || DEFAULT_DURATION_DAYS,
        payment: l._payment === 'code' ? 'code' : 'pending',
        // המפרסם הקליד את קוד הבעלים — בקשה לפרסום חינם, לא אישור שלה
        codeRequested: l._codeRequested === true,
        requestedDurationDays: normalizePlanDays(l._requestedDurationDays),
        slotOrder: typeof l._order === 'number' ? l._order : undefined,
        paused: l._paused === true,
        pausedDaysLeft: typeof l._pausedDaysLeft === 'number' ? l._pausedDaysLeft : undefined,
        replacesAdId: typeof l._replacesAdId === 'string' ? l._replacesAdId : undefined,
        replacesTitle: typeof l._replacesTitle === 'string' ? l._replacesTitle : undefined,
        supersededBy: typeof l._supersededBy === 'string' ? l._supersededBy : undefined,
        standalone: l._standalone === true,
    };
}

/** סדר התצוגה בטור: קודם מי שקיבל מספר מקום, אחריו לפי סדר הכניסה
 *  (ותיק→חדש) — בדיוק הסדר שהאתר מציג היום, ולכן ההקצאה הראשונה של
 *  מספרים מקפיאה אותו כמו שהוא. */
function byDisplayOrder(a: SubmittedAd, b: SubmittedAd): number {
    const ao = a.slotOrder ?? Number.MAX_SAFE_INTEGER;
    const bo = b.slotOrder ?? Number.MAX_SAFE_INTEGER;
    if (ao !== bo) return ao - bo;
    return Date.parse(a.submittedAt || '') - Date.parse(b.submittedAt || '');
}

// ---------- שליפות בסיס ----------

/** כל הרשומות של האתר הזה (הסינון לפי _site בקוד — אין עמודה ייעודית).
 *  הרשומות כבדות (תמונות data-URI), ולכן ממשיכים לעמוד הבא רק כשצריך. */
async function fetchAllRows(): Promise<StrapiAd[]> {
    const out: StrapiAd[] = [];
    let page = 1;
    for (;;) {
        const res = await strapiGet<{ data: StrapiAd[]; meta?: { pagination?: { pageCount?: number } } }>(ENDPOINT, {
            sort: 'submitted_at:desc',
            'pagination[pageSize]': '100',
            'pagination[page]': String(page),
        });
        const items = Array.isArray(res.data) ? res.data : [];
        out.push(...items.filter(belongsToThisSite));
        const pageCount = res.meta?.pagination?.pageCount ?? 1;
        if (page >= pageCount) return out;
        page++;
    }
}

/** רשומה בודדת לפי documentId — null גם כשהיא של אתר אחר באוסף המשותף. */
async function findRow(id: string): Promise<StrapiAd | null> {
    try {
        const res = await strapiGet<{ data: StrapiAd }>(`${ENDPOINT}/${encodeURIComponent(id)}`);
        const row = res.data ?? null;
        return row && belongsToThisSite(row) ? row : null;
    } catch {
        return null;
    }
}

// ---------- קאש קצר לרשימת המאושרות ----------
// נקראת בכל טעינת ה-endpoint הציבורי — אין צורך להציף את Strapi.
// קצר בכוונה: invalidateAdsCache מנקה רק את המופע (lambda) שביצע את האישור,
// ולכן זה גם הזמן המרבי שמופע אחר ימשיך להחזיר רשימה ישנה אחרי אישור מודעה.
const TTL_MS = 15_000;
// מונה הממתינות (ההתראה לאדמינים) לא חייב להיות טרי לשנייה — נשאר על דקה.
const PENDING_TTL_MS = 60_000;
let approvedCache: { at: number; list: ApprovedAdPublic[] } | null = null;
let pendingCache: { at: number; list: PendingAdBrief[] } | null = null;

export function invalidateAdsCache(): void {
    approvedCache = null;
    pendingCache = null;
}

/** מודעה שממתינה לאישור — תמצית להתראת האדמינים (בלי תמונות). */
export interface PendingAdBrief {
    id: string;
    title: string;
    submittedAt: string;
}

/**
 * המודעות שממתינות לאישור — הבסיס להתראה שרצה אצל אדמין.
 * שאילתה רזה בכוונה: fields מצמצם את העמודות ומשאיר את התמונות
 * (logo/main_image) בחוץ. landing נדרש לסינון _site ולכן נכלל —
 * ברשומות ממתינות בודדות זה זול בהרבה ממשיכת הכל.
 */
export async function listPendingAds(): Promise<PendingAdBrief[]> {
    if (pendingCache && Date.now() - pendingCache.at < PENDING_TTL_MS) return pendingCache.list;
    try {
        const res = await strapiGet<{ data: StrapiAd[] }>(ENDPOINT, {
            'filters[ad_status][$eq]': 'pending',
            'fields[0]': 'title',
            'fields[1]': 'ad_status',
            'fields[2]': 'submitted_at',
            'fields[3]': 'landing',
            sort: 'submitted_at:desc',
            'pagination[pageSize]': '100',
        });
        const list = (res.data ?? [])
            .filter(belongsToThisSite)
            .map((row) => ({
                id: row.documentId,
                title: row.title || 'פרסומת ללא כותרת',
                submittedAt: row.submitted_at ?? '',
            }));
        pendingCache = { at: Date.now(), list };
        return list;
    } catch (err) {
        // כשל זמני — לא מפילים את הדף שההתראה יושבת עליו
        if (!(err instanceof StrapiContentTypeError)) {
            console.warn('adsStore: listPendingAds failed', err instanceof Error ? err.message : err);
        }
        pendingCache = { at: Date.now(), list: [] };
        return [];
    }
}

/** מודעה ממתינה עם התוכן עצמו — התראת האדמינים מציגה את הפרסומת, לא רק שם. */
export interface PendingAdPreview extends PendingAdBrief {
    subtitle: string;
    cta: string;
    hoverText: string;
    gradient: string;
    mainImage: string;
    submittedBy: { email: string; name: string };
}

/**
 * הממתינות במלואן (כולל תמונה) — לבאנר שהאדמין רואה בלי לנדוד למסך אחר.
 * שתי פעימות בכוונה: הרשימה הרזה (עם הקאש) נותנת את המזהים, ורק עבורם
 * נמשכות הרשומות המלאות — התמונות הכבדות נטענות רק כשבאמת יש מה לאשר.
 */
export async function listPendingAdsPreview(): Promise<PendingAdPreview[]> {
    const brief = await listPendingAds();
    if (brief.length === 0) return [];
    const full = await Promise.all(brief.map((b) => getAd(b.id)));
    return brief.map((b, i) => {
        const a = full[i];
        return {
            ...b,
            subtitle: a?.subtitle ?? '',
            cta: a?.cta ?? '',
            hoverText: a?.hoverText ?? '',
            gradient: a?.gradient ?? '',
            mainImage: a?.mainImage ?? '',
            submittedBy: { email: a?.submittedBy.email ?? '', name: a?.submittedBy.name ?? '' },
        };
    });
}

// ============================================================
// מפרסם חוזר: זיהוי גרסה מעודכנת של מודעה קיימת
// ------------------------------------------------------------
// בבילדר אין "עריכה" של רשומה קיימת — מפרסם ששב לשפר את המודעה שלו
// שולח רשומה חדשה לגמרי. בלי הקישור שכאן ההתראה למנהל נוסחה כבקשה
// חדשה, ואישור שלה הוסיף מודעה שנייה לאותו מפרסם במקום להחליף.
// ============================================================

/** טלפון ישראלי מנורמל להשוואה: ספרות בלבד, 972 → 0 */
function normPhone(raw: string | undefined | null): string {
    const digits = (raw ?? '').replace(/\D/g, '').replace(/^972/, '0');
    return digits.length >= 9 ? digits : '';
}

type AdvertiserIdentity = {
    submittedBy?: { id?: string; email?: string; name?: string };
    landing?: { email?: string; phone?: string };
};

/** מפתחות הזהות של מפרסם — מזהה משתמש, אימייל ופרטי הקשר שבדף הנחיתה */
function identityKeys(ad: AdvertiserIdentity): string[] {
    const keys: string[] = [];
    if (ad.submittedBy?.id) keys.push(`id:${ad.submittedBy.id}`);
    const email = (ad.submittedBy?.email || ad.landing?.email || '').trim().toLowerCase();
    if (email) keys.push(`email:${email}`);
    const phone = normPhone(ad.landing?.phone);
    if (phone) keys.push(`phone:${phone}`);
    return keys;
}

function sameAdvertiser(a: AdvertiserIdentity, b: AdvertiserIdentity): boolean {
    const keysB = new Set(identityKeys(b));
    return identityKeys(a).some((k) => keysB.has(k));
}

const byNewest = (a: SubmittedAd, b: SubmittedAd) =>
    Date.parse(b.submittedAt || '') - Date.parse(a.submittedAt || '');

/**
 * מה כבר יש למפרסם הזה: target = המודעה שהשליחה החדשה היא גרסה מעודכנת
 * שלה (מאושרת → ממתינה → נדחתה), stalePending = כל בקשותיו הממתינות,
 * שהשליחה החדשה מייתרת. כשל כאן לא מפיל שליחה — מפרסם שלא זוהה מתנהג
 * פשוט כמפרסם חדש.
 */
async function findPredecessors(
    identity: AdvertiserIdentity,
): Promise<{ target: SubmittedAd | null; stalePending: SubmittedAd[] }> {
    let all: SubmittedAd[];
    try {
        all = await listAllForAdmin();
    } catch (err) {
        console.warn('adsStore: findPredecessors failed', err instanceof Error ? err.message : err);
        return { target: null, stalePending: [] };
    }
    const mine = all.filter((a) => !a.supersededBy && sameAdvertiser(a, identity));
    const live = mine.filter((a) => a.status === 'approved').sort(byNewest);
    const stalePending = mine.filter((a) => a.status === 'pending').sort(byNewest);
    const past = mine.filter((a) => a.status === 'rejected').sort(byNewest);
    return { target: live[0] ?? stalePending[0] ?? past[0] ?? null, stalePending };
}

/**
 * עוקב אחרי שרשרת ההחלפות (_supersededBy) עד הגלגול העדכני ביותר של
 * המודעה. נחוץ כשהקישור נוצר בשליחה ובינתיים אושרה גרסה נוספת:
 * האישור צריך לפגוש את מה שחי על האתר בפועל.
 */
async function resolveLatestVersion(id: string): Promise<SubmittedAd | null> {
    let cur = await getAd(id).catch(() => null);
    for (let hops = 0; cur?.supersededBy && hops < 6; hops++) {
        const next = await getAd(cur.supersededBy).catch(() => null);
        if (!next) break;
        cur = next;
    }
    return cur;
}

/** עדכון landing תוך שמירה על המפתחות הקיימים (המקבילה ל-mergeExtra
 *  בגרסת ה-items: כאן העמודות שטוחות, ורק המפתחות הפנימיים חיים ב-landing). */
async function mergeAd(
    id: string,
    columns: Record<string, unknown>,
    landingPatch?: Record<string, unknown>,
): Promise<void> {
    const row = await findRow(id);
    if (!row) throw new Error('ad not found (or not of this site)');
    const data: Record<string, unknown> = { ...columns };
    if (landingPatch) {
        data.landing = { ...(row.landing ?? {}), ...landingPatch };
    }
    await strapiPut(`${ENDPOINT}/${encodeURIComponent(id)}`, { data });
}

/**
 * מוציא גרסה ישנה מהמחזור אחרי שגרסה מעודכנת נכנסה במקומה. הסטטוס
 * 'rejected' הוא הארכיון היחיד שיש — המודעה יורדת מהאתר ומהתור אבל
 * נשארת במסך הניהול עם הסיבה, ואפשר להחזיר אותה. שום דבר לא נמחק.
 */
async function supersedeAd(oldId: string, newAdId: string, decidedBy: string, reason: string): Promise<void> {
    await mergeAd(oldId, {
        ad_status: 'rejected',
        decided_at: new Date().toISOString(),
        decided_by: decidedBy,
        rejection_reason: reason,
    }, { _supersededBy: newAdId });
    invalidateAdsCache();
}

/** שליחת מודעה חדשה מהבילדר (status: pending). */
export async function submitAd(payload: {
    title: string;
    subtitle?: string;
    hoverText?: string;
    cta?: string;
    gradient?: string;
    logo?: string;
    mainImage?: string;
    mainImageFit?: unknown;
    adStyle?: unknown;
    landing?: Partial<AdLanding>;
    submittedBy?: { id: string; email: string; name: string };
    payment?: string;
    requestedDurationDays?: number;
    /** מודעה *נוספת* שנקנתה בכוונה - לא מתקשרת לקודמת ולא מורידה אותה באישור */
    standalone?: boolean;
}): Promise<{
    id: string;
    status: AdStatus;
    replacesAdId: string;
    replacesTitle: string;
    replacesStatus: AdStatus | '';
    retiredPendingIds: string[];
}> {
    // מפרסם חוזר: מחפשים לפני היצירה, כדי שהרשומה החדשה עצמה לא תיספר.
    // מודעה נוספת שנקנתה בכוונה (הגעה מדף המחירים) לא מחפשת קודמת בכלל -
    // היא לא באה במקום שום דבר, וזיהוי לפי זהות היה הורג את המודעה
    // שהמפרסם כבר משלם עליה.
    const { target: predecessor, stalePending } = payload.standalone
        ? { target: null, stalePending: [] as SubmittedAd[] }
        : await findPredecessors({
            submittedBy: payload.submittedBy,
            landing: payload.landing as { email?: string; phone?: string } | undefined,
        });

    const logo = payload.logo ?? '';
    const mainImage = payload.mainImage ?? '';
    const baseLanding = (payload.landing ?? emptyLanding()) as Record<string, any>;
    const landing: Record<string, unknown> = {
        ...baseLanding,
        // שיוך קשיח לאתר — בלעדיו הפרסומת תיבלע באוסף המשותף
        _site: SITE_ID,
        // הגשה לעולם לא נכנסת כ"שולם". קוד הבעלים הוא *בקשה* לפרסום
        // חינם, והזכות עצמה ניתנת רק באישור הידני של האדמין.
        _payment: 'pending',
        _codeRequested: payload.payment === 'code',
        _requestedDurationDays: normalizePlanDays(payload.requestedDurationDays),
        _mainImageFit: parseAdImageFit(payload.mainImageFit),
        // העיצוב שהמפרסם קבע בבילדר — בלעדיו המודעה מתפרסמת עם
        // ברירות המחדל של האתר ולא עם מה שהוא ראה על המסך
        _adStyle: parseAdStyle(payload.adStyle),
        // חותם התמונות — הכתובות שמגישות אותן נגזרות ממנו (?v=)
        _imgV: stampOf(logo, mainImage, baseLanding),
        // נשמר עם המודעה: גם באישור, שבא אחר-כך, אסור להוריד את הקיימת
        ...(payload.standalone ? { _standalone: true } : {}),
        ...(predecessor
            ? { _replacesAdId: predecessor.id, _replacesTitle: predecessor.title }
            : {}),
    };

    const res = await strapiPost<{ data: StrapiAd }>(ENDPOINT, {
        data: {
            ad_status: 'pending',
            title: payload.title,
            subtitle: payload.subtitle ?? '',
            hover_text: payload.hoverText ?? '',
            cta: payload.cta ?? '',
            gradient: payload.gradient ?? '',
            logo,
            main_image: mainImage,
            landing,
            submitted_by_id: payload.submittedBy?.id ?? null,
            submitted_by_email: payload.submittedBy?.email ?? null,
            submitted_by_name: payload.submittedBy?.name ?? null,
            submitted_at: new Date().toISOString(),
        },
    });
    invalidateAdsCache();
    const id = res.data?.documentId ?? '';

    // בקשות ממתינות קודמות של אותו מפרסם יורדות מהתור: המנהל אמור לראות
    // בקשה אחת לכל מפרסם — האחרונה — ולא שתי בקשות שנראות כפולות.
    // מודעה מאושרת נשארת באוויר עד שהחדשה תאושר, אחרת האתר נשאר בלי מודעה.
    const retiredPendingIds: string[] = [];
    for (const stale of stalePending) {
        try {
            await supersedeAd(stale.id, id, 'system', 'הוחלפה בגרסה מעודכנת שהמפרסם שלח');
            retiredPendingIds.push(stale.id);
        } catch (err) {
            console.warn('adsStore: retire pending predecessor failed', err instanceof Error ? err.message : err);
        }
    }

    return {
        id,
        status: 'pending',
        replacesAdId:   predecessor?.id ?? '',
        replacesTitle:  predecessor?.title ?? '',
        replacesStatus: predecessor?.status ?? '',
        retiredPendingIds,
    };
}

// ============================================================
// הגשת תמונות הפרסומת ככתובת, לא כ-base64 בתוך הנתונים
// ------------------------------------------------------------
// התמונות שמורות ב-Strapi כ-data:image/...;base64 בתוך הרשומה. אילו עברו
// כמות שהן, כל גולש היה מוריד אותן מחדש בכל צפייה (נמדד בגמ"ח: 2.2MB
// ל-/api/ads/approved). במקום זה מוחזרת כתובת ל-/api/ad-image/<id>/<kind>,
// והתמונה נשלפת פעם אחת ונשמרת בקאש של הדפדפן ושל הקצה.
// ============================================================

/**
 * logo/main הן תמונות הכרטיס בלוח. landing ו-product-<n> הן של דף הנחיתה
 * (/ads/<id>) - הדף שאליו מגיעה כל לחיצה על פרסומת.
 */
export type AdImageKind = 'logo' | 'main' | 'landing' | `product-${number}`;

export function isAdImageKind(v: string | undefined): v is AdImageKind {
    if (!v) return false;
    return v === 'logo' || v === 'main' || v === 'landing' || /^product-\d+$/.test(v);
}

function pickImage(ad: SubmittedAd, kind: AdImageKind): string {
    if (kind === 'logo') return ad.logo;
    if (kind === 'main') return ad.mainImage;
    if (kind === 'landing') return ad.landing?.image ?? '';
    const idx = Number(kind.slice('product-'.length));
    return ad.landing?.products?.[idx]?.image ?? '';
}

/**
 * הכתובת שבה הצרכן ימשוך את התמונה. ריק נשאר ריק (הצרכן בודק אמת/שקר),
 * וערך שאינו data: - למשל כתובת חיצונית במודעה ותיקה - עובר כמות שהוא.
 */
export function adImageUrl(ad: SubmittedAd, kind: AdImageKind): string {
    const raw = pickImage(ad, kind);
    if (!raw) return '';
    if (!raw.startsWith('data:')) return raw;
    return `/api/ad-image/${ad.id}/${kind}?v=${ad.imgVersion}`;
}

/**
 * אותה רשומה, כשכל שדות התמונה שבה הוחלפו בכתובות - לדף הנחיתה /ads/<id>,
 * שמחזיר את הפרסומת המלאה ולכן היה סוחב את כל התמונות המוטבעות.
 */
export function withAdImageUrls(ad: SubmittedAd): SubmittedAd {
    if (ad.status !== 'approved') return ad;
    const products = Array.isArray(ad.landing?.products)
        ? ad.landing.products.map((p, i) => ({
            ...p,
            image: p?.image ? adImageUrl(ad, `product-${i}`) : '',
        }))
        : [];
    return {
        ...ad,
        logo: adImageUrl(ad, 'logo'),
        mainImage: adImageUrl(ad, 'main'),
        landing: { ...ad.landing, image: adImageUrl(ad, 'landing'), products },
    };
}

/**
 * הבייטים עצמם, לנתיב שמגיש אותם. מאושרות בלבד - תמונות של פרסומת
 * ממתינה/נדחית לא נחשפות דרך ניחוש מזהה.
 *
 * getAd ולא הרשימה שב-cache: listApproved מסננת החוצה מושהות ופגות-תוקף,
 * אבל דף הנחיתה של פרסומת מושהית עדיין נטען - ובלי זה כל התמונות שלו
 * היו מחזירות 404. רץ רק כשהתמונה לא בקאש של הקצה.
 */
export async function getApprovedAdImage(
    id: string,
    kind: AdImageKind,
): Promise<{ mime: string; bytes: ArrayBuffer } | null> {
    const ad = await getAd(id);
    if (!ad || ad.status !== 'approved') return null;
    return decodeDataImage(pickImage(ad, kind));
}

/** רשימת המודעות המאושרות — גרסה רזה לתצוגה, עם אכיפת תוקף בזמן קריאה. */
export async function listApproved(): Promise<ApprovedAdPublic[]> {
    if (approvedCache && Date.now() - approvedCache.at < TTL_MS) {
        return approvedCache.list;
    }
    try {
        const res = await strapiGet<{ data: StrapiAd[] }>(ENDPOINT, {
            'filters[ad_status][$eq]': 'approved',
            // מהוותיק לחדש: סדר הרשימה הוא סדר המשבצות בטור, ולכן מפרסם
            // חדש נכנס למשבצת הפנויה הבאה ולא דוחף את מי שכבר באוויר מטה.
            sort: 'submitted_at:asc',
            'pagination[pageSize]': '50',
        });
        const now = Date.now();
        const approvedAll = (res.data ?? [])
            .filter(belongsToThisSite)
            .map(fromStrapi)
            .filter((a): a is SubmittedAd => Boolean(a));
        // מספרי המקומות מחושבים על *כל* המאושרות — גם מושהית/פגה שומרת את
        // מקומה (המשבצת שלה מוצגת כפנויה עד שתחזור). חישוב בזיכרון בלבד:
        // נתיב קריאה לא כותב ל-Strapi.
        const slots = computeSlots(approvedAll);
        const list = approvedAll
            // מודעה שפג תוקפה יורדת מהאתר אוטומטית (הרשומה נשארת לארכיון)
            .filter((a) => !a.expiresAt || Date.parse(a.expiresAt) > now)
            // מודעה מושהית יורדת מהאתר ושומרת את הימים שנותרו לה
            .filter((a) => !a.paused)
            // סדר הלוח = סדר המספרים שנקבעו במסך הניהול
            .sort((a, b) => (slots.get(a.id) ?? 0) - (slots.get(b.id) ?? 0))
            .map((a) => ({
                id: a.id,
                title: a.title,
                subtitle: a.subtitle,
                cta: a.cta,
                hover: a.hoverText,
                gradient: a.gradient,
                // הלוגו והעיצוב עוברים לתצוגה הציבורית — ככתובת ולא כ-base64:
                // הרשימה הזו נמשכת בצד-הלקוח בכל טעינת אתר. ראה adImageUrl.
                logo: adImageUrl(a, 'logo'),
                mainImage: adImageUrl(a, 'main'),
                mainImageFit: a.mainImageFit,
                adStyle: a.adStyle,
                // המספר בלוח (1-based) — הלקוח מציב לפיו את המודעה בדיוק
                // במקום שנקבע לה, והחורים ביניהם נשארים משבצות פנויות
                slot: (slots.get(a.id) ?? 0) + 1,
            }));
        approvedCache = { at: Date.now(), list };
        return list;
    } catch (err) {
        // כשל זמני — קאש שלילי קצר, האתר ממשיך עם משבצות "מקום פרסום"
        if (!(err instanceof StrapiContentTypeError)) {
            console.warn('adsStore: listApproved failed', err instanceof Error ? err.message : err);
        }
        approvedCache = { at: Date.now(), list: [] };
        return [];
    }
}

/** מודעה בודדת לפי documentId — לדף הנחיתה /ads/[id]. */
export async function getAd(id: string): Promise<SubmittedAd | null> {
    const row = await findRow(id);
    return fromStrapi(row);
}

/** מיפוי אחיד של שדות דף הנחיתה מגוף בקשה — משותף לשליחה חדשה
 *  (/api/ads/submit) ולעריכה בידי הבעלים (PUT /api/ads/[id]). */
export function normalizeLanding(raw: unknown): Partial<AdLanding> {
    const l = (raw ?? {}) as Record<string, any>;
    return {
        headline: l.headline ?? '',
        pitch: l.pitch ?? '',
        extended: l.extended ?? '',
        image: l.image ?? '',
        advantages: [l.advantages?.[0] ?? '', l.advantages?.[1] ?? '', l.advantages?.[2] ?? ''],
        uniqueness: l.uniqueness ?? '',
        phone: l.phone ?? '',
        whatsapp: l.whatsapp ?? '',
        website: l.website ?? '',
        email: l.email ?? '',
        address: l.address ?? '',
        hours: l.hours ?? '',
        products: Array.isArray(l.products) ? l.products : [],
    };
}

/** האם המודעה נשלחה בידי המשתמש הזה. משווים מול קבוצת המזהים שלו
 *  (ownerCandidateKeys) — כי submitted_by נשמר עם id ומייל, ובאתרים
 *  התאומים המזהה המספרי לא בהכרח זהה. */
export function isAdOwner(keys: Set<string>, ad: SubmittedAd): boolean {
    const id = (ad.submittedBy.id ?? '').trim();
    const email = (ad.submittedBy.email ?? '').trim().toLowerCase();
    if (id && keys.has(id)) return true;
    if (email && keys.has(email)) return true;
    // מודעות שנשלחו בלי בעלים רשום: האימייל שבפרטי הקשר של דף הנחיתה
    // הוא הזיהוי היחיד שקיים. חל רק כשאין submitted_by — מודעה עם בעלים
    // רשום לא נלקחת מידיו.
    if (id || email) return false;
    const contact = (ad.landing?.email ?? '').trim().toLowerCase();
    return Boolean(contact && keys.has(contact));
}

/** המודעות של המפרסם עצמו — לדשבורד הנכס (/about/advertise/manage). */
export async function listForOwner(keys: Set<string>): Promise<SubmittedAd[]> {
    if (keys.size === 0) return [];
    const rows = await fetchAllRows();
    return rows
        .map(fromStrapi)
        .filter((a): a is SubmittedAd => Boolean(a))
        .filter((a) => isAdOwner(keys, a));
}

/** עריכה מחדש בידי המפרסם — תוכן בלבד. סטטוס, תוקף, תשלום ותקופה
 *  לא נוגעים כאן: מודעה מאושרת נשארת באוויר, ורק _editedAt מתעדכן
 *  כדי שמסך האישור (/admin/ads) יראה שהיא נערכה אחרי האישור. */
export async function updateAdContent(
    id: string,
    patch: {
        title: string;
        subtitle?: string;
        hoverText?: string;
        cta?: string;
        gradient?: string;
        logo?: string;
        mainImage?: string;
        mainImageFit?: unknown;
        adStyle?: unknown;
        landing?: Partial<AdLanding>;
    },
): Promise<void> {
    const row = await findRow(id);
    if (!row) throw new Error('not an ad of this site');
    const existingLanding = (row.landing ?? {}) as Record<string, any>;
    const logo = patch.logo ?? '';
    const mainImage = patch.mainImage ?? row.main_image ?? '';
    const mergedLanding: Record<string, unknown> = {
        ...existingLanding,
        ...(patch.landing ?? {}),
        _mainImageFit: patch.mainImageFit !== undefined
            ? parseAdImageFit(patch.mainImageFit)
            : (existingLanding._mainImageFit ?? parseAdImageFit(undefined)),
        // עריכה מהדשבורד שומרת גם את העיצוב; בלי זה עריכת טקסט
        // הייתה מאפסת את הלוגו והרצועה שהמפרסם כיוון
        _adStyle: patch.adStyle !== undefined
            ? parseAdStyle(patch.adStyle)
            : (existingLanding._adStyle ?? null),
        _editedAt: new Date().toISOString(),
    };
    // חותם תמונות טרי — מחושב על ה-landing הממוזג, אחרי החלפת התמונות
    mergedLanding._imgV = stampOf(logo, mainImage, mergedLanding as Record<string, any>);
    await strapiPut(`${ENDPOINT}/${encodeURIComponent(id)}`, {
        data: {
            title: patch.title,
            subtitle: patch.subtitle ?? '',
            hover_text: patch.hoverText ?? '',
            cta: patch.cta ?? '',
            gradient: patch.gradient ?? row.gradient ?? '',
            logo,
            main_image: mainImage,
            landing: mergedLanding,
        },
    });
    invalidateAdsCache();
}

/** כל המודעות למסך האדמין (ממתינות + מאושרות + נדחות). */
export async function listAllForAdmin(): Promise<SubmittedAd[]> {
    const rows = await fetchAllRows();
    return rows.map(fromStrapi).filter((a): a is SubmittedAd => Boolean(a));
}

/** אישור מודעה — קובע תוקף (ברירת מחדל 30 יום). התשלום ידני, ולכן
 *  מי שקיבל את הכסף (המנהל) הוא שקובע את המסלול בפועל.
 *
 *  גרסה מעודכנת של מפרסם קיים נכנסת *במקום* הישנה: אותה משבצת בטור
 *  ואותו תאריך סיום, ומיד אחרי האישור הישנה יורדת מהאתר. keepPrevious
 *  הוא המקרה ההפוך — מפרסם שבאמת רוצה שתי מודעות במקביל.
 *  מחזיר את כותרת המודעה שהוחלפה, כדי שהמנהל יראה מה ירד. */
export async function approveAd(
    id: string,
    {
        durationDays = DEFAULT_DURATION_DAYS,
        decidedBy = '',
        keepPrevious = false,
    }: { durationDays?: number; decidedBy?: string; keepPrevious?: boolean } = {},
): Promise<{ replacedTitle: string }> {
    const current = await getAd(id);
    // מודעה נוספת שנקנתה בכוונה מתנהגת בדיוק כמו keepPrevious: היא לא
    // באה במקום כלום, והמפרסם משלם על שתי המשבצות.
    const keep = keepPrevious || current?.standalone === true;

    // גרסה מעודכנת נכנסת *במקום* המודעה שאליה היא מקושרת - ורק במקומה.
    // הקישור נקבע בשליחה, וכאן עוקבים אחרי שרשרת ההחלפות למקרה שבינתיים
    // אושרה גרסה נוספת. שאר המודעות החיות של אותו מפרסם לא נוגעות.
    const linked = current?.replacesAdId && !keep
        ? await resolveLatestVersion(current.replacesAdId)
        : null;
    const replacing = linked && linked.id !== id && linked.status === 'approved' && !linked.supersededBy
        ? linked
        : null;
    const replacingAll = replacing ? [replacing] : [];

    const days = normalizePlanDays(durationDays);
    // התקופה שהמפרסם כבר שילם עליה ממשיכה כרגיל: אותו תאריך פקיעה, לא
    // ספירה חדשה. מבין כמה גרסאות שיורדות - הרחוקה ביותר.
    const inheritedExpiry = replacingAll
        .filter((a) => !a.paused && a.expiresAt && Date.parse(a.expiresAt) > Date.now())
        .map((a) => a.expiresAt)
        .sort()
        .pop() ?? '';
    const expires = inheritedExpiry || new Date(Date.now() + days * DAY_MS).toISOString();

    // ----- מספר המקום בלוח (1..16) -----
    // ברירת המחדל: מודעה חדשה תופסת את המספר הפנוי הנמוך ביותר ואף אחת
    // לא זזה ממקומה. גרסה מחליפה יורשת את המספר של הישנה; מודעה שהורדה
    // ואושרה מחדש חוזרת למקומה הקודם אם הוא עדיין פנוי.
    let slot: number | undefined;
    try {
        const approvedNow = (await listApprovedAll()).filter((a) => a.id !== id);
        const slots = await ensureSlotsPersisted(approvedNow);
        const taken = new Set(slots.values());
        const inherited = replacing ? slots.get(replacing.id) : undefined;
        if (inherited !== undefined) {
            slot = inherited;
        } else if (typeof current?.slotOrder === 'number' && current.slotOrder >= 0 && !taken.has(current.slotOrder)) {
            slot = current.slotOrder;
        } else {
            slot = 0;
            while (taken.has(slot)) slot++;
        }
    } catch (err) {
        // כשל בהקצאה לא מפיל אישור — המודעה תקבל מספר בפעולת הניהול הבאה
        console.warn('adsStore: slot assignment failed', err instanceof Error ? err.message : err);
        slot = typeof current?.slotOrder === 'number' && current.slotOrder >= 0 ? current.slotOrder : undefined;
    }

    await mergeAd(id, {
        ad_status: 'approved',
        decided_at: new Date().toISOString(),
        decided_by: decidedBy,
        rejection_reason: '',
        duration_days: inheritedExpiry ? (replacing?.durationDays ?? days) : days,
        expires_at: expires,
    }, {
        ...(slot !== undefined ? { _order: slot } : {}),
        // מודעה שמאושרת עכשיו היא בהגדרה לא "גרסה ישנה שהוחלפה". דגל
        // _supersededBy שנשאר מגלגול קודם גרם למודעה חיה להיראות מוחלפת:
        // גרסה מעודכנת של המפרסם לא זיהתה אותה ולא הורידה אותה באישור.
        _supersededBy: null,
    });
    invalidateAdsCache();

    // סדר הפעולות מכוון: קודם החדשה עולה, רק אחר-כך הישנה יורדת. כשל כאן
    // משאיר את שתיהן באוויר (מצב שהמנהל רואה ומתקן) — עדיף מלהוריד את
    // הישנה ואז להיכשל בהעלאת החדשה ולהשאיר את המפרסם בלי מודעה.
    const retiredTitles: string[] = [];
    for (const old of replacingAll) {
        try {
            await supersedeAd(old.id, id, decidedBy, 'הוחלפה בגרסה מעודכנת שאישרת');
            retiredTitles.push(old.title);
        } catch (err) {
            console.warn('adsStore: supersede on approve failed', err instanceof Error ? err.message : err);
        }
    }
    return { replacedTitle: retiredTitles.join('", "') };
}

/** דחיית מודעה (עם סיבה אופציונלית). */
export async function rejectAd(
    id: string,
    { reason = '', decidedBy = '' }: { reason?: string; decidedBy?: string } = {},
): Promise<void> {
    await mergeAd(id, {
        ad_status: 'rejected',
        decided_at: new Date().toISOString(),
        decided_by: decidedBy,
        rejection_reason: reason,
    });
    invalidateAdsCache();
}

/** הורדת מודעה מאושרת מהאתר — חוזרת ל"ממתינה", בלי למחוק אותה.
 *  התוקף מתאפס כדי שהמשבצת תתפנה מיד ולא תיתפס ע"י מודעה שכבר לא באוויר. */
export async function unapproveAd(id: string, decidedBy = ''): Promise<void> {
    await mergeAd(id, {
        ad_status: 'pending',
        decided_at: null,
        decided_by: decidedBy,
        expires_at: null,
        rejection_reason: '',
    });
    invalidateAdsCache();
}

/** מחיקה לצמיתות (ניקוי מודעות ישנות במסך האדמין). מוגן שיוך-אתר:
 *  לא מוחקים בטעות רשומה של אתר אחר באוסף המשותף. */
export async function removeAd(id: string): Promise<void> {
    const row = await findRow(id);
    if (!row) return;
    await strapiDelete(`${ENDPOINT}/${encodeURIComponent(id)}`);
    invalidateAdsCache();
}

// ---------- ניהול תקופת הפרסום: קציבה, השהיה, המשך ----------

const MIN_DURATION_DAYS = 1;
const MAX_DURATION_DAYS = 730;

/** מנרמל קלט ימים מהטופס לטווח שפוי (הקציבה הידנית אינה כבולה למסלולים) */
export function normalizeDurationDays(raw: unknown): number {
    const n = Math.round(Number(raw));
    if (!Number.isFinite(n)) return DEFAULT_DURATION_DAYS;
    return Math.min(MAX_DURATION_DAYS, Math.max(MIN_DURATION_DAYS, n));
}

/**
 * קוצב למודעה תקופה חדשה. התקופה נספרת מיום האישור, ולכן קציבה קצרה
 * מהזמן שכבר רץ מורידה את המודעה מהאתר מיד — וזו המשמעות של "לקצוב".
 */
export async function setAdDuration(
    id: string,
    days: number,
): Promise<{ title: string; expiresAt: string; daysLeft: number } | null> {
    const ad = await getAd(id);
    if (!ad) return null;
    const from = ad.decidedAt || ad.submittedAt || new Date().toISOString();
    const expires = new Date(new Date(from).getTime() + days * DAY_MS);
    await mergeAd(id, { duration_days: days, expires_at: expires.toISOString() });
    invalidateAdsCache();
    return {
        title: ad.title,
        expiresAt: expires.toISOString(),
        daysLeft: Math.ceil((expires.getTime() - Date.now()) / DAY_MS),
    };
}

/**
 * קובע תאריך תפוגה שרירותי (מחלון הקציבה). המשך (duration_days) נגזר
 * ממנו ביחס ליום האישור, כדי שהתצוגה תמשיך להציג "X מתוך Y" עקבי.
 */
export async function setAdExpiry(
    id: string,
    expiresIso: string,
): Promise<{ title: string; expiresAt: string; daysLeft: number } | null> {
    const ad = await getAd(id);
    if (!ad) return null;
    const expires = new Date(expiresIso);
    if (isNaN(expires.getTime())) return null;
    const from = ad.decidedAt || ad.submittedAt || new Date().toISOString();
    const days = Math.max(0, Math.ceil((expires.getTime() - Date.parse(from)) / DAY_MS));
    await mergeAd(id, { duration_days: days, expires_at: expires.toISOString() });
    invalidateAdsCache();
    return {
        title: ad.title,
        expiresAt: expires.toISOString(),
        daysLeft: Math.ceil((expires.getTime() - Date.now()) / DAY_MS),
    };
}

/**
 * השהיה: המודעה יורדת מהאתר אבל שומרת את הימים שנותרו לה. בשונה
 * מ"הורד מהאתר" — המפרסם לא מפסיד ימים ששילם עליהם.
 */
export async function pauseAd(id: string): Promise<{ title: string; daysLeft: number } | null> {
    const ad = await getAd(id);
    if (!ad) return null;
    if (ad.paused) return { title: ad.title, daysLeft: ad.pausedDaysLeft ?? 0 };
    const daysLeft = ad.expiresAt
        ? Math.max(0, Math.ceil((Date.parse(ad.expiresAt) - Date.now()) / DAY_MS))
        : (ad.durationDays || DEFAULT_DURATION_DAYS);
    await mergeAd(id, {}, { _paused: true, _pausedDaysLeft: daysLeft });
    invalidateAdsCache();
    return { title: ad.title, daysLeft };
}

/** המשך אחרי השהיה: הימים שנשמרו נספרים מחדש מהיום. */
export async function resumeAd(
    id: string,
): Promise<{ title: string; expiresAt: string; daysLeft: number } | null> {
    const ad = await getAd(id);
    if (!ad) return null;
    const daysLeft = ad.pausedDaysLeft ?? ad.durationDays ?? DEFAULT_DURATION_DAYS;
    const expires = new Date(Date.now() + daysLeft * DAY_MS);
    await mergeAd(id, {
        ad_status: 'approved',
        expires_at: expires.toISOString(),
    }, { _paused: null, _pausedDaysLeft: null });
    invalidateAdsCache();
    return { title: ad.title, expiresAt: expires.toISOString(), daysLeft };
}

// ---------- מקומות ממוספרים בלוח הפרסומות (1..16) ----------

export type MoveDirection = 'up' | 'down';

/** כל המאושרות — כולל מושהות ופגות תוקף. הבסיס לחישוב המספרים: מודעה
 *  שומרת את מקומה גם דרך השהיה ופקיעה, ולכן גם מי שלא באוויר תופסת מספר. */
async function listApprovedAll(): Promise<SubmittedAd[]> {
    const all = await listAllForAdmin();
    return all.filter((a) => a.status === 'approved');
}

/** האם המודעה מוצגת לגולש עכשיו (לא פגה ולא מושהית) */
function isLiveNow(a: SubmittedAd, now = Date.now()): boolean {
    if (a.paused) return false;
    return !a.expiresAt || Date.parse(a.expiresAt) > now;
}

/**
 * המספר האפקטיבי של כל מודעה ברשימה (0-based). מי שכבר נקבע לה מספר —
 * שומרת עליו (בהתנגשות, הראשונה בסדר התצוגה גוברת); מי שאין לה מקבלת את
 * המספר הפנוי הנמוך ביותר, לפי סדר התצוגה הנוכחי. כך מודעות ותיקות בלי
 * מספר מקבלות בדיוק את מקומן של היום — ההקצאה הראשונה לא מזיזה כלום.
 */
function computeSlots(list: SubmittedAd[]): Map<string, number> {
    const bySlot = new Map<string, number>();
    const taken = new Set<number>();
    const display = [...list].sort(byDisplayOrder);
    for (const ad of display) {
        if (typeof ad.slotOrder === 'number' && ad.slotOrder >= 0 && !taken.has(ad.slotOrder)) {
            bySlot.set(ad.id, ad.slotOrder);
            taken.add(ad.slotOrder);
        }
    }
    let next = 0;
    for (const ad of display) {
        if (bySlot.has(ad.id)) continue;
        while (taken.has(next)) next++;
        bySlot.set(ad.id, next);
        taken.add(next);
    }
    return bySlot;
}

/** מספרי המקומות לתצוגה (1-based) — למסך הניהול שמציג "משבצת N מתוך 16" */
export function computeAdSlots(list: SubmittedAd[]): Map<string, number> {
    return new Map([...computeSlots(list)].map(([id, s]) => [id, s + 1]));
}

/**
 * מקבע ב-Strapi מספר מקום לכל מודעה ברשימה שעדיין אין לה (או שהמספר
 * השמור מתנגש). כותב רק את מי שהשתנה — בהקצאה הראשונה זו כל הרשימה,
 * ומכאן והלאה כלום. רץ בפעולות ניהול בלבד, לא בנתיבי קריאה.
 */
async function ensureSlotsPersisted(list: SubmittedAd[]): Promise<Map<string, number>> {
    const slots = computeSlots(list);
    const dirty = list.filter((ad) => ad.slotOrder !== slots.get(ad.id));
    if (dirty.length > 0) {
        // סדרתי בכוונה — mergeAd עושה GET+PUT לכל מודעה, והרשומות כבדות
        // (תמונות data-URI); מקבילי היה חונק את koa בבת אחת.
        for (const ad of dirty) {
            await mergeAd(ad.id, {}, { _order: slots.get(ad.id)! });
        }
        invalidateAdsCache();
    }
    return slots;
}

/**
 * מזיזה מודעה מקום אחד למעלה/למטה בלוח: מחליפה מספרים עם השכנה *שבאוויר*
 * בלבד — מושהית/פגה שומרת את המספר שלה ואינה זזה, ושאר המודעות נשארות
 * במקומן (בלי מספור-מחדש דוחס). המיקום נשמר ב-landing._order — אין
 * עמודה ייעודית באוסף, ואותה עמודת json כבר נושאת את המפתחות הפנימיים.
 * מחזירה null אם המודעה לא באוויר או שהיא כבר בקצה הטור.
 */
export async function moveApprovedAd(
    id: string,
    direction: MoveDirection,
): Promise<{ title: string; position: number; total: number } | null> {
    const all = await listApprovedAll();
    const slots = await ensureSlotsPersisted(all);
    const now = Date.now();
    const live = all
        .filter((a) => isLiveNow(a, now))
        .sort((a, b) => (slots.get(a.id) ?? 0) - (slots.get(b.id) ?? 0));
    const from = live.findIndex((a) => a.id === id);
    if (from === -1) return null;
    const to = direction === 'up' ? from - 1 : from + 1;
    if (to < 0 || to >= live.length) return null;

    const moved = live[from];
    const other = live[to];
    const movedSlot = slots.get(moved.id)!;
    const otherSlot = slots.get(other.id)!;
    await mergeAd(moved.id, {}, { _order: otherSlot });
    await mergeAd(other.id, {}, { _order: movedSlot });
    invalidateAdsCache();
    return { title: moved.title, position: otherSlot + 1, total: AD_SLOT_COUNT };
}

/**
 * מציבה מודעה מאושרת במקום מספרי מסוים בלוח (1..16). מקום תפוס — השתיים
 * מתחלפות זו בזו; שאר המודעות לא זזות. המספר נשאר קבוע למודעה גם דרך
 * השהיה ופקיעה — כשהיא חוזרת לאוויר היא חוזרת לאותו מקום.
 */
export async function setAdSlot(
    id: string,
    requested: number,
): Promise<{ title: string; slot: number; swappedTitle?: string; swappedSlot?: number } | null> {
    const n = Math.round(Number(requested));
    if (!Number.isFinite(n)) return null;
    const target = Math.min(AD_SLOT_COUNT, Math.max(1, n)) - 1;

    const list = await listApprovedAll();
    const ad = list.find((a) => a.id === id);
    if (!ad) return null;
    const slots = await ensureSlotsPersisted(list);
    const cur = slots.get(id) ?? 0;
    if (cur === target) return { title: ad.title, slot: target + 1 };

    const occupant = list.find((a) => a.id !== id && slots.get(a.id) === target) ?? null;
    await mergeAd(ad.id, {}, { _order: target });
    if (occupant) await mergeAd(occupant.id, {}, { _order: cur });
    invalidateAdsCache();
    return {
        title: ad.title,
        slot: target + 1,
        ...(occupant ? { swappedTitle: occupant.title, swappedSlot: cur + 1 } : {}),
    };
}
