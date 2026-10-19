export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 animate-pulse px-6 py-12">
      <div className="h-8 w-64 rounded-lg bg-surface" />
      <div className="mt-3 h-4 w-48 rounded bg-surface" />
      <div className="mt-8 h-20 rounded-xl border border-border bg-surface" />
    </main>
  );
}
