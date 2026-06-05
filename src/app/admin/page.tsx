import Link from "next/link";
import { hasDb } from "@/db";
import { getAllDeals } from "@/lib/deals";
import { formatCurrency, STATUS_LABELS } from "@/lib/format";
import { deleteDealAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const deals = await getAllDeals();

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
          Provision Neon (Vercel → Storage), then run <code>vercel env pull .env.local</code> and{" "}
          <code>pnpm db:push</code> to enable creating and editing deals.
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Address</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {deals.map((deal) => (
              <tr key={deal.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-900">{deal.address}</div>
                  <div className="text-xs text-slate-500">
                    {deal.city}, {deal.state} {deal.zip}
                  </div>
                </td>
                <td className="px-4 py-3">{formatCurrency(deal.purchasePrice)}</td>
                <td className="px-4 py-3">{STATUS_LABELS[deal.status]}</td>
                <td className="px-4 py-3">{deal.featured ? "★" : "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/deals/${deal.slug}`}
                      className="text-slate-500 hover:text-slate-800"
                      target="_blank"
                    >
                      View
                    </Link>
                    {hasDb && (
                      <>
                        <Link
                          href={`/admin/deals/${deal.id}/edit`}
                          className="font-medium text-brand-dark hover:underline"
                        >
                          Edit
                        </Link>
                        <form action={deleteDealAction}>
                          <input type="hidden" name="id" value={deal.id} />
                          <input type="hidden" name="slug" value={deal.slug} />
                          <button
                            type="submit"
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </form>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {deals.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
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
