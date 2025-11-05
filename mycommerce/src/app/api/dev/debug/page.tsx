import { readPrefs } from "@/lib/geo";
import { listProductsForCurrency } from "@/data/products";

export const revalidate = 0;

export default async function DebugPage() {
  const prefs = await readPrefs();
  const products = await listProductsForCurrency(prefs.currency);

  return (
    <pre className="text-xs whitespace-pre-wrap">
      {JSON.stringify({ prefs, sample: products.slice(0, 2) }, null, 2)}
    </pre>
  );
}
