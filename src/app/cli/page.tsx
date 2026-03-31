import { Hero } from "@/components/layout/hero";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";
import { AgentsMarquee } from "./agents-marquee";
import { CopyButton } from "./copy-button";

export const metadata: Metadata = {
  title: "CLI",
  description:
    "Run npx stackskills to discover and install agent skills for your tech stack in seconds.",
};

const COMMAND = "npx stackskills";

const STEPS = [
  {
    title: "Run the command",
    description: (
      <>
        From your project root, run{" "}
        <code className="text-foreground font-mono">npx stackskills</code>. No
        global install needed.
      </>
    ),
  },
  {
    title: "Stack detected instantly",
    description:
      "Your package.json dependencies are matched against a curated map of 80+ packages — no AI call, no network latency.",
  },
  {
    title: "Skills fetched live",
    description:
      "For each technology in your stack, the top skills are pulled from skills.sh sorted by install count.",
  },
  {
    title: "You choose",
    description:
      "An interactive multi-select groups skills by technology. Pick exactly what you want — or take them all.",
  },
  {
    title: "Installed to your agent",
    description: (
      <>
        Skills are installed concurrently into Claude Code, Cursor, Copilot, or
        any of{" "}
        <span className="text-foreground font-medium">
          30+ supported agents
        </span>
        .
      </>
    ),
  },
];

const TECH_CATEGORIES = [
  {
    name: "Frontend",
    techs: [
      "React",
      "Next.js",
      "Vue",
      "Nuxt",
      "Svelte",
      "SvelteKit",
      "Astro",
      "Remix",
      "Gatsby",
      "Angular",
      "Qwik",
      "SolidJS",
    ],
  },
  {
    name: "Backend",
    techs: ["tRPC", "NestJS", "Express", "Fastify", "Hono", "Koa", "Elysia"],
  },
  {
    name: "CMS",
    techs: [
      "Payload",
      "Directus",
      "Strapi",
      "Sanity",
      "Contentful",
      "Keystatic",
      "TinaCMS",
    ],
  },
  {
    name: "ORMs & Databases",
    techs: [
      "Drizzle",
      "Prisma",
      "TypeORM",
      "Sequelize",
      "Mongoose",
      "MikroORM",
      "PostgreSQL",
      "MySQL",
      "SQLite",
      "Redis",
    ],
  },
  {
    name: "UI Libraries",
    techs: [
      "shadcn/ui",
      "Mantine",
      "Ant Design",
      "Material UI",
      "Chakra UI",
      "DaisyUI",
      "NextUI",
      "HeroUI",
    ],
  },
  {
    name: "Auth",
    techs: ["Auth.js", "Better Auth", "Clerk", "Passport", "Lucia"],
  },
  {
    name: "State Management",
    techs: ["Zustand", "Jotai", "Recoil", "Valtio", "Redux", "MobX", "Pinia"],
  },
  {
    name: "Forms",
    techs: [
      "React Hook Form",
      "TanStack Form",
      "Formik",
      "React Final Form",
      "VeeValidate",
    ],
  },
  {
    name: "Data Fetching",
    techs: ["React Query", "SWR", "Apollo", "GraphQL"],
  },
  {
    name: "Testing",
    techs: ["Vitest", "Jest", "Playwright", "Cypress"],
  },
  {
    name: "AI / LLM",
    techs: ["Vercel AI SDK", "LangChain", "OpenAI"],
  },
  {
    name: "Language & Styling",
    techs: ["TypeScript", "Tailwind CSS", "Zod"],
  },
];

export default function CliPage() {
  return (
    <main className="relative mx-auto flex max-w-6xl flex-col items-center justify-center px-4 pb-30">
      <Hero />

      <div className="w-full">
        {/* TRY IT NOW */}
        <div className="border-border border-t pt-10">
          <div className="flex flex-col items-start justify-between gap-10 lg:flex-row">
            <div className="flex min-w-md flex-col gap-4">
              <p className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
                Try it now
              </p>
              <div className="bg-muted/30 border-border flex w-full items-center justify-between rounded-lg border px-4 py-4 font-mono">
                <span className="text-muted-foreground text-sm">
                  <span className="text-muted-foreground/50 mr-2">$</span>
                  {COMMAND}
                </span>
                <CopyButton text={COMMAND} />
              </div>
            </div>
            <AgentsMarquee />
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className="border-border mt-14 border-t pt-10">
          <p className="text-muted-foreground mb-8 font-mono text-xs tracking-widest uppercase">
            How it works
          </p>
          <ol className="flex flex-col gap-6">
            {STEPS.map((step, i) => (
              <li key={i} className="flex items-start gap-5">
                <span className="text-muted-foreground/50 font-mono text-sm tabular-nums">
                  [{String(i + 1).padStart(1, "0")}]
                </span>
                <div>
                  <p className="text-foreground font-mono text-sm font-bold">
                    {step.title}
                  </p>
                  <p className="text-muted-foreground mt-0.5 font-mono text-sm">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* SUPPORTED TECHNOLOGIES */}
        <div className="border-border mt-14 border-t pt-10">
          <p className="text-muted-foreground mb-8 font-mono text-xs tracking-widest uppercase">
            Supported technologies
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TECH_CATEGORIES.map((category) => (
              <div
                key={category.name}
                className="border-border rounded-lg border p-4"
              >
                <p className="text-foreground mb-3 font-mono text-xs font-semibold tracking-wider uppercase">
                  {category.name}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {category.techs.map((tech) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="font-mono text-xs font-normal"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
