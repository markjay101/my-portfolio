"use client";

import { ThemeToggle } from "./theme-toggle";

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 4h16v16H4z" opacity="0" />
      <path d="M4 6h16v12H4z" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 3v10" />
      <path d="m7 11 5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}

export function SiteHeader({
  onContactClick,
}: {
  onContactClick?: () => void;
}) {
  const cvUrl = process.env.NEXT_PUBLIC_CV_URL || "#";
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const mailto = contactEmail ? `mailto:${contactEmail}` : undefined;

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (onContactClick) return onContactClick();
              if (mailto) window.location.href = mailto;
            }}
            disabled={!onContactClick && !mailto}
            className="inline-flex items-center gap-2 rounded border border-border bg-transparent px-3 py-1.5 text-sm text-muted transition hover:border-accent hover:text-accent disabled:opacity-60"
          >
            <MailIcon className="h-4 w-4" />
            <span>Contact Me</span>
          </button>
          <a
            href={cvUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded border border-border bg-transparent px-3 py-1.5 text-sm text-muted transition hover:border-accent hover:text-accent disabled:opacity-60"
          >
            <DownloadIcon className="h-4 w-4" />
            <span>Download CV</span>
          </a>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
