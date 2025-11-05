import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = (searchParams.get("slug") || "").trim();
  if (!slug) return NextResponse.json({ ok: false, reason: "missing slug" }, { status: 400 });

  const p = await prisma.product.findUnique({ where: { slug } });
  return NextResponse.json({ ok: !!p, slug, found: !!p });
}
