import { notFound } from "next/navigation";
import { DealForm } from "@/components/admin/deal-form";
import { getDealById } from "@/lib/deals";

export const metadata = { title: "Edit deal", robots: { index: false } };

type Params = Promise<{ id: string }>;

export default async function EditDealPage({ params }: { params: Params }) {
  const { id } = await params;
  const deal = await getDealById(id);
  if (!deal) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">Edit deal</h1>
      <p className="mt-1 text-sm text-slate-500">
        {deal.address}, {deal.city}, {deal.state}
        {!deal.published && <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-700">Draft</span>}
      </p>
      <div className="mt-8">
        <DealForm deal={deal} />
      </div>
    </div>
  );
}
