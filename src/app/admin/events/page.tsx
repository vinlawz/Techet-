import { redirect } from "next/navigation";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatEventDate } from "@/lib/format";
import type { EventStatus } from "@/generated/prisma/client";

async function setStatus(eventId: string, next: EventStatus) {
  "use server";
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Forbidden");

  await prisma.event.update({ where: { id: eventId }, data: { status: next } });
  const { revalidatePath } = await import("next/cache");
  revalidatePath("/admin/events");
}

const statusStyles: Record<string, string> = {
  DRAFT: "border-border text-muted",
  PUBLISHED: "border-accent text-accent",
  UNPUBLISHED: "border-yellow-500/40 text-yellow-400",
  CANCELLED: "border-red-500/40 text-red-400",
};

export default async function AdminEventsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/admin/events");
  if (session.user.role !== "ADMIN") redirect("/");

  const events = await prisma.event.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: { organizer: { select: { displayName: true } }, ticketTypes: true },
  });

  const drafts = events.filter((e) => e.status === "DRAFT");
  const others = events.filter((e) => e.status !== "DRAFT");

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
        <h1 className="text-2xl font-bold">Event moderation</h1>
        <p className="mt-2 text-sm text-muted">
          Approve drafts to make them visible on the site, or manage any event's visibility.
        </p>

        <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-muted">
          Pending approval ({drafts.length})
        </h2>
        <div className="mt-3 flex flex-col gap-3">
          {drafts.length === 0 && <p className="text-sm text-muted">Nothing waiting on you.</p>}
          {drafts.map((event) => (
            <div
              key={event.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface p-4"
            >
              <div>
                <div className="font-medium">{event.title}</div>
                <div className="text-xs text-muted">
                  {event.organizer.displayName} · {formatEventDate(event.startsAt)} ·{" "}
                  {event.ticketTypes.length} ticket type{event.ticketTypes.length === 1 ? "" : "s"}
                </div>
              </div>
              <div className="flex gap-2">
                <form action={setStatus.bind(null, event.id, "PUBLISHED")}>
                  <button className="rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-background">
                    Approve
                  </button>
                </form>
                <form action={setStatus.bind(null, event.id, "CANCELLED")}>
                  <button className="rounded-full border border-red-400/40 px-4 py-1.5 text-xs font-medium text-red-400">
                    Reject
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>

        <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-muted">
          All other events
        </h2>
        <div className="mt-3 flex flex-col gap-3">
          {others.map((event) => (
            <div
              key={event.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface p-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{event.title}</span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${statusStyles[event.status]}`}
                  >
                    {event.status}
                  </span>
                </div>
                <div className="text-xs text-muted">
                  {event.organizer.displayName} · {formatEventDate(event.startsAt)}
                </div>
              </div>
              {event.status !== "CANCELLED" && (
                <div className="flex gap-2">
                  {event.status === "PUBLISHED" && (
                    <form action={setStatus.bind(null, event.id, "UNPUBLISHED")}>
                      <button className="rounded-full border border-border px-4 py-1.5 text-xs font-medium">
                        Unpublish
                      </button>
                    </form>
                  )}
                  {event.status === "UNPUBLISHED" && (
                    <form action={setStatus.bind(null, event.id, "PUBLISHED")}>
                      <button className="rounded-full border border-border px-4 py-1.5 text-xs font-medium">
                        Republish
                      </button>
                    </form>
                  )}
                  <form action={setStatus.bind(null, event.id, "CANCELLED")}>
                    <button className="rounded-full border border-red-400/40 px-4 py-1.5 text-xs font-medium text-red-400">
                      Cancel
                    </button>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
