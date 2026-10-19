import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema, organizerRegisterSchema } from "@/lib/validation/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const asOrganizer = typeof body?.displayName === "string";

  if (asOrganizer) {
    const parsed = organizerRegisterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }
    return createUser({ ...parsed.data, role: "ORGANIZER" });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }
  return createUser({ ...parsed.data, role: "CUSTOMER" });
}

async function createUser(input: {
  name: string;
  email: string;
  password: string;
  role: "CUSTOMER" | "ORGANIZER";
  displayName?: string;
  bio?: string;
}) {
  try {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    // Role comes only from this trusted branch; the client never supplies it directly.
    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash,
        role: input.role,
        ...(input.role === "ORGANIZER"
          ? { organizer: { create: { displayName: input.displayName!, bio: input.bio } } }
          : {}),
      },
      select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("[register] failed:", error);
    return NextResponse.json(
      { error: "Registration is temporarily unavailable. Please try again shortly." },
      { status: 503 },
    );
  }
}
