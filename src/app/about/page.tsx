import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

const values = [
  {
    title: "Haraka haraka",
    description: "From scrolling to a ticket in your pocket, every step is fast enough to run on patchy data.",
  },
  {
    title: "Trust, not vibes",
    description: "Every payment is confirmed server-side and every ticket is a signed, single-use QR code. No fakes, no wahala.",
  },
  {
    title: "Fair to the hustle",
    description: "Clear payouts, no hidden cuts — organizers see exactly what lands in their pocket.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-6 pt-20 pb-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            We&apos;re just here for the <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">plans</span>.
          </h1>
          <p className="mt-4 text-lg text-muted">
            Techet started with one annoying problem: finding out what&apos;s actually happening this
            weekend shouldn&apos;t mean five WhatsApp groups and a blurry poster on someone&apos;s
            story. So we built one place — gigs, raves, pop-ups, wellness mornings, tech meetups — where
            you can see what&apos;s on, cop a ticket in seconds, and show up knowing it&apos;s legit.
          </p>
          <p className="mt-4 text-lg text-muted">
            For organizers, we built the boring-but-important stuff so you don&apos;t have to: payments
            that actually land, tickets that can&apos;t be screenshotted and reused, and a dashboard
            that tells you the truth about your numbers. Less admin, more function.
          </p>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="grid gap-6 sm:grid-cols-3">
            {values.map((value) => (
              <div key={value.title} className="rounded-2xl border border-border bg-surface p-6">
                <h2 className="text-lg font-semibold">{value.title}</h2>
                <p className="mt-2 text-sm text-muted">{value.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
