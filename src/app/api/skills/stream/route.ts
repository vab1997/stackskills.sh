import { identifyTechnologiesFromMap } from "@/features/skills/services/identify-tech-map";
import { searchSkillsByDependency } from "@/features/skills/services/search-skills";
import type {
  SkillsByDependency,
  SkillsStreamEvent,
} from "@/features/skills/types";
import { logger } from "@/lib/logger";
import z from "zod";

const bodySchema = z.object({
  packageJsons: z.array(z.string()).min(1),
});

export function parsePackageJsons(packageJsons: string[]): {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
} {
  const dependencies: Record<string, string> = {};
  const devDependencies: Record<string, string> = {};
  for (const pkgStr of packageJsons) {
    try {
      const pkg = JSON.parse(pkgStr);
      Object.assign(dependencies, pkg.dependencies ?? {});
      Object.assign(devDependencies, pkg.devDependencies ?? {});
    } catch {
      logger.warn("Skipping invalid package.json entry");
    }
  }
  return { dependencies, devDependencies };
}

export async function POST(request: Request) {
  let packageJsons: string[];
  try {
    const body = await request.json();
    const parsed = bodySchema.parse(body);
    packageJsons = parsed.packageJsons;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
    });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: SkillsStreamEvent) => {
        controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
      };

      try {
        send({ type: "detecting" });

        const { dependencies, devDependencies } =
          parsePackageJsons(packageJsons);
        const technologies = identifyTechnologiesFromMap(
          dependencies,
          devDependencies,
        );

        send({ type: "technologies_found", technologies });

        const total = technologies.length;
        send({ type: "fetching_skills", total });

        const result: SkillsByDependency = {};
        for (let i = 0; i < technologies.length; i++) {
          const technology = technologies[i];
          try {
            const { skills } = await searchSkillsByDependency(
              technology,
              request.signal,
            );
            if (skills.length > 0) {
              result[technology] = skills;
            }
          } catch (err) {
            if (
              err instanceof Error &&
              (err.name === "AbortError" || err.name === "TimeoutError")
            ) {
              throw err;
            }
            logger.error(
              { err, technology },
              "Failed to fetch skills for technology",
            );
          }
          send({ type: "skill_fetched", technology, fetched: i + 1, total });
        }

        send({ type: "complete", skills: result });
      } catch (err) {
        if (
          err instanceof Error &&
          (err.name === "AbortError" || err.name === "TimeoutError")
        ) {
          logger.error({ err }, "Client disconnected");
        } else {
          const message = err instanceof Error ? err.message : "Unknown error";
          send({ type: "error", message });
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
    },
  });
}
