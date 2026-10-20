"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const asOrganizer = searchParams.get("role") === "organizer";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        asOrganizer ? { name, email, password, displayName, bio } : { name, email, password },
      ),
    });

    const data = await res.json();

    if (!res.ok) {
      setLoading(false);
      setError(data.error ?? "Something went wrong");
      return;
    }

    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);

    if (result?.error) {
      router.push("/login");
      return;
    }

    router.push(asOrganizer ? "/dashboard" : "/");
    router.refresh();
  }

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8">
        <h1 className="text-2xl font-bold tracking-tight">
          {asOrganizer ? "Create your organizer account" : "Create your account"}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {asOrganizer
            ? "Set up your organizer profile and start dropping events."
            : "Sawa, let's get you in — book tickets in seconds."}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm">
            Your name
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            Password
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </label>

          {asOrganizer && (
            <>
              <label className="flex flex-col gap-1.5 text-sm">
                Organizer / brand name
                <input
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Techet Collective"
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm">
                Short bio (optional)
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                />
              </label>
            </>
          )}

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-foreground underline underline-offset-4">
            Log in
          </Link>
        </p>
        {!asOrganizer && (
          <p className="mt-2 text-sm text-muted">
            Hosting an event?{" "}
            <Link href="/register?role=organizer" className="text-foreground underline underline-offset-4">
              Sign up as an organizer
            </Link>
          </p>
        )}
      </div>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
