import type { SkillsApiSkill } from "@/features/skills/types";

const SKILLS_API_BASE = "https://skills.sh/api/search";
const MAX_RESULTS_PER_DEPENDENCY = 5;

// [condition (tech slug or null), searchQuery, source?]
// condition null = always include (when any technologies found)
const CURATED_SKILLS: [string | null, string, string?][] = [
  ["nextjs", "nextjs-caching"],
  ["nextjs", "nextjs-rendering"],
  ["nextjs", "nextjs-navigation"],
  [null, "performance", "addyosmani/web-quality-skills"],
  [null, "accessibility", "addyosmani/web-quality-skills"],
  [null, "core-web-vitals", "addyosmani/web-quality-skills"],
  [null, "best-practices", "addyosmani/web-quality-skills"],
];

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

export async function fetchCuratedSkills(
  technologies: string[],
): Promise<SkillsApiSkill[]> {
  const filtered = CURATED_SKILLS.filter(
    ([condition]) => condition === null || technologies.includes(condition),
  );
  const results = await Promise.all(
    filtered.map(async ([, query, source]) => {
      try {
        const { skills } = await searchSkillsByDependency(query);
        return source
          ? (skills.find((s) => s.source === source) ?? null)
          : (skills[0] ?? null);
      } catch {
        return null;
      }
    }),
  );
  return results.filter((s): s is SkillsApiSkill => s !== null);
}
