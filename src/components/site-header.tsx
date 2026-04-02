import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="text-sm font-semibold tracking-tight text-foreground">
          ~/portfolio
        </Link>
        <nav className="flex items-center gap-3">
          <Link
            href="/admin"
            className="text-sm text-muted transition hover:text-accent"
          >
            Admin
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
