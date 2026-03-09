import { useSafeAction } from "@/hooks/use-safe-action";
import { getSkillsAction } from "../actions/get-skills";

export function useGetSkills() {
  const {
    executeAsync: executeGetSkills,
    isExecuting: isExecutingGetSkills,
    result: resultGetSkills,
  } = useSafeAction(getSkillsAction, {
    loadingText: () => "Getting skills...",
    successText: () => "Skills fetched successfully",
    errorText: (error) => error.message,
  });

  const fetchSkills = async (packageJsons: string[]) => {
    return await executeGetSkills({ packageJsons });
  };

  return {
    fetchSkills,
    isExecutingGetSkills,
    resultGetSkills: resultGetSkills.data,
  };
}
