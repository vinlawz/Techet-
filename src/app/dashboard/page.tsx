import Link from "next/link";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatEventDate } from "@/lib/format";

const statusStyles: Record<string, string> = {
  DRAFT: "border-border text-muted",
  PUBLISHED: "border-accent text-accent",
  UNPUBLISHED: "border-yellow-500/40 text-yellow-400",
  CANCELLED: "border-red-500/40 text-red-400",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/dashboard");

  const organizer = await prisma.organizer.findUnique({
    where: { userId: session.user.id },
    include: {
      events: {
        orderBy: { startsAt: "desc" },
        include: { ticketTypes: true },
      },
    },
  });

  if (!organizer) {
    return (
      <>
        <Navbar />
        <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
          <p className="text-muted">
            This account doesn&apos;t have an organizer profile.{" "}
            <Link href="/register?role=organizer" className="text-accent underline">
              Create one
            </Link>{" "}
            to start listing events.
          </p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{organizer.displayName}</h1>
            <p className="mt-1 text-sm text-muted">Your events and ticket sales.</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/dashboard/earnings"
              className="rounded-full border border-border px-4 py-2 text-sm font-medium"
            >
              Earnings
            </Link>
            <Link
              href="/dashboard/events/new"
              className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-background"
            >
              + New event
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4">
          {organizer.events.length === 0 && (
            <div className="rounded-2xl border border-border bg-surface p-10 text-center text-muted">
              You haven&apos;t created any events yet.
            </div>
          )}
          {organizer.events.map((event) => {
            const sold = event.ticketTypes.reduce((sum, t) => sum + t.sold, 0);
            const capacity = event.ticketTypes.reduce((sum, t) => sum + t.quantity, 0);
            const revenue = event.ticketTypes.reduce(
              (sum, t) => sum + t.sold * Number(t.price),
              0,
            );
            return (
              <Link
                key={event.id}
                href={`/dashboard/events/${event.id}/edit`}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-accent-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{event.title}</span>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${statusStyles[event.status]}`}
                    >
                      {event.status}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-muted">{formatEventDate(event.startsAt)}</div>
                </div>
                <div className="flex gap-6 text-sm">
                  <div>
                    <div className="text-xs text-muted">Sold</div>
                    <div className="font-medium">
                      {sold}/{capacity}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted">Revenue</div>
                    <div className="font-medium">{formatPrice(revenue)}</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
