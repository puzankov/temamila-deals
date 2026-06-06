import { DealForm } from "@/components/admin/deal-form";

export const metadata = { title: "New deal", robots: { index: false } };

export default function NewDealPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">New deal</h1>
      <p className="mt-1 text-sm text-slate-500">
        Saved automatically as a draft. Toggle <strong>Published</strong> to make it live.
      </p>
      <div className="mt-8">
        <DealForm />
      </div>
    </div>
  );
}
