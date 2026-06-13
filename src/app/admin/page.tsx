import Link from "next/link";
import { hasDb } from "@/db";
import { getAllDealsAdmin } from "@/lib/deals";
import { formatCurrency } from "@/lib/format";
import { StatusBadge } from "@/components/status-badge";
import { StatusDropdown } from "@/components/admin/status-dropdown";
import { DeleteDealButton } from "@/components/admin/delete-deal-button";
import { TablePublishToggle } from "@/components/admin/table-publish-toggle";
import { EyeIcon, PencilIcon } from "@/components/admin/icons";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

type SearchParams = Promise<{ tab?: string; page?: string }>;

export default async function AdminDashboard({ searchParams }: { searchParams: SearchParams }) {
  const { tab = "active", page: pageStr = "1" } = await searchParams;
  const page = Math.max(1, parseInt(pageStr, 10) || 1);

  const allDeals = await getAllDealsAdmin();

  const active = allDeals.filter((d) => d.status !== "closed");
  const closed = allDeals.filter((d) => d.status === "closed");
  const tabDeals = tab === "closed" ? closed : active;

  const totalPages = Math.max(1, Math.ceil(tabDeals.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const deals = tabDeals.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function pageUrl(p: number) {
    return `/admin?tab=${tab}&page=${p}`;
  }
  function tabUrl(t: string) {
    return `/admin?tab=${t}&page=1`;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Deals</h1>
          <p className="text-sm text-slate-500">{allDeals.length} total</p>
        </div>
        <Link
          href="/admin/deals/new"
          className="brand-gradient rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90"
        >
          + New deal
        </Link>
      </div>

      {!hasDb && (
        <div className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
          <strong>No database connected.</strong> You&apos;re viewing read-only seed data.
        </div>
      )}

      {/* Tabs */}
      <div className="mt-6 flex gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 w-fit">
        <Link
          href={tabUrl("active")}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            tab !== "closed"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Active &amp; Under Contract
          <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
            {active.length}
          </span>
        </Link>
        <Link
          href={tabUrl("closed")}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            tab === "closed"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Closed
          <span className="ml-2 rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">
            {closed.length}
          </span>
        </Link>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Address</th>
              <th className="px-4 py-3">Bd/Ba</th>
              <th className="px-4 py-3">Sqft</th>
              <th className="px-4 py-3">Types</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Created</th>
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
                <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-400">
                  {new Date(deal.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </td>
                <td className="px-4 py-3">
                  {hasDb
                    ? <StatusDropdown id={deal.id} status={deal.status} />
                    : <StatusBadge status={deal.status} />}
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
                <td colSpan={9} className="px-4 py-10 text-center text-slate-500">
                  No deals in this category yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
          <span>
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, tabDeals.length)} of {tabDeals.length}
          </span>
          <div className="flex gap-1">
            {currentPage > 1 && (
              <Link href={pageUrl(currentPage - 1)} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50">
                ← Prev
              </Link>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={pageUrl(p)}
                className={`rounded-lg border px-3 py-1.5 font-medium transition ${
                  p === currentPage
                    ? "border-brand bg-brand text-white"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {p}
              </Link>
            ))}
            {currentPage < totalPages && (
              <Link href={pageUrl(currentPage + 1)} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50">
                Next →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
