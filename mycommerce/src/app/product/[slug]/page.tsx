// src/app/product/[slug]/page.tsx
import { readPrefs } from "@/lib/geo";
import { getProductBySlug } from "@/data/products";
import { formatMoney } from "@/lib/currency";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 0;

// ⬇️ Note: params is a Promise now in Next 15 in some contexts
type Params = { slug?: string };
type Props = { params: Promise<Params> };

export default async function ProductPage({ params }: Props) {
  // ✅ Unwrap the Promise
  const { slug: rawSlug } = await params;

  const raw = typeof rawSlug === "string" ? rawSlug : "";
  const slug = decodeURIComponent(raw).trim();

  if (!slug) {
    notFound();
  }

  const prefs = await readPrefs();
  const product = await getProductBySlug(slug, prefs.currency);

  if (!product) {
    notFound();
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div className="rounded-2xl border">
        <div className="aspect-square bg-gray-100">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
          ) : null}
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        <div className="mt-1 text-sm text-gray-600">{product.sku}</div>

        <div className="mt-4 text-xl font-bold">
          {product.priceMinor != null
            ? formatMoney(product.priceMinor, prefs.currency, prefs.locale)
            : "—"}
        </div>

        {product.inventory <= 0 && (
          <div className="mt-1 text-sm text-red-600">Out of stock</div>
        )}

        {product.description ? (
          <p className="mt-4 text-gray-800">{product.description}</p>
        ) : null}

        {/* Cart wiring comes on Day 4 */}
        <div className="mt-6 flex gap-2">
          <button
            type="button"
            className="rounded bg-black px-4 py-2 text-white"
            disabled={product.inventory <= 0}
            title={product.inventory <= 0 ? "Out of stock" : "Add to cart"}
          >
            Add to cart (Day 4)
          </button>
          <Link className="rounded border px-4 py-2" href="/">
            Continue shopping
          </Link>
        </div>

        <div className="mt-6 text-sm text-gray-600">Weight: {product.weightG} g</div>
      </div>
    </div>
  );
}
