import Link from "next/link";
import { DealCard } from "@/components/deal-card";
import { getFeaturedDeals } from "@/lib/deals";

export default async function HomePage() {
  const featured = await getFeaturedDeals(3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="brand-gradient absolute inset-0 opacity-[0.06]" />
        <div className="mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-brand-tint px-3 py-1 text-sm font-medium text-brand-dark">
              New deals added weekly
            </span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Curated real estate deals,{" "}
              <span className="text-gradient">creatively financed.</span>
            </h1>
            <p className="mt-5 text-lg text-slate-600">
              Off-market and creative-finance opportunities — seller finance,
              subject-to, cash, fix &amp; flip, and short-term rentals.
              Underwritten, packaged, and ready to close.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/deals"
                className="brand-gradient rounded-full px-6 py-3 font-semibold text-white shadow-sm transition hover:opacity-90"
              >
                Browse all deals
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:border-slate-400"
              >
                Get on the buyers list
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
          <ValueProp
            title="Underwritten deals"
            body="Every listing comes with the numbers that matter — entry fee, rate, and monthly payment."
          />
          <ValueProp
            title="Creative finance"
            body="Seller finance, subject-to, novation, and hybrid structures that skip the bank."
          />
          <ValueProp
            title="Ready to close"
            body="Signed contracts and clean packages so you can move fast on the deals you want."
          />
        </div>
      </section>

      {/* Featured deals */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Featured deals</h2>
            <p className="mt-1 text-slate-600">A few of this week&apos;s standout opportunities.</p>
          </div>
          <Link href="/deals" className="text-sm font-semibold text-brand-dark hover:underline">
            View all →
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      </section>
    </>
  );
}

function ValueProp({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{body}</p>
    </div>
  );
}
