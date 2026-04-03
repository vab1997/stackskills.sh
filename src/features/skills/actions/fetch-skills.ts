"use server";

import type { SkillsByDependency } from "@/features/skills/types";
import { logger } from "@/lib/logger";
import { actionClient } from "@/lib/safe-action";
import z from "zod";
import {
  fetchCuratedSkills,
  searchSkillsByDependency,
} from "../services/search-skills";

const inputSchema = z.object({
  technologies: z.array(z.string()).min(1),
});

export const fetchSkillsAction = actionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput }) => {
    const { technologies } = parsedInput;

    try {
      const [results, curatedSkills] = await Promise.all([
        Promise.all(
          technologies.map(async (technology) => {
            try {
              return await searchSkillsByDependency(technology);
            } catch {
              return { dependency: technology, skills: [] };
            }
          }),
        ),
        fetchCuratedSkills(technologies),
      ]);

      const skills = results.reduce<SkillsByDependency>(
        (acc, { dependency, skills }) => {
          if (skills.length > 0) acc[dependency] = skills;
          return acc;
        },
        {},
      );

      if (curatedSkills.length > 0) {
        skills["curated"] = curatedSkills;
      }

      return { skills };
    } catch (error) {
      if (error instanceof Error) {
        logger.error({ error }, "Failed to fetch skills");
        throw new Error(error.message);
      }
      throw new Error("Failed to fetch skills");
    }
  });
