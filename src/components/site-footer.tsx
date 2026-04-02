import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background/80 backdrop-blur">
      <div className="flex flex-col mx-auto max-w-6xl px-4 py-6 items-center justify-between gap-4 text-sm text-muted-foreground">
        <p className="text-muted text-center">
          Open for part-time & freelance opportunities
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/markjay101"
            target="_blank"
            className="text-accent"
          >
            Github
          </Link>
          <Link
            href="https://www.linkedin.com/in/mark-jay-cuyos-630977268/"
            target="_blank"
            className="text-accent"
          >
            LinkedIn
          </Link>
        </div>
        <p className="text-muted text-center">
          © {new Date().getFullYear()} Mark Jay Cuyos — Built with Next.js &
          Tailwind CSS
        </p>
      </div>
    </footer>
  );
}
