export const metadata = {
  title: "About",
  description: "How Temamila Deals sources, underwrites, and packages real estate deals.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-900">About Temamila Deals</h1>
      <div className="prose mt-6 space-y-4 text-slate-700">
        <p>
          Temamila Deals is a curated source of off-market and creative-finance
          real estate opportunities. We find properties that don&apos;t fit the
          traditional MLS-and-bank mold and package them so investors can act
          quickly and confidently.
        </p>
        <p>
          Every deal we list is underwritten with the numbers that actually
          matter to an investor — entry fee, financing terms, and projected
          monthly cost — and comes with the supporting documentation you need to
          make a decision.
        </p>
        <h2 className="text-xl font-semibold text-slate-900">What we focus on</h2>
        <p>
          Seller finance, subject-to, novation, lease purchase, and hybrid
          structures, alongside straight cash deals for fix &amp; flip and
          buy-and-hold. From short-term rentals to co-living, we look for deals
          with a clear path to returns.
        </p>
        <p>
          Want first access to new inventory?{" "}
          <a href="/contact" className="font-medium text-brand-dark hover:underline">
            Get on the buyers list
          </a>
          .
        </p>
      </div>
    </div>
  );
}
