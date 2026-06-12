"use client";

import { useState } from "react";
import { useAutosave } from "./autosave";

function btnCls(active: boolean) {
  return `flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-sm font-medium transition ${
    active
      ? "border-brand bg-brand text-white"
      : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
  }`;
}

/**
 * Quick-pick number input: preset buttons (e.g. 1–5) plus a "custom" toggle
 * that reveals a manual field for any other value. Submits via a hidden input.
 */
export function QuickNumber({
  name,
  label,
  defaultValue,
  options = [1, 2, 3, 4, 5],
  step,
  min,
  max,
}: {
  name: string;
  label: string;
  defaultValue?: number;
  options?: number[];
  step?: string;
  min?: number;
  max?: number;
}) {
  const save = useAutosave();
  const presets = new Set(options);
  const initial = defaultValue ?? null;
  const [value, setValue] = useState<number | null>(initial);
  const [manual, setManual] = useState(initial != null && !presets.has(initial));

  return (
    <div>
      <label className="text-xs text-slate-500">{label}</label>
      <div className="mt-1 flex flex-wrap items-center gap-1.5">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => {
              setValue(o);
              setManual(false);
              save();
            }}
            className={btnCls(!manual && value === o)}
          >
            {o}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setManual(true)}
          aria-label={`Custom ${label.toLowerCase()}`}
          className={btnCls(manual)}
        >
          {manual ? "Custom" : "···"}
        </button>
        {manual && (
          <input
            type="number"
            step={step}
            min={min}
            max={max}
            autoFocus
            value={value ?? ""}
            onChange={(e) => setValue(e.target.value === "" ? null : Number(e.target.value))}
            placeholder="—"
            className="h-9 w-20 rounded-lg border border-slate-300 px-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
          />
        )}
      </div>
      <input type="hidden" name={name} value={value ?? ""} />
    </div>
  );
}
