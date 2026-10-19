import Link from "next/link";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { getOrganizerEarnings, PLATFORM_FEE_PCT } from "@/lib/payouts";

export default async function OrganizerEarningsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/dashboard/earnings");

  const organizer = await prisma.organizer.findUnique({ where: { userId: session.user.id } });
  if (!organizer) redirect("/dashboard");

  const [earnings] = await getOrganizerEarnings(organizer.id);

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
        <Link href="/dashboard" className="text-sm text-muted hover:text-foreground">
          ← Back to dashboard
        </Link>
        <h1 className="mt-4 text-2xl font-bold">Earnings</h1>
        <p className="mt-1 text-sm text-muted">
          Platform fee: {PLATFORM_FEE_PCT}%. Payouts are sent manually by the Techet team via
          M-Pesa.
        </p>

        <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
          <div className="text-xs text-muted">Owed to you</div>
          <div className="text-3xl font-bold text-accent-2">
            {formatPrice(earnings?.balance ?? 0)}
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-4 text-xs text-muted sm:grid-cols-4">
            <div>
              <dt>Gross sales</dt>
              <dd className="text-sm font-medium text-foreground">
                {formatPrice(earnings?.grossSales ?? 0)}
              </dd>
            </div>
            <div>
              <dt>Platform fee</dt>
              <dd className="text-sm font-medium text-foreground">
                {formatPrice(earnings?.platformFee ?? 0)}
              </dd>
            </div>
            <div>
              <dt>Net earned</dt>
              <dd className="text-sm font-medium text-foreground">
                {formatPrice(earnings?.netEarned ?? 0)}
              </dd>
            </div>
            <div>
              <dt>Already paid out</dt>
              <dd className="text-sm font-medium text-foreground">
                {formatPrice(earnings?.paidOut ?? 0)}
              </dd>
            </div>
          </dl>
        </div>
      </main>
      <Footer />
    </>
  );
}
