import type { SkillsByDependency } from "@/features/skills/types";
import { logger } from "@/lib/logger";

const SKILLS_API_BASE = "https://skills.sh/api/search";

interface SkillsApiSkill {
  id: string;
  skillId: string;
  name: string;
  installs: number;
  source: string;
}

interface SkillsApiResponse {
  skills: SkillsApiSkill[];
}

export async function searchSkillsService({
  dependencies,
  maxResultsPerDep,
}: {
  dependencies: string[];
  maxResultsPerDep: number;
}) {
  try {
    const results: SkillsByDependency = {};

    const responses = await Promise.all(
      dependencies.map((dep) =>
        fetch(
          `${SKILLS_API_BASE}?q=${encodeURIComponent(dep)}&limit=${maxResultsPerDep}`,
        )
          .then((r) => r.json() as Promise<SkillsApiResponse>)
          .then((data) => ({ dep, skills: data.skills ?? [] })),
      ),
    );

    for (const { dep, skills } of responses) {
      if (skills.length === 0) continue;
      results[dep] = skills.map((skill) => ({
        id: skill.id,
        skillId: skill.skillId,
        name: skill.name,
        url: `https://skills.sh/${skill.id}`,
        command: `npx skills add https://github.com/${skill.source} --skill ${skill.name}`,
        installs: skill.installs,
        source: skill.source,
      }));
    }

    logger.info({ dependencies, results }, "Search results by dependency");
    return results;
  } catch (error) {
    logger.error(error, "Error searching skills.sh");
    return {};
  }
}
