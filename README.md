# StackSkills

<a href="https://stackskills.sh">
<img src="https://stackskills.sh/opengraph-image" alt="stackskills" />
</a>

Skill discovery platform for developers. Paste your `package.json` and instantly get a curated set of [skills.sh](https://skills.sh) skills matched to your tech stack — ready to install into your coding agent of choice.

## What it does

1. **Analyzes your stack** — paste your `package.json` or connect your GitHub repo. StackSkills maps your dependencies against a curated library of 80+ packages to identify the technologies you're using. No LLM, no latency — instant and deterministic.

2. **Finds the best skills** — for each detected technology, the top skills from [skills.sh](https://skills.sh) are fetched and ranked by install count.

3. **Generates the install command** — select the skills you want, pick your agent (Claude Code, Cursor, Copilot, Windsurf, and 25+ more), and copy the complete install command — flags included, ready to paste in your terminal.

## CLI

There's also a CLI if you prefer to stay in the terminal:

```bash
npx stackskills
```

It reads your `package.json` directly from the current directory, detects your stack, lets you pick skills and agents interactively, and installs everything concurrently. No API key required.

→ See [`packages/stackskills`](./packages/stackskills) for full CLI documentation.

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript 5**
- **Tailwind CSS v4**
- **Drizzle ORM** + **PostgreSQL**
- **better-auth** — GitHub OAuth
- **next-safe-action** + **Zod** — type-safe server actions
- **shadcn/ui** + **Radix UI**

## Development

```bash
pnpm install
pnpm dev        # starts Next.js dev server + Docker PostgreSQL
```

Environment variables required — see `.env.example`.

```bash
pnpm db:up        # start Docker PostgreSQL
pnpm db:migrate   # run pending migrations
pnpm build        # production build
pnpm lint         # ESLint
pnpm format       # Prettier
```

## License

MIT © 2026 [Victor Bejas](https://github.com/vab1997)
