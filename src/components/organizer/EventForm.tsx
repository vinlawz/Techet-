"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EVENT_CATEGORIES } from "@/lib/categories";
import { toLocalInput } from "@/lib/format";

export type EventFormTicketType = {
  id?: string;
  name: string;
  price: number;
  quantity: number;
  sold?: number;
};

export type EventFormValues = {
  title: string;
  description: string;
  category: string;
  venueName: string;
  venueAddress: string;
  venueCity: string;
  startsAt: string; // datetime-local value
  endsAt: string;
  externalUrl: string;
  ticketTypes: EventFormTicketType[];
};

export const emptyEventForm: EventFormValues = {
  title: "",
  description: "",
  category: EVENT_CATEGORIES[0],
  venueName: "",
  venueAddress: "",
  venueCity: "Nairobi",
  startsAt: "",
  endsAt: "",
  externalUrl: "",
  ticketTypes: [{ name: "General", price: 0, quantity: 50 }],
};

export function EventForm({
  mode,
  eventId,
  initial,
}: {
  mode: "create" | "edit";
  eventId?: string;
  initial: EventFormValues;
}) {
  const router = useRouter();
  const [values, setValues] = useState<EventFormValues>(initial);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof EventFormValues>(key: K, value: EventFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function updateTicket(index: number, patch: Partial<EventFormTicketType>) {
    setValues((v) => ({
      ...v,
      ticketTypes: v.ticketTypes.map((t, i) => (i === index ? { ...t, ...patch } : t)),
    }));
  }

  function addTicket() {
    setValues((v) => ({
      ...v,
      ticketTypes: [...v.ticketTypes, { name: "", price: 0, quantity: 50 }],
    }));
  }

  function removeTicket(index: number) {
    setValues((v) => ({ ...v, ticketTypes: v.ticketTypes.filter((_, i) => i !== index) }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const url = mode === "create" ? "/api/organizer/events" : `/api/organizer/events/${eventId}`;
    const method = mode === "create" ? "POST" : "PATCH";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          startsAt: new Date(values.startsAt).toISOString(),
          endsAt: new Date(values.endsAt).toISOString(),
          ticketTypes: values.ticketTypes.map((t) => ({
            id: t.id,
            name: t.name,
            price: Number(t.price),
            quantity: Number(t.quantity),
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      router.push(mode === "create" ? "/dashboard" : `/dashboard/events/${eventId}/edit`);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <label className="flex flex-col gap-1.5 text-sm">
        Title
        <input
          required
          value={values.title}
          onChange={(e) => update("title", e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        Description
        <textarea
          required
          rows={5}
          value={values.description}
          onChange={(e) => update("description", e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        Category
        <select
          value={values.category}
          onChange={(e) => update("category", e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        >
          {EVENT_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-1.5 text-sm">
          Venue name
          <input
            required
            value={values.venueName}
            onChange={(e) => update("venueName", e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          Address
          <input
            required
            value={values.venueAddress}
            onChange={(e) => update("venueAddress", e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          City
          <input
            required
            value={values.venueCity}
            onChange={(e) => update("venueCity", e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          Starts at
          <input
            required
            type="datetime-local"
            value={values.startsAt}
            onChange={(e) => update("startsAt", e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          Ends at
          <input
            required
            type="datetime-local"
            value={values.endsAt}
            onChange={(e) => update("endsAt", e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-sm">
        External ticket link (optional)
        <input
          type="url"
          placeholder="https://example.com/your-event"
          value={values.externalUrl}
          onChange={(e) => update("externalUrl", e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <span className="text-xs text-muted">
          If tickets are sold elsewhere (e.g. another platform), add the link here — Techet will
          list the event for discovery and send buyers there instead of its own checkout.
        </span>
      </label>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Ticket types</h2>
          <button
            type="button"
            onClick={addTicket}
            className="text-xs font-medium text-accent hover:underline"
          >
            + Add ticket type
          </button>
        </div>
        <div className="mt-3 flex flex-col gap-3">
          {values.ticketTypes.map((t, i) => {
            const locked = (t.sold ?? 0) > 0;
            return (
              <div
                key={t.id ?? i}
                className="grid grid-cols-1 gap-2 rounded-xl border border-border p-3 sm:grid-cols-[2fr_1fr_1fr_auto]"
              >
                <input
                  required
                  placeholder="Name"
                  value={t.name}
                  disabled={locked}
                  onChange={(e) => updateTicket(i, { name: e.target.value })}
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent disabled:opacity-60"
                />
                <input
                  required
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="Price (KES)"
                  value={t.price}
                  disabled={locked}
                  onChange={(e) => updateTicket(i, { price: Number(e.target.value) })}
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent disabled:opacity-60"
                />
                <input
                  required
                  type="number"
                  min={Math.max(1, t.sold ?? 0)}
                  placeholder="Quantity"
                  value={t.quantity}
                  onChange={(e) => updateTicket(i, { quantity: Number(e.target.value) })}
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                />
                <button
                  type="button"
                  onClick={() => removeTicket(i)}
                  disabled={locked || values.ticketTypes.length === 1}
                  className="rounded-lg border border-border px-3 py-2 text-xs disabled:opacity-40"
                  title={locked ? "Already sold — can't remove" : "Remove"}
                >
                  Remove
                </button>
                {locked && (
                  <p className="col-span-full text-xs text-muted">
                    {t.sold} sold — name, price locked; quantity can only increase.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="self-start rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Saving…" : mode === "create" ? "Create event" : "Save changes"}
      </button>
      {mode === "create" && (
        <p className="text-xs text-muted">
          New events start as a draft and need admin approval before they go live.
        </p>
      )}
    </form>
  );
}
