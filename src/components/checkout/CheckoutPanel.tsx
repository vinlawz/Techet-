"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/format";

type Ticket = { id: string; name: string; price: string; remaining: number };

export function CheckoutPanel({
  eventId,
  slug,
  tickets,
}: {
  eventId: string;
  slug: string;
  tickets: Ticket[];
}) {
  const router = useRouter();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const total = tickets.reduce((sum, t) => sum + Number(t.price) * (quantities[t.id] ?? 0), 0);
  const count = Object.values(quantities).reduce((a, b) => a + b, 0);

  function change(id: string, delta: number, max: number) {
    setQuantities((q) => ({ ...q, [id]: Math.max(0, Math.min(max, (q[id] ?? 0) + delta)) }));
  }

  async function submit() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          phone,
          items: tickets
            .filter((t) => (quantities[t.id] ?? 0) > 0)
            .map((t) => ({ ticketTypeId: t.id, quantity: quantities[t.id] })),
        }),
      });
      if (res.status === 401) {
        router.push(`/login?callbackUrl=${encodeURIComponent(`/events/${slug}`)}`);
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setConfirming(false);
        return;
      }
      router.push(`/orders/${data.orderId}`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mt-4 flex flex-col gap-3">
        {tickets.map((t) => {
          const soldOut = t.remaining <= 0;
          const max = Math.min(10, t.remaining);
          return (
            <div
              key={t.id}
              className="flex items-center justify-between rounded-xl border border-border px-4 py-3"
            >
              <div>
                <div className="text-sm font-medium">{t.name}</div>
                <div className="text-xs text-muted">
                  {soldOut ? "Sold out" : `${t.remaining} left`} · {formatPrice(t.price)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={soldOut || !(quantities[t.id] > 0)}
                  onClick={() => change(t.id, -1, max)}
                  className="h-7 w-7 rounded-full border border-border disabled:opacity-40"
                  aria-label={`Remove ${t.name}`}
                >
                  −
                </button>
                <span className="w-5 text-center text-sm">{quantities[t.id] ?? 0}</span>
                <button
                  type="button"
                  disabled={soldOut || (quantities[t.id] ?? 0) >= max}
                  onClick={() => change(t.id, 1, max)}
                  className="h-7 w-7 rounded-full border border-border disabled:opacity-40"
                  aria-label={`Add ${t.name}`}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <label className="mt-6 block text-xs font-medium text-muted" htmlFor="phone">
        M-Pesa phone number
      </label>
      <input
        id="phone"
        type="tel"
        inputMode="tel"
        placeholder="0712345678"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2 text-sm"
      />

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-muted">Total</span>
        <span className="font-semibold">{formatPrice(total)}</span>
      </div>

      {error && <p className="mt-3 text-xs text-red-400">{error}</p>}

      {confirming ? (
        <div className="mt-4 rounded-xl border border-border bg-background p-4 text-sm">
          <p>
            Pay <span className="font-semibold">{formatPrice(total)}</span> for {count} ticket
            {count === 1 ? "" : "s"}? An M-Pesa prompt will be sent to{" "}
            <span className="font-semibold">{phone}</span>. Enter your M-Pesa PIN on your phone to
            complete the purchase.
          </p>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={submit}
              disabled={loading}
              className="flex-1 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-background disabled:opacity-60"
            >
              {loading ? "Sending prompt…" : "Confirm & send prompt"}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={loading}
              className="rounded-full border border-border px-4 py-2 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            setError(null);
            setConfirming(true);
          }}
          disabled={count === 0 || !phone}
          className="mt-4 block w-full rounded-full bg-accent px-4 py-3 text-center text-sm font-semibold text-background disabled:cursor-not-allowed disabled:opacity-60"
        >
          Buy tickets
        </button>
      )}
    </div>
  );
}
