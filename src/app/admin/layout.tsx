import Link from "next/link";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/auth";
import { logout } from "./actions";

export const metadata = { robots: { index: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  const authed = await verifySessionToken(token);

  return (
    <div>
      {authed && (
        <div className="border-b border-slate-200 bg-slate-900 text-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <div className="flex items-center gap-4 text-sm">
              <Link href="/admin" className="font-semibold">Admin</Link>
              <Link href="/admin/deals/new" className="text-slate-300 hover:text-white">New deal</Link>
              <Link href="/" className="text-slate-300 hover:text-white">View site ↗</Link>
            </div>
            <form action={logout}>
              <button className="text-sm text-slate-300 hover:text-white" type="submit">
                Log out
              </button>
            </form>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
