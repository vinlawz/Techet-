import { redirect } from "next/navigation";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { getOrganizerEarnings, PLATFORM_FEE_PCT } from "@/lib/payouts";

async function recordPayout(formData: FormData) {
  "use server";
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Forbidden");

  const organizerId = String(formData.get("organizerId") ?? "");
  const amount = Number(formData.get("amount"));
  const note = String(formData.get("note") ?? "").trim() || null;
  if (!organizerId || !(amount > 0)) return;

  const earnings = await getOrganizerEarnings();
  const organizer = earnings.find((o) => o.organizerId === organizerId);
  if (!organizer || amount > organizer.balance + 0.01) return;

  await prisma.payout.create({ data: { organizerId, amount, note } });
  const { revalidatePath } = await import("next/cache");
  revalidatePath("/admin/payouts");
}

export default async function AdminPayoutsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/admin/payouts");
  if (session.user.role !== "ADMIN") redirect("/");

  const earnings = await getOrganizerEarnings();

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
        <h1 className="text-2xl font-bold">Organizer payouts</h1>
        <p className="mt-2 text-sm text-muted">
          Platform fee: {PLATFORM_FEE_PCT}%. Balances reflect paid orders only. Record a payout
          after you&apos;ve sent the money via M-Pesa.
        </p>

        <div className="mt-8 flex flex-col gap-6">
          {earnings.length === 0 && (
            <p className="text-muted">No organizers yet.</p>
          )}
          {earnings.map((org) => (
            <div key={org.organizerId} className="rounded-2xl border border-border bg-surface p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <div className="font-semibold">{org.displayName}</div>
                  <div className="text-xs text-muted">{org.email}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted">Owed</div>
                  <div className="text-lg font-bold text-accent-2">{formatPrice(org.balance)}</div>
                </div>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 text-xs text-muted sm:grid-cols-4">
                <div>
                  <dt>Gross sales</dt>
                  <dd className="text-sm font-medium text-foreground">
                    {formatPrice(org.grossSales)}
                  </dd>
                </div>
                <div>
                  <dt>Platform fee</dt>
                  <dd className="text-sm font-medium text-foreground">
                    {formatPrice(org.platformFee)}
                  </dd>
                </div>
                <div>
                  <dt>Net earned</dt>
                  <dd className="text-sm font-medium text-foreground">
                    {formatPrice(org.netEarned)}
                  </dd>
                </div>
                <div>
                  <dt>Already paid out</dt>
                  <dd className="text-sm font-medium text-foreground">
                    {formatPrice(org.paidOut)}
                  </dd>
                </div>
              </dl>

              {org.balance > 0.01 && (
                <form action={recordPayout} className="mt-4 flex flex-wrap items-end gap-3">
                  <input type="hidden" name="organizerId" value={org.organizerId} />
                  <div>
                    <label className="block text-xs text-muted" htmlFor={`amount-${org.organizerId}`}>
                      Amount sent
                    </label>
                    <input
                      id={`amount-${org.organizerId}`}
                      name="amount"
                      type="number"
                      step="0.01"
                      max={org.balance}
                      defaultValue={org.balance.toFixed(2)}
                      className="mt-1 w-36 rounded-lg border border-border bg-background px-3 py-1.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted" htmlFor={`note-${org.organizerId}`}>
                      Note (optional)
                    </label>
                    <input
                      id={`note-${org.organizerId}`}
                      name="note"
                      type="text"
                      placeholder="M-Pesa code"
                      className="mt-1 w-40 rounded-lg border border-border bg-background px-3 py-1.5 text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-background"
                  >
                    Mark as paid
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
