import Link from "next/link";

export const metadata = {
  title: "You're on the List!",
};

export default function BuyersListSuccessPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-16">
      <div className="w-full max-w-lg text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand/10">
          <svg
            className="h-10 w-10 text-brand"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-slate-900">You&apos;re on the list!</h1>
        <p className="mt-4 text-lg text-slate-600">
          Your buy box has been saved. We&apos;ll reach out as soon as we have
          deals that match your criteria.
        </p>

        {/* Next steps */}
        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-left space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            What happens next
          </h2>
          <div className="space-y-3">
            {[
              {
                step: "1",
                title: "We review your buy box",
                body: "Our team looks at your criteria and flags deals that are a strong match.",
              },
              {
                step: "2",
                title: "You get an early alert",
                body: "Matched deals land in your inbox before they hit the public site.",
              },
              {
                step: "3",
                title: "You move fast",
                body: "The best deals go quickly — being on the list means you see them first.",
              },
            ].map(({ step, title, body }) => (
              <div key={step} className="flex gap-4">
                <div className="brand-gradient flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
                  {step}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{title}</p>
                  <p className="text-sm text-slate-600">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/deals"
            className="brand-gradient rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            Browse Current Deals
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
