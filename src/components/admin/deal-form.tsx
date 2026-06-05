"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { ActionState } from "@/app/admin/actions";
import { DEAL_STATUSES, DEAL_TYPES, type Deal } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/format";

type Action = (prev: ActionState, formData: FormData) => Promise<ActionState>;

const inputCls =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30";

export function DealForm({
  action,
  deal,
  submitLabel,
}: {
  action: Action;
  deal?: Deal;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, {});

  return (
    <form action={formAction} className="space-y-8">
      {/* Location */}
      <Section title="Location">
        <Field label="Street address" name="address" defaultValue={deal?.address} required className="sm:col-span-2" />
        <Field label="City" name="city" defaultValue={deal?.city} required />
        <Field label="State" name="state" defaultValue={deal?.state} required placeholder="FL" />
        <Field label="ZIP" name="zip" defaultValue={deal?.zip} />
        <Field label="Slug (optional)" name="slug" defaultValue={deal?.slug} placeholder="auto-generated" className="sm:col-span-2" />
        <Field label="Latitude (optional)" name="lat" defaultValue={deal?.lat} type="number" step="any" />
        <Field label="Longitude (optional)" name="lng" defaultValue={deal?.lng} type="number" step="any" />
      </Section>

      {/* Property facts */}
      <Section title="Property">
        <Field label="Beds" name="beds" defaultValue={deal?.beds} type="number" />
        <Field label="Baths" name="baths" defaultValue={deal?.baths} type="number" step="0.5" />
        <Field label="Sqft" name="sqft" defaultValue={deal?.sqft} type="number" />
      </Section>

      {/* Financials */}
      <Section title="Financials (whole dollars)">
        <Field label="Purchase price" name="purchasePrice" defaultValue={deal?.purchasePrice} type="number" required />
        <Field label="Entry fee" name="entryFee" defaultValue={deal?.entryFee} type="number" />
        <Field label="Interest rate %" name="interestRate" defaultValue={deal?.interestRate} type="number" step="any" />
        <Field label="Monthly payment" name="monthlyPayment" defaultValue={deal?.monthlyPayment} type="number" />
      </Section>

      {/* Presentation */}
      <Section title="Listing">
        <div className="sm:col-span-3">
          <span className="text-sm font-medium text-slate-700">Deal types</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {DEAL_TYPES.map((t) => (
              <label
                key={t}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-300 px-3 py-1.5 text-sm has-[:checked]:border-brand has-[:checked]:bg-brand-tint"
              >
                <input
                  type="checkbox"
                  name="dealTypes"
                  value={t}
                  defaultChecked={deal?.dealTypes.includes(t)}
                  className="accent-brand"
                />
                {t}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Status</label>
          <select name="status" defaultValue={deal?.status ?? "available"} className={inputCls}>
            {DEAL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>

        <label className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-slate-700">
          <input type="checkbox" name="featured" defaultChecked={deal?.featured} className="accent-brand" />
          Featured on homepage
        </label>

        <div className="sm:col-span-3">
          <label className="text-sm font-medium text-slate-700">Description</label>
          <textarea name="description" rows={4} defaultValue={deal?.description} className={inputCls} />
        </div>

        <div className="sm:col-span-3">
          <label className="text-sm font-medium text-slate-700">Image URLs (one per line)</label>
          <textarea
            name="images"
            rows={3}
            defaultValue={deal?.images.join("\n")}
            placeholder="https://…/photo-1.jpg"
            className={`${inputCls} font-mono text-xs`}
          />
        </div>
      </Section>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="brand-gradient rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Saving…" : submitLabel}
        </button>
        <Link href="/admin" className="text-sm text-slate-500 hover:text-slate-800">
          Cancel
        </Link>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-slate-900">{title}</legend>
      <div className="mt-3 grid gap-4 sm:grid-cols-3">{children}</div>
    </fieldset>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required,
  placeholder,
  step,
  className,
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  type?: string;
  required?: boolean;
  placeholder?: string;
  step?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <input
        name={name}
        type={type}
        step={step}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue ?? ""}
        className={inputCls}
      />
    </div>
  );
}
