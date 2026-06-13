"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import React from "react";
import type { DealType } from "@/lib/types";

type SortField = "date" | "price" | "rate" | "entry" | "year";
type SortDir = "asc" | "desc";

const SORT_FIELDS: { value: SortField; label: string; icon: React.ReactNode }[] = [
  { value: "date",  label: "Date Added",     icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><rect x="3" y="4" width="18" height="18" rx="2"/><path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18"/></svg> },
  { value: "price", label: "Purchase Price", icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 2v20M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6"/></svg> },
  { value: "rate",  label: "Interest Rate",  icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" d="M6 18L18 6"/><circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="17" r="2.5"/></svg> },
  { value: "entry", label: "Entry Fee",      icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><circle cx="12" cy="12" r="8"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 7v10M14.5 9.5h-4a1.5 1.5 0 000 3h3a1.5 1.5 0 010 3H9.5"/></svg> },
  { value: "year",  label: "Year Built",     icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11M8 14v3m4-3v3m4-3v3"/></svg> },
];

const DIR_LABELS: Record<SortField, [string, string]> = {
  date:  ["Oldest first", "Newest first"],
  price: ["Low → High",  "High → Low"  ],
  rate:  ["Low → High",  "High → Low"  ],
  entry: ["Low → High",  "High → Low"  ],
  year:  ["Oldest first", "Newest first"],
};

// Default direction when switching fields
const DEFAULT_DIR: Record<SortField, SortDir> = {
  date: "desc", year: "desc", price: "asc", rate: "asc", entry: "asc",
};

function parseSortParam(sort: string | null): { field: SortField; dir: SortDir } {
  if (!sort) return { field: "date", dir: "desc" };
  const [f, d] = sort.split("_");
  const field = SORT_FIELDS.some((s) => s.value === f) ? (f as SortField) : "date";
  const dir = d === "asc" ? "asc" : "desc";
  return { field, dir };
}

function sortLabel(field: SortField, dir: SortDir) {
  const labels = DIR_LABELS[field];
  return `${SORT_FIELDS.find((f) => f.value === field)!.label}: ${dir === "asc" ? labels[0] : labels[1]}`;
}

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
  const { field, dir } = parseSortParam(params.get("sort"));

  // Sort dropdown state
  const [sortOpen, setSortOpen] = useState(false);
  const [draftField, setDraftField] = useState<SortField>(field);
  const [draftDir, setDraftDir] = useState<SortDir>(dir);
  const sortRef = useRef<HTMLDivElement>(null);

  function handleSortBlur(e: React.FocusEvent) {
    if (!sortRef.current?.contains(e.relatedTarget as Node)) setSortOpen(false);
  }

  function openSort() {
    setDraftField(field);
    setDraftDir(dir);
    setSortOpen(true);
  }

  const isDefaultSort = field === "date" && dir === "desc";

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
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        )}

        {/* Sort button + dropdown */}
        <div ref={sortRef} className="relative shrink-0" onBlur={handleSortBlur}>
          <button
            type="button"
            onClick={openSort}
            className={`flex items-center gap-2 whitespace-nowrap rounded-lg border px-3 py-2.5 text-sm transition ${
              !isDefaultSort
                ? "border-brand bg-brand-tint font-semibold text-brand-dark"
                : "border-slate-300 text-slate-700 hover:border-slate-400"
            }`}
          >
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
            {isDefaultSort ? "Sort" : sortLabel(field, dir)}
          </button>

          {sortOpen && (
            <div className="absolute right-0 top-full z-30 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Sort by</p>
              <div className="space-y-1">
                {SORT_FIELDS.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => { const d = DEFAULT_DIR[f.value]; setDraftField(f.value); setDraftDir(d); setSortOpen(false); setParam("sort", `${f.value}_${d}`); }}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                      draftField === f.value
                        ? "bg-brand text-white"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="shrink-0 opacity-70">{f.icon}</span>
                    {f.label}
                    {draftField === f.value && (
                      <svg className="ml-auto h-3.5 w-3.5 shrink-0" viewBox="0 0 14 14" fill="currentColor">
                        <path fillRule="evenodd" d="M12 3.5L6 10 2 6.5l1-1 3 3 5-5 1 1z" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>

              <div className="my-3 border-t border-slate-100" />

              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Order</p>
              <div className="grid grid-cols-2 gap-2">
                {(["asc", "desc"] as SortDir[]).map((d, i) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => { setDraftDir(d); setSortOpen(false); setParam("sort", `${draftField}_${d}`); }}
                    className={`flex items-center justify-center gap-1.5 rounded-lg border py-2 text-sm font-medium transition ${
                      draftDir === d
                        ? "border-brand bg-brand-tint text-brand-dark"
                        : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={2}>
                      {d === "asc"
                        ? <path strokeLinecap="round" strokeLinejoin="round" d="M7 12V2M3 6l4-4 4 4" />
                        : <path strokeLinecap="round" strokeLinejoin="round" d="M7 2v10M3 8l4 4 4-4" />}
                    </svg>
                    {DIR_LABELS[draftField][i]}
                  </button>
                ))}
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Deal-type tag chips */}
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
