export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 animate-pulse px-6 py-12">
      <div className="h-8 w-56 rounded-lg bg-surface" />
      <div className="mt-8 flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 rounded-xl border border-border bg-surface" />
        ))}
      </div>
    </main>
  );
}
