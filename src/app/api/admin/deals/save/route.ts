import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/auth";
import { saveDealFromForm } from "@/lib/deal-write";

// Autosave endpoint. Upserts a deal from the admin form; new deals become drafts.
export async function POST(request: Request) {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();

  try {
    const result = await saveDealFromForm(formData);
    // Keep public pages fresh when a published deal changes.
    revalidatePath("/");
    revalidatePath("/deals");
    revalidatePath(`/deals/${result.slug}`);
    revalidatePath("/admin");
    return NextResponse.json(result);
  } catch (error) {
    console.error("[autosave] failed", error);
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}
