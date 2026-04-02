import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="flex items-center justify-between gap-4">
        <p className="text-muted">Theme + Tailwind</p>
        <ThemeToggle />
      </div>
    </div>
  );
}
