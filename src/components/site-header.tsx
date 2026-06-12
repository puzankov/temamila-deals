import Image from "next/image";
import Link from "next/link";

const NAV = [
  { href: "/deals", label: "Deals" },
  { href: "/buyers-list", label: "Buyers List" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
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

        <nav className="hidden items-center gap-6 sm:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/deals"
          className="brand-gradient rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          Browse Deals
        </Link>
      </div>
    </header>
  );
}
