import Link from "next/link";
import { hasDb } from "@/db";
import { getAllDealsAdmin } from "@/lib/deals";
import { formatCurrency } from "@/lib/format";
import { StatusBadge } from "@/components/status-badge";
import { DeleteDealButton } from "@/components/admin/delete-deal-button";
import { TablePublishToggle } from "@/components/admin/table-publish-toggle";
import { EyeIcon, PencilIcon } from "@/components/admin/icons";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const deals = await getAllDealsAdmin();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Deals</h1>
          <p className="text-sm text-slate-500">{deals.length} total</p>
        </div>
        <Link
          href="/admin/deals/new"
          className="brand-gradient rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90"
        >
          + New deal
        </Link>
      </div>

      {!hasDb && (
        <div className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
          <strong>No database connected.</strong> You&apos;re viewing read-only seed data.
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Address</th>
              <th className="px-4 py-3">Bd/Ba</th>
              <th className="px-4 py-3">Sqft</th>
              <th className="px-4 py-3">Types</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {deals.map((deal) => (
              <tr key={deal.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 font-medium text-slate-900">
                    <span>{deal.address}</span>
                    {deal.featured && <span className="text-amber-500" title="Featured">★</span>}
                  </div>
                  <div className="text-xs text-slate-500">
                    {deal.city}, {deal.state} {deal.zip}
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                  {deal.beds}/{deal.baths}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                  {deal.sqft ? deal.sqft.toLocaleString() : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex max-w-44 flex-wrap gap-1">
                    {deal.dealTypes.map((t) => (
                      <span key={t} className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-600">
                        {t}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-mono text-slate-900">
                  {formatCurrency(deal.purchasePrice)}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={deal.status} />
                </td>
                <td className="px-4 py-3">
                  {hasDb ? (
                    <TablePublishToggle id={deal.id} published={deal.published} />
                  ) : (
                    <span className="text-xs text-slate-500">{deal.published ? "Live" : "Draft"}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/deals/${deal.slug}`}
                      target="_blank"
                      title="View"
                      className="rounded p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                    >
                      <EyeIcon />
                    </Link>
                    {hasDb && (
                      <>
                        <Link
                          href={`/admin/deals/${deal.id}/edit`}
                          title="Edit"
                          className="rounded p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-brand-dark"
                        >
                          <PencilIcon />
                        </Link>
                        <DeleteDealButton id={deal.id} slug={deal.slug} />
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {deals.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                  No deals yet. Create your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
