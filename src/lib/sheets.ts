import "server-only";

export async function logDealRequest(data: {
  name: string;
  email: string;
  phone: string | null;
  dealAddress: string | null;
  dealSlug: string;
  dealUrl: string;
  message: string | null;
}): Promise<void> {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_DEALS;
  if (!webhookUrl) {
    console.warn("[sheets] GOOGLE_SHEETS_WEBHOOK_DEALS not set — skipping");
    return;
  }

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      timestamp: new Date().toLocaleString("en-US", { timeZone: "America/New_York" }),
      name: data.name,
      email: data.email,
      phone: data.phone ?? "",
      dealAddress: data.dealAddress ?? data.dealSlug,
      dealUrl: data.dealUrl,
      message: data.message ?? "",
    }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    console.error("[sheets] webhook error", res.status, err);
  }
}
