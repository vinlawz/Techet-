import Link from "next/link";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { EventCard } from "@/components/events/EventCard";
import { EVENT_CATEGORIES } from "@/lib/categories";
import { prisma } from "@/lib/prisma";

export default async function EventsPage({ searchParams }: PageProps<"/events">) {
  const { category } = await searchParams;
  const activeCategory = typeof category === "string" ? category : undefined;

  const events = await prisma.event.findMany({
    where: {
      status: "PUBLISHED",
      ...(activeCategory ? { category: { equals: activeCategory, mode: "insensitive" } } : {}),
    },
    orderBy: { startsAt: "asc" },
    include: {
      venue: { select: { name: true, city: true } },
      ticketTypes: { orderBy: { price: "asc" }, take: 1, select: { price: true } },
    },
  });

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 pt-16 pb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">What&apos;s on</h1>
          <p className="mt-3 max-w-xl text-muted">
            Browse upcoming events from organizers across Nairobi and beyond. Filter by category to
            find what feels like yours.
          </p>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-6">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/events"
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                !activeCategory
                  ? "border-accent bg-accent text-background"
                  : "border-border text-muted hover:text-foreground"
              }`}
            >
              All
            </Link>
            {EVENT_CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={`/events?category=${encodeURIComponent(cat)}`}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeCategory?.toLowerCase() === cat.toLowerCase()
                    ? "border-accent bg-accent text-background"
                    : "border-border text-muted hover:text-foreground"
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-24">
          {events.length === 0 ? (
            <div className="rounded-2xl border border-border bg-surface p-12 text-center text-muted">
              No events {activeCategory ? `in ${activeCategory} ` : ""}right now. Check back soon.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={{
                    slug: event.slug,
                    title: event.title,
                    category: event.category,
                    imageUrl: event.imageUrl,
                    startsAt: event.startsAt,
                    venue: event.venue,
                    fromPrice: event.ticketTypes[0] ? Number(event.ticketTypes[0].price) : null,
                  }}
                />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
