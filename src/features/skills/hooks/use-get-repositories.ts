import { getRepositoriesAction } from "@/features/skills/actions/get-repositories";
import { useSafeAction } from "@/hooks/use-safe-action";
import { useEffect } from "react";

export function useGetRepositories({
  hasRepoAccess,
}: {
  hasRepoAccess: boolean;
}) {
  const {
    executeAsync: executeGetRepositories,
    isExecuting: isExecutingGetRepositories,
    result: resultGetRepositories,
  } = useSafeAction(getRepositoriesAction, {
    loadingText: () => "Getting repositories...",
    successText: () => "Repositories fetched successfully",
    errorText: (error) => error.message,
  });

  useEffect(() => {
    if (hasRepoAccess) {
      executeGetRepositories({});
    }
  }, [hasRepoAccess, executeGetRepositories]);

  return {
    isExecutingGetRepositories,
    resultGetRepositories: resultGetRepositories.data,
  };
}
