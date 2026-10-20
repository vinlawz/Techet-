import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireOrganizer } from "@/lib/organizer";
import { eventInputSchema } from "@/lib/validation/event";
import { slugify } from "@/lib/slug";

export async function POST(request: Request) {
  const access = await requireOrganizer();
  if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status });

  const parsed = eventInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }
  const data = parsed.data;

  const startsAt = new Date(data.startsAt);
  const endsAt = new Date(data.endsAt);
  if (endsAt <= startsAt) {
    return NextResponse.json({ error: "End time must be after the start time." }, { status: 400 });
  }
  if (startsAt < new Date()) {
    return NextResponse.json({ error: "Start time can't be in the past." }, { status: 400 });
  }

  const baseSlug = slugify(data.title) || "event";
  let slug = baseSlug;
  for (let i = 1; await prisma.event.findUnique({ where: { slug } }); i++) {
    slug = `${baseSlug}-${i}`;
  }

  const event = await prisma.event.create({
    data: {
      organizer: { connect: { id: access.organizerId } },
      title: data.title,
      slug,
      description: data.description,
      category: data.category,
      status: "DRAFT",
      startsAt,
      endsAt,
      venue: {
        create: { name: data.venueName, address: data.venueAddress, city: data.venueCity },
      },
      ticketTypes: {
        create: data.ticketTypes.map((t) => ({ name: t.name, price: t.price, quantity: t.quantity })),
      },
    },
    select: { id: true, slug: true },
  });

  return NextResponse.json({ event }, { status: 201 });
}
