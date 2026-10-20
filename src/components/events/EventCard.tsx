import Image from "next/image";
import Link from "next/link";
import { formatEventDate, formatPrice } from "@/lib/format";

type EventCardData = {
  slug: string;
  title: string;
  category: string;
  imageUrl: string | null;
  startsAt: Date;
  venue: { name: string; city: string } | null;
  fromPrice: number | null;
};

export function EventCard({ event }: { event: EventCardData }) {
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-accent-2"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-background">
        {event.imageUrl ? (
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted">No image</div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-background/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-accent backdrop-blur">
          {event.category}
        </span>
      </div>

      <div className="p-4">
        <div className="text-xs font-medium text-muted">{formatEventDate(event.startsAt)}</div>
        <h3 className="mt-1 line-clamp-2 text-base font-semibold tracking-tight">{event.title}</h3>
        {event.venue && (
          <p className="mt-1 text-sm text-muted">
            {event.venue.name}, {event.venue.city}
          </p>
        )}
        <div className="mt-3 text-sm font-semibold text-accent-2">
          {event.fromPrice !== null ? `From ${formatPrice(event.fromPrice)}` : "Dropping soon"}
        </div>
      </div>
    </Link>
  );
}
