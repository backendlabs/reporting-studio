"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { SAMPLE_CLIENT, unlockSession } from "@/lib/auth";
import { Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password === SAMPLE_CLIENT.password) {
      unlockSession();
      router.push("/dashboard");
    } else {
      setError("That password isn't right — try again.");
    }
  }

  return (
    <main className="flex min-h-full items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-5 h-14 w-14 overflow-hidden rounded-full">
            <Image
              src="/logo.png"
              alt={`${SAMPLE_CLIENT.name} logo`}
              width={56}
              height={56}
              className="h-full w-full object-cover"
            />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
            Reporting Studio
          </p>
          <h1 className="mt-2 font-display text-2xl text-ink">
            {SAMPLE_CLIENT.name}
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            This link is private to your account.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-line bg-card p-6 shadow-[0_1px_2px_rgba(16,34,44,0.04)]"
        >
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
            Password
          </label>
          <div className="flex items-center gap-2 rounded-lg border border-line bg-paper px-3 py-2.5 focus-within:border-brand">
            <Lock className="h-4 w-4 shrink-0 text-ink-soft" strokeWidth={1.75} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-soft/60"
              autoFocus
            />
          </div>
          {error && (
            <p className="mt-2 text-xs font-medium text-down">{error}</p>
          )}
          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-brand py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-deep"
          >
            View Report
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-ink-soft">
          Each client gets their own unique link and password.
        </p>
      </div>
    </main>
  );
}
