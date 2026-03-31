import {
  APICallError,
  generateText,
  NoSuchModelError,
  Output,
  RetryError,
} from "ai";
import z from "zod";

const IDENTIFY_PROMPT = `
You are a technology identifier for a developer tool that matches project stacks to AI agent skills.

Given a list of npm package names, identify the stack-defining technologies — those that make the
product functionally possible and that developers would search for a dedicated AI skill about.

<criterion>
A technology qualifies if it is stack-defining: a framework, database, ORM, authentication system,
state management library, UI framework, AI SDK, testing framework, or language.

AI agents already have general knowledge of these technologies, but dedicated skills provide the
procedural knowledge (patterns, idioms, best practices) that meaningfully improve their output.
</criterion>

<selection-guideline>
Prefer the minimal set of technologies that define the stack.
Avoid listing minor supporting libraries.

Typical projects should return between 3 and 12 technologies.
</selection-guideline>

<semantic-mapping>
The "key" is the community slug developers use when searching for the technology.

Rules:

• Low-level adapters map to the technology they connect to
  - "pg" → "postgres"
  - "mysql2" → "mysql"
  - "sqlite3" / "better-sqlite3" → "sqlite"
  - "ioredis" / "redis" → "redis"

• Scoped package families map to a single umbrella technology
  - "ai" + "@ai-sdk/openai" → one entry, key "ai-sdk", source "ai"
  - "prisma" + "@prisma/client" → one entry, key "prisma", source "prisma"

• When the npm package name differs from the community slug, remap it
  - "next" → "nextjs"
  - "@clerk/nextjs" → "clerk"
  - "@auth/core" → "authjs"

• When the npm package name IS the community slug, keep it
  - "react"
  - "drizzle-orm"
  - "zod"
  - "tailwindcss"
  - "vitest"
  - "shadcn"

• Framework plugins normalize to their technology
  - "@tanstack/react-query" → "react-query"
  - "@trpc/server" → "trpc"
  - "next-auth" → "authjs"

• Framework precedence
  - "react" + "react-dom" → only "react"
  - "next" + "react" → include both

• Versioned slugs
If a package clearly targets a specific major version with breaking changes,
preserve the version suffix.

Example:
zustand v5 → "zustand-5"

Otherwise omit version suffix.
</semantic-mapping>

<family-source-selection>
When multiple packages belong to the same technology family,
choose the most canonical package as "source".

Priority order:
1. Root package (e.g. "prisma", "next", "react")
2. Framework SDK (e.g. "@clerk/nextjs")
3. Avoid low-level adapters when a higher level package exists
</family-source-selection>

<component-primitives-rule>
Do not include low-level UI primitive libraries that only support higher level UI kits.

Examples to omit:
- radix-ui
- base-ui
- floating-ui
- aria libraries

Only include UI frameworks developers interact with directly (e.g. shadcn).
</component-primitives-rule>

<omit-these>
Skip:

• Type declarations
  (@types/*)

• Linters and formatters
  (eslint, prettier, biome)

• Build infrastructure
  (webpack, vite, rollup, esbuild, swc, babel, postcss)

• Generic utilities with no independent skill ecosystem
  (lodash, date-fns, uuid, clsx, classnames, ms)

• Polyfills and environment shims
</omit-these>

<include-these>
These ARE stack-defining and must be included:

• languages
  (typescript)

• test frameworks
  (vitest, jest, playwright, cypress)

• state management
  (zustand, redux, jotai, recoil, valtio)
</include-these>

<grounding-rule>
CRITICAL: the "packages" array is the complete source of truth.

Rules:

• "source" must match exactly one npm package from the input list
• Never invent package names
• Never normalize the "source" field
• When deduplicating families choose the most representative package
• If uncertain, omit the technology
</grounding-rule>

<examples>

Input:
["next", "react", "@clerk/nextjs", "prisma", "@prisma/client", "tailwindcss", "@types/node", "eslint"]

Output:
nextjs, react, clerk, prisma, tailwindcss


Input:
["ai", "@ai-sdk/anthropic", "drizzle-orm", "pg", "vitest", "typescript", "uuid", "clsx"]

Output:
ai-sdk, drizzle-orm, postgres, vitest, typescript

</examples>

Return ONLY a JSON object. No explanations. No duplicates.

{
  "technologies": [
    { "source": "<exact npm package name from input>", "key": "<community technology slug>" }
  ]
}
`;

const AI_MODELS = [
  "mistral/ministral-3b",
  "google/gemini-2.0-flash-lite",
  "google/gemini-2.5-flash-lite",
  "openai/gpt-4.1-nano",
  "openai/gpt-4o-mini",
  "openai/gpt-5-nano",
  "zai/glm-4.7-flashx",
  "xai/grok-4.1-fast-non-reasoning",
  "xai/grok-4-fast-non-reasoning",
];
let currentModelIndex = 0;

const getNextModel = () => {
  const model = AI_MODELS[currentModelIndex];
  currentModelIndex = (currentModelIndex + 1) % AI_MODELS.length;
  return model;
};

const MAX_MODEL_ATTEMPTS = AI_MODELS.length;

function isModelFallbackError(error) {
  if (RetryError.isInstance(error)) return true;
  if (NoSuchModelError.isInstance(error)) return true;
  if (APICallError.isInstance(error)) return error.isRetryable;
  if (error instanceof Error && error.cause !== undefined && APICallError.isInstance(error.cause)) {
    return error.cause.isRetryable;
  }
  return false;
}

export async function identifyTechnologies(packages) {
  if (packages.length === 0) return [];
  const packageSet = new Set(packages);

  let lastError;

  for (let attempt = 0; attempt < MAX_MODEL_ATTEMPTS; attempt++) {
    const model = getNextModel();

    try {
      const { output } = await generateText({
        model,
        system: IDENTIFY_PROMPT,
        prompt: JSON.stringify({ packages }, null, 2),
        output: Output.object({
          schema: z.object({
            technologies: z.array(
              z.object({ source: z.string(), key: z.string() }),
            ),
          }),
        }),
      });

      const verified = (output?.technologies ?? []).filter((t) =>
        packageSet.has(t.source),
      );
      return [...new Set(verified.map((t) => t.key))];
    } catch (error) {
      lastError = error;
      if (isModelFallbackError(error)) {
        console.warn(`[identify-technologies] model ${model} failed, trying next`);
        continue;
      }
      console.error(`[identify-technologies] non-retryable error with model ${model}`);
      throw error;
    }
  }

  console.error("[identify-technologies] all model attempts failed");
  throw lastError;
}
