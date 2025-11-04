/* prisma/seed.ts */
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// --- Data blueprints -------------------------------------------------
const ProductSchema = z.object({
  slug: z.string(),
  name: z.string(),
  description: z.string().optional(),
  sku: z.string(),
  imageUrl: z.string().optional(),
  weightG: z.number().int().nonnegative(),
  hsCode: z.string().optional(),
  originCountry: z.string().optional(),
  inventory: z.number().int().nonnegative(),
  prices: z.array(z.object({
    currency: z.enum(["SEK", "EUR", "USD", "GBP"]),
    amountMinor: z.number().int().positive()
  }))
});

type ProductSeed = z.infer<typeof ProductSchema>;

// Helper: make consistent price books with friendly rounded numbers
function sekTo(other: "EUR" | "USD" | "GBP", sek: number): number {
  // Light, opinionated “price book” mapping (rounded for nice numbers).
  const rates = { EUR: 0.089, USD: 0.094, GBP: 0.077 }; // sample mapping
  const val = Math.round(sek * rates[other] * 100) / 100;
  return Math.round(val * 100); // convert to minor
}

const products: ProductSeed[] = [
  {
    slug: "twd-hoodie-black",
    name: "TWD Hoodie — Black",
    description: "Premium heavyweight hoodie with embroidered logo.",
    sku: "TWD-HOODIE-BLK",
    imageUrl: "https://images.example.com/hoodie-black.jpg",
    weightG: 650,
    hsCode: "6109.10",
    originCountry: "SE",
    inventory: 120,
    prices: [
      { currency: "SEK", amountMinor: 79900 },
      { currency: "EUR", amountMinor: sekTo("EUR", 799) },
      { currency: "USD", amountMinor: sekTo("USD", 799) },
      { currency: "GBP", amountMinor: sekTo("GBP", 799) }
    ]
  },
  {
    slug: "twd-tee-white",
    name: "TWD Tee — White",
    description: "Soft cotton t-shirt with screen print.",
    sku: "TWD-TEE-WHT",
    imageUrl: "https://images.example.com/tee-white.jpg",
    weightG: 220,
    hsCode: "6109.10",
    originCountry: "SE",
    inventory: 300,
    prices: [
      { currency: "SEK", amountMinor: 29900 },
      { currency: "EUR", amountMinor: sekTo("EUR", 299) },
      { currency: "USD", amountMinor: sekTo("USD", 299) },
      { currency: "GBP", amountMinor: sekTo("GBP", 299) }
    ]
  },
  {
    slug: "twd-cap",
    name: "TWD Cap",
    description: "Adjustable baseball cap with stitched logo.",
    sku: "TWD-CAP-01",
    imageUrl: "https://images.example.com/cap.jpg",
    weightG: 150,
    hsCode: "6505.00",
    originCountry: "SE",
    inventory: 200,
    prices: [
      { currency: "SEK", amountMinor: 19900 },
      { currency: "EUR", amountMinor: sekTo("EUR", 199) },
      { currency: "USD", amountMinor: sekTo("USD", 199) },
      { currency: "GBP", amountMinor: sekTo("GBP", 199) }
    ]
  }
];

// Shipping rates (simple, flat-ish per zone & weight tier)
const shippingRates = [
  { zone: "EU",   minWeightG: 0,    maxWeightG: 1000,  priceMinor: 6900,  currency: "SEK", incoterm: "DAP" },
  { zone: "EU",   minWeightG: 1001, maxWeightG: 5000,  priceMinor: 9900,  currency: "SEK", incoterm: "DAP" },
  { zone: "NA",   minWeightG: 0,    maxWeightG: 1000,  priceMinor: 12900, currency: "SEK", incoterm: "DAP" },
  { zone: "NA",   minWeightG: 1001, maxWeightG: 5000,  priceMinor: 17900, currency: "SEK", incoterm: "DAP" },
  { zone: "APAC", minWeightG: 0,    maxWeightG: 1000,  priceMinor: 14900, currency: "SEK", incoterm: "DAP" },
  { zone: "APAC", minWeightG: 1001, maxWeightG: 5000,  priceMinor: 19900, currency: "SEK", incoterm: "DAP" },
  { zone: "ROW",  minWeightG: 0,    maxWeightG: 1000,  priceMinor: 13900, currency: "SEK", incoterm: "DAP" },
  { zone: "ROW",  minWeightG: 1001, maxWeightG: 5000,  priceMinor: 18900, currency: "SEK", incoterm: "DAP" }
];

async function main() {
  // Validate product blueprints
  for (const p of products) ProductSchema.parse(p);

  // Upsert products with their prices (idempotent seed)
  for (const p of products) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        description: p.description,
        sku: p.sku,
        imageUrl: p.imageUrl,
        weightG: p.weightG,
        hsCode: p.hsCode,
        originCountry: p.originCountry,
        inventory: p.inventory,
        active: true
      },
      create: {
        slug: p.slug,
        name: p.name,
        description: p.description,
        sku: p.sku,
        imageUrl: p.imageUrl,
        weightG: p.weightG,
        hsCode: p.hsCode,
        originCountry: p.originCountry,
        inventory: p.inventory,
        active: true
      },
      select: { id: true, slug: true }
    });

    // Ensure one price per currency
    for (const price of p.prices) {
      await prisma.price.upsert({
        where: {
          // Prisma needs a named unique constraint; we created @@unique([productId,currency])
          // So we need productId first; get via findUnique earlier or use composite find:
          // Workaround: fetch ID and compose our own unique key in code:
          // We'll use a unique surrogate by querying first:
          // But we can also use createMany with skipDuplicates; upsert is clearer here:
          // We'll look for an existing by productId+currency using findFirst.
        } as any,
        update: {
          amountMinor: price.amountMinor,
          active: true
        },
        create: {
          productId: product.id,
          currency: price.currency,
          amountMinor: price.amountMinor,
          active: true
        }
      }).catch(async () => {
        // Prisma doesn't allow composite where with upsert directly without an @id or explicit unique input
        // Use manual upsert:
        const existing = await prisma.price.findFirst({
          where: { productId: product.id, currency: price.currency }
        });
        if (existing) {
          await prisma.price.update({
            where: { id: existing.id },
            data: { amountMinor: price.amountMinor, active: true }
          });
        } else {
          await prisma.price.create({
            data: {
              productId: product.id,
              currency: price.currency,
              amountMinor: price.amountMinor,
              active: true
            }
          });
        }
      });
    }
  }

  // Seed shipping rates
  for (const r of shippingRates) {
    await prisma.shippingRate.upsert({
      where: {
        // Not unique in schema; create a stable synthetic key with a constrained find:
      } as any,
      update: {
        priceMinor: r.priceMinor,
        currency: r.currency,
        incoterm: r.incoterm,
        active: true
      },
      create: {
        zone: r.zone,
        minWeightG: r.minWeightG,
        maxWeightG: r.maxWeightG,
        priceMinor: r.priceMinor,
        currency: r.currency,
        incoterm: r.incoterm,
        active: true
      }
    }).catch(async () => {
      const existing = await prisma.shippingRate.findFirst({
        where: {
          zone: r.zone,
          minWeightG: r.minWeightG,
          maxWeightG: r.maxWeightG
        }
      });
      if (existing) {
        await prisma.shippingRate.update({
          where: { id: existing.id },
          data: {
            priceMinor: r.priceMinor,
            currency: r.currency,
            incoterm: r.incoterm,
            active: true
          }
        });
      } else {
        await prisma.shippingRate.create({ data: r });
      }
    });
  }

  console.log("✅ Seed complete");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
