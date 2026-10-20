import Link from "next/link";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

const steps = [
  {
    title: "Set up your event",
    description: "Details, venue, ticket types — live in a few minutes. No setup fees, no forms to chase.",
  },
  {
    title: "Sell while you sleep",
    description: "People check out with M-Pesa or card in seconds; your inventory updates itself, real time.",
  },
  {
    title: "Run the door like a pro",
    description: "Scan QR tickets from any phone at the gate — no extra hardware, no guest list drama.",
  },
  {
    title: "Get your money",
    description: "Track revenue live on your dashboard and request a payout once the function wraps up.",
  },
];

export default function OrganizersPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-6 pt-20 pb-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Host it. We&apos;ll handle the <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">boring part</span>.
          </h1>
          <p className="mt-4 text-lg text-muted">
            Ticketing, payments, check-in, payouts — sorted, so you can focus on throwing something
            people actually remember. No spreadsheets, no "send proof of payment" DMs.
          </p>
          <Link
            href="/register?role=organizer"
            className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
          >
            Start selling tickets
          </Link>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="grid gap-6 sm:grid-cols-2">
            {steps.map((step, i) => (
              <div key={step.title} className="rounded-2xl border border-border bg-surface p-6">
                <span className="font-mono text-sm text-accent">0{i + 1}</span>
                <h2 className="mt-2 text-lg font-semibold">{step.title}</h2>
                <p className="mt-2 text-sm text-muted">{step.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
