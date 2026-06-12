import { NextResponse } from "next/server";
import { sendEmail, buildDealRequestEmail, buildBuyBoxEmail } from "@/lib/mailer";
import { logDealRequest } from "@/lib/sheets";
import { COMPANY_URL } from "@/lib/config";

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
  const dealAddress = String(body.dealAddress ?? "").trim() || null;

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
      const dealUrl = `${COMPANY_URL}/deals/${dealSlug}`;
      const [mail] = await Promise.all([
        Promise.resolve(buildDealRequestEmail({ name, email, phone, dealSlug, dealAddress, message })),
        logDealRequest({ name, email, phone, dealAddress, dealSlug, dealUrl, message }),
      ]);
      await sendEmail(mail);
    }
  } catch (err) {
    console.error("[mailer] unexpected error", err);
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
