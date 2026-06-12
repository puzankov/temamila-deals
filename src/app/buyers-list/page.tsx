import { BuyBoxForm } from "@/components/buy-box-form";

export const metadata = {
  title: "My Buy Box",
  description:
    "Tell us exactly what you're looking for and we'll send matching deals straight to your inbox before they hit the public site.",
};

export default function BuyersListPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero */}
      <div className="brand-gradient py-14">
        <div className="mx-auto max-w-3xl px-4 text-center text-white">
          <p className="text-sm font-semibold uppercase tracking-widest opacity-80">
            Buyers List
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">My Buy Box</h1>
          <p className="mt-4 text-lg opacity-90">
            Tell us exactly what you&apos;re looking for and we&apos;ll send
            matching deals to your inbox — before they hit the public site.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm opacity-85">
            <span className="flex items-center gap-2">
              <span className="text-base">✓</span> Off-market deals first
            </span>
            <span className="flex items-center gap-2">
              <span className="text-base">✓</span> Matched to your criteria
            </span>
            <span className="flex items-center gap-2">
              <span className="text-base">✓</span> No spam, ever
            </span>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="mx-auto max-w-2xl px-4 py-12">
        <BuyBoxForm />
      </div>
    </div>
  );
}
