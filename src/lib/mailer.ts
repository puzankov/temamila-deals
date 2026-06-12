import {
  COMPANY_NAME,
  COMPANY_URL,
  COMPANY_LOGO_DARK_URL,
  COMPANY_DISCLAIMER,
  CONTACT_EMAIL,
  CONTACT_PHONE,
} from "./config";

const MAILERSEND_URL = "https://api.mailersend.com/v1/email";

// ── Transport ────────────────────────────────────────────────────────────────

export async function sendEmail({
  subject,
  html,
  text,
}: {
  subject: string;
  html: string;
  text: string;
}) {
  const apiKey = process.env.MAILERSEND_API;
  if (!apiKey) {
    console.warn("[mailer] MAILERSEND_API not set — skipping email");
    return;
  }

  const res = await fetch(MAILERSEND_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: { email: CONTACT_EMAIL, name: COMPANY_NAME },
      to: [{ email: CONTACT_EMAIL, name: COMPANY_NAME }],
      subject,
      html,
      text,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error("[mailer] MailerSend error", res.status, body);
  }
}

// ── HTML base template ───────────────────────────────────────────────────────

function emailBase({
  preheader,
  title,
  subtitle,
  body,
}: {
  preheader: string;
  title: string;
  subtitle: string;
  body: string;
}) {
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <!-- preheader (hidden preview text) -->
  <span style="display:none;max-height:0;overflow:hidden">${preheader}&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌</span>

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 16px">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
          style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.07)">

          <!-- ── Header ── -->
          <tr>
            <td style="background:#041f48;padding:28px 36px">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align:middle">
                    <img src="${COMPANY_LOGO_DARK_URL}" height="44" alt="${COMPANY_NAME}"
                      style="display:block;border-radius:8px" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── Title band ── -->
          <tr>
            <td style="background:#f8fffe;border-bottom:1px solid #e2e8f0;padding:24px 36px">
              <h1 style="margin:0 0 4px;font-size:20px;font-weight:700;color:#0f172a">${title}</h1>
              <p style="margin:0;font-size:14px;color:#64748b">${subtitle}</p>
            </td>
          </tr>

          <!-- ── Body ── -->
          <tr>
            <td style="padding:28px 36px">
              ${body}
            </td>
          </tr>

          <!-- ── Footer ── -->
          <tr>
            <td style="background:#f8fafc;border-top:2px solid #e2e8f0;padding:20px 36px;text-align:center">
              <p style="margin:0 0 4px;font-size:13px;color:#475569">
                <a href="mailto:${CONTACT_EMAIL}" style="color:#089f48;text-decoration:none">${CONTACT_EMAIL}</a>
                &nbsp;·&nbsp;
                <a href="tel:${CONTACT_PHONE.replace(/\D/g, "").replace(/^/, "+1")}" style="color:#089f48;text-decoration:none">${CONTACT_PHONE}</a>
              </p>
              <p style="margin:0;font-size:11px;color:#94a3b8">
                © ${year} <a href="${COMPANY_URL}" style="color:#94a3b8;text-decoration:none">${COMPANY_NAME}</a>
                &nbsp;·&nbsp; ${COMPANY_DISCLAIMER}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ── Row helper (reused in both templates) ────────────────────────────────────

function tableRows(rows: [string, string][]) {
  return rows
    .map(
      ([label, value], i) => `
    <tr>
      <td style="padding:10px 14px;background:${i % 2 === 0 ? "#f8fafc" : "#ffffff"};border:1px solid #e2e8f0;font-size:13px;font-weight:600;color:#475569;width:38%;white-space:nowrap;vertical-align:top">
        ${label}
      </td>
      <td style="padding:10px 14px;background:${i % 2 === 0 ? "#f8fafc" : "#ffffff"};border:1px solid #e2e8f0;font-size:13px;color:#0f172a;vertical-align:top">
        ${value}
      </td>
    </tr>`,
    )
    .join("");
}

function fmt(val: unknown): string {
  if (Array.isArray(val)) return val.length ? val.join(", ") : "—";
  if (val === null || val === undefined || val === "") return "—";
  return String(val);
}

// ── Deal request email ───────────────────────────────────────────────────────

export function buildDealRequestEmail(data: {
  name: string;
  email: string;
  phone: string | null;
  dealSlug: string;
  dealAddress: string | null;
  message: string | null;
}) {
  const displayAddress = data.dealAddress || data.dealSlug;
  const dealUrl = `${COMPANY_URL}/deals/${data.dealSlug}`;
  const subject = `🏠 New deal request — ${displayAddress}`;

  const rows: [string, string][] = [
    ["Name", data.name],
    ["Email", `<a href="mailto:${data.email}" style="color:#089f48">${data.email}</a>`],
    ["Phone", data.phone ? `<a href="tel:${data.phone.replace(/\D/g, "").replace(/^/, "+1")}" style="color:#089f48">${data.phone}</a>` : "—"],
    ["Deal", `<a href="${dealUrl}" style="color:#089f48">${displayAddress}</a>`],
    ["Message", data.message || "—"],
  ];

  const body = `
    <p style="margin:0 0 16px;font-size:14px;color:#334155">
      A buyer just requested full deal info. Here are their details:
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-radius:8px;overflow:hidden">
      ${tableRows(rows)}
    </table>`;

  const html = emailBase({
    preheader: `New deal request from ${data.name} for ${displayAddress}`,
    title: displayAddress,
    subtitle: `<strong>${data.name}</strong> is interested in this deal`,
    body,
  });

  const text = [
    `NEW DEAL REQUEST`,
    `Deal: ${data.dealSlug}`,
    `---`,
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || "—"}`,
    `Message: ${data.message || "—"}`,
  ].join("\n");

  return { subject, html, text };
}

// ── Buy box email ────────────────────────────────────────────────────────────

export function buildBuyBoxEmail(data: {
  name: string;
  email: string;
  phone: string | null;
  buyBox: Record<string, unknown>;
}) {
  const subject = `📋 New buy box — ${data.name}`;

  const b = data.buyBox;
  const rows: [string, string][] = [
    ["Name", data.name],
    ["Email", `<a href="mailto:${data.email}" style="color:#089f48">${data.email}</a>`],
    ["Phone", data.phone ? `<a href="tel:${data.phone.replace(/\D/g, "").replace(/^/, "+1")}" style="color:#089f48">${data.phone}</a>` : "—"],
    ["Target states", fmt(b.targetStates)],
    ["Cities / zip codes", fmt(b.targetCities)],
    ["Property types", fmt(b.propertyTypes)],
    ["Condition", fmt(b.conditions)],
    ["Min beds", fmt(b.minBeds)],
    ["Min baths", fmt(b.minBaths)],
    ["Max purchase price", b.maxPurchasePrice ? `$${Number(b.maxPurchasePrice).toLocaleString()}` : "—"],
    ["Max entry fee", b.maxEntryFee ? `$${Number(b.maxEntryFee).toLocaleString()}` : "—"],
    ["Deal types", fmt(b.dealTypes)],
    ["Financing", fmt(b.financing)],
    ["Closing speed", fmt(b.closingSpeed)],
    ["Strategies", fmt(b.strategies)],
    ["How they heard", fmt(b.source)],
    ["Notes", fmt(b.notes)],
  ];

  const body = `
    <p style="margin:0 0 16px;font-size:14px;color:#334155">
      A new buyer just submitted their buy box criteria. Here's everything they shared:
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-radius:8px;overflow:hidden">
      ${tableRows(rows)}
    </table>`;

  const html = emailBase({
    preheader: `Buy box from ${data.name} — ${fmt(b.targetStates)} · ${fmt(b.strategies)}`,
    title: "New Buy Box Submission",
    subtitle: `<strong>${data.name}</strong> just submitted their buyer criteria`,
    body,
  });

  const text = rows.map(([l, v]) => `${l}: ${v.replace(/<[^>]+>/g, "")}`).join("\n");

  return { subject, html, text };
}
