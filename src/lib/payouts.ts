import { prisma } from "@/lib/prisma";

export const PLATFORM_FEE_PCT = Number(process.env.PLATFORM_FEE_PCT ?? "10");

export type OrganizerEarnings = {
  organizerId: string;
  displayName: string;
  email: string;
  grossSales: number;
  platformFee: number;
  netEarned: number;
  paidOut: number;
  balance: number;
};

// Sums paid orders per organizer, applies the platform fee, and nets off recorded payouts.
// Pass organizerId to scope this to a single organizer (e.g. their own dashboard).
export async function getOrganizerEarnings(organizerId?: string): Promise<OrganizerEarnings[]> {
  const organizers = await prisma.organizer.findMany({
    where: organizerId ? { id: organizerId } : undefined,
    include: {
      user: { select: { email: true } },
      payouts: { select: { amount: true } },
      events: {
        select: {
          ticketTypes: {
            select: {
              orderItems: {
                where: { order: { status: "PAID" } },
                select: { quantity: true, unitPrice: true },
              },
            },
          },
        },
      },
    },
  });

  return organizers.map((org) => {
    const grossSales = org.events
      .flatMap((e) => e.ticketTypes)
      .flatMap((t) => t.orderItems)
      .reduce((sum, item) => sum + item.quantity * Number(item.unitPrice), 0);

    const platformFee = grossSales * (PLATFORM_FEE_PCT / 100);
    const netEarned = grossSales - platformFee;
    const paidOut = org.payouts.reduce((sum, p) => sum + Number(p.amount), 0);

    return {
      organizerId: org.id,
      displayName: org.displayName,
      email: org.user.email,
      grossSales,
      platformFee,
      netEarned,
      paidOut,
      balance: netEarned - paidOut,
    };
  });
}
