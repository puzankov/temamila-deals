import Image from "next/image";
import Link from "next/link";
import {
  COMPANY_NAME,
  COMPANY_DISCLAIMER,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_TEL,
} from "@/lib/config";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div className="sm:col-span-2">
          <div className="flex items-center gap-2">
            <Image src="/smartdeal-mark.png" alt={COMPANY_NAME} width={32} height={32} className="h-8 w-8" />
            <span className="text-lg font-bold text-navy">
              SmartDeal<span className="text-brand">365</span>
            </span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-slate-600">
            Curated off-market and creative-finance real estate deals. New
            inventory added regularly.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900">Explore</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><Link href="/deals" className="hover:text-slate-900">All Deals</Link></li>
            <li><Link href="/buyers-list" className="hover:text-slate-900">Buyers List</Link></li>
            <li><Link href="/about" className="hover:text-slate-900">About</Link></li>
            <li><Link href="/faq" className="hover:text-slate-900">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900">Get in touch</h3>
          <ul className="mt-3 space-y-3 text-sm text-slate-600">
            <li>
              <a href={`tel:${CONTACT_PHONE_TEL}`} className="flex items-center gap-2 hover:text-slate-900">
                <svg className="h-4 w-4 shrink-0 text-brand" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.47 11.47 0 003.58.57 1 1 0 011 1V21a1 1 0 01-1 1A17 17 0 013 5a1 1 0 011-1h3.5a1 1 0 011 1 11.47 11.47 0 00.57 3.58 1 1 0 01-.25 1.01l-2.2 2.2z" />
                </svg>
                {CONTACT_PHONE}
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-2 hover:text-slate-900">
                <svg className="h-4 w-4 shrink-0 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {CONTACT_EMAIL}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-slate-500">
          © {new Date().getFullYear()} {COMPANY_NAME}. {COMPANY_DISCLAIMER}
        </div>
      </div>
    </footer>
  );
}
