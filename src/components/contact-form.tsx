"use client";

import { useEffect, useState } from "react";

export function ContactModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) {
  const [form, setForm] = useState({
    email: "",
    subject: "",
    message: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [animateIn, setAnimateIn] = useState(false);
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setAnimateIn(false);
    setPending(false);
    setSent(false);
    const t = window.setTimeout(() => setAnimateIn(true), 0);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, setOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    setSent(false);

    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then(async (res) => {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        if (!res.ok) throw new Error(j.error || "Failed to send message");
        setForm({ email: "", subject: "", message: "" });
        setSent(true);
        window.setTimeout(() => setOpen(false), 900);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to send message");
      })
      .finally(() => setPending(false));
  }

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity duration-300 ease-out ${
        animateIn ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Contact form"
        className={`w-full max-w-md rounded-lg border border-border bg-background p-6 shadow-lg transform-gpu transition-[transform,opacity] duration-300 ease-out ${
          animateIn
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-2"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Contact Me</h3>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded border border-border px-2 py-1 text-sm text-muted hover:border-accent hover:text-accent"
            aria-label="Close contact modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {error ? (
            <p className="text-sm text-red-500" role="alert">
              {error}
            </p>
          ) : null}
          {sent ? (
            <p className="text-sm text-foreground/90">
              Thanks! Your message has been sent.
            </p>
          ) : null}

          <input
            type="email"
            name="email"
            placeholder="Your email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full rounded border border-border px-3 py-2 text-sm bg-transparent"
          />

          <input
            name="subject"
            placeholder="Subject"
            value={form.subject}
            onChange={handleChange}
            required
            className="w-full rounded border border-border px-3 py-2 text-sm bg-transparent"
          />

          <textarea
            name="message"
            placeholder="Message"
            value={form.message}
            onChange={handleChange}
            required
            rows={5}
            className="w-full rounded border border-border px-3 py-2 text-sm bg-transparent"
          />

          <button
            type="submit"
            className="w-full rounded bg-accent px-4 py-2 text-sm text-accent-fg hover:opacity-90 transition"
            disabled={pending}
          >
            {pending ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
