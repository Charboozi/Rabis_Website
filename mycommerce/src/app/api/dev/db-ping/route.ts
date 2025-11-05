import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const count = await prisma.product.count();
  return NextResponse.json({ ok: true, productCount: count });
}
