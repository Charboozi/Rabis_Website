import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PREFS_COOKIE, Prefs } from "@/lib/geo";

// (optional) works on node & edge — cookies() is async in both
// export const runtime = "edge";

export async function GET() {
  const jar = await cookies(); // ✅ await
  const raw = jar.get(PREFS_COOKIE)?.value;

  if (!raw) {
    // fallback default (mirror readPrefs() logic if you want)
    const fallback: Prefs = { country: "SE", currency: "SEK", locale: "sv" };
    return NextResponse.json({ ok: true, prefs: fallback });
  }

  try {
    const prefs = JSON.parse(raw) as Prefs;
    return NextResponse.json({ ok: true, prefs });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

export async function POST(req: Request) {
  const data = await req.formData();

  const prefs: Prefs = {
    country: String(data.get("country") || "SE") as any,
    currency: String(data.get("currency") || "SEK") as any,
    locale: (String(data.get("locale") || "en") === "sv" ? "sv" : "en") as any
  };

  const jar = await cookies(); // ✅ await
  jar.set(PREFS_COOKIE, JSON.stringify(prefs), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production", // ✅ dev-friendly
    path: "/",
    maxAge: 60 * 60 * 24 * 365
  });

  return NextResponse.json({ ok: true, prefs });
}
