export const metadata = {
  title: "FAQ",
  description: "Common questions about buying creative-finance real estate deals from Temamila.",
};

const FAQS = [
  {
    q: "What does the entry fee cover?",
    a: "The entry fee is the cash required to take the deal down — depending on structure that may be a down payment, an assignment fee, or reinstatement plus closing costs. The exact breakdown is in each deal's full package.",
  },
  {
    q: "What is a subject-to or seller-finance deal?",
    a: "These are creative structures where you acquire a property without a new bank loan — either taking over the seller's existing mortgage (subject-to) or having the seller carry the financing (seller finance). They often unlock below-market rates and low entry costs.",
  },
  {
    q: "How do I get the full details on a deal?",
    a: "Open any deal and submit the 'Request Deal Info' form. We'll send the complete package — comps, financials, photos, and documents — and answer any questions.",
  },
  {
    q: "Do you represent me as an agent?",
    a: "No. Temamila Deals is not acting as your real estate agent or financial advisor. We provide information on opportunities; you should perform your own due diligence and consult your own professionals.",
  },
  {
    q: "How often are new deals added?",
    a: "We add new inventory regularly. The best way to see deals first is to join the buyers list on our contact page.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-900">Frequently asked questions</h1>
      <dl className="mt-8 divide-y divide-slate-200">
        {FAQS.map((item) => (
          <div key={item.q} className="py-6">
            <dt className="text-lg font-semibold text-slate-900">{item.q}</dt>
            <dd className="mt-2 text-slate-700">{item.a}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
