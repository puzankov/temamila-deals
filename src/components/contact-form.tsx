"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, dealSlug: "buyers-list" }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
        <p className="font-semibold text-emerald-800">You&apos;re on the list!</p>
        <p className="mt-1 text-sm text-emerald-700">We&apos;ll be in touch with new deals soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input name="name" required placeholder="Your name"
        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30" />
      <input name="email" type="email" required placeholder="Email"
        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30" />
      <input name="phone" type="tel" placeholder="Phone (optional)"
        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30" />
      <textarea name="message" rows={4} placeholder="Tell us your buy box — markets, budget, and strategy."
        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30" />
      <button type="submit" disabled={status === "submitting"}
        className="brand-gradient w-full rounded-lg px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-60">
        {status === "submitting" ? "Sending…" : "Join the buyers list"}
      </button>
      {status === "error" && <p className="text-sm text-red-600">Something went wrong. Please try again.</p>}
    </form>
  );
}
