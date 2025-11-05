"use client";
export default function Error({ error }: { error: Error }) {
  return (
    <div className="rounded border border-red-300 bg-red-50 p-4 text-red-800">
      Failed to load products: {error.message}
    </div>
  );
}
