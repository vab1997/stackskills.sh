import type { SkillsApiSkill } from "@/features/skills/types";

const SKILLS_API_BASE = "https://skills.sh/api/search";
const MAX_RESULTS_PER_DEPENDENCY = 5;

interface SkillsApiResponse {
  skills: SkillsApiSkill[];
}

export async function searchSkillsByDependency(
  dependency: string,
  signal?: AbortSignal,
) {
  const response = await fetch(
    `${SKILLS_API_BASE}?q=${encodeURIComponent(dependency)}&limit=${MAX_RESULTS_PER_DEPENDENCY}`,
    { signal },
  );
  const data = (await response.json()) as SkillsApiResponse;
  const skills = (data.skills ?? [])
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
  return { dependency, skills };
}
