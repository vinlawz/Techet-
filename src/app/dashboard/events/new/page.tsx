import { redirect } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EventForm, emptyEventForm } from "@/components/organizer/EventForm";

export default async function NewEventPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/dashboard/events/new");

  const organizer = await prisma.organizer.findUnique({ where: { userId: session.user.id } });
  if (!organizer) {
    return (
      <>
        <Navbar />
        <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
          <p className="text-muted">
            This account doesn&apos;t have an organizer profile.{" "}
            <Link href="/register?role=organizer" className="text-accent underline">
              Create one
            </Link>{" "}
            to list events.
          </p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <h1 className="text-2xl font-bold">New event</h1>
        <p className="mt-1 text-sm text-muted">Fill in the details, then submit for approval.</p>
        <div className="mt-8">
          <EventForm mode="create" initial={emptyEventForm} />
        </div>
      </main>
      <Footer />
    </>
  );
}
