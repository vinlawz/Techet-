import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { normalizePhone, stkPush } from "@/lib/mpesa";

const checkoutSchema = z.object({
  eventId: z.string().min(1),
  phone: z.string().min(1),
  items: z
    .array(
      z.object({
        ticketTypeId: z.string().min(1),
        quantity: z.number().int().min(1).max(10),
      }),
    )
    .min(1),
});

class CheckoutError extends Error {}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Please sign in to buy tickets." }, { status: 401 });
  }
  const userId = session.user.id;

  const parsed = checkoutSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const { eventId, items } = parsed.data;

  const phone = normalizePhone(parsed.data.phone);
  if (!phone) {
    return NextResponse.json(
      { error: "Enter a valid Safaricom number, e.g. 0712345678." },
      { status: 400 },
    );
  }

  const merged = new Map<string, number>();
  for (const item of items) {
    merged.set(item.ticketTypeId, (merged.get(item.ticketTypeId) ?? 0) + item.quantity);
  }

  // Create the order and reserve stock atomically; prices always come from the database.
  let order: { id: string; totalAmount: number };
  try {
    order = await prisma.$transaction(async (tx) => {
      const event = await tx.event.findUnique({ where: { id: eventId } });
      if (!event || event.status !== "PUBLISHED") throw new CheckoutError("Event not available.");

      let total = 0;
      const orderItems: { ticketTypeId: string; quantity: number; unitPrice: number }[] = [];

      for (const [ticketTypeId, quantity] of merged) {
        const ticketType = await tx.ticketType.findUnique({ where: { id: ticketTypeId } });
        if (!ticketType || ticketType.eventId !== eventId) {
          throw new CheckoutError("Invalid ticket type.");
        }

        const reserved = await tx.ticketType.updateMany({
          where: { id: ticketTypeId, sold: { lte: ticketType.quantity - quantity } },
          data: { sold: { increment: quantity } },
        });
        if (reserved.count === 0) {
          throw new CheckoutError(`Not enough "${ticketType.name}" tickets left.`);
        }

        const unitPrice = Number(ticketType.price);
        total += unitPrice * quantity;
        orderItems.push({ ticketTypeId, quantity, unitPrice });
      }

      if (total < 1) throw new CheckoutError("Order total must be at least KES 1.");

      const created = await tx.order.create({
        data: {
          userId,
          eventId,
          totalAmount: total,
          items: { create: orderItems },
          payments: { create: { provider: "MPESA", amount: total, phone } },
        },
      });
      return { id: created.id, totalAmount: total };
    });
  } catch (error) {
    if (error instanceof CheckoutError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    throw error;
  }

  try {
    const result = await stkPush({
      phone,
      amount: order.totalAmount,
      reference: order.id.slice(-8),
      description: "Techet",
    });
    await prisma.payment.updateMany({
      where: { orderId: order.id },
      data: {
        checkoutRequestId: result.checkoutRequestId,
        providerRef: result.merchantRequestId,
      },
    });
  } catch (error) {
    await releaseOrder(order.id, error instanceof Error ? error.message : "STK push failed");
    return NextResponse.json(
      { error: "Could not start M-Pesa payment. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ orderId: order.id });
}

async function releaseOrder(orderId: string, reason: string) {
  await prisma.$transaction(async (tx) => {
    const items = await tx.orderItem.findMany({ where: { orderId } });
    for (const item of items) {
      await tx.ticketType.update({
        where: { id: item.ticketTypeId },
        data: { sold: { decrement: item.quantity } },
      });
    }
    await tx.order.update({ where: { id: orderId }, data: { status: "FAILED" } });
    await tx.payment.updateMany({
      where: { orderId },
      data: { status: "FAILED", failureReason: reason },
    });
  });
}
