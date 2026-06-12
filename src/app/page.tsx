import Link from "next/link";
import Image from "next/image";
import { DealCard } from "@/components/deal-card";
import { getFeaturedDeals } from "@/lib/deals";
import { CONTACT_PHONE, CONTACT_PHONE_TEL } from "@/lib/config";

export const revalidate = 60;

export default async function HomePage() {
  const featured = await getFeaturedDeals(3);

  return (
    <>
      <Hero />
      <ValueProposition />
      {featured.length > 0 && <FeaturedDeals deals={featured} />}
      <AudienceSegmentation />
      <HowItWorks />
      <JVBanner />
      <About />
      <TextFeatures />
      <FinalCTA />
    </>
  );
}

// ── Block 1: Hero ─────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-navy">
      <Image src="/hero.png" alt="" fill priority sizes="100vw" className="-z-10 object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy/97 via-navy/85 to-navy/50" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy/60 to-transparent" />

      <div className="mx-auto max-w-6xl px-4 py-28 sm:py-36">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand/20 px-4 py-1.5 text-sm font-semibold text-brand ring-1 ring-brand/30">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            Premier Creative Real Estate Community
          </span>

          <h1 className="mt-6 text-5xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl">
            Unlock Your Next{" "}
            <span className="text-gradient">Creative Real Estate</span>{" "}
            Investment
          </h1>
          <p className="mt-4 text-xl font-medium text-slate-300">
            Personalized to your buying criteria.
          </p>

          {/* Search bar */}
          <form action="/deals" method="get" className="mt-8">
            <div className="flex items-center overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-white/10">
              <svg className="ml-4 h-5 w-5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="m21 21-4.35-4.35" />
              </svg>
              <input
                name="q"
                type="text"
                placeholder="Enter an address, state, city, area or zip code"
                className="flex-1 bg-transparent px-4 py-4 text-slate-900 placeholder-slate-400 outline-none text-sm sm:text-base"
              />
              <button
                type="submit"
                className="brand-gradient m-1.5 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:opacity-90 shrink-0"
              >
                Search Deals
              </button>
            </div>
          </form>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/deals" className="brand-gradient rounded-full px-6 py-3 font-semibold text-white shadow-lg transition hover:opacity-90">
              Browse All Deals
            </Link>
            <Link href="/buyers-list" className="rounded-full border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10">
              Get on the Buyers List
            </Link>
          </div>

          {/* Banner text */}
          <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 px-6 py-5 backdrop-blur">
            <p className="text-sm leading-relaxed text-slate-300">
              <span className="font-semibold text-white">SmartDeal365</span> is a premier community working as one to achieve more. We are your ultimate deal partner — fueling a steady flow of curated, off-market investment opportunities matched to your buying goals.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Block 2: Value Proposition ────────────────────────────────────────────────

function ValueProposition() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            At SmartDeal365, Your Success is Our Strategy
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Whether your strategy is co-living, STR, wholesale, or fix-and-flip, we deliver high-potential, deeply underwritten deals in one place. No banks, no traditional hassle — just seamless, expert support from search to keys in hand.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {/* Card 1 */}
          <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md hover:-translate-y-0.5">
            <div className="brand-gradient flex items-center gap-3 px-6 py-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15 text-white">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white">Fresh Daily Deal Inventory</h3>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <ul className="flex-1 space-y-3">
                {[
                  "100+ exclusive and partner deals updated daily on our platform.",
                  "Nationwide creative inventory: Seller Financing, Subject-To, Novations, and deep-discount wholesale deals.",
                  "Transparent underwriting with crystal-clear numbers and projected ROI designed around your goals.",
                ].map((line) => (
                  <li key={line} className="flex gap-2.5 text-sm text-slate-600">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-tint text-[10px] font-bold text-brand">✓</span>
                    {line}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Link href="/deals" className="brand-gradient inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-bold text-white transition hover:opacity-90">
                  Find Your Next Deal
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md hover:-translate-y-0.5">
            <div className="brand-gradient flex items-center gap-3 px-6 py-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15 text-white">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="3" /><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="11.5" strokeOpacity=".3" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white">Your Criteria, Our Focus</h3>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <ul className="flex-1 space-y-3">
                {[
                  "Tired of junk deals? Filter your Buy Box and get sent exactly what fits your precise parameters.",
                  "Book a 1-on-1 strategy session with our acquisitions team to locate target properties faster.",
                  "A perfect blend of boots-on-the-ground real estate expertise and automated, data-driven matching.",
                ].map((line) => (
                  <li key={line} className="flex gap-2.5 text-sm text-slate-600">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-tint text-[10px] font-bold text-brand">✓</span>
                    {line}
                  </li>
                ))}
              </ul>
              <div className="mt-6 space-y-2">
                <a href={`tel:${CONTACT_PHONE_TEL}`} className="inline-flex w-full items-center justify-center rounded-xl border border-brand px-5 py-3 text-sm font-bold text-brand transition hover:bg-brand-tint">
                  Schedule Deal Shopping
                </a>
                <Link href="/buyers-list" className="brand-gradient inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-bold text-white transition hover:opacity-90">
                  Add My Buy Box
                </Link>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md hover:-translate-y-0.5">
            <div className="brand-gradient flex items-center gap-3 px-6 py-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15 text-white">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white">Seamless Closings, Real Results</h3>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <ul className="flex-1 space-y-3">
                {[
                  "Backing a community with hundreds of successfully closed transactions across the US.",
                  "Easily track your active contracts, due diligence materials, and incoming properties in real time.",
                  "Dedicated transaction coordinators guide you through every creative escrow step to keep it secure and smooth.",
                ].map((line) => (
                  <li key={line} className="flex gap-2.5 text-sm text-slate-600">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-tint text-[10px] font-bold text-brand">✓</span>
                    {line}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Link href="/about" className="brand-gradient inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-bold text-white transition hover:opacity-90">
                  Learn About SmartDeal365
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Featured Deals ────────────────────────────────────────────────────────────

function FeaturedDeals({ deals }: { deals: Awaited<ReturnType<typeof getFeaturedDeals>> }) {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
              <svg className="h-3.5 w-3.5 fill-amber-500" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              Hand-Picked This Week
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Featured Deals</h2>
            <p className="mt-2 text-lg text-slate-600">A few of this week&apos;s standout opportunities.</p>
          </div>
          <Link
            href="/deals"
            className="brand-gradient shrink-0 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            View all →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Block 3: Audience Segmentation ───────────────────────────────────────────

function AudienceSegmentation() {
  const groups = [
    {
      icon: (
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      title: "Investors",
      bullets: [
        "Scale your portfolio with off-market, high-yield assets",
        "No rigid bank approvals — creative terms that work for you",
        "Fully underwritten deals with clear numbers and projected ROI",
      ],
    },
    {
      icon: (
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
        </svg>
      ),
      title: "Wholesalers",
      bullets: [
        "You bring the contract — we bring the buyers",
        "Instant underwriting feedback and structural optimization",
        "Elite disposition power across our nationwide network",
      ],
    },
    {
      icon: (
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <circle cx="12" cy="5" r="2" /><circle cx="5" cy="19" r="2" /><circle cx="19" cy="19" r="2" />
          <path strokeLinecap="round" d="M12 7v4M12 11l-5.5 6M12 11l5.5 6" />
        </svg>
      ),
      title: "Connectors",
      bullets: [
        "Plug into a premium deal-maker network",
        "Leverage our massive buyers list to move inventory fast",
        "Maximize your joint-venture splits with proven partners",
      ],
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Who We Serve</h2>
          <p className="mt-4 text-lg text-slate-600">
            Seasoned institutional buyers, active flippers, and residential investors alike benefit from our deeply analyzed creative deal flow. For wholesalers and connectors, this is your premier marketplace to joint-venture and scale your business.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {groups.map(({ icon, title, bullets }) => (
            <div key={title} className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {/* Header */}
              <div className="flex items-center gap-3 border-b border-slate-100 bg-navy px-6 py-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
                  {icon}
                </div>
                <h3 className="text-lg font-bold text-white">{title}</h3>
              </div>
              {/* Body */}
              <div className="flex-1 px-6 py-5">
                <ul className="space-y-2.5">
                  {bullets.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-base text-slate-700">
                      <svg className="mt-0.5 h-5 w-5 shrink-0 text-brand" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Block 4: How It Works ─────────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      title: "Set Your Buy Box",
      text: "Tell us your exact target markets, preferred strategies (Sub-To, Seller Finance, Cash), and expected returns.",
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: "Connect & Analyze",
      text: "Instantly review premium properties online or connect directly with our desk to structure complex creative offers.",
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Close Cleanly",
      text: "Our transaction team handles the heavy lifting, paperwork, and title coordination to ensure a secure, stress-free closing.",
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      title: "Profit & Scale",
      text: "Build consistent cash flow and long-term equity with a reliable partner supplying your investment engine.",
    },
  ];

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">How It Works</h2>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ icon, title, text }, i) => (
            <div key={title} className="relative flex flex-col items-center text-center">
              {/* Connector line (desktop) */}
              {i < steps.length - 1 && (
                <div className="absolute left-[calc(50%+2.5rem)] top-6 hidden h-px w-[calc(100%-5rem)] bg-slate-200 lg:block" />
              )}
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md ring-1 ring-slate-200 text-brand">
                {icon}
                <div className="absolute -top-3 -right-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-brand text-sm font-extrabold text-white shadow-sm">
                  {i + 1}
                </div>
              </div>
              <h3 className="mt-5 text-base font-bold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Block 5: JV Banner ────────────────────────────────────────────────────────

function JVBanner() {
  return (
    <section className="brand-gradient py-20">
      <div className="mx-auto max-w-4xl px-4 text-center text-white">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Partner on Deals with SmartDeal365
        </h2>
        <p className="mt-3 text-lg font-medium opacity-90">
          Focus on finding leads, and we will handle the rest!
        </p>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed opacity-85">
          Got a property under contract? We have you covered from creative restructuring to elite disposition. If you need help closing or want to leverage our massive buyers list, let&apos;s JV. We do the heavy lifting and protect your equity along the way. Submit your deals now and let&apos;s win together.
        </p>
        <div className="mt-10">
          <a
            href={`tel:${CONTACT_PHONE_TEL}`}
            className="inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-4 text-base font-bold text-brand shadow-lg transition hover:shadow-xl hover:-translate-y-0.5"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.47 11.47 0 003.58.57 1 1 0 011 1V21a1 1 0 01-1 1A17 17 0 013 5a1 1 0 011-1h3.5a1 1 0 011 1 11.47 11.47 0 00.57 3.58 1 1 0 01-.25 1.01l-2.2 2.2z" />
            </svg>
            Submit a JV Deal
          </a>
        </div>
      </div>
    </section>
  );
}

// ── Block 6: About ────────────────────────────────────────────────────────────

function About() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Text */}
          <div>
            <span className="text-sm font-semibold uppercase tracking-widest text-brand">About Us</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              About SmartDeal365
            </h2>
            <div className="mt-6 space-y-4 text-slate-600 leading-relaxed">
              <p>
                SmartDeal365 unifies the modern real estate investing ecosystem. Whether you are expanding your portfolio, wholesaling contract rights, or connecting buyers to off-market inventory, we bring unmatched transparency, speed, and creative strategy to every single escrow.
              </p>
              <p>
                We help operators close more deals — faster, cleaner, and with optimized terms. Backed by a community with over <span className="font-semibold text-slate-900">$50M in collective transaction volume</span>, we are building the most dependable, tech-forward creative real estate destination in the market.
              </p>
              <p>
                Stop guessing and dealing with flaky buyers. We are committed to providing top-tier investment opportunities and transactional support from initial analysis to final funding. Our platform removes friction, giving you everything you need under one roof.
              </p>
            </div>
            <div className="mt-8">
              <Link href="/about" className="brand-gradient inline-flex rounded-xl px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:opacity-90">
                Learn More
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "$50M+", label: "Collective Transaction Volume" },
              { value: "100+", label: "Exclusive Deals Updated Daily" },
              { value: "500+", label: "Transactions Closed Nationwide" },
              { value: "50", label: "States We Operate In" },
            ].map(({ value, label }) => (
              <div key={label} className="rounded-2xl bg-slate-50 p-6 text-center">
                <div className="text-3xl font-extrabold text-brand">{value}</div>
                <div className="mt-1 text-sm text-slate-600">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Block 7: Text Features ────────────────────────────────────────────────────

function TextFeatures() {
  const features = [
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      title: "Elite Deal Access",
      text: "Unrivaled, off-market inventory across high-demand investment markets.",
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Active Deal Support",
      text: "Expert, real-time feedback through every underwriting and escrow phase.",
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
      title: "Unified Marketplace",
      text: "A single, streamlined platform that unifies deal flow, paperwork, and communication.",
    },
  ];

  return (
    <section className="bg-navy py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Powered by People, Not Just Software
          </h2>
          <p className="mt-4 text-lg text-slate-300">
            We don&apos;t just send deals. We help you underwrite, structure, and close them flawlessly.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {features.map(({ icon, title, text }) => (
            <div key={title} className="flex gap-4 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/20 text-brand">
                {icon}
              </div>
              <div>
                <h3 className="font-bold text-white">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Block 8: Final CTA ────────────────────────────────────────────────────────

function FinalCTA() {
  const steps = [
    {
      title: "Share Your Goals",
      text: "Tell our team what markets and strategies you are actively targeting.",
    },
    {
      title: "Targeted Asset Search",
      text: "Our acquisition engine filters high-potential deals matching your strict criteria.",
    },
    {
      title: "Direct Delivery",
      text: "Receive fully analyzed, ready-to-close investment packages straight to your phone or inbox.",
    },
  ];

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-5xl px-4">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Your Next Smart Deal is Just a Conversation Away
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Our investment coordinators make scaling your portfolio effortless. Tell us your goals, and we&apos;ll match you with the exact deals you need.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {steps.map(({ title, text }, i) => (
            <div key={title} className="relative text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand text-lg font-extrabold text-white shadow-md">
                {i + 1}
              </div>
              <h3 className="mt-4 font-bold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
            </div>
          ))}
        </div>

        {/* Action box */}
        <div className="mt-14 overflow-hidden rounded-3xl bg-navy">
          <div className="flex flex-col items-center gap-6 px-8 py-12 text-center sm:flex-row sm:text-left">
            <div className="flex-1">
              <p className="text-xl font-bold text-white">Ready to secure your next asset?</p>
              <p className="mt-2 text-slate-300">
                Speak directly with an acquisitions specialist at{" "}
                <a href={`tel:${CONTACT_PHONE_TEL}`} className="font-bold text-brand hover:underline">
                  {CONTACT_PHONE}
                </a>
              </p>
            </div>
            <a
              href={`tel:${CONTACT_PHONE_TEL}`}
              className="brand-gradient flex shrink-0 items-center gap-3 rounded-2xl px-8 py-4 text-base font-bold text-white shadow-lg transition hover:opacity-90 hover:-translate-y-0.5"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.47 11.47 0 003.58.57 1 1 0 011 1V21a1 1 0 01-1 1A17 17 0 013 5a1 1 0 011-1h3.5a1 1 0 011 1 11.47 11.47 0 00.57 3.58 1 1 0 01-.25 1.01l-2.2 2.2z" />
              </svg>
              Call Us Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
