import Link from "next/link";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PLATFORM_FEE_PCT } from "@/lib/payouts";

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-6 pt-20 pb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Pricing that doesn&apos;t play games</h1>
          <p className="mt-4 text-lg text-muted">
            No setup fees, no monthly subscription, no "call us for a quote." We only get paid when
            your tickets sell.
          </p>
        </section>

        <section className="mx-auto max-w-lg px-6 pb-24">
          <div className="rounded-2xl border border-border bg-surface p-8 text-center">
            <div className="font-mono text-5xl font-bold">{PLATFORM_FEE_PCT}%</div>
            <p className="mt-2 text-sm text-muted">per ticket sold — deducted automatically, no invoices to chase</p>
            <ul className="mt-6 flex flex-col gap-2 text-left text-sm text-muted">
              <li>Unlimited events and ticket types</li>
              <li>M-Pesa and card payments handled end-to-end</li>
              <li>QR check-in for your whole crew at the door</li>
              <li>Live sales dashboard, no spreadsheet required</li>
            </ul>
            <Link
              href="/register?role=organizer"
              className="mt-8 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
            >
              Create your event
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
