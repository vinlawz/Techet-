import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toLocalInput } from "@/lib/format";
import { EventForm } from "@/components/organizer/EventForm";
import type { EventStatus } from "@/generated/prisma/client";

async function setEventStatus(eventId: string, next: EventStatus) {
  "use server";
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { organizer: true },
  });
  if (!event) throw new Error("Event not found");

  const isOwner = event.organizer.userId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";
  if (!isOwner && !isAdmin) throw new Error("Forbidden");

  // Organizers may toggle PUBLISHED/UNPUBLISHED or cancel; only an admin can approve a DRAFT.
  const allowed: Record<EventStatus, EventStatus[]> = {
    DRAFT: isAdmin ? ["PUBLISHED", "CANCELLED"] : ["CANCELLED"],
    PUBLISHED: ["UNPUBLISHED", "CANCELLED"],
    UNPUBLISHED: ["PUBLISHED", "CANCELLED"],
    CANCELLED: [],
  };
  if (!allowed[event.status].includes(next)) throw new Error("That change isn't allowed.");

  await prisma.event.update({ where: { id: eventId }, data: { status: next } });
  const { revalidatePath } = await import("next/cache");
  revalidatePath(`/dashboard/events/${eventId}/edit`);
  revalidatePath("/dashboard");
}

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect(`/login?callbackUrl=/dashboard/events/${id}/edit`);

  const event = await prisma.event.findUnique({
    where: { id },
    include: { venue: true, ticketTypes: true, organizer: true },
  });
  if (!event) notFound();

  const isOwner = event.organizer.userId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";
  if (!isOwner && !isAdmin) redirect("/dashboard");

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{event.title}</h1>
            <p className="mt-1 text-sm text-muted">
              Status: <span className="font-medium text-foreground">{event.status}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/dashboard/events/${id}/checkin`}
              className="rounded-full border border-border px-4 py-2 text-xs font-medium"
            >
              Check-in scanner
            </Link>
            {event.status === "PUBLISHED" && (
              <form action={setEventStatus.bind(null, id, "UNPUBLISHED")}>
                <button className="rounded-full border border-border px-4 py-2 text-xs font-medium">
                  Unpublish
                </button>
              </form>
            )}
            {event.status === "UNPUBLISHED" && (
              <form action={setEventStatus.bind(null, id, "PUBLISHED")}>
                <button className="rounded-full border border-border px-4 py-2 text-xs font-medium">
                  Republish
                </button>
              </form>
            )}
            {event.status !== "CANCELLED" && (
              <form action={setEventStatus.bind(null, id, "CANCELLED")}>
                <button className="rounded-full border border-red-400/40 px-4 py-2 text-xs font-medium text-red-400">
                  Cancel event
                </button>
              </form>
            )}
          </div>
        </div>

        {event.status === "DRAFT" && (
          <p className="mt-4 rounded-xl border border-border bg-surface p-3 text-xs text-muted">
            This event is a draft awaiting admin approval. It won&apos;t be visible to attendees
            until it&apos;s published.
          </p>
        )}

        <div className="mt-8">
          <EventForm
            mode="edit"
            eventId={id}
            initial={{
              title: event.title,
              description: event.description,
              category: event.category,
              venueName: event.venue?.name ?? "",
              venueAddress: event.venue?.address ?? "",
              venueCity: event.venue?.city ?? "",
              startsAt: toLocalInput(event.startsAt),
              endsAt: toLocalInput(event.endsAt),
              ticketTypes: event.ticketTypes.map((t) => ({
                id: t.id,
                name: t.name,
                price: Number(t.price),
                quantity: t.quantity,
                sold: t.sold,
              })),
            }}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
