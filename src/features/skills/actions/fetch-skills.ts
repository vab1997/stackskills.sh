"use server";

import type { SkillsByDependency } from "@/features/skills/types";
import { logger } from "@/lib/logger";
import { actionClient } from "@/lib/safe-action";
import z from "zod";
import { searchSkillsByDependency } from "../services/search-skills";

const inputSchema = z.object({
  technologies: z.array(z.string()).min(1),
});

export const fetchSkillsAction = actionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput }) => {
    const { technologies } = parsedInput;

    try {
      const results = await Promise.all(
        technologies.map(async (technology) => {
          try {
            return await searchSkillsByDependency(technology);
          } catch {
            return { dependency: technology, skills: [] };
          }
        }),
      );

      const skills = results.reduce<SkillsByDependency>(
        (acc, { dependency, skills }) => {
          if (skills.length > 0) acc[dependency] = skills;
          return acc;
        },
        {},
      );

      return { skills };
    } catch (error) {
      if (error instanceof Error) {
        logger.error({ error }, "Failed to fetch skills");
        throw new Error(error.message);
      }
      throw new Error("Failed to fetch skills");
    }
  });
