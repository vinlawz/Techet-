import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto max-w-2xl px-6 py-20">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Privacy policy</h1>
          <p className="mt-4 text-sm text-muted">Last updated October 2026</p>

          <div className="mt-8 flex flex-col gap-6 text-sm leading-relaxed text-muted">
            <p>
              This policy explains what information Techet collects and how we use it when you book
              tickets or run events on our platform.
            </p>
            <div>
              <h2 className="text-base font-semibold text-foreground">Information we collect</h2>
              <p className="mt-2">
                Account details (name, email, phone), order and ticket history, and payment
                confirmation details (such as M-Pesa receipt numbers) needed to verify your purchase.
                We do not store your card or M-Pesa PIN.
              </p>
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">How we use it</h2>
              <p className="mt-2">
                To process orders, issue tickets, verify check-in at events, calculate organizer
                payouts, and contact you about your bookings.
              </p>
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">Sharing</h2>
              <p className="mt-2">
                Event organizers can see the name and contact details of attendees who booked their
                events. We share payment details with our payment providers (M-Pesa, card processors)
                only as needed to complete a transaction.
              </p>
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">Your choices</h2>
              <p className="mt-2">
                You can request a copy of your data or ask us to delete your account by contacting
                support@techet.app.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
