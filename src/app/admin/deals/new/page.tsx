import { DealForm } from "@/components/admin/deal-form";
import { createDealAction } from "@/app/admin/actions";

export const metadata = { title: "New deal", robots: { index: false } };

export default function NewDealPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">New deal</h1>
      <p className="mt-1 text-sm text-slate-500">Add a property to the public feed.</p>
      <div className="mt-8">
        <DealForm action={createDealAction} submitLabel="Create deal" />
      </div>
    </div>
  );
}
