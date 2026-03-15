export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  description: string | null;
  owner: { login: string };
}

export interface SkillsApiSkill {
  id: string;
  skillId: string;
  name: string;
  installs: number;
  source: string;
  command: string;
  url: string;
}

export type SkillsByDependency = Record<string, SkillsApiSkill[]>;

export type SkillsStreamEvent =
  | { type: "detecting" }
  | { type: "technologies_found"; technologies: string[] }
  | { type: "fetching_skills"; total: number }
  | {
      type: "skill_fetched";
      technology: string;
      fetched: number;
      total: number;
    }
  | { type: "complete"; skills: SkillsByDependency }
  | { type: "error"; message: string };
