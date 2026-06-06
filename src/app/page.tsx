import Image from "next/image";
import Link from "next/link";
import { DealCard } from "@/components/deal-card";
import { getFeaturedDeals } from "@/lib/deals";

// Hero background photo. Swap this URL (or drop a file in /public and use "/your.jpg").
const HERO_IMAGE =
  "/hero.png";

export default async function HomePage() {
  const featured = await getFeaturedDeals(3);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-navy">
        {/* Background photo */}
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover"
        />
        {/* Brand overlay for text contrast */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy/95 via-navy/80 to-navy/40" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy/70 to-transparent" />

        <div className="mx-auto max-w-6xl px-4 py-24 sm:py-32">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white ring-1 ring-inset ring-white/20 backdrop-blur">
              New deals added weekly
            </span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Curated real estate deals,{" "}
              <span className="text-brand">creatively financed.</span>
            </h1>
            <p className="mt-5 text-lg text-slate-200">
              Off-market and creative-finance opportunities — seller finance,
              subject-to, cash, fix &amp; flip, and short-term rentals.
              Underwritten, packaged, and ready to close.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/deals"
                className="brand-gradient rounded-full px-6 py-3 font-semibold text-white shadow-lg transition hover:opacity-90"
              >
                Browse all deals
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
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
