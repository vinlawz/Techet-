import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto max-w-2xl px-6 py-20">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Terms of service</h1>
          <p className="mt-4 text-sm text-muted">Last updated October 2026</p>

          <div className="mt-8 flex flex-col gap-6 text-sm leading-relaxed text-muted">
            <p>
              By creating an account or purchasing a ticket on Techet, you agree to these terms. Please
              read them carefully.
            </p>
            <div>
              <h2 className="text-base font-semibold text-foreground">1. Tickets and orders</h2>
              <p className="mt-2">
                Tickets are issued by the organizer of each event. Techet processes payment and issues
                a digital ticket on the organizer&apos;s behalf once payment is confirmed. Each ticket
                is valid for a single entry and is void once checked in.
              </p>
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">2. Payments</h2>
              <p className="mt-2">
                Payments are processed through M-Pesa or supported card providers. Orders are only
                confirmed after payment succeeds server-side.
              </p>
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">3. Refunds and cancellations</h2>
              <p className="mt-2">
                Refund eligibility is set by the event organizer. If an event is cancelled by the
                organizer, Techet will work with the organizer to process refunds to affected
                attendees.
              </p>
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">4. Organizer responsibilities</h2>
              <p className="mt-2">
                Organizers are responsible for the accuracy of their event listings and for complying
                with applicable laws, including venue capacity and safety requirements.
              </p>
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">5. Changes</h2>
              <p className="mt-2">
                We may update these terms from time to time. Continued use of Techet after a change
                means you accept the updated terms.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
