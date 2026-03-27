import { getRepositoriesAction } from "@/features/skills/actions/get-repositories";
import { useSafeAction } from "@/hooks/use-safe-action";
import { useEffect } from "react";

export function useGetRepositories() {
  const {
    executeAsync: executeGetRepositories,
    isExecuting: isExecutingGetRepositories,
    result: resultGetRepositories,
  } = useSafeAction(getRepositoriesAction, { showToast: false });

  useEffect(() => {
    executeGetRepositories({});
  }, [executeGetRepositories]);

  return {
    isExecutingGetRepositories,
    resultGetRepositories: resultGetRepositories.data,
  };
}
