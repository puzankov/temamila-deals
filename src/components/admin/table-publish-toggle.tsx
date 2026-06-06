"use client";

import { useState, useTransition } from "react";
import { setPublishedAction } from "@/app/admin/actions";

export function TablePublishToggle({ id, published }: { id: string; published: boolean }) {
  const [on, setOn] = useState(published);
  const [pending, startTransition] = useTransition();

  function toggle() {
    const next = !on;
    setOn(next); // optimistic
    startTransition(async () => {
      try {
        await setPublishedAction(id, next);
      } catch {
        setOn(!next); // revert on failure
      }
    });
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={toggle}
      disabled={pending}
      title={on ? "Published — click to unpublish" : "Draft — click to publish"}
      className="inline-flex items-center gap-2 disabled:opacity-60"
    >
      <span
        className={`relative h-5 w-9 rounded-full transition ${on ? "bg-brand" : "bg-slate-300"}`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${
            on ? "left-4" : "left-0.5"
          }`}
        />
      </span>
      <span className={`text-xs font-medium ${on ? "text-brand-dark" : "text-slate-500"}`}>
        {on ? "Live" : "Draft"}
      </span>
    </button>
  );
}
