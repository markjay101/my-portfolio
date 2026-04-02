export function Hero() {
  return (
    <section className="border-b border-border py-16 sm:py-20">
      <p className="mb-2 text-sm text-accent">Hi, I&apos;m</p>
      <h1 className="mb-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        A developer building things for the web.
      </h1>
      <p className="max-w-xl text-sm leading-relaxed text-muted sm:text-base">
        This portfolio is a minimal Next.js app with JSON-backed content, a
        protected admin area, and light/dark theming.
      </p>
    </section>
  );
}
