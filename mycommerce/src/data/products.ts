import { prisma } from "@/lib/prisma";
import { SupportedCurrency } from "@/lib/currency";

export async function listProductsForCurrency(currency: SupportedCurrency) {
  const rows = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
    include: {
      prices: { where: { currency, active: true }, select: { amountMinor: true } },
    },
  });

  return rows.map((p: any) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    sku: p.sku,
    imageUrl: p.imageUrl,
    inventory: p.inventory,
    priceMinor: p.prices[0]?.amountMinor ?? null,
  }));
}

export async function getProductBySlug(slug: string, currency: SupportedCurrency) {
  const clean = (slug ?? "").trim();
  if (!clean) return null;

  // slug is unique in your schema -> use findUnique with the unique field
  const p = await prisma.product.findUnique({
    where: { slug: clean },
    include: {
      prices: { where: { currency, active: true }, select: { amountMinor: true } }
    },
  });

  if (!p) return null;

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    sku: p.sku,
    imageUrl: p.imageUrl,
    description: p.description,
    inventory: p.inventory,
    weightG: p.weightG,
    priceMinor: p.prices[0]?.amountMinor ?? null,
  };
}
