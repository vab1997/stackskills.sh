# StackSkills Architecture

> **Audience:** AI agents (Claude, Copilot, etc.) working on this codebase.
> This document is the single source of truth for project structure, conventions, and patterns.

---

## 1. Project Overview

**StackSkills** is an AI skill discovery platform for developers.

### What it does

StackSkills analyzes a project's `package.json` dependencies using an LLM to identify the technologies in use, then queries the skills.sh API to surface relevant AI agent skills the developer can install. The goal is to reduce friction in discovering and adopting community skills for AI-assisted development.

### Core user journey

```
GitHub login
  → input package.json (via GitHub repo selector or manual paste)
  → LLM identifies technologies from dependencies
  → skills.sh API returns matching skills
  → user copies install command
```

---

## 2. Tech Stack

| Technology                     | Version | Purpose                                        |
| ------------------------------ | ------- | ---------------------------------------------- |
| Next.js                        | 16.1.6  | App Router, SSR, API routes                    |
| React                          | 19      | UI framework                                   |
| TypeScript                     | 5       | Language (strict mode)                         |
| Tailwind CSS                   | v4      | Styling (no config file — via `@theme` in CSS) |
| Drizzle ORM                    | latest  | Database ORM                                   |
| PostgreSQL                     | —       | Database (Docker in dev)                       |
| better-auth                    | latest  | Authentication (GitHub OAuth)                  |
| Vercel AI SDK                  | latest  | LLM integration                                |
| OpenRouter                     | —       | LLM gateway (multi-model fallback)             |
| next-safe-action               | latest  | Type-safe server actions                       |
| Zod                            | latest  | Schema validation                              |
| Radix UI / shadcn/ui / Base UI | latest  | UI primitives                                  |
| Motion                         | latest  | Animations                                     |
| Sonner                         | latest  | Toast notifications                            |
| Lucide React                   | latest  | Icons                                          |
| react-shiki                    | latest  | Syntax highlighting                            |
| Pino                           | latest  | Server-side logging                            |

---

## 3. Directory Structure

**All application source code lives inside `src/`.** Root-level files are config only (`next.config.ts`, `tsconfig.json`, `drizzle.config.ts`, `docker-compose.yml`, etc.).

```
src/
├── app/                          # Next.js App Router routes
│   ├── api/
│   │   └── auth/
│   │       └── [...all]/         # Better-auth catch-all handler
│   ├── oauth-popup-callback/     # GitHub OAuth popup callback route
│   ├── globals.css               # Tailwind v4 + CSS custom properties
│   ├── layout.tsx                # Root layout (fonts, providers)
│   └── page.tsx                  # Home page (entry point)
│
├── features/                     # Feature modules (co-located)
│   ├── auth/                     # Everything auth-related
│   │   ├── auth.ts               # better-auth config
│   │   ├── server.ts             # Server-side session helpers
│   │   ├── client.ts             # Client-side auth helpers
│   │   ├── components/           # Auth UI (login button, etc.)
│   │   └── hooks/                # Auth hooks
│   └── skills/                   # Core feature: skill discovery
│       ├── actions/              # Server actions (thin, delegate to services)
│       ├── components/           # Skills UI components
│       ├── hooks/                # Skills hooks
│       ├── services/             # Business logic (LLM calls, API calls)
│       └── types.ts              # Feature-level types
│
├── components/                   # Shared UI components
│   ├── ui/                       # shadcn primitives (Button, Input, etc.)
│   ├── layout/                   # Header, Footer, Hero
│   └── skeletons/                # Loading skeleton components
│
├── db/                           # Database layer
│   ├── schema.ts                 # Drizzle table definitions
│   ├── index.ts                  # DB client export
│   └── drizzle/                  # Generated migrations
│
├── hooks/                        # Shared hooks (cross-feature)
│   └── use-safe-action.tsx       # Wrapper for next-safe-action
│
└── lib/                          # Utilities, config, constants
    ├── utils.ts                  # cn() and general helpers
    ├── constants.ts              # App-wide constants
    ├── config.ts                 # Env variable validation (Zod)
    └── safe-action.ts            # actionClient factory
```

---

## 4. Architecture Patterns

### Feature-based organization

Each feature lives in `src/features/<feature>/` with its own internal structure:

```
src/features/<feature>/
├── actions/       # Server actions (input validation, delegate to service)
├── components/    # Feature-specific UI
├── hooks/         # Feature-specific hooks
├── services/      # Business logic (pure async functions)
└── types.ts       # Types specific to this feature
```

Co-location principle: everything a feature needs is in its folder. Shared things go in `src/components/`, `src/hooks/`, or `src/lib/`.

### Server vs Client components

- **Default:** server components (no directive needed)
- **Client boundary:** explicit `"use client"` at top of file
- **Data fetching:** async server components + `<Suspense>` boundaries for streaming

### Data flow

```
Component
  → useHook (client)
    → Server Action (next-safe-action + Zod validation)
      → Service (business logic)
        → External API / DB
```

### Server actions pattern

- All actions use `actionClient` from `src/lib/safe-action.ts`
- Input validated with Zod schemas via `.inputSchema(z.object({...}))`
- Called on the client via `useSafeAction` hook from `src/hooks/use-safe-action.tsx`
- **Actions are thin:** validate input, call service, return result — no business logic inside actions

```ts
// Example pattern
export const myAction = actionClient
  .inputSchema(z.object({ foo: z.string() }))
  .action(async ({ parsedInput }) => {
    return await myService(parsedInput.foo);
  });
```

### Business logic lives in services

- All logic (LLM calls, GitHub API, data transformation) in `src/features/<feature>/services/`
- Services are plain async functions — zero framework coupling
- Actions call services; **components never call services directly**

---

## 5. Database

- **Database:** PostgreSQL, run via Docker in development (`docker-compose.yml`)
- **ORM:** Drizzle ORM
- **Schema:** `src/db/schema.ts`
- **Migrations:** `src/db/drizzle/`
- **Tables:** `user`, `session`, `account`, `verification` — all managed by better-auth
- **Config:** `drizzle.config.ts` at repo root

---

## 6. Authentication

- **Provider:** better-auth with GitHub OAuth
- **Scopes:**
  - Default: `read:user email` (public repo access)
  - Extended: `repo` (for private repo access, requested on demand)
- **OAuth popup flow:** handled by `/oauth-popup-callback` route to avoid full-page redirects
- **Server session:** `src/features/auth/server.ts`
- **Client auth:** `src/features/auth/client.ts`
- **Auth config:** `src/features/auth/auth.ts`

---

## 7. AI / LLM Integration

- **SDK:** Vercel AI SDK (`ai` package)
- **Gateway:** OpenRouter
- **Model fallback chain:** 8 models in priority order (Mistral → Gemini → GPT variants) — if one fails or rate-limits, the next is tried automatically
- **LLM task:** maps npm package names → technology slugs
  - Input: array of npm package names (e.g., `["pg", "express", "react"]`)
  - Output: array of technology slugs (e.g., `["postgres", "express", "react"]`)
- **Prompt + orchestration:** `src/features/skills/services/get-skills.ts`

---

## 8. External APIs

| API           | Base URL               | Usage                                      |
| ------------- | ---------------------- | ------------------------------------------ |
| GitHub API    | `api.github.com`       | List repos, fetch `package.json` contents  |
| skills.sh API | `skills.sh/api/search` | Discover skills by technology slug         |
| OpenRouter    | `openrouter.ai/api`    | LLM inference (via Vercel AI SDK provider) |

---

## 9. Styling Conventions

- **Tailwind CSS v4** — no `tailwind.config.ts`; all config via `@theme inline` block in `src/app/globals.css`
- **Path alias:** `@/*` resolves to `./src/*`
- **Color system:** OKLCh color space; dark mode always active via `.dark` class
- **Utility:** `cn()` from `src/lib/utils.ts` (combines `clsx` + `tailwind-merge`)
- **Component variants:** CVA (`class-variance-authority`) for multi-variant components like buttons
- **Custom utilities:** `styled-scrollbar` utility class defined in `globals.css`
- **Never** use inline `style=` for anything achievable with Tailwind utilities

---

## 10. Naming Conventions

| Thing          | Convention                        | Example                              |
| -------------- | --------------------------------- | ------------------------------------ |
| Files          | `kebab-case`                      | `get-skills.ts`, `repo-explorer.tsx` |
| Components     | `PascalCase` named exports        | `export function RepoExplorer()`     |
| Hooks          | `use-<name>.ts`                   | `use-safe-action.tsx`                |
| Server actions | `<verb>-<noun>.ts`                | `analyze-dependencies.ts`            |
| Services       | `<verb>-<noun>.ts` in `services/` | `get-skills.ts`                      |
| Types          | `PascalCase` interface/type names | `SkillResult`, `RepoFile`            |

**No barrel `index.ts` files** — use explicit imports from the actual file path.

---

## 11. Environment Variables

All variables are validated at startup via Zod in `src/lib/config.ts`. The app will throw on startup if any required variable is missing.

| Variable               | Purpose                                       |
| ---------------------- | --------------------------------------------- |
| `DATABASE_URL`         | PostgreSQL connection string                  |
| `BETTER_AUTH_SECRET`   | Session encryption key                        |
| `BETTER_AUTH_URL`      | Auth base URL (e.g., `http://localhost:3000`) |
| `GITHUB_CLIENT_ID`     | GitHub OAuth app client ID                    |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth app client secret                |
| `OPENAI_API_KEY`       | OpenAI API key                                |
| `AI_GATEWAY_API_KEY`   | Vercel AI Gateway key                         |
| `OPENROUTER_API_KEY`   | OpenRouter API key                            |

---

## 12. Development Commands

```bash
pnpm dev          # Start dev server + Docker DB (http://localhost:3000)
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm format       # Run Prettier

pnpm db:up        # Start Docker PostgreSQL container
pnpm db:down      # Stop Docker PostgreSQL container
pnpm db:studio    # Open Drizzle ORM GUI
pnpm db:generate  # Generate new migration from schema changes
pnpm db:migrate   # Run pending migrations
```

---

## 13. Key Files Reference

Quick map for navigating the codebase:

| File                                               | Purpose                                   |
| -------------------------------------------------- | ----------------------------------------- |
| `src/app/page.tsx`                                 | Application entry point (home page)       |
| `src/app/layout.tsx`                               | Root layout, font loading, providers      |
| `src/app/globals.css`                              | Global styles, Tailwind v4 theme config   |
| `src/lib/utils.ts`                                 | `cn()` utility and general helpers        |
| `src/lib/constants.ts`                             | App-wide constants                        |
| `src/lib/config.ts`                                | Environment variable validation (Zod)     |
| `src/lib/safe-action.ts`                           | `actionClient` factory for server actions |
| `src/hooks/use-safe-action.tsx`                    | Client hook for calling server actions    |
| `src/features/auth/auth.ts`                        | better-auth configuration                 |
| `src/features/auth/server.ts`                      | Server-side session helpers               |
| `src/features/auth/client.ts`                      | Client-side auth helpers                  |
| `src/features/skills/components/repo-explorer.tsx` | Main feature orchestrator component       |
| `src/features/skills/services/get-skills.ts`       | LLM integration + skills discovery logic  |
| `src/db/schema.ts`                                 | Drizzle database schema                   |
