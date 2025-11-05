import { readPrefs } from "@/lib/geo";
import { listProductsForCurrency } from "@/data/products";
import { formatMoney } from "@/lib/currency";
import Link from "next/link";

export default async function HomePage() {
  const prefs = await readPrefs();
  const products = await listProductsForCurrency(prefs.currency);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Products</h1>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p: any) => (
          <li key={p.slug} className="overflow-hidden rounded-2xl border shadow-sm hover:shadow-md transition">
            <Link href={`/product/${p.slug}`} className="block">
              <div className="aspect-[4/3] bg-gray-100">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
                ) : null}
              </div>
              <div className="p-4">
                <div className="mb-1 text-lg font-medium">{p.name}</div>
                <div className="text-sm text-gray-600">{p.sku}</div>
                <div className="mt-2 text-base font-semibold">
                  {p.priceMinor != null ? formatMoney(p.priceMinor, prefs.currency, prefs.locale) : "—"}
                </div>
                {p.inventory <= 0 ? (
                  <div className="mt-1 text-sm text-red-600">Out of stock</div>
                ) : null}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
