import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

const faqs = [
  {
    q: "How do I actually pay for tickets?",
    a: "M-Pesa or card, right at checkout. Your ticket only drops once the payment is confirmed — no payment, no QR code.",
  },
  {
    q: "Where's my ticket?",
    a: "Once your order is PAID, your QR code shows up on the order page and under \"My bookings.\" Screenshot it or just show the page — either works.",
  },
  {
    q: "Can I get my money back?",
    a: "Refunds are down to each organizer's policy. Hit up the organizer or our support team with your order number and we'll sort it.",
  },
  {
    q: "I want to host my own event — how?",
    a: "Make an organizer account, drop your event details and ticket types, and you're live. Check the For organizers page for the full rundown.",
  },
  {
    q: "How do organizers actually get paid?",
    a: "Every sale shows on your dashboard in real time. Payouts are calculated after our platform fee comes off — no surprises, no guesswork.",
  },
];

export default function FaqPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto max-w-2xl px-6 py-20">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Questions? We got you.</h1>

          <dl className="mt-10 flex flex-col gap-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-xl border border-border bg-surface p-5">
                <dt className="font-semibold">{faq.q}</dt>
                <dd className="mt-2 text-sm text-muted">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
      <Footer />
    </>
  );
}
