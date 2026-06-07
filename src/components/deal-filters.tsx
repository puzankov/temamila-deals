"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { DealType } from "@/lib/types";

const SORTS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

export function DealFilters({
  states,
  dealTypes,
}: {
  states: string[];
  dealTypes: DealType[];
}) {
  const router = useRouter();
  const params = useSearchParams();

  const setParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      router.push(`/deals?${next.toString()}`, { scroll: false });
    },
    [params, router],
  );

  const activeType = params.get("dealType") ?? "";

  return (
    <div className="space-y-4">
      {/* Search + state + sort row */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          defaultValue={params.get("q") ?? ""}
          placeholder="Search by city, state, or address…"
          onChange={(e) => setParam("q", e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
        />
        {states.length > 0 && (
          <select
            value={params.get("state") ?? ""}
            onChange={(e) => setParam("state", e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
          >
            <option value="">All states</option>
            {states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        )}
        <select
          defaultValue={params.get("sort") ?? "newest"}
          onChange={(e) => setParam("sort", e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Deal-type tag chips — only types that have deals */}
      <div className="flex flex-wrap gap-2">
        <Chip active={activeType === ""} onClick={() => setParam("dealType", "")}>
          All types
        </Chip>
        {dealTypes.map((t) => (
          <Chip
            key={t}
            active={activeType === t}
            onClick={() => setParam("dealType", activeType === t ? "" : t)}
          >
            {t}
          </Chip>
        ))}
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
        active
          ? "border-brand bg-brand text-white"
          : "border-slate-300 bg-white text-slate-600 hover:border-slate-400"
      }`}
    >
      {children}
    </button>
  );
}
