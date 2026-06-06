// Core domain types for SmartDeal365.
// Kept framework-agnostic so the data source can swap from seed data to a DB later.

export const DEAL_TYPES = [
  "Cash",
  "Seller Finance",
  "Subto",
  "Novation",
  "Hybrid",
  "Lease Purchase",
  "Fix & Flip",
  "STR",
  "MTR",
  "Co-Living",
  "Furnished",
] as const;

export type DealType = (typeof DEAL_TYPES)[number];

export const DEAL_STATUSES = ["available", "under_contract", "closed"] as const;
export type DealStatus = (typeof DEAL_STATUSES)[number];

export interface Deal {
  id: string;
  slug: string;

  // Location
  address: string;
  city: string;
  state: string;
  zip: string;
  lat?: number; // reserved for the map feature (Phase: later)
  lng?: number;

  // Property facts
  beds: number;
  baths: number;
  sqft?: number;

  // Financials
  purchasePrice: number;
  entryFee: number; // cash to get in (down payment / assignment / entry fee)
  interestRate?: number; // for creative-finance deals, annual %
  monthlyPayment?: number; // PITI or note payment

  // Presentation
  dealTypes: DealType[];
  status: DealStatus;
  description: string;
  images: string[];
  featured?: boolean;

  createdAt: string; // ISO date
}

export interface Lead {
  dealSlug: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
}
