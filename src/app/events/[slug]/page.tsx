import Image from "next/image";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { prisma } from "@/lib/prisma";
import { CheckoutPanel } from "@/components/checkout/CheckoutPanel";
import { formatEventDate, formatEventTime, formatPrice } from "@/lib/format";

export default async function EventDetailPage({ params }: PageProps<"/events/[slug]">) {
  const { slug } = await params;

  const event = await prisma.event.findUnique({
    where: { slug },
    include: {
      venue: true,
      organizer: { select: { displayName: true } },
      ticketTypes: { orderBy: { price: "asc" } },
    },
  });

  if (!event || event.status !== "PUBLISHED") {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="relative h-[40vh] min-h-[280px] w-full overflow-hidden bg-surface">
          {event.imageUrl && (
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </section>

        <section className="mx-auto max-w-6xl px-6 py-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
            <div>
              <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-accent">
                {event.category}
              </span>
              <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{event.title}</h1>
              <p className="mt-2 text-muted">By {event.organizer.displayName}</p>

              <div className="mt-6 flex flex-col gap-2 text-sm">
                <div>
                  <span className="font-semibold">{formatEventDate(event.startsAt)}</span>{" "}
                  <span className="text-muted">
                    · {formatEventTime(event.startsAt)} – {formatEventTime(event.endsAt)}
                  </span>
                </div>
                {event.venue && (
                  <div className="text-muted">
                    {event.venue.name}, {event.venue.city}
                  </div>
                )}
              </div>

              <p className="mt-8 max-w-2xl whitespace-pre-line text-muted">{event.description}</p>
            </div>

            <aside className="h-fit rounded-2xl border border-border bg-surface p-6">
              {event.externalUrl ? (
                <>
                  <h2 className="text-lg font-semibold">Get tickets</h2>
                  <p className="mt-2 text-sm text-muted">
                    Tickets for this event are sold by {event.organizer.displayName} on another
                    platform. You&apos;ll be taken there to complete your booking.
                  </p>
                  {event.ticketTypes.length > 0 && (
                    <p className="mt-3 text-sm font-semibold text-accent-2">
                      From {formatPrice(event.ticketTypes[0].price.toString())}
                    </p>
                  )}
                  <a
                    href={event.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 block w-full rounded-full bg-accent px-5 py-2.5 text-center text-sm font-semibold text-background transition-opacity hover:opacity-90"
                  >
                    Get tickets
                  </a>
                </>
              ) : (
                <>
                  <h2 className="text-lg font-semibold">Lock in your spot</h2>
                  <CheckoutPanel
                    eventId={event.id}
                    slug={event.slug}
                    tickets={event.ticketTypes.map((t) => ({
                      id: t.id,
                      name: t.name,
                      price: t.price.toString(),
                      remaining: t.quantity - t.sold,
                    }))}
                  />
                </>
              )}
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
