import type { SkillsByDependency } from "@/features/skills/types";
import { logger } from "@/lib/logger";

const SKILLS_API_BASE = "https://skills.sh/api/search";
const MAX_RESULTS_PER_DEPENDENCY = 5;

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

async function fetchSkills(dependency: string) {
  const response = await fetch(
    `${SKILLS_API_BASE}?q=${encodeURIComponent(dependency)}&limit=${MAX_RESULTS_PER_DEPENDENCY}`,
  );
  const data = (await response.json()) as SkillsApiResponse;
  return { dependency, skills: data.skills ?? [] };
}

export async function searchSkillsService({
  dependencies,
}: {
  dependencies: string[];
}) {
  try {
    const results: SkillsByDependency = {};

    const skillsByDependency = await Promise.all(
      dependencies.map((dep) => fetchSkills(dep)),
    );

    for (const { dependency, skills } of skillsByDependency) {
      if (skills.length === 0) continue;
      results[dependency] = skills
        .map((skill) => ({
          id: skill.id,
          skillId: skill.skillId,
          name: skill.name,
          url: `https://skills.sh/${skill.id}`,
          command: `npx skills add https://github.com/${skill.source} --skill ${skill.name}`,
          installs: skill.installs,
          source: skill.source,
        }))
        .toSorted((a, b) => b.installs - a.installs);
    }
    return results;
  } catch (error) {
    logger.error(error, "Error searching skills.sh");
    return {};
  }
}
