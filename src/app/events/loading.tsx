export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 animate-pulse px-6 py-16">
      <div className="h-9 w-48 rounded-lg bg-surface" />
      <div className="mt-4 h-4 w-80 max-w-full rounded bg-surface" />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-72 rounded-2xl border border-border bg-surface" />
        ))}
      </div>
    </main>
  );
}
