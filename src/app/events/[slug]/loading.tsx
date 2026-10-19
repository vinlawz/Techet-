export default function Loading() {
  return (
    <main className="flex-1 animate-pulse">
      <div className="h-[40vh] min-h-[280px] w-full bg-surface" />
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-10 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="h-6 w-24 rounded-full bg-surface" />
          <div className="mt-4 h-10 w-2/3 rounded-lg bg-surface" />
          <div className="mt-8 h-24 max-w-2xl rounded-lg bg-surface" />
        </div>
        <div className="h-72 rounded-2xl border border-border bg-surface" />
      </div>
    </main>
  );
}
