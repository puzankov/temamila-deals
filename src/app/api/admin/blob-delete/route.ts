import { del } from "@vercel/blob";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/auth";

// Deletes a single just-uploaded (unsaved) blob when the admin removes it before
// saving. Already-published images are deleted on save instead (see actions.ts).
export async function POST(request: Request) {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let url: string;
  try {
    ({ url } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!url || !url.includes(".blob.vercel-storage.com")) {
    return NextResponse.json({ error: "Not a blob URL" }, { status: 400 });
  }

  try {
    await del(url);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Delete failed" },
      { status: 500 },
    );
  }
}
