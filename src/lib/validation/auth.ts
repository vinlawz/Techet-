import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password is too long"),
});

export const organizerRegisterSchema = registerSchema.extend({
  displayName: z.string().trim().min(2, "Organizer name must be at least 2 characters").max(100),
  bio: z.string().trim().max(500).optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type OrganizerRegisterInput = z.infer<typeof organizerRegisterSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
