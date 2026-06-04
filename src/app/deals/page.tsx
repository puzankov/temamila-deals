import { Suspense } from "react";
import { DealCard } from "@/components/deal-card";
import { DealFilters } from "@/components/deal-filters";
import { getFilteredDeals, type DealFilters as Filters } from "@/lib/deals";
import { DEAL_TYPES, type DealType } from "@/lib/types";

export const metadata = {
  title: "All Deals",
  description: "Browse every available creative-finance and off-market real estate deal.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function parseFilters(sp: Record<string, string | string[] | undefined>): Filters {
  const get = (k: string) => (Array.isArray(sp[k]) ? sp[k]?.[0] : sp[k]) as string | undefined;
  const dealType = get("dealType");
  const sort = get("sort");
  return {
    q: get("q") || undefined,
    dealType: DEAL_TYPES.includes(dealType as DealType) ? (dealType as DealType) : undefined,
    sort: sort === "price_asc" || sort === "price_desc" ? sort : "newest",
  };
}

export default async function DealsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const filters = parseFilters(sp);
  const deals = await getFilteredDeals(filters);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Deals</h1>
        <p className="mt-1 text-slate-600">
          Curated creative-finance and off-market opportunities.
        </p>
      </header>

      <Suspense fallback={<div className="h-24" />}>
        <DealFilters />
      </Suspense>

      <p className="mt-6 text-sm text-slate-500">
        {deals.length} {deals.length === 1 ? "deal" : "deals"} found
      </p>

      {deals.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-slate-300 py-20 text-center">
          <p className="font-medium text-slate-700">No deals match your filters.</p>
          <p className="mt-1 text-sm text-slate-500">Try clearing a filter or widening your search.</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      )}
    </div>
  );
}
