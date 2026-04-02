import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl justify-end px-4 py-3 sm:px-6">
        <ThemeToggle />
      </div>
    </header>
  );
}
