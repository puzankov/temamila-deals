import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div className="sm:col-span-2">
          <div className="flex items-center gap-2">
            <Image src="/smartdeal-mark.png" alt="SmartDeal365" width={32} height={32} className="h-8 w-8" />
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
            <li><Link href="/about" className="hover:text-slate-900">About</Link></li>
            <li><Link href="/faq" className="hover:text-slate-900">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900">Get in touch</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><Link href="/contact" className="hover:text-slate-900">Contact us</Link></li>
            <li><a href="tel:+13212098087" className="hover:text-slate-900">(321) 209-8087</a></li>
            <li><a href="mailto:info@smartdeal365.com" className="hover:text-slate-900">info@smartdeal365.com</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-slate-500">
          © {new Date().getFullYear()} SmartDeal365. All information deemed
          reliable but not guaranteed. Not financial advice.
        </div>
      </div>
    </footer>
  );
}
