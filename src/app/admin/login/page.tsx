import { LoginForm } from "@/components/admin/login-form";

export const metadata = { title: "Admin sign in", robots: { index: false } };

type SearchParams = Promise<{ from?: string }>;

export default async function AdminLoginPage({ searchParams }: { searchParams: SearchParams }) {
  const { from } = await searchParams;
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4">
      <h1 className="text-2xl font-bold text-slate-900">Admin sign in</h1>
      <p className="mt-1 text-sm text-slate-500">Enter the admin password to manage deals.</p>
      <div className="mt-6">
        <LoginForm from={from && from.startsWith("/admin") ? from : "/admin"} />
      </div>
    </div>
  );
}
