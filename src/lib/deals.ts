import { and, asc, desc, eq, gte, ilike, lte, or, type SQL } from "drizzle-orm";
import { getDb, hasDb } from "@/db";
import { deals as dealsTable, type DealRow, type NewDealRow } from "@/db/schema";
import { SEED_DEALS } from "./seed-data";
import type { Deal, DealStatus, DealType } from "./types";

// Data access layer. Uses Postgres when DATABASE_URL is configured; otherwise
// falls back to seed data so the public site works before the DB is wired up.

export interface DealFilters {
  q?: string;
  dealType?: DealType;
  status?: DealStatus;
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  sort?: "newest" | "price_asc" | "price_desc";
}

function rowToDeal(r: DealRow): Deal {
  return {
    id: r.id,
    slug: r.slug,
    address: r.address,
    city: r.city,
    state: r.state,
    zip: r.zip,
    lat: r.lat ?? undefined,
    lng: r.lng ?? undefined,
    beds: r.beds,
    baths: r.baths,
    sqft: r.sqft ?? undefined,
    purchasePrice: r.purchasePrice,
    entryFee: r.entryFee,
    interestRate: r.interestRate ?? undefined,
    monthlyPayment: r.monthlyPayment ?? undefined,
    dealTypes: r.dealTypes as DealType[],
    status: r.status as DealStatus,
    description: r.description,
    images: r.images,
    featured: r.featured,
    createdAt:
      r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
  };
}

// ---------- Public reads ----------

export async function getAllDeals(): Promise<Deal[]> {
  if (!hasDb) return SEED_DEALS;
  const rows = await getDb().select().from(dealsTable).orderBy(desc(dealsTable.createdAt));
  return rows.map(rowToDeal);
}

export async function getDealBySlug(slug: string): Promise<Deal | null> {
  if (!hasDb) return SEED_DEALS.find((d) => d.slug === slug) ?? null;
  const rows = await getDb().select().from(dealsTable).where(eq(dealsTable.slug, slug)).limit(1);
  return rows[0] ? rowToDeal(rows[0]) : null;
}

export async function getDealById(id: string): Promise<Deal | null> {
  if (!hasDb) return SEED_DEALS.find((d) => d.id === id) ?? null;
  const rows = await getDb().select().from(dealsTable).where(eq(dealsTable.id, id)).limit(1);
  return rows[0] ? rowToDeal(rows[0]) : null;
}

export async function getFeaturedDeals(limit = 3): Promise<Deal[]> {
  const all = await getAllDeals();
  return all.filter((d) => d.featured && d.status !== "closed").slice(0, limit);
}

export async function getFilteredDeals(filters: DealFilters): Promise<Deal[]> {
  if (!hasDb) return filterSeed(filters);

  const conds: SQL[] = [];
  if (filters.q) {
    const q = `%${filters.q.trim()}%`;
    conds.push(
      or(
        ilike(dealsTable.address, q),
        ilike(dealsTable.city, q),
        ilike(dealsTable.state, q),
        ilike(dealsTable.zip, q),
      )!,
    );
  }
  if (filters.status) conds.push(eq(dealsTable.status, filters.status));
  if (filters.minPrice != null) conds.push(gte(dealsTable.purchasePrice, filters.minPrice));
  if (filters.maxPrice != null) conds.push(lte(dealsTable.purchasePrice, filters.maxPrice));
  if (filters.minBeds != null) conds.push(gte(dealsTable.beds, filters.minBeds));

  const orderBy =
    filters.sort === "price_asc"
      ? asc(dealsTable.purchasePrice)
      : filters.sort === "price_desc"
        ? desc(dealsTable.purchasePrice)
        : desc(dealsTable.createdAt);

  const rows = await getDb()
    .select()
    .from(dealsTable)
    .where(conds.length ? and(...conds) : undefined)
    .orderBy(orderBy);

  let deals = rows.map(rowToDeal);
  // dealType filter on the array column is applied in JS for simplicity/correctness.
  if (filters.dealType) deals = deals.filter((d) => d.dealTypes.includes(filters.dealType!));
  return deals;
}

function filterSeed(filters: DealFilters): Deal[] {
  let deals = [...SEED_DEALS];
  if (filters.q) {
    const q = filters.q.toLowerCase().trim();
    deals = deals.filter((d) =>
      [d.address, d.city, d.state, d.zip].some((f) => f.toLowerCase().includes(q)),
    );
  }
  if (filters.dealType) deals = deals.filter((d) => d.dealTypes.includes(filters.dealType!));
  if (filters.status) deals = deals.filter((d) => d.status === filters.status);
  if (filters.minPrice != null) deals = deals.filter((d) => d.purchasePrice >= filters.minPrice!);
  if (filters.maxPrice != null) deals = deals.filter((d) => d.purchasePrice <= filters.maxPrice!);
  if (filters.minBeds != null) deals = deals.filter((d) => d.beds >= filters.minBeds!);
  switch (filters.sort) {
    case "price_asc":
      deals.sort((a, b) => a.purchasePrice - b.purchasePrice);
      break;
    case "price_desc":
      deals.sort((a, b) => b.purchasePrice - a.purchasePrice);
      break;
    default:
      deals.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  return deals;
}

// ---------- Admin writes (require DB) ----------

export async function createDeal(data: NewDealRow): Promise<Deal> {
  const rows = await getDb().insert(dealsTable).values(data).returning();
  return rowToDeal(rows[0]);
}

export async function updateDeal(id: string, data: Partial<NewDealRow>): Promise<Deal | null> {
  const rows = await getDb().update(dealsTable).set(data).where(eq(dealsTable.id, id)).returning();
  return rows[0] ? rowToDeal(rows[0]) : null;
}

export async function deleteDeal(id: string): Promise<void> {
  await getDb().delete(dealsTable).where(eq(dealsTable.id, id));
}
