import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export type AuthorizedOrganizer = { organizerId: string; isAdmin: boolean };

// Resolves the caller's own Organizer profile. Admins may act on any organizer's event
// but don't get an organizerId here — callers should check event ownership separately for admins.
export async function requireOrganizer(): Promise<
  { ok: true; organizerId: string; isAdmin: boolean } | { ok: false; status: number; error: string }
> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, status: 401, error: "Please sign in." };

  const role = session.user.role;
  if (role !== "ORGANIZER" && role !== "ADMIN") {
    return { ok: false, status: 403, error: "Organizer account required." };
  }

  const organizer = await prisma.organizer.findUnique({ where: { userId: session.user.id } });
  if (!organizer && role !== "ADMIN") {
    return {
      ok: false,
      status: 403,
      error: "No organizer profile found for this account.",
    };
  }

  return { ok: true, organizerId: organizer?.id ?? "", isAdmin: role === "ADMIN" };
}
