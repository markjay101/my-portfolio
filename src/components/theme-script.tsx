/** Inline script to apply stored theme before paint (avoids flash). */
export function ThemeScript() {
  const code = `
(function() {
  try {
    var k = 'portfolio-theme';
    var stored = localStorage.getItem(k);
    var dark =
      stored === 'dark' ||
      (stored !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', dark);
  } catch (e) {}
})();`;
  return (
    <script
      dangerouslySetInnerHTML={{ __html: code }}
      suppressHydrationWarning
    />
  );
}
