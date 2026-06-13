import "server-only";

function csv(val: unknown): string {
  if (Array.isArray(val)) return val.join(", ");
  if (val === null || val === undefined) return "";
  return String(val);
}

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

export async function logBuyBoxSubmission(data: {
  name: string;
  email: string;
  phone: string | null;
  buyBox: Record<string, unknown>;
}): Promise<void> {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_BUYBOX;
  if (!webhookUrl) {
    console.warn("[sheets] GOOGLE_SHEETS_WEBHOOK_BUYBOX not set — skipping");
    return;
  }

  const b = data.buyBox;
  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      timestamp: new Date().toLocaleString("en-US", { timeZone: "America/New_York" }),
      name: data.name,
      email: data.email,
      phone: data.phone ?? "",
      states: csv(b.targetStates),
      cities: csv(b.targetCities),
      propertyTypes: csv(b.propertyTypes),
      conditions: csv(b.conditions),
      minBeds: csv(b.minBeds),
      minBaths: csv(b.minBaths),
      maxPrice: csv(b.maxPurchasePrice),
      maxEntry: csv(b.maxEntryFee),
      dealTypes: csv(b.dealTypes),
      financing: csv(b.financing),
      closingSpeed: csv(b.closingSpeed),
      strategies: csv(b.strategies),
      source: csv(b.source),
      notes: csv(b.notes),
    }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    console.error("[sheets] buy box webhook error", res.status, err);
  }
}
