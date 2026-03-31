const SKILLS_API_BASE = "https://skills.sh/api/search";
const MAX_RESULTS = 5;

export async function searchSkillsByTechnology(technology) {
  const response = await fetch(
    `${SKILLS_API_BASE}?q=${encodeURIComponent(technology)}&limit=${MAX_RESULTS}`,
  );
  const data = await response.json();
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
  return { technology, skills };
}

export async function searchSkillsForTechnologies(technologies) {
  const results = await Promise.all(
    technologies.map((tech) => searchSkillsByTechnology(tech)),
  );
  return results.filter((r) => r.skills.length > 0);
}
