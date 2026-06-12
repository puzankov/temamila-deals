import "server-only";
import { del } from "@vercel/blob";
import { createDeal, getDealById, getDealBySlug, updateDeal } from "@/lib/deals";
import { DEAL_STATUSES, DEAL_TYPES, type DealStatus, type DealType } from "@/lib/types";
import type { NewDealRow } from "@/db/schema";

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function numOrNull(formData: FormData, key: string): number | null {
  const v = String(formData.get(key) ?? "").trim();
  if (v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function boolFrom(formData: FormData, key: string): boolean {
  return ["on", "true", "1"].includes(String(formData.get(key) ?? ""));
}

export function parseDealForm(formData: FormData): Omit<NewDealRow, "slug"> {
  const dealTypes = formData
    .getAll("dealTypes")
    .map(String)
    .filter((t): t is DealType => (DEAL_TYPES as readonly string[]).includes(t));

  const statusRaw = String(formData.get("status") ?? "available");
  const status: DealStatus = (DEAL_STATUSES as readonly string[]).includes(statusRaw)
    ? (statusRaw as DealStatus)
    : "available";

  const images = String(formData.get("images") ?? "")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    address: String(formData.get("address") ?? "").trim(),
    city: String(formData.get("city") ?? "").trim(),
    state: String(formData.get("state") ?? "").trim().toUpperCase(),
    zip: String(formData.get("zip") ?? "").trim(),
    lat: numOrNull(formData, "lat"),
    lng: numOrNull(formData, "lng"),
    beds: numOrNull(formData, "beds") ?? 0,
    baths: numOrNull(formData, "baths") ?? 0,
    sqft: numOrNull(formData, "sqft"),
    yearBuilt: numOrNull(formData, "yearBuilt"),
    purchasePrice: numOrNull(formData, "purchasePrice") ?? 0,
    entryFee: numOrNull(formData, "entryFee") ?? 0,
    interestRate: numOrNull(formData, "interestRate"),
    monthlyPayment: numOrNull(formData, "monthlyPayment"),
    dealTypes,
    status,
    description: String(formData.get("description") ?? "").trim(),
    images,
    zillowUrl: String(formData.get("zillowUrl") ?? "").trim() || null,
    directPhone: String(formData.get("directPhone") ?? "").trim() || null,
    featured: boolFrom(formData, "featured"),
    published: boolFrom(formData, "published"),
  };
}

async function uniqueSlug(base: string, ignoreSlug?: string): Promise<string> {
  let slug = base || "draft";
  let n = 1;
  while (true) {
    const existing = await getDealBySlug(slug);
    if (!existing || existing.slug === ignoreSlug) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}

/** Deletes Vercel Blob images, ignoring non-blob URLs (e.g. seed placeholders). */
export async function deleteBlobs(urls: string[]) {
  const blobs = urls.filter((u) => u.includes(".blob.vercel-storage.com"));
  if (blobs.length === 0) return;
  try {
    await del(blobs);
  } catch (err) {
    console.error("[blob] delete failed", err);
  }
}

function removedImagesFrom(formData: FormData): string[] {
  return String(formData.get("removedImages") ?? "")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export interface SaveResult {
  id: string;
  slug: string;
  published: boolean;
}

/** Upsert a deal from form data. New deals are created as unpublished drafts. */
export async function saveDealFromForm(formData: FormData): Promise<SaveResult> {
  const id = String(formData.get("id") ?? "").trim();
  const data = parseDealForm(formData);
  const customSlug = String(formData.get("slug") ?? "").trim();
  const base = slugify(customSlug || `${data.address}-${data.city}-${data.state}`);

  if (id) {
    const current = await getDealById(id);
    const slug = await uniqueSlug(base, current?.slug);
    const updated = await updateDeal(id, { ...data, slug });
    await deleteBlobs(removedImagesFrom(formData));
    return { id, slug, published: updated?.published ?? data.published ?? false };
  }

  const slug = await uniqueSlug(base);
  const created = await createDeal({ ...data, slug, published: false });
  return { id: created.id, slug: created.slug, published: false };
}
