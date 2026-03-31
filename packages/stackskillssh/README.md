# stackskillssh

CLI to discover and install AI agent skills for your tech stack.

Reads your `package.json`, identifies the technologies in your stack, finds the most popular [skills.sh](https://skills.sh) skills for each technology, and installs them into your coding agent of choice — all in one interactive command.

## Usage

Run it from the root of any Node.js project:

```bash
npx stackskillssh
```

No global installation required. No API key needed.

## How it works

```
package.json  →  map detection  →  skills.sh search  →  select  →  install
```

1. **Reads your `package.json`** — extracts all keys from `dependencies` and `devDependencies`.

2. **Identifies your stack** — maps each package against a curated `PACKAGE_MAP` of ~80 npm packages → technology slugs. Instant and deterministic: no LLM, no network call. Handles semantic remappings: `next` → `nextjs`, `pg` → `postgres`, `@tanstack/react-query` → `react-query`, etc.

3. **Searches skills.sh** — for each detected technology, fetches the top 5 skills from the [skills.sh](https://skills.sh) API, sorted by install count.

4. **Shows curated skills** — a `⭐ curated` group always appears at the end of the selector with high-value skills regardless of your stack (see [Curated skills](#curated-skills)).

5. **You select skills** — an interactive grouped multi-select lets you pick exactly which skills to install, organized by technology.

6. **You select agents** — choose one or more coding agents to install to (Claude Code, Cursor, GitHub Copilot, and [30+ more](#supported-agents)).

7. **Installs concurrently** — runs up to 3 installations in parallel with live animated spinners per skill. Each install runs:

   ```
   npx -y skills add <repo> --skill <name> -a <agent> -y
   ```

8. **Reports results** — each skill shows `✔` or `✘`, with a final count summary.

## Curated skills

In addition to the skills found for your detected stack, the CLI always shows a `⭐ curated` group with high-value skills:

| Skill | Condition | Source |
|---|---|---|
| `nextjs-caching` | `next` in deps | goncy/nextjs-skills |
| `nextjs-rendering` | `next` in deps | goncy/nextjs-skills |
| `nextjs-navigation` | `next` in deps | goncy/nextjs-skills |
| `performance` | always | addyosmani/web-quality-skills |
| `accessibility` | always | addyosmani/web-quality-skills |
| `core-web-vitals` | always | addyosmani/web-quality-skills |
| `best-practices` | always | addyosmani/web-quality-skills |

Curated skills are fetched live from skills.sh so install counts are always fresh.

## Supported agents

| Agent          | `--agent` slug   | Install path        |
| -------------- | ---------------- | ------------------- |
| Claude Code    | `claude-code`    | `.claude/skills/`   |
| Cursor         | `cursor`         | `.agents/skills/`   |
| GitHub Copilot | `github-copilot` | `.agents/skills/`   |
| OpenCode       | `opencode`       | `.agents/skills/`   |
| Windsurf       | `windsurf`       | `.windsurf/skills/` |
| Cline          | `cline`          | `.agents/skills/`   |
| Codex          | `codex`          | `.agents/skills/`   |
| Augment        | `augment`        | `.augment/skills/`  |
| Gemini CLI     | `gemini-cli`     | `.agents/skills/`   |
| Roo Code       | `roo`            | `.roo/skills/`      |
| Continue       | `continue`       | `.continue/skills/` |
| Goose          | `goose`          | `.goose/skills/`    |

30+ agents total. Full list available in the [vercel-labs/skills](https://github.com/vercel-labs/skills#supported-agents) repository.

## How stack detection works

The CLI uses a static `PACKAGE_MAP` — a curated `Map<npmPackage, slug>` covering the most common packages across:

- **Frontend**: React, Next.js, Vue, Nuxt, Svelte, SvelteKit, Astro, Remix, Gatsby, Angular, Qwik, SolidJS
- **Backend**: tRPC, NestJS, Express, Fastify, Hono, Koa, Elysia
- **CMS**: Payload, Directus, Strapi, Sanity, Contentful, Keystatic, TinaCMS
- **ORMs & databases**: Drizzle, Prisma, TypeORM, Sequelize, Mongoose, MikroORM, PostgreSQL, MySQL, SQLite, Redis
- **UI libraries**: shadcn/ui, Mantine, Ant Design, Material UI, Chakra UI, DaisyUI, NextUI, HeroUI
- **Auth**: Auth.js, Better Auth, Clerk, Passport, Lucia
- **State**: Zustand, Jotai, Recoil, Valtio, Redux, MobX
- **Data fetching**: React Query, SWR, Apollo, GraphQL
- **Testing**: Vitest, Jest, Playwright, Cypress
- **AI / LLM**: Vercel AI SDK, LangChain, OpenAI
- **Language & styling**: TypeScript, Tailwind CSS, Zod

Deduplication is handled automatically — `react` + `react-dom` both map to `react` and only appear once.

## Requirements

- Node.js 18+
- A `package.json` in the current working directory

## Project structure

```
src/
├── main.mjs                # CLI entrypoint — orchestrates the full flow
├── merge-dependencies.mjs  # Merges deps + devDeps into a flat string[]
├── identify-tech-map.mjs   # Static PACKAGE_MAP detection + curated skills
├── identify-tech.mjs       # LLM-based tech detection (kept for reference)
├── search-skills.mjs       # skills.sh API client — top 5 skills per technology
├── agents.mjs              # Hardcoded list of 30+ supported agents
├── install-skills.mjs      # Concurrent installer with animated multi-line spinners
└── colors.mjs              # ANSI color helpers (dim, green, cyan, red)
```

## License

MIT
