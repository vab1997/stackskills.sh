import { useSafeAction } from "@/hooks/use-safe-action";
import { fetchSkillsAction } from "../actions/fetch-skills";

export function useFetchSkills() {
  const {
    executeAsync: executeFetchSkills,
    isExecuting: isExecutingFetchSkills,
    result: resultFetchSkills,
  } = useSafeAction(fetchSkillsAction, {
    showToast: false,
  });

  const fetchSkills = ({ technologies }: { technologies: string[] }) => {
    return executeFetchSkills({ technologies });
  };

  return {
    fetchSkills,
    isExecutingFetchSkills,
    resultFetchSkills: resultFetchSkills.data,
  };
}
