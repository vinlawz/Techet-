export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 animate-pulse px-6 py-12">
      <div className="h-8 w-48 rounded-lg bg-surface" />
      <div className="mt-8 flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 rounded-2xl border border-border bg-surface" />
        ))}
      </div>
    </main>
  );
}
