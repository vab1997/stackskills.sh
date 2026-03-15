export function Footer() {
  return (
    <footer className="relative mx-auto flex max-w-6xl flex-col items-start justify-start gap-2 px-4 pb-10 md:flex-row md:items-center md:justify-between">
      <span className="text-muted-foreground/80 text-sm leading-snug uppercase">
        (c) 2026 stackskills.sh all rights reserved.
      </span>
      <a
        href="https://x.com/victorbejas"
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground/80 hover:text-muted-foreground text-sm leading-snug uppercase transition-colors"
      >
        @victorbejas
      </a>
    </footer>
  );
}
