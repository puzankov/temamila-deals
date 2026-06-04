import Link from "next/link";

const NAV = [
  { href: "/deals", label: "Deals" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="brand-gradient flex h-8 w-8 items-center justify-center rounded-lg font-bold text-white">
            T
          </span>
          <span className="text-lg font-bold tracking-tight">
            Temamila <span className="text-gradient">Deals</span>
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
