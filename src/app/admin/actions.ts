"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createDeal, deleteDeal, getDealBySlug, updateDeal } from "@/lib/deals";
import {
  ADMIN_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  checkPassword,
  createSessionToken,
} from "@/lib/auth";
import { DEAL_TYPES, DEAL_STATUSES, type DealStatus, type DealType } from "@/lib/types";
import type { NewDealRow } from "@/db/schema";

export type ActionState = { error?: string };

// ---------- Auth ----------

export async function login(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    return { error: "Incorrect password." };
  }
  const token = await createSessionToken();
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  const from = String(formData.get("from") ?? "/admin");
  redirect(from.startsWith("/admin") ? from : "/admin");
}

export async function logout() {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

// ---------- Deal CRUD ----------

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function numOrNull(formData: FormData, key: string): number | null {
  const v = String(formData.get(key) ?? "").trim();
  if (v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function parseDealForm(formData: FormData): Omit<NewDealRow, "slug"> {
  const dealTypes = formData
    .getAll("dealTypes")
    .map(String)
    .filter((t): t is DealType => (DEAL_TYPES as readonly string[]).includes(t));

  const statusRaw = String(formData.get("status") ?? "available");
  const status: DealStatus = (DEAL_STATUSES as readonly string[]).includes(statusRaw)
    ? (statusRaw as DealStatus)
    : "available";

  const images = String(formData.get("images") ?? "")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    address: String(formData.get("address") ?? "").trim(),
    city: String(formData.get("city") ?? "").trim(),
    state: String(formData.get("state") ?? "").trim().toUpperCase(),
    zip: String(formData.get("zip") ?? "").trim(),
    lat: numOrNull(formData, "lat"),
    lng: numOrNull(formData, "lng"),
    beds: numOrNull(formData, "beds") ?? 0,
    baths: numOrNull(formData, "baths") ?? 0,
    sqft: numOrNull(formData, "sqft"),
    purchasePrice: numOrNull(formData, "purchasePrice") ?? 0,
    entryFee: numOrNull(formData, "entryFee") ?? 0,
    interestRate: numOrNull(formData, "interestRate"),
    monthlyPayment: numOrNull(formData, "monthlyPayment"),
    dealTypes,
    status,
    description: String(formData.get("description") ?? "").trim(),
    images,
    featured: formData.get("featured") === "on",
  };
}

async function uniqueSlug(base: string, ignoreSlug?: string): Promise<string> {
  let slug = base || "deal";
  let n = 1;
  // Probe for collisions; cheap for a single-operator catalog.
  while (true) {
    const existing = await getDealBySlug(slug);
    if (!existing || existing.slug === ignoreSlug) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}

function validate(data: Omit<NewDealRow, "slug">): string | null {
  if (!data.address) return "Address is required.";
  if (!data.city) return "City is required.";
  if (!data.state) return "State is required.";
  return null;
}

export async function createDealAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const data = parseDealForm(formData);
  const error = validate(data);
  if (error) return { error };

  const customSlug = String(formData.get("slug") ?? "").trim();
  const base = slugify(customSlug || `${data.address}-${data.city}-${data.state}`);
  const slug = await uniqueSlug(base);

  await createDeal({ ...data, slug });
  revalidatePath("/");
  revalidatePath("/deals");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateDealAction(
  id: string,
  currentSlug: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const data = parseDealForm(formData);
  const error = validate(data);
  if (error) return { error };

  const customSlug = String(formData.get("slug") ?? "").trim();
  const base = slugify(customSlug || `${data.address}-${data.city}-${data.state}`);
  const slug = await uniqueSlug(base, currentSlug);

  await updateDeal(id, { ...data, slug });
  revalidatePath("/");
  revalidatePath("/deals");
  revalidatePath(`/deals/${slug}`);
  revalidatePath(`/deals/${currentSlug}`);
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteDealAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const slug = String(formData.get("slug") ?? "");
  if (id) {
    await deleteDeal(id);
    revalidatePath("/");
    revalidatePath("/deals");
    if (slug) revalidatePath(`/deals/${slug}`);
    revalidatePath("/admin");
  }
}
