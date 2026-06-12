import { NextResponse } from "next/server";
import { sendEmail, buildDealRequestEmail, buildBuyBoxEmail } from "@/lib/mailer";

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

  const phone = String(body.phone ?? "").trim() || null;
  const message = String(body.message ?? "").trim() || null;

  try {
    if (dealSlug === "buyers-list") {
      let buyBox: Record<string, unknown> = {};
      try {
        buyBox = message ? JSON.parse(message) : {};
      } catch {
        buyBox = { raw: message };
      }
      const mail = buildBuyBoxEmail({ name, email, phone, buyBox });
      await sendEmail(mail);
    } else {
      const mail = buildDealRequestEmail({ name, email, phone, dealSlug, message });
      await sendEmail(mail);
    }
  } catch (err) {
    console.error("[mailer] unexpected error", err);
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
