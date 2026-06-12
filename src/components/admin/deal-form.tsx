"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AddressAutocomplete } from "./address-autocomplete";
import { AutosaveContext } from "./autosave";
import { ImageUploader } from "./image-uploader";
import { QuickNumber } from "./quick-number";
import { RichTextEditor } from "./rich-text-editor";
import { SegmentedSwitch } from "./segmented-switch";
import { DEAL_STATUSES, DEAL_TYPES, type Deal } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/format";

const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30";

type SaveStatus = "idle" | "saving" | "saved" | "error";

export function DealForm({ deal }: { deal?: Deal }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const idRef = useRef<string | null>(deal?.id ?? null);
  const savingRef = useRef(false);
  const pendingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveRef = useRef<() => void>(() => {});

  const [status, setStatus] = useState<SaveStatus>("idle");

  // Plain functions (recreated each render) that only read refs + stable setters,
  // so they're always correct regardless of closure age.
  async function runSave() {
    if (!formRef.current) return;
    if (savingRef.current) {
      pendingRef.current = true;
      return;
    }
    savingRef.current = true;
    setStatus("saving");
    try {
      const fd = new FormData(formRef.current);
      if (idRef.current) fd.set("id", idRef.current);
      const res = await fetch("/api/admin/deals/save", { method: "POST", body: fd });
      if (!res.ok) throw new Error("save failed");
      const data: { id: string } = await res.json();
      if (data.id && !idRef.current) {
        idRef.current = data.id;
        // Bind the URL to the new draft so a refresh keeps editing it.
        window.history.replaceState(null, "", `/admin/deals/${data.id}/edit`);
      }
      setStatus("saved");
    } catch {
      setStatus("error");
    } finally {
      savingRef.current = false;
      if (pendingRef.current) {
        pendingRef.current = false;
        runSave();
      }
    }
  }

  function scheduleSave() {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(runSave, 400);
  }

  async function finishEditing() {
    if (timerRef.current) clearTimeout(timerRef.current);
    await runSave();
    router.push("/admin");
  }

  // Stable callback for context so child effects don't re-run each render.
  useEffect(() => {
    saveRef.current = scheduleSave;
  });
  const stableSave = useCallback(() => saveRef.current(), []);

  return (
    <AutosaveContext.Provider value={stableSave}>
      <form
        ref={formRef}
        onSubmit={(e) => e.preventDefault()}
        onBlur={scheduleSave}
        className="space-y-6 pb-24"
      >
        <input type="hidden" name="id" defaultValue={deal?.id ?? ""} />

        <Card title="Location">
          <AddressAutocomplete initial={deal} />
        </Card>

        <Card title="Property">
          <div className="flex flex-wrap items-start gap-x-8 gap-y-4">
            <QuickNumber name="beds" label="Beds" defaultValue={deal?.beds} min={0} max={50} />
            <QuickNumber name="baths" label="Baths" defaultValue={deal?.baths} step="0.5" min={0} max={20} />
            <div className="w-24">
              <Num label="Sqft" name="sqft" value={deal?.sqft} min={1} />
            </div>
            <div className="w-28">
              <Num label="Year Built" name="yearBuilt" value={deal?.yearBuilt} min={1900} max={new Date().getFullYear() + 5} />
            </div>
          </div>
        </Card>

        <Card title="Financials">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Num label="Purchase $" name="purchasePrice" value={deal?.purchasePrice} min={0} />
            <Num label="Entry fee $" name="entryFee" value={deal?.entryFee} min={0} />
            <Num label="Rate %" name="interestRate" value={deal?.interestRate} step="any" min={0} max={100} />
            <Num label="Monthly $" name="monthlyPayment" value={deal?.monthlyPayment} min={0} />
          </div>
        </Card>

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
                    onChange={scheduleSave}
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
              <input
                type="checkbox"
                name="featured"
                defaultChecked={deal?.featured}
                onChange={scheduleSave}
                className="accent-brand"
              />
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
            <label className="text-xs text-slate-500">Photos</label>
            <div className="mt-1">
              <ImageUploader name="images" initial={deal?.images} />
            </div>
          </div>

          <div className="mt-4">
            <label className="text-xs text-slate-500">Zillow URL (optional)</label>
            <input
              name="zillowUrl"
              type="url"
              defaultValue={deal?.zillowUrl ?? ""}
              placeholder="https://www.zillow.com/homes/..."
              className={`mt-1 ${inputCls}`}
            />
          </div>

          <div className="mt-4">
            <label className="text-xs text-slate-500">Direct Contact Phone (optional — overrides default button)</label>
            <input
              name="directPhone"
              type="tel"
              defaultValue={deal?.directPhone ?? ""}
              placeholder="(321) 000-0000"
              className={`mt-1 ${inputCls}`}
            />
          </div>
        </Card>

        <details className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">
          <summary className="cursor-pointer font-medium text-slate-600">Advanced</summary>
          <div className="mt-3">
            <label className="text-xs text-slate-500">URL slug (auto-generated if blank)</label>
            <input name="slug" defaultValue={deal?.slug} placeholder="auto" className={`mt-1 ${inputCls}`} />
          </div>
        </details>

        {/* Sticky bar: autosave status + publish toggle + done */}
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3">
            <SaveIndicator status={status} onRetry={runSave} />
            <div className="flex items-center gap-4">
              <PublishToggle defaultChecked={deal?.published ?? false} onChange={scheduleSave} />
              <button
                type="button"
                onClick={finishEditing}
                className="brand-gradient rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </form>
    </AutosaveContext.Provider>
  );
}

function SaveIndicator({ status, onRetry }: { status: SaveStatus; onRetry: () => void }) {
  if (status === "saving") {
    return (
      <span className="flex items-center gap-2 text-sm text-slate-500">
        <Spinner /> Saving…
      </span>
    );
  }
  if (status === "saved") {
    return <span className="text-sm text-brand-dark">✓ All changes saved</span>;
  }
  if (status === "error") {
    return (
      <span className="flex items-center gap-2 text-sm text-red-600">
        Save failed
        <button type="button" onClick={onRetry} className="underline">
          Retry
        </button>
      </span>
    );
  }
  return <span className="text-sm text-slate-400">Changes save automatically</span>;
}

function PublishToggle({
  defaultChecked,
  onChange,
}: {
  defaultChecked: boolean;
  onChange: () => void;
}) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
      <input
        type="checkbox"
        name="published"
        checked={on}
        onChange={(e) => {
          setOn(e.target.checked);
          onChange();
        }}
        className="peer sr-only"
      />
      <span className="relative h-5 w-9 rounded-full bg-slate-300 transition peer-checked:bg-brand">
        <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-4" />
      </span>
      {on ? "Published" : "Draft"}
    </label>
  );
}

function Spinner() {
  return (
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-brand" />
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
  step,
  min,
  max,
}: {
  label: string;
  name: string;
  value?: number;
  step?: string;
  min?: number;
  max?: number;
}) {
  return (
    <div>
      <label className="text-xs text-slate-500">{label}</label>
      <input name={name} type="number" step={step} min={min} max={max} defaultValue={value ?? ""} className={inputCls} />
    </div>
  );
}
