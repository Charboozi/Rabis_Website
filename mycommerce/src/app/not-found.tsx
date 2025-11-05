export default function NotFound() {
  return (
    <div className="rounded border bg-gray-50 p-6">
      <h1 data-testid="not-found-title" className="text-lg font-semibold">
        404 — Not found
      </h1>
      <p className="mt-1 text-sm text-gray-600">
        The page or product you’re looking for doesn’t exist.
      </p>
    </div>
  );
}
