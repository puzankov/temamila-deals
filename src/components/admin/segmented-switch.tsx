"use client";

import { useState } from "react";
import { useAutosave } from "./autosave";

/** A button-group switcher that submits the chosen value via a hidden input. */
export function SegmentedSwitch({
  name,
  options,
  defaultValue,
}: {
  name: string;
  options: { value: string; label: string; activeClass?: string }[];
  defaultValue?: string;
}) {
  const save = useAutosave();
  const [val, setVal] = useState(defaultValue ?? options[0]?.value);

  return (
    <div className="inline-flex rounded-lg border border-slate-300 bg-slate-50 p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => {
            setVal(o.value);
            save();
          }}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
            val === o.value
              ? (o.activeClass ?? "bg-brand text-white") + " shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          {o.label}
        </button>
      ))}
      <input type="hidden" name={name} value={val} />
    </div>
  );
}
