# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with this repository.

> For the full architecture reference see [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).

---

## Project

**StackSkills** — AI skill discovery platform for developers. Analyzes `package.json` dependencies via LLM to surface installable AI agent skills from skills.sh.

Core user journey: GitHub login → input package.json (repo selector or paste) → LLM identifies technologies → skills.sh returns matching skills → user copies install command.

---

## Commands

```bash
pnpm dev          # Start dev server + Docker DB (http://localhost:3000)
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # ESLint
pnpm format       # Prettier

pnpm db:up        # Start Docker PostgreSQL
pnpm db:down      # Stop Docker PostgreSQL
pnpm db:studio    # Drizzle ORM GUI
pnpm db:generate  # Generate migrations from schema changes
pnpm db:migrate   # Run pending migrations
```

---

## Tech Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript 5** (strict)
- **Tailwind CSS v4** — config via `@theme inline` in `src/app/globals.css`, no `tailwind.config.ts`
- **Drizzle ORM** + **PostgreSQL** (Docker in dev)
- **better-auth** — GitHub OAuth (popup flow), scopes: `read:user email` + `repo`
- **Vercel AI SDK** + **OpenRouter** — multi-model LLM fallback (8 models)
- **next-safe-action** + **Zod** — type-safe server actions
- **shadcn/ui** + **Radix UI** + **Base UI** — UI primitives
- **Motion**, **Sonner**, **Lucide React**, **react-shiki**, **Pino**

---

## Directory Structure

All source code lives in `src/`. Root-level files are config only.

```
src/
├── app/                   # Next.js App Router routes
│   ├── api/auth/[...all]/ # Better-auth handler
│   ├── oauth-popup-callback/
│   ├── globals.css        # Tailwind v4 theme + global styles
│   ├── layout.tsx         # Root layout, fonts, providers
│   └── page.tsx           # Home page (entry point)
├── features/              # Feature modules (co-located)
│   ├── auth/              # auth.ts, server.ts, client.ts, components/, hooks/
│   └── skills/            # actions/, components/, hooks/, services/, types.ts
├── components/            # Shared UI
│   ├── ui/                # shadcn primitives
│   ├── layout/            # Header, Footer, Hero
│   └── skeletons/
├── db/                    # schema.ts, index.ts, drizzle/ (migrations)
├── hooks/                 # Shared hooks (use-safe-action.tsx)
└── lib/                   # utils.ts, constants.ts, config.ts, safe-action.ts
```

---

## Architecture Patterns

### Data flow

```
Component → useHook → Server Action (next-safe-action + Zod) → Service → External API / DB
```

### Server actions

- Use `actionClient` from `src/lib/safe-action.ts` + `.inputSchema(zod)`
- **Actions are thin:** validate input, delegate to service — no business logic
- Called client-side via `useSafeAction` from `src/hooks/use-safe-action.tsx`

### Services

- All business logic in `src/features/<feature>/services/` — plain async functions
- Components never call services directly

### Components

- Default: server components. Add `"use client"` only when needed
- Data fetching: async server components + `<Suspense>` for streaming

### Feature structure

```
src/features/<feature>/
├── actions/    # Thin server actions
├── components/ # Feature UI
├── hooks/      # Feature hooks
├── services/   # Business logic (LLM, API, transforms)
└── types.ts
```

---

## Styling

- `cn()` from `src/lib/utils.ts` (clsx + tailwind-merge) for conditional classes
- CVA for component variants
- OKLCh color space; dark mode always active via `.dark` class
- `styled-scrollbar` utility defined in `globals.css`
- Never use inline `style=` for anything achievable with Tailwind

---

## Conventions

- **Files:** `kebab-case.tsx`
- **Components:** `PascalCase` named exports
- **Hooks:** `use-<name>.ts`
- **Actions/Services:** `<verb>-<noun>.ts`
- **No barrel `index.ts` files** — explicit imports
- **Path alias:** `@/*` → `./src/*`
- **No `any` types** without explicit justification

---

## Key Files

| File                                               | Purpose                        |
| -------------------------------------------------- | ------------------------------ |
| `src/app/page.tsx`                                 | Entry point                    |
| `src/app/globals.css`                              | Tailwind v4 theme              |
| `src/lib/config.ts`                                | Env variable validation (Zod)  |
| `src/lib/safe-action.ts`                           | `actionClient` factory         |
| `src/hooks/use-safe-action.tsx`                    | Client hook for server actions |
| `src/features/auth/auth.ts`                        | better-auth config             |
| `src/features/skills/components/repo-explorer.tsx` | Main feature orchestrator      |
| `src/features/skills/services/get-skills.ts`       | LLM + skills discovery logic   |
| `src/db/schema.ts`                                 | Drizzle schema                 |

---

## Environment Variables

Validated at startup via Zod in `src/lib/config.ts`.

| Variable                                    | Purpose                      |
| ------------------------------------------- | ---------------------------- |
| `DATABASE_URL`                              | PostgreSQL connection string |
| `BETTER_AUTH_SECRET`                        | Session encryption key       |
| `BETTER_AUTH_URL`                           | Auth base URL                |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub OAuth                 |
| `OPENROUTER_API_KEY`                        | OpenRouter (LLM gateway)     |
| `OPENAI_API_KEY`                            | OpenAI API key               |
| `AI_GATEWAY_API_KEY`                        | Vercel AI Gateway key        |
