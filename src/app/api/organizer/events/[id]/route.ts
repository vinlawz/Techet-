import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireOrganizer } from "@/lib/organizer";
import { eventInputSchema } from "@/lib/validation/event";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const access = await requireOrganizer();
  if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status });

  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
    include: { ticketTypes: true },
  });
  if (!event) return NextResponse.json({ error: "Event not found." }, { status: 404 });
  if (!access.isAdmin && event.organizerId !== access.organizerId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (event.status === "CANCELLED") {
    return NextResponse.json({ error: "A cancelled event can't be edited." }, { status: 409 });
  }

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
  if (startsAt.getTime() !== event.startsAt.getTime() && startsAt < new Date()) {
    return NextResponse.json({ error: "Start time can't be in the past." }, { status: 400 });
  }

  const existingById = new Map(event.ticketTypes.map((t) => [t.id, t]));
  for (const t of data.ticketTypes) {
    if (!t.id) continue;
    const existing = existingById.get(t.id);
    if (!existing) {
      return NextResponse.json({ error: "Unknown ticket type." }, { status: 400 });
    }
    if (t.quantity < existing.sold) {
      return NextResponse.json(
        { error: `"${existing.name}" already sold ${existing.sold}; quantity can't go below that.` },
        { status: 400 },
      );
    }
  }

  await prisma.$transaction(async (tx) => {
    if (event.venueId) {
      await tx.venue.update({
        where: { id: event.venueId },
        data: { name: data.venueName, address: data.venueAddress, city: data.venueCity },
      });
    }

    await tx.event.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        startsAt,
        endsAt,
        externalUrl: data.externalUrl || null,
        ...(event.venueId
          ? {}
          : {
              venue: {
                create: { name: data.venueName, address: data.venueAddress, city: data.venueCity },
              },
            }),
      },
    });

    for (const t of data.ticketTypes) {
      if (t.id) {
        await tx.ticketType.update({
          where: { id: t.id },
          data: { name: t.name, price: t.price, quantity: t.quantity },
        });
      } else {
        await tx.ticketType.create({
          data: { eventId: id, name: t.name, price: t.price, quantity: t.quantity },
        });
      }
    }
  });

  return NextResponse.json({ ok: true });
}
