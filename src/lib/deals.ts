import { SEED_DEALS } from "./seed-data";
import type { Deal, DealStatus, DealType } from "./types";

// Data access layer. Currently backed by seed data; the async signatures mean
// swapping in a Postgres query later won't touch any calling code.

export interface DealFilters {
  q?: string; // free-text: matches address / city / state / zip
  dealType?: DealType;
  status?: DealStatus;
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  sort?: "newest" | "price_asc" | "price_desc";
}

export async function getAllDeals(): Promise<Deal[]> {
  return SEED_DEALS;
}

export async function getDealBySlug(slug: string): Promise<Deal | null> {
  return SEED_DEALS.find((d) => d.slug === slug) ?? null;
}

export async function getFeaturedDeals(limit = 3): Promise<Deal[]> {
  return SEED_DEALS.filter((d) => d.featured && d.status !== "closed").slice(0, limit);
}

export async function getFilteredDeals(filters: DealFilters): Promise<Deal[]> {
  let deals = [...SEED_DEALS];

  if (filters.q) {
    const q = filters.q.toLowerCase().trim();
    deals = deals.filter((d) =>
      [d.address, d.city, d.state, d.zip].some((f) => f.toLowerCase().includes(q)),
    );
  }
  if (filters.dealType) {
    deals = deals.filter((d) => d.dealTypes.includes(filters.dealType!));
  }
  if (filters.status) {
    deals = deals.filter((d) => d.status === filters.status);
  }
  if (filters.minPrice != null) {
    deals = deals.filter((d) => d.purchasePrice >= filters.minPrice!);
  }
  if (filters.maxPrice != null) {
    deals = deals.filter((d) => d.purchasePrice <= filters.maxPrice!);
  }
  if (filters.minBeds != null) {
    deals = deals.filter((d) => d.beds >= filters.minBeds!);
  }

  switch (filters.sort) {
    case "price_asc":
      deals.sort((a, b) => a.purchasePrice - b.purchasePrice);
      break;
    case "price_desc":
      deals.sort((a, b) => b.purchasePrice - a.purchasePrice);
      break;
    case "newest":
    default:
      deals.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  return deals;
}
