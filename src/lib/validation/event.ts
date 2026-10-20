import { z } from "zod";
import { EVENT_CATEGORIES } from "@/lib/categories";

export const ticketTypeInputSchema = z.object({
  id: z.string().optional(), // present when editing an existing ticket type
  name: z.string().trim().min(1, "Ticket name is required").max(60),
  price: z.number().min(0, "Price can't be negative"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

export const eventInputSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(140),
  description: z.string().trim().min(10, "Tell attendees a bit more about the event").max(4000),
  category: z.enum(EVENT_CATEGORIES, { message: "Choose a category" }),
  venueName: z.string().trim().min(1, "Venue name is required").max(140),
  venueAddress: z.string().trim().min(1, "Venue address is required").max(200),
  venueCity: z.string().trim().min(1, "City is required").max(100),
  startsAt: z.string().refine((v) => !Number.isNaN(Date.parse(v)), "Invalid start date"),
  endsAt: z.string().refine((v) => !Number.isNaN(Date.parse(v)), "Invalid end date"),
  externalUrl: z
    .string()
    .trim()
    .url("Enter a full link, e.g. https://example.com/event")
    .max(500)
    .optional()
    .or(z.literal("")),
  ticketTypes: z.array(ticketTypeInputSchema).min(1, "Add at least one ticket type"),
});

export type EventInput = z.infer<typeof eventInputSchema>;
export type TicketTypeInput = z.infer<typeof ticketTypeInputSchema>;
