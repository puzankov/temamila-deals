import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LeadForm } from "@/components/lead-form";
import { PropertyGallery } from "@/components/property-gallery";
import { PropertyMap } from "@/components/property-map";
import { BedIcon, BathIcon, RulerIcon } from "@/components/property-icons";
import { StatusBadge } from "@/components/status-badge";
import { getAllDeals, getDealBySlug } from "@/lib/deals";
import { formatCurrency, formatPercent } from "@/lib/format";
import type { Deal } from "@/lib/types";

type Params = Promise<{ slug: string }>;

// ISR: reflect admin edits (primary image, fields, publish) within a minute,
// on top of the instant revalidatePath calls the admin actions already make.
export const revalidate = 60;

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
      <div className="mt-4">
        <PropertyGallery
          images={deal.images}
          alt={`${deal.address}, ${deal.city}, ${deal.state}`}
        />
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

          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-700">
            <span className="inline-flex items-center gap-1.5">
              <BedIcon className="h-5 w-5 text-slate-400" />
              <strong>{deal.beds}</strong> beds
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BathIcon className="h-5 w-5 text-slate-400" />
              <strong>{deal.baths}</strong> baths
            </span>
            {deal.sqft && (
              <span className="inline-flex items-center gap-1.5">
                <RulerIcon className="h-5 w-5 text-slate-400" />
                <strong>{deal.sqft.toLocaleString()}</strong> sqft
              </span>
            )}
          </div>

          {/* Price block — shown here on mobile (above the description) */}
          <div className="mt-6 lg:hidden">
            <PriceCard deal={deal} />
          </div>

          <h2 className="mt-8 text-lg font-semibold text-slate-900">About this deal</h2>
          <div
            className="prose prose-slate mt-2 max-w-none [&_li]:my-0.5 [&_li>p]:my-0 [&_ol]:my-2 [&_p]:my-2 [&_ul]:my-2"
            dangerouslySetInnerHTML={{ __html: deal.description }}
          />

          {/* Location map */}
          {deal.lat != null && deal.lng != null && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-slate-900">Location</h2>
              <div className="mt-2 aspect-[16/9] overflow-hidden rounded-2xl border border-slate-200">
                <PropertyMap
                  lat={deal.lat}
                  lng={deal.lng}
                  label={`${deal.address}, ${deal.city}, ${deal.state}`}
                />
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: financials (desktop only) + lead form */}
        <aside className="space-y-6">
          <div className="hidden lg:block">
            <PriceCard deal={deal} />
          </div>

          <div className="rounded-2xl border border-slate-200 p-6 shadow-sm">
            <LeadForm dealSlug={deal.slug} dealAddress={`${deal.address}, ${deal.city}`} />
          </div>
        </aside>
      </div>
    </article>
  );
}

function PriceCard({ deal }: { deal: Deal }) {
  return (
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
