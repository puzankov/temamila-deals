import type { DealStatus } from "./types";

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${value}%`;
}

export const STATUS_LABELS: Record<DealStatus, string> = {
  available: "Available",
  under_contract: "Under Contract",
  closed: "Closed",
};

export const STATUS_STYLES: Record<DealStatus, string> = {
  available: "bg-emerald-100 text-emerald-700 ring-emerald-600/20",
  under_contract: "bg-amber-100 text-amber-700 ring-amber-600/20",
  closed: "bg-slate-200 text-slate-600 ring-slate-500/20",
};
