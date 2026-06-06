import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LeadForm } from "@/components/lead-form";
import { StatusBadge } from "@/components/status-badge";
import { getAllDeals, getDealBySlug } from "@/lib/deals";
import { formatCurrency, formatPercent } from "@/lib/format";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const deals = await getAllDeals();
  return deals.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const deal = await getDealBySlug(slug);
  if (!deal) return { title: "Deal not found" };
  const title = `${deal.address}, ${deal.city}, ${deal.state}`;
  return {
    title,
    description: `${formatCurrency(deal.purchasePrice)} · ${deal.beds} bd / ${deal.baths} ba · ${deal.dealTypes.join(", ")}. ${deal.description.slice(0, 120)}`,
    openGraph: { title, images: deal.images.slice(0, 1) },
  };
}

export default async function DealDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const deal = await getDealBySlug(slug);
  if (!deal) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SingleFamilyResidence",
    name: `${deal.address}, ${deal.city}, ${deal.state}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: deal.address,
      addressLocality: deal.city,
      addressRegion: deal.state,
      postalCode: deal.zip,
      addressCountry: "US",
    },
    numberOfBedrooms: deal.beds,
    numberOfBathroomsTotal: deal.baths,
    floorSize: deal.sqft ? { "@type": "QuantitativeValue", value: deal.sqft, unitCode: "FTK" } : undefined,
    offers: { "@type": "Offer", price: deal.purchasePrice, priceCurrency: "USD" },
  };

  return (
    <article className="mx-auto max-w-6xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link href="/deals" className="text-sm font-medium text-slate-500 hover:text-slate-800">
        ← Back to all deals
      </Link>

      {/* Gallery */}
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100 md:col-span-2 md:row-span-2">
          <Image
            src={deal.images[0]}
            alt={`${deal.address} — main photo`}
            fill
            sizes="(max-width: 768px) 100vw, 66vw"
            className="object-cover"
            priority
          />
        </div>
        {deal.images.slice(1, 3).map((src, i) => (
          <div key={i} className="relative hidden aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100 md:block">
            <Image src={src} alt={`${deal.address} — photo ${i + 2}`} fill sizes="33vw" className="object-cover" />
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        {/* Main column */}
        <div className="lg:col-span-2">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={deal.status} />
            {deal.dealTypes.map((t) => (
              <span key={t} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                {t}
              </span>
            ))}
          </div>

          <h1 className="mt-3 text-3xl font-bold text-slate-900">{deal.address}</h1>
          <p className="text-slate-600">
            {deal.city}, {deal.state} {deal.zip}
          </p>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-slate-700">
            <span><strong>{deal.beds}</strong> beds</span>
            <span><strong>{deal.baths}</strong> baths</span>
            {deal.sqft && <span><strong>{deal.sqft.toLocaleString()}</strong> sqft</span>}
          </div>

          <h2 className="mt-8 text-lg font-semibold text-slate-900">About this deal</h2>
          <div
            className="prose prose-slate mt-2 max-w-none [&_li]:my-0.5 [&_li>p]:my-0 [&_ol]:my-2 [&_p]:my-2 [&_ul]:my-2"
            dangerouslySetInnerHTML={{ __html: deal.description }}
          />

          {/* Map placeholder — feature coming later */}
          <div className="mt-8 flex aspect-[16/7] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-400">
            Map view coming soon
          </div>
        </div>

        {/* Sidebar: financials + lead form */}
        <aside className="space-y-6">
          <div className="rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="text-3xl font-extrabold text-slate-900">
              {formatCurrency(deal.purchasePrice)}
            </div>
            <div className="text-sm text-slate-500">Purchase price</div>

            <dl className="mt-4 space-y-3 border-t border-slate-100 pt-4 text-sm">
              <Row label="Entry fee" value={formatCurrency(deal.entryFee)} />
              {deal.interestRate != null && <Row label="Interest rate" value={formatPercent(deal.interestRate)} />}
              {deal.monthlyPayment != null && <Row label="Monthly payment" value={formatCurrency(deal.monthlyPayment)} />}
            </dl>
          </div>

          <div className="rounded-2xl border border-slate-200 p-6 shadow-sm">
            <LeadForm dealSlug={deal.slug} dealAddress={`${deal.address}, ${deal.city}`} />
          </div>
        </aside>
      </div>
    </article>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-semibold text-slate-900">{value}</dd>
    </div>
  );
}
