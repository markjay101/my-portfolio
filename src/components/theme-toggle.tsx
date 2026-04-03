"use client";

import { useTheme } from "./theme-provider";

function SunIcon({ className }: { className?: string }) {
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
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
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
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

export function ThemeToggle() {
  const { theme, mounted, toggleTheme } = useTheme();

  if (!mounted) {
    return (
      <span
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-transparent"
        aria-hidden
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="group relative inline-flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-surface text-foreground shadow-sm transition-[border-color,box-shadow,transform,background-color] duration-300 ease-out hover:border-accent hover:text-accent hover:shadow-md active:scale-95 cursor-pointer"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
    >
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <SunIcon
          className={`transition-all duration-300 ease-out ${
            isDark
              ? "scale-50 -rotate-90 opacity-0"
              : "scale-100 rotate-0 opacity-100"
          }`}
        />
      </span>
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <MoonIcon
          className={`transition-all duration-300 ease-out ${
            isDark
              ? "scale-100 rotate-0 opacity-100"
              : "scale-50 rotate-90 opacity-0"
          }`}
        />
      </span>
    </button>
  );
}
