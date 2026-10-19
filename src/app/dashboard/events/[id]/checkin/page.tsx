import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CheckinScanner } from "@/components/organizer/CheckinScanner";

export default async function CheckinPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect(`/login?callbackUrl=/dashboard/events/${id}/checkin`);

  const event = await prisma.event.findUnique({
    where: { id },
    include: { organizer: true },
  });
  if (!event) notFound();

  const isOwner = event.organizer.userId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";
  if (!isOwner && !isAdmin) redirect("/dashboard");

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-xl flex-1 px-6 py-12">
        <Link href={`/dashboard/events/${id}/edit`} className="text-sm text-muted hover:text-foreground">
          ← Back to event
        </Link>
        <h1 className="mt-4 text-2xl font-bold">Check in · {event.title}</h1>
        <p className="mt-1 text-sm text-muted">
          Scan a ticket's QR code or paste its code to mark it used at the door.
        </p>
        <div className="mt-8">
          <CheckinScanner />
        </div>
      </main>
      <Footer />
    </>
  );
}
