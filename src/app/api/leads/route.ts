import { NextResponse } from "next/server";
import { getDb, hasDb } from "@/db";
import { leads } from "@/db/schema";

// Lead intake endpoint. Persists to Postgres when configured.
// TODO(next): email notification via Resend.
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
    phone: String(body.phone ?? "").trim() || null,
    message: String(body.message ?? "").trim() || null,
  };

  if (hasDb) {
    await getDb().insert(leads).values(lead);
  } else {
    console.log("[lead] received (no DB configured)", lead);
  }

  return NextResponse.json({ ok: true });
}
