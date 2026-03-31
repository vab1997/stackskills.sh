# stackskillssh

CLI to discover and install AI agent skills for your tech stack.

Reads your `package.json`, uses an LLM to identify the technologies in your stack, finds the most popular [skills.sh](https://skills.sh) skills for each technology, and installs them into your coding agent of choice — all in one interactive command.

## Usage

Run it from the root of any Node.js project:

```bash
npx stackskillssh
```

No global installation required.

## Configuration

The CLI requires a **Vercel AI Gateway** API key to call the LLM that identifies your technologies.

```bash
# Option 1 — .env file in the directory where you run the command
AI_GATEWAY_API_KEY=your_key_here

# Option 2 — system environment variable
export AI_GATEWAY_API_KEY=your_key_here
```

If the key is missing, the CLI will exit immediately with a descriptive error before doing anything else.

## How it works

```
package.json  →  LLM detection  →  skills.sh search  →  select  →  install
```

1. **Reads your `package.json`** — extracts all keys from `dependencies` and `devDependencies`.

2. **Identifies your stack** — sends the package list to an LLM that returns the stack-defining technologies. It understands semantic mappings: `next` → `nextjs`, `pg` → `postgres`, `@tanstack/react-query` → `react-query`, etc. Skips utilities, linters, and build tools.

3. **Searches skills.sh** — for each detected technology, fetches the top 5 skills from the [skills.sh](https://skills.sh) API, sorted by install count.

4. **You select skills** — an interactive grouped multi-select lets you pick exactly which skills to install, organized by technology.

5. **You select agents** — choose one or more coding agents to install to (Claude Code, Cursor, GitHub Copilot, and [30+ more](#supported-agents)).

6. **Installs concurrently** — runs up to 3 installations in parallel with live animated spinners per skill. Each install runs:

   ```
   npx -y skills add <repo> --skill <name> -a <agent> -y
   ```

7. **Reports results** — each skill shows `✔` or `✘`, with a final count summary.

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

## How the LLM detection works

The CLI uses [Vercel AI SDK v6](https://sdk.vercel.ai) with structured output (Zod schema) to extract technologies from your dependency list.

It rotates across **9 models** with automatic fallback if one fails:

- `mistral/ministral-3b`
- `google/gemini-2.0-flash-lite`
- `google/gemini-2.5-flash-lite`
- `openai/gpt-4.1-nano`
- `openai/gpt-4o-mini`
- `openai/gpt-5-nano`
- and more

The prompt instructs the model to return only stack-defining technologies — frameworks, databases, ORMs, auth systems, UI libraries — and map npm package names to their community slugs. Generic utilities (`lodash`, `uuid`, `clsx`) and build tools (`eslint`, `vite`, `typescript`) are omitted.

## Requirements

- Node.js 18+
- `AI_GATEWAY_API_KEY` — Vercel AI Gateway key
- A `package.json` in the current working directory

## Project structure

```
src/
├── main.mjs                # CLI entrypoint — orchestrates the full flow
├── config.mjs              # Env var validation with Zod (fails fast if missing)
├── merge-dependencies.mjs  # Merges deps + devDeps into a flat string[]
├── identify-tech.mjs       # LLM tech detection with 9-model fallback
├── search-skills.mjs       # skills.sh API client — top 5 skills per technology
├── agents.mjs              # Hardcoded list of 30+ supported agents
├── install-skills.mjs      # Concurrent installer with animated multi-line spinners
└── colors.mjs              # ANSI color helpers (dim, green, cyan, red)
```

## License

MIT
