import Image from "next/image";
import Link from "next/link";
import { formatCurrency, formatPercent } from "@/lib/format";
import type { Deal } from "@/lib/types";
import { StatusBadge } from "./status-badge";

export function DealCard({ deal }: { deal: Deal }) {
  return (
    <Link
      href={`/deals/${deal.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <Image
          src={deal.images[0]}
          alt={`${deal.address}, ${deal.city}, ${deal.state}`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <StatusBadge status={deal.status} />
        </div>
        <div className="absolute right-3 top-3 flex flex-wrap justify-end gap-1">
          {deal.dealTypes.slice(0, 2).map((t) => (
            <span
              key={t}
              className="rounded-full bg-black/70 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-xl font-bold text-slate-900">
            {formatCurrency(deal.purchasePrice)}
          </span>
          <span className="text-sm text-slate-500">
            {deal.beds} bd · {deal.baths} ba
          </span>
        </div>

        <p className="mt-1 text-sm font-medium text-slate-700">{deal.address}</p>
        <p className="text-sm text-slate-500">
          {deal.city}, {deal.state} {deal.zip}
        </p>

        <div className="mt-3 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 text-center">
          <Stat label="Entry" value={formatCurrency(deal.entryFee)} />
          <Stat
            label="Rate"
            value={deal.interestRate != null ? formatPercent(deal.interestRate) : "—"}
          />
          <Stat
            label="Monthly"
            value={deal.monthlyPayment != null ? formatCurrency(deal.monthlyPayment) : "—"}
          />
        </div>
      </div>
    </Link>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-slate-400">{label}</div>
      <div className="text-sm font-semibold text-slate-800">{value}</div>
    </div>
  );
}
