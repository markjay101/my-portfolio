"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setPending(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        setError(j.error || "Login failed");
        return;
      }
      router.push(next);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-16">
      <div className="mb-6 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="text-sm text-muted transition hover:text-accent"
        >
          ← Back to site
        </Link>
        <ThemeToggle />
      </div>
      <h1 className="mb-6 text-lg font-semibold text-foreground">Admin login</h1>
      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded border border-border bg-surface p-6"
      >
        {error ? (
          <p className="text-sm text-red-500 dark:text-red-400" role="alert">
            {error}
          </p>
        ) : null}
        <label className="block text-sm">
          <span className="text-muted">Username</span>
          <input
            name="username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-foreground"
            required
          />
        </label>
        <label className="block text-sm">
          <span className="text-muted">Password</span>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-foreground"
            required
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded border border-accent bg-accent px-3 py-2 text-sm font-medium text-accent-fg transition hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
