import { NextResponse } from "next/server";

// Lead intake endpoint.
// MVP: validates and logs the lead. Wire up email (Resend) + DB persistence next.
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const dealSlug = String(body.dealSlug ?? "").trim();

  if (!name || !email || !dealSlug) {
    return NextResponse.json(
      { error: "name, email, and dealSlug are required" },
      { status: 400 },
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const lead = {
    dealSlug,
    name,
    email,
    phone: String(body.phone ?? "").trim() || undefined,
    message: String(body.message ?? "").trim() || undefined,
    receivedAt: new Date().toISOString(),
  };

  // TODO(next): persist to DB and email notification via Resend.
  console.log("[lead] received", lead);

  return NextResponse.json({ ok: true });
}
