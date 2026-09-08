import Link from "next/link";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

const stats = [
  { label: "Events hosted", value: "0" },
  { label: "Tickets sold", value: "0" },
  { label: "Organizers onboard", value: "0" },
  { label: "Payment success rate", value: "99.9%" },
];

const features = [
  {
    title: "Checkout in seconds",
    description: "A fast, mobile-first booking flow so customers complete payment without friction.",
  },
  {
    title: "M-Pesa & card payments",
    description: "Accept mobile money and card payments with verified, server-side confirmation.",
  },
  {
    title: "Secure digital tickets",
    description: "Every ticket ships with a signed QR code that's validated in real time at the door.",
  },
  {
    title: "Live sales dashboard",
    description: "Organizers track revenue, remaining inventory, and attendance as it happens.",
  },
];

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto flex max-w-6xl flex-col items-start px-6 pt-24 pb-20">
          <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-accent">
            Now onboarding organizers
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Event ticketing, built for speed and trust.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted">
            Techet helps organizers publish events and sell tickets, and gives attendees a fast,
            secure way to discover, book, and manage their tickets.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/events"
              className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
            >
              Browse events
            </Link>
            <Link
              href="/register?role=organizer"
              className="rounded-full border border-border px-6 py-3 text-sm font-semibold transition-colors hover:border-accent-2 hover:text-accent-2"
            >
              Create an event
            </Link>
          </div>
        </section>

        <section className="border-y border-border bg-surface/60">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-10 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="font-mono text-2xl font-bold sm:text-3xl">{stat.value}</div>
                <div className="mt-1 text-sm text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Why organizers choose Techet</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-border bg-surface p-6">
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-border bg-surface p-10 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Ready to sell your first ticket?</h2>
              <p className="mt-2 max-w-md text-sm text-muted">
                Set up your event page, add ticket types, and start selling in minutes.
              </p>
            </div>
            <Link
              href="/register?role=organizer"
              className="whitespace-nowrap rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
            >
              Get started free
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
