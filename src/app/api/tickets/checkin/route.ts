import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireOrganizer } from "@/lib/organizer";

export async function POST(request: Request) {
  const access = await requireOrganizer();
  if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status });

  const body = await request.json().catch(() => null);
  const code = typeof body?.code === "string" ? body.code.trim() : "";
  if (!code) return NextResponse.json({ error: "Enter or scan a ticket code." }, { status: 400 });

  const ticket = await prisma.ticket.findUnique({
    where: { qrCode: code },
    include: {
      ticketType: { include: { event: { select: { id: true, title: true, organizerId: true } } } },
      order: { include: { user: { select: { name: true } } } },
    },
  });

  if (!ticket) return NextResponse.json({ error: "No ticket found for this code." }, { status: 404 });
  if (!access.isAdmin && ticket.ticketType.event.organizerId !== access.organizerId) {
    return NextResponse.json({ error: "This ticket is for a different organizer." }, { status: 403 });
  }

  if (ticket.status === "VOID") {
    return NextResponse.json({ error: "This ticket has been voided." }, { status: 409 });
  }
  if (ticket.status === "USED") {
    return NextResponse.json(
      {
        error: `Already checked in${ticket.checkedInAt ? ` at ${ticket.checkedInAt.toLocaleTimeString()}` : ""}.`,
      },
      { status: 409 },
    );
  }

  const updated = await prisma.ticket.update({
    where: { id: ticket.id },
    data: { status: "USED", checkedInAt: new Date() },
  });

  return NextResponse.json({
    ok: true,
    ticketTypeName: ticket.ticketType.name,
    eventTitle: ticket.ticketType.event.title,
    buyer: ticket.order.user.name,
    checkedInAt: updated.checkedInAt,
  });
}
