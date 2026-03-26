import { MessageCircleIcon } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mx-auto flex max-w-6xl flex-col items-start justify-start gap-2 px-4 pb-10 md:flex-row md:items-center md:justify-between">
      <span className="text-muted-foreground/80 text-sm leading-snug uppercase">
        (c) 2026 stackskills.sh all rights reserved.
      </span>

      <div className="flex items-center gap-4">
        <a
          href="https://github.com/vab1997/feedback-stackskills.sh/issues/new/choose"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground/80 hover:text-muted-foreground flex items-center gap-0.5 text-sm leading-snug uppercase transition-colors"
        >
          <MessageCircleIcon className="size-3.5" />
          feedback
        </a>
        <a
          href="https://x.com/victorbejas"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground/80 hover:text-muted-foreground text-sm leading-snug uppercase transition-colors"
        >
          @victorbejas
        </a>
      </div>
    </footer>
  );
}
