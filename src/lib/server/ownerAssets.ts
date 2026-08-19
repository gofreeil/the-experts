// ============================================================
// ownerAssets.ts — "הנכסים שלי": הפרסומות של המשתמש המחובר.
// ------------------------------------------------------------
// גרסת המומחים של העם של אותו מודול בגמ"ח הארצי — כאן אין גמ"חים,
// ולכן הנכסים הם הפרסומות בלבד. הזיהוי מול אותה קבוצת מזהים
// (ownerCandidateKeys), והצורה המוחזרת ציבורית בלבד.
// ============================================================

import { listForOwner } from './adsStore';
import { getAdStats, type AdStats } from './adStats';
import { ownerCandidateKeys, type OwnerSessionLike } from './ownership';

export interface OwnerAdView {
    id: string;
    title: string;
    subtitle: string;
    status: string;
    gradient: string;
    mainImage: string;
    mainImageFit: { x: number; y: number; z: number };
    submittedAt: string;
    editedAt: string | null;
    expiresAt: string | null;
    durationDays: number | null;
    requestedDurationDays: number | null;
    rejectionReason: string;
    totals: AdStats['totals'];
}

export interface OwnerAssets {
    /** שליפת הפרסומות נכשלה — הדף מציג הודעה במקום רשימה ריקה מטעה */
    loadFailed: boolean;
    ads: OwnerAdView[];
}

export async function getOwnerAssets(user: OwnerSessionLike): Promise<OwnerAssets> {
    const keys = ownerCandidateKeys(user);

    let ads: Awaited<ReturnType<typeof listForOwner>> = [];
    let loadFailed = false;
    try {
        ads = await listForOwner(keys);
    } catch (e) {
        console.error('[ownerAssets] listForOwner failed:', e);
        loadFailed = true;
    }

    // ברשימה אין צורך בפירוט היומי — רק בסך הכל לכל מודעה
    const stats = await getAdStats(ads.map((a) => a.id), 0)
        .catch((): Record<string, AdStats> => ({}));

    return {
        loadFailed,
        ads: ads.map((a) => ({
            id: a.id,
            title: a.title,
            subtitle: a.subtitle,
            status: a.status,
            gradient: a.gradient,
            mainImage: a.mainImage,
            mainImageFit: a.mainImageFit,
            submittedAt: a.submittedAt,
            editedAt: a.editedAt,
            expiresAt: a.expiresAt,
            durationDays: a.durationDays,
            requestedDurationDays: a.requestedDurationDays,
            rejectionReason: a.rejectionReason,
            totals: stats[a.id]?.totals ?? { impressions: 0, clicks: 0, landing: 0, leads: 0 },
        })),
    };
}
