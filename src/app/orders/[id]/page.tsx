import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { OrderStatusPoller } from "@/components/checkout/OrderStatusPoller";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect(`/login?callbackUrl=${encodeURIComponent(`/orders/${id}`)}`);

  const order = await prisma.order.findUnique({
    where: { id },
    include: { event: true, tickets: { include: { ticketType: true } } },
  });
  if (!order || order.userId !== session.user.id) notFound();

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
        <h1 className="text-2xl font-bold">{order.event.title}</h1>
        <p className="mt-1 text-sm text-muted">
          Order total {formatPrice(String(order.totalAmount))} · {order.status}
        </p>

        <OrderStatusPoller orderId={order.id} initialStatus={order.status} />

        {order.status === "PAID" && (
          <ul className="mt-6 flex flex-col gap-3">
            {order.tickets.map((ticket) => (
              <li key={ticket.id} className="rounded-xl border border-border bg-surface p-4">
                <div className="text-sm font-semibold">{ticket.ticketType.name}</div>
                <div className="mt-1 break-all font-mono text-xs text-muted">{ticket.qrCode}</div>
              </li>
            ))}
          </ul>
        )}

        <Link href="/events" className="mt-8 inline-block text-sm text-accent">
          Back to events
        </Link>
      </main>
      <Footer />
    </>
  );
}
