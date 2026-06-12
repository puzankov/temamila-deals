"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function CheckboxPill({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-all ${
        checked
          ? "border-brand bg-brand text-white"
          : "border-slate-200 bg-white text-slate-700 hover:border-brand hover:text-brand"
      }`}
    >
      {label}
    </button>
  );
}

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
];

const PROPERTY_TYPES = [
  "Single Family (SFR)",
  "Duplex / Triplex / Quad",
  "Multifamily (5+ units)",
  "Mobile Home",
  "RV / Park Model",
  "Land",
  "Commercial",
];

const CONDITIONS = ["Turnkey", "Light Rehab", "Heavy Rehab", "Distressed"];

const DEAL_TYPES = [
  "Cash",
  "Seller Finance",
  "Subject-To",
  "Novation",
  "Fix & Flip",
  "STR / Airbnb",
  "MTR",
  "Co-Living",
];

const FINANCING_TYPES = [
  "Cash Buyer",
  "Hard Money",
  "Conventional",
  "DSCR Loan",
  "Private Money",
];

const CLOSING_SPEEDS = [
  "7–10 days",
  "10–21 days",
  "21–30 days",
  "30–45 days",
  "45+ days",
];

const STRATEGIES = [
  "Buy & Hold",
  "Fix & Flip",
  "BRRRR",
  "Short-Term Rental (STR)",
  "Mid-Term Rental (MTR)",
  "Wholesale",
  "Co-Living",
];

const inputCls =
  "w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30";
const labelCls = "block text-sm font-medium text-slate-700 mb-1.5";
const sectionCls = "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-b border-slate-100 pb-3">
      <h2 className="text-base font-semibold text-slate-900">{children}</h2>
    </div>
  );
}

function PillGroup({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (val: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <CheckboxPill
          key={opt}
          label={opt}
          checked={selected.includes(opt)}
          onChange={() => onToggle(opt)}
        />
      ))}
    </div>
  );
}

export function BuyBoxForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");

  const [targetStates, setTargetStates] = useState<string[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [conditions, setConditions] = useState<string[]>([]);
  const [dealTypes, setDealTypes] = useState<string[]>([]);
  const [financing, setFinancing] = useState<string[]>([]);
  const [closingSpeed, setClosingSpeed] = useState<string[]>([]);
  const [strategies, setStrategies] = useState<string[]>([]);

  function toggle(arr: string[], setArr: (v: string[]) => void, val: string) {
    setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const fd = new FormData(e.currentTarget);

    const payload = {
      name: `${fd.get("firstName")} ${fd.get("lastName")}`.trim(),
      email: fd.get("email") as string,
      phone: fd.get("phone") as string,
      dealSlug: "buyers-list",
      message: JSON.stringify({
        targetStates,
        targetCities: fd.get("cities") || null,
        propertyTypes,
        conditions,
        minBeds: fd.get("minBeds") || null,
        minBaths: fd.get("minBaths") || null,
        maxPurchasePrice: fd.get("maxPrice") || null,
        maxEntryFee: fd.get("maxEntry") || null,
        dealTypes,
        financing,
        closingSpeed,
        strategies,
        source: fd.get("source") || null,
        notes: fd.get("notes") || null,
      }),
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      router.push("/buyers-list/success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Contact Info */}
      <div className={sectionCls}>
        <SectionTitle>Contact Info</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>First Name *</label>
            <input name="firstName" required className={inputCls} placeholder="Jane" />
          </div>
          <div>
            <label className={labelCls}>Last Name *</label>
            <input name="lastName" required className={inputCls} placeholder="Smith" />
          </div>
        </div>
        <div>
          <label className={labelCls}>Email *</label>
          <input name="email" type="email" required className={inputCls} placeholder="jane@example.com" />
        </div>
        <div>
          <label className={labelCls}>Phone *</label>
          <input name="phone" type="tel" required className={inputCls} placeholder="(555) 000-0000" />
        </div>
      </div>

      {/* Target Markets */}
      <div className={sectionCls}>
        <SectionTitle>Target Markets</SectionTitle>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className={`${labelCls} mb-0`}>States you buy in</label>
            <button
              type="button"
              onClick={() =>
                setTargetStates(
                  targetStates.length === US_STATES.length ? [] : [...US_STATES],
                )
              }
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition-all ${
                targetStates.length === US_STATES.length
                  ? "border-brand bg-brand text-white"
                  : "border-slate-300 text-slate-600 hover:border-brand hover:text-brand"
              }`}
            >
              {targetStates.length === US_STATES.length ? "Clear all" : "All US"}
            </button>
          </div>
          <PillGroup
            options={US_STATES}
            selected={targetStates}
            onToggle={(v) => toggle(targetStates, setTargetStates, v)}
          />
        </div>
        <div>
          <label className={labelCls}>Specific cities or zip codes</label>
          <input
            name="cities"
            className={inputCls}
            placeholder="e.g. Houston TX, 77002, Memphis TN"
          />
        </div>
      </div>

      {/* Property Preferences */}
      <div className={sectionCls}>
        <SectionTitle>Property Preferences</SectionTitle>
        <div>
          <label className={labelCls}>Property types</label>
          <PillGroup
            options={PROPERTY_TYPES}
            selected={propertyTypes}
            onToggle={(v) => toggle(propertyTypes, setPropertyTypes, v)}
          />
        </div>
        <div>
          <label className={labelCls}>Condition tolerance</label>
          <PillGroup
            options={CONDITIONS}
            selected={conditions}
            onToggle={(v) => toggle(conditions, setConditions, v)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Min bedrooms</label>
            <select name="minBeds" className={inputCls}>
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Min bathrooms</label>
            <select name="minBaths" className={inputCls}>
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="1.5">1.5+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
            </select>
          </div>
        </div>
      </div>

      {/* Deal Criteria */}
      <div className={sectionCls}>
        <SectionTitle>Deal Criteria</SectionTitle>
        <div>
          <label className={labelCls}>Deal types you buy</label>
          <PillGroup
            options={DEAL_TYPES}
            selected={dealTypes}
            onToggle={(v) => toggle(dealTypes, setDealTypes, v)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Max purchase price</label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-slate-400">
                $
              </span>
              <input
                name="maxPrice"
                type="number"
                min="0"
                className={`${inputCls} pl-7`}
                placeholder="500,000"
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>Max entry fee / cash to close</label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-slate-400">
                $
              </span>
              <input
                name="maxEntry"
                type="number"
                min="0"
                className={`${inputCls} pl-7`}
                placeholder="50,000"
              />
            </div>
          </div>
        </div>
        <div>
          <label className={labelCls}>Financing method</label>
          <PillGroup
            options={FINANCING_TYPES}
            selected={financing}
            onToggle={(v) => toggle(financing, setFinancing, v)}
          />
        </div>
        <div>
          <label className={labelCls}>Typical closing speed</label>
          <PillGroup
            options={CLOSING_SPEEDS}
            selected={closingSpeed}
            onToggle={(v) => toggle(closingSpeed, setClosingSpeed, v)}
          />
        </div>
      </div>

      {/* Investment Strategy */}
      <div className={sectionCls}>
        <SectionTitle>Investment Strategy</SectionTitle>
        <PillGroup
          options={STRATEGIES}
          selected={strategies}
          onToggle={(v) => toggle(strategies, setStrategies, v)}
        />
      </div>

      {/* Additional */}
      <div className={sectionCls}>
        <SectionTitle>Anything Else?</SectionTitle>
        <div>
          <label className={labelCls}>How did you hear about us?</label>
          <select name="source" className={inputCls}>
            <option value="">Select one</option>
            <option>Google / Search</option>
            <option>Social Media</option>
            <option>Referral from a friend</option>
            <option>Podcast / YouTube</option>
            <option>Real estate group or meetup</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Additional notes</label>
          <textarea
            name="notes"
            rows={3}
            className={inputCls}
            placeholder="Anything else we should know about your buy box?"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="brand-gradient w-full rounded-xl px-6 py-4 text-base font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-60"
      >
        {status === "submitting" ? "Submitting…" : "Submit My Buy Box →"}
      </button>

      {status === "error" && (
        <p className="text-center text-sm text-red-600">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
