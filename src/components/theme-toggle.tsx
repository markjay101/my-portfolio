"use client";

import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, mounted, toggleTheme } = useTheme();

  if (!mounted) {
    return (
      <span className="inline-block min-w-[4.5rem] rounded border border-transparent px-3 py-1.5 text-sm opacity-0">
        —
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded border border-border bg-surface px-3 py-1.5 text-sm text-foreground transition hover:border-accent hover:text-accent"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}
