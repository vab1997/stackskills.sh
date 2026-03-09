"use server";

import { logger } from "@/lib/logger";
import { actionClient } from "@/lib/safe-action";
import { z } from "zod";
import { getSkillsService } from "../services/get-skills";

export const getSkillsAction = actionClient
  .inputSchema(
    z.object({
      packageJsons: z.array(z.string()),
    }),
  )
  .action(async ({ parsedInput }) => {
    console.log("parsedInput", { parsedInput });
    try {
      const skills = await getSkillsService({
        packageJsons: parsedInput.packageJsons,
      });
      return skills;
    } catch (error) {
      logger.error({ error }, "Failed to get skills");
      throw new Error("Failed to get skills");
    }
  });
