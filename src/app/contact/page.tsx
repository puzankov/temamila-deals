import { ContactForm } from "@/components/contact-form";

export const metadata = {
  title: "Contact",
  description: "Join the SmartDeal365 buyers list or get in touch.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Get on the buyers list</h1>
          <p className="mt-4 text-slate-700">
            Tell us your buy box and we&apos;ll send deals that fit before they hit
            the public site. The more we know about your target markets and
            strategy, the better the matches.
          </p>
          <div className="mt-8 space-y-2 text-sm text-slate-600">
            <p>
              <span className="font-medium text-slate-900">Email:</span>{" "}
              <a href="mailto:info@smartdeal365.com" className="text-brand-dark hover:underline">
                info@smartdeal365.com
              </a>
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 p-6 shadow-sm">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
