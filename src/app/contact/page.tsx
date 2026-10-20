import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto max-w-2xl px-6 py-20">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Talk to us</h1>
          <p className="mt-4 text-lg text-muted">
            Order acting up? Event not showing? Got a partnership idea? Bonga nasi — hit us up, we
            actually reply.
          </p>

          <div className="mt-8 flex flex-col gap-4">
            <div className="rounded-xl border border-border bg-surface p-5">
              <h2 className="text-sm font-semibold">General support</h2>
              <a href="mailto:support@techet.app" className="mt-1 block text-sm text-accent">
                support@techet.app
              </a>
            </div>
            <div className="rounded-xl border border-border bg-surface p-5">
              <h2 className="text-sm font-semibold">Organizer sales</h2>
              <a href="mailto:organizers@techet.app" className="mt-1 block text-sm text-accent">
                organizers@techet.app
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
