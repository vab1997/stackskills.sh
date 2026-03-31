const PACKAGE_MAP = new Map<string, string>([
  // — Frontend frameworks —
  ["next", "nextjs"],
  ["react", "react"],
  ["react-dom", "react"],
  ["vue", "vue"],
  ["nuxt", "nuxt"],
  ["svelte", "svelte"],
  ["@sveltejs/kit", "sveltekit"],
  ["solid-js", "solidjs"],
  ["astro", "astro"],
  ["@remix-run/react", "remix"],
  ["gatsby", "gatsby"],
  ["@angular/core", "angular"],
  ["qwik", "qwik"],
  ["@builder.io/qwik", "qwik"],

  // — Backend frameworks —
  ["@trpc/server", "trpc"],
  ["@nestjs/core", "nestjs"],
  ["express", "express"],
  ["fastify", "fastify"],
  ["hono", "hono"],
  ["koa", "koa"],
  ["elysia", "elysia"],

  // — CMS —
  ["payload", "payload"],
  ["directus", "directus"],
  ["strapi", "strapi"],
  ["@strapi/strapi", "strapi"],
  ["@sanity/client", "sanity"],
  ["contentful", "contentful"],
  ["@keystatic/core", "keystatic"],
  ["tinacms", "tinacms"],

  // — ORMs & databases —
  ["drizzle-orm", "drizzle-orm"],
  ["prisma", "prisma"],
  ["@prisma/client", "prisma"],
  ["typeorm", "typeorm"],
  ["sequelize", "sequelize"],
  ["mongoose", "mongoose"],
  ["@mikro-orm/core", "mikro-orm"],
  ["pg", "postgres"],
  ["@vercel/postgres", "postgres"],
  ["@neondatabase/serverless", "postgres"],
  ["mysql2", "mysql"],
  ["sqlite3", "sqlite"],
  ["better-sqlite3", "sqlite"],
  ["ioredis", "redis"],
  ["redis", "redis"],

  // — UI libraries —
  ["shadcn", "shadcn"],
  ["@mantine/core", "mantine"],
  ["antd", "ant-design"],
  ["@mui/material", "material-ui"],
  ["@chakra-ui/react", "chakra-ui"],
  ["daisyui", "daisyui"],
  ["@nextui-org/react", "nextui"],
  ["@heroui/react", "heroui"],

  // — Auth —
  ["next-auth", "authjs"],
  ["@auth/core", "authjs"],
  ["better-auth", "better-auth"],
  ["@clerk/nextjs", "clerk"],
  ["@clerk/clerk-react", "clerk"],
  ["passport", "passport"],
  ["lucia", "lucia"],

  // — State management —
  ["zustand", "zustand"],
  ["jotai", "jotai"],
  ["recoil", "recoil"],
  ["valtio", "valtio"],
  ["redux", "redux"],
  ["@reduxjs/toolkit", "redux"],
  ["mobx", "mobx"],
  ["mobx-react-lite", "mobx"],

  // — Forms —
  ["react-hook-form", "react-hook-form"],
  ["@tanstack/react-form", "tanstack-form"],
  ["@tanstack/vue-form", "tanstack-form"],
  ["formik", "formik"],
  ["react-final-form", "react-final-form"],
  ["final-form", "react-final-form"],
  ["vee-validate", "vee-validate"],

  // — Data fetching —
  ["@tanstack/react-query", "react-query"],
  ["@tanstack/vue-query", "react-query"],
  ["swr", "swr"],
  ["@apollo/client", "apollo"],
  ["graphql", "graphql"],

  // — Testing —
  ["vitest", "vitest"],
  ["jest", "jest"],
  ["@playwright/test", "playwright"],
  ["playwright", "playwright"],
  ["cypress", "cypress"],

  // — AI / LLM —
  ["ai", "ai-sdk"],
  ["@ai-sdk/openai", "ai-sdk"],
  ["@ai-sdk/anthropic", "ai-sdk"],
  ["@ai-sdk/google", "ai-sdk"],
  ["@ai-sdk/azure", "ai-sdk"],
  ["@ai-sdk/cohere", "ai-sdk"],
  ["@ai-sdk/deepseek", "ai-sdk"],
  ["@ai-sdk/gemini", "ai-sdk"],
  ["@ai-sdk/groq", "ai-sdk"],
  ["@ai-sdk/ollama", "ai-sdk"],
  ["langchain", "langchain"],
  ["@langchain/core", "langchain"],
  ["openai", "openai"],

  // — Language & styling —
  ["typescript", "typescript"],
  ["tailwindcss", "tailwindcss"],
  ["zod", "zod"],
]);

export function identifyTechnologiesFromMap(
  dependencies: Record<string, string> = {},
  devDependencies: Record<string, string> = {},
): string[] {
  const packages = [
    ...Object.keys(dependencies),
    ...Object.keys(devDependencies),
  ];
  const seen = new Set<string>();
  const result: string[] = [];
  for (const pkg of packages) {
    const slug = PACKAGE_MAP.get(pkg);
    if (slug && !seen.has(slug)) {
      seen.add(slug);
      result.push(slug);
    }
  }
  return result;
}
