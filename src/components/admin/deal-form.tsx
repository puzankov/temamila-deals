"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { ActionState } from "@/app/admin/actions";
import { AddressAutocomplete } from "./address-autocomplete";
import { QuickNumber } from "./quick-number";
import { RichTextEditor } from "./rich-text-editor";
import { SegmentedSwitch } from "./segmented-switch";
import { DEAL_STATUSES, DEAL_TYPES, type Deal } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/format";

type Action = (prev: ActionState, formData: FormData) => Promise<ActionState>;

const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30";

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
    <form action={formAction} className="space-y-6 pb-24">
      {/* Address — smart autocomplete */}
      <Card title="Location">
        <AddressAutocomplete initial={deal} />
      </Card>

      {/* Property — quick-pick beds/baths, all on one line */}
      <Card title="Property">
        <div className="flex flex-wrap items-start gap-x-8 gap-y-4">
          <QuickNumber name="beds" label="Beds" defaultValue={deal?.beds} />
          <QuickNumber name="baths" label="Baths" defaultValue={deal?.baths} step="0.5" />
          <div className="w-24">
            <Num label="Sqft" name="sqft" value={deal?.sqft} />
          </div>
        </div>
      </Card>

      <Card title="Financials">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Num label="Purchase $" name="purchasePrice" value={deal?.purchasePrice} required />
          <Num label="Entry fee $" name="entryFee" value={deal?.entryFee} />
          <Num label="Rate %" name="interestRate" value={deal?.interestRate} step="any" />
          <Num label="Monthly $" name="monthlyPayment" value={deal?.monthlyPayment} />
        </div>
      </Card>

      {/* Listing details */}
      <Card title="Listing">
        <div>
          <span className="text-xs text-slate-500">Deal types</span>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {DEAL_TYPES.map((t) => (
              <label
                key={t}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-300 px-2.5 py-1 text-xs has-[:checked]:border-brand has-[:checked]:bg-brand-tint has-[:checked]:text-brand-dark"
              >
                <input
                  type="checkbox"
                  name="dealTypes"
                  value={t}
                  defaultChecked={deal?.dealTypes.includes(t)}
                  className="sr-only"
                />
                {t}
              </label>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-end gap-x-6 gap-y-3">
          <div>
            <label className="text-xs text-slate-500">Status</label>
            <div className="mt-1">
              <SegmentedSwitch
                name="status"
                defaultValue={deal?.status ?? "available"}
                options={DEAL_STATUSES.map((s) => ({ value: s, label: STATUS_LABELS[s] }))}
              />
            </div>
          </div>
          <label className="flex items-center gap-2 pb-2 text-sm font-medium text-slate-700">
            <input type="checkbox" name="featured" defaultChecked={deal?.featured} className="accent-brand" />
            <span className="text-amber-500">★</span>
            Featured
          </label>
        </div>

        <div className="mt-4">
          <label className="text-xs text-slate-500">Description</label>
          <div className="mt-1">
            <RichTextEditor name="description" defaultValue={deal?.description} />
          </div>
        </div>

        <div className="mt-4">
          <label className="text-xs text-slate-500">Image URLs (one per line)</label>
          <textarea
            name="images"
            rows={2}
            defaultValue={deal?.images.join("\n")}
            placeholder="https://…/photo-1.jpg"
            className={`mt-1 font-mono text-xs ${inputCls}`}
          />
        </div>
      </Card>

      {/* Rarely-touched fields tucked away */}
      <details className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">
        <summary className="cursor-pointer font-medium text-slate-600">Advanced</summary>
        <div className="mt-3">
          <label className="text-xs text-slate-500">URL slug (auto-generated if blank)</label>
          <input name="slug" defaultValue={deal?.slug} placeholder="auto" className={`mt-1 ${inputCls}`} />
        </div>
      </details>

      {/* Sticky save bar */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3">
          <span className="text-sm text-red-600">{state.error}</span>
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-sm text-slate-500 hover:text-slate-800">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={pending}
              className="brand-gradient rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-60"
            >
              {pending ? "Saving…" : submitLabel}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">{title}</h2>
      {children}
    </section>
  );
}

function Num({
  label,
  name,
  value,
  required,
  step,
}: {
  label: string;
  name: string;
  value?: number;
  required?: boolean;
  step?: string;
}) {
  return (
    <div>
      <label className="text-xs text-slate-500">{label}</label>
      <input
        name={name}
        type="number"
        step={step}
        required={required}
        defaultValue={value ?? ""}
        className={inputCls}
      />
    </div>
  );
}
