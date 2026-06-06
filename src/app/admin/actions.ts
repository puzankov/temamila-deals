"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { deleteDeal, getDealById, updateDeal } from "@/lib/deals";
import { deleteBlobs } from "@/lib/deal-write";
import {
  ADMIN_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  checkPassword,
  createSessionToken,
} from "@/lib/auth";

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

// ---------- Publish toggle ----------

export async function setPublishedAction(id: string, published: boolean) {
  if (!id) return;
  const updated = await updateDeal(id, { published });
  revalidatePath("/");
  revalidatePath("/deals");
  if (updated) revalidatePath(`/deals/${updated.slug}`);
  revalidatePath("/admin");
}

// ---------- Delete ----------

export async function deleteDealAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const slug = String(formData.get("slug") ?? "");
  if (!id) return;

  // Clean up this deal's blobs so we don't leave dead images behind.
  const deal = await getDealById(id);
  await deleteDeal(id);
  if (deal?.images?.length) await deleteBlobs(deal.images);

  revalidatePath("/");
  revalidatePath("/deals");
  if (slug) revalidatePath(`/deals/${slug}`);
  revalidatePath("/admin");
}
