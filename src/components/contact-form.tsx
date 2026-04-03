"use client";

import { useEffect, useState } from "react";

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

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

  useEffect(() => {
    if (!open) return;
    setError(null);
    setAnimateIn(false);
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
    if (!CONTACT_EMAIL) {
      setError("Contact email is not configured.");
      return;
    }

    const params = new URLSearchParams({
      subject: form.subject,
      body: `From: ${form.email}\n\n${form.message}`,
    });

    window.location.href = `mailto:${CONTACT_EMAIL}?${params.toString()}`;

    setForm({ email: "", subject: "", message: "" });
    setOpen(false);
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
          animateIn ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2"
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
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
