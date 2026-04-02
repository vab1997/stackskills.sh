import { parsePackageJsons } from "@/features/skills/hooks/use-identify-tech";
import type { AnalysisState, SkillsByDependency } from "@/features/skills/types";

export const INITIAL_ANALYSIS_STATE: AnalysisState = {
  phase: "idle",
  technologies: [],
  skills: null,
  errorMessage: null,
};

export const getEmptyDependenciesState = (): AnalysisState => ({
  ...INITIAL_ANALYSIS_STATE,
  phase: "empty_dependencies",
});

export const getNoTechnologiesState = (): AnalysisState => ({
  ...INITIAL_ANALYSIS_STATE,
  phase: "no_technologies",
});

export const getFetchingState = (technologies: string[]): AnalysisState => ({
  phase: "fetching",
  technologies,
  skills: null,
  errorMessage: null,
});

export const getCompletedState = (
  technologies: string[],
  skills: SkillsByDependency,
): AnalysisState => {
  const hasSkills = Object.keys(skills).length > 0;

  return {
    phase: hasSkills ? "complete" : "no_technologies",
    technologies,
    skills: hasSkills ? skills : null,
    errorMessage: null,
  };
};

export const getErrorState = (
  technologies: string[],
  errorMessage: string,
): AnalysisState => ({
  phase: "error",
  technologies,
  skills: null,
  errorMessage,
});

export const getAnalysisErrorMessage = (error: unknown) => {
  return error instanceof Error ? error.message : "Unknown error";
};

export const getSkillsSummary = (skills: SkillsByDependency | null) => {
  const skillsByDependency = skills ?? {};
  const technologyCount = Object.keys(skillsByDependency).length;
  const totalSkills = Object.values(skillsByDependency).reduce(
    (acc, value) => acc + value.length,
    0,
  );

  const subtitle =
    technologyCount > 0
      ? `${technologyCount} technologies, ${totalSkills} skills found`
      : "Skills will appear after analysis";

  return {
    skillsByDependency,
    technologyCount,
    subtitle,
  };
};

export const hasDependencies = (packageJsons: string[]) => {
  const { dependencies, devDependencies } = parsePackageJsons(packageJsons);

  return (
    Object.keys(dependencies).length > 0 ||
    Object.keys(devDependencies).length > 0
  );
};
