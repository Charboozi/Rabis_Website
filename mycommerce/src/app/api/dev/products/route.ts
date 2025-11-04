import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  // Return minimal product cards with SEK prices as a quick smoke test.
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
    include: {
      prices: {
        where: { currency: "SEK", active: true },
        take: 1
      }
    }
  });

  const mapped = products.map((p: any) => ({
    slug: p.slug,
    name: p.name,
    priceMinorSEK: p.prices[0]?.amountMinor ?? null,
    sku: p.sku
  }));

  return NextResponse.json({ products: mapped });
}
