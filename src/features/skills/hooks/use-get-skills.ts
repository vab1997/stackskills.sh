import { useSafeAction } from "@/hooks/use-safe-action";
import { getSkillsAction } from "../actions/get-skills";

export function useGetSkills() {
  const {
    executeAsync: executeGetSkills,
    isExecuting: isExecutingGetSkills,
    result: resultGetSkills,
    reset: resetGetSkills,
  } = useSafeAction(getSkillsAction, {
    showToast: false,
  });

  const fetchSkills = async (packageJsons: string[]) => {
    return await executeGetSkills({ packageJsons });
  };

  return {
    fetchSkills,
    resetSkills: resetGetSkills,
    isExecutingGetSkills,
    resultGetSkills: resultGetSkills.data,
  };
}
