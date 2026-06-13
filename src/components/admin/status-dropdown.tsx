"use client";

import { useRef, useState, useTransition } from "react";
import { setStatusAction } from "@/app/admin/actions";
import { DEAL_STATUSES, type DealStatus } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/format";

const STATUS_STYLES: Record<DealStatus, { badge: string; dot: string }> = {
  available:      { badge: "bg-emerald-100 text-emerald-700 ring-emerald-600/20", dot: "bg-emerald-500" },
  under_contract: { badge: "bg-amber-100 text-amber-700 ring-amber-600/20",       dot: "bg-amber-400"  },
  closed:         { badge: "bg-slate-200 text-slate-600 ring-slate-500/20",        dot: "bg-slate-400"  },
};

export function StatusDropdown({ id, status }: { id: string; status: DealStatus }) {
  const [current, setCurrent] = useState<DealStatus>(status);
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  function select(next: DealStatus) {
    setOpen(false);
    if (next === current) return;
    setCurrent(next);
    startTransition(() => setStatusAction(id, next));
  }

  // Close on outside click
  function handleBlur(e: React.FocusEvent) {
    if (!ref.current?.contains(e.relatedTarget as Node)) setOpen(false);
  }

  const styles = STATUS_STYLES[current];

  return (
    <div ref={ref} className="relative inline-block" onBlur={handleBlur}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={pending}
        className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset transition hover:opacity-80 ${styles.badge} ${pending ? "opacity-50" : ""}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
        {STATUS_LABELS[current]}
        <svg className="h-3 w-3 opacity-50" viewBox="0 0 12 12" fill="currentColor">
          <path d="M6 8L2 4h8L6 8z" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-30 mt-1 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          {DEAL_STATUSES.map((s) => {
            const st = STATUS_STYLES[s];
            return (
              <button
                key={s}
                type="button"
                onClick={() => select(s)}
                className={`flex w-full items-center gap-2 px-3 py-2.5 text-sm transition hover:bg-slate-50 ${s === current ? "font-semibold" : "font-medium text-slate-700"}`}
              >
                <span className={`h-2 w-2 rounded-full ${st.dot}`} />
                <span className={s === current ? STATUS_STYLES[s].badge.split(" ").find(c => c.startsWith("text-")) : ""}>
                  {STATUS_LABELS[s]}
                </span>
                {s === current && (
                  <svg className="ml-auto h-3.5 w-3.5 text-brand" viewBox="0 0 14 14" fill="currentColor">
                    <path fillRule="evenodd" d="M12 3.5L6 10 2 6.5l1-1 3 3 5-5 1 1z" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
