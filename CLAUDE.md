# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev       # Start dev server at http://localhost:3000
pnpm build     # Production build
pnpm start     # Start production server
pnpm lint      # Run ESLint
```

## Architecture

This is a **Next.js 16 App Router** project (no `src/` directory — the `app/` folder is at the root).

- **`app/layout.tsx`** — Root layout; loads Geist Sans and Geist Mono via `next/font/google` and applies them as CSS variables (`--font-geist-sans`, `--font-geist-mono`).
- **`app/globals.css`** — Tailwind CSS v4 (imported via `@import "tailwindcss"`), with CSS custom properties for background/foreground and `@theme inline` for font tokens. Dark mode is handled via `prefers-color-scheme`.
- **`app/page.tsx`** — Home page (currently the default create-next-app starter).

**Path alias:** `@/*` maps to the repo root (e.g., `@/app/...`, `@/components/...`).

**Styling:** Tailwind CSS v4 — use utility classes directly. No `tailwind.config` file; configuration is done in `globals.css` via `@theme`.

**Package manager:** pnpm (see `pnpm-workspace.yaml`).

**TypeScript:** strict mode enabled. No `any` types without explicit justification.
