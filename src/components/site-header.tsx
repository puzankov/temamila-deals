import Image from "next/image";
import Link from "next/link";
import { CONTACT_PHONE, CONTACT_PHONE_TEL } from "@/lib/config";

const NAV = [
  { href: "/deals", label: "Browse Deals", highlight: true },
  { href: "/buyers-list", label: "Buyers List", highlight: false },
  { href: "/about", label: "About", highlight: false },
  { href: "/faq", label: "FAQ", highlight: false },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/smartdeal-mark.png"
            alt="SmartDeal365"
            width={36}
            height={36}
            priority
            className="h-9 w-9"
          />
          <span className="text-lg font-bold tracking-tight text-navy">
            SmartDeal<span className="text-brand">365</span>
          </span>
        </Link>

        {/* Right: nav + phone */}
        <div className="hidden items-center gap-4 sm:flex">
          <nav className="flex items-center gap-1">
            {NAV.map((item) =>
              item.highlight ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className="brand-gradient ml-1 rounded-full px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                >
                  {item.label}
                </Link>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          <a
            href={`tel:${CONTACT_PHONE_TEL}`}
            className="flex items-center gap-1.5 text-sm font-semibold text-brand-dark transition hover:text-brand"
          >
            <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.47 11.47 0 003.58.57 1 1 0 011 1V21a1 1 0 01-1 1A17 17 0 013 5a1 1 0 011-1h3.5a1 1 0 011 1 11.47 11.47 0 00.57 3.58 1 1 0 01-.25 1.01l-2.2 2.2z" />
            </svg>
            {CONTACT_PHONE}
          </a>
        </div>
      </div>
    </header>
  );
}
