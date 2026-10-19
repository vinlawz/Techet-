import { EVENT_CATEGORIES } from "@/lib/categories";

// Duplicate the list so the CSS marquee loop has no visible seam.
const loop = [...EVENT_CATEGORIES, ...EVENT_CATEGORIES];

export function CategoryMarquee() {
  return (
    <div className="overflow-hidden border-y border-border bg-surface/60 py-3">
      <div className="animate-marquee flex w-max gap-8 whitespace-nowrap">
        {loop.map((category, i) => (
          <span
            key={`${category}-${i}`}
            className="font-mono text-sm font-semibold tracking-wider text-muted"
          >
            {category.toUpperCase()}
          </span>
        ))}
      </div>
    </div>
  );
}
