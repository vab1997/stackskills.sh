import { useSafeAction } from "@/hooks/use-safe-action";
import { getPackageJsonFromGithubAction } from "../actions/get-package-json-from-github";

export function useGetPackagejson() {
  const {
    executeAsync: executeGetPackageJson,
    isExecuting: isExecutingGetPackageJson,
    result: resultGetPackageJson,
  } = useSafeAction(getPackageJsonFromGithubAction, {
    loadingText: () => "Getting package.json...",
    successText: () => "Package.json fetched successfully",
    errorText: (error: { message: string }) => error.message,
  });

  const fetchPackageJson = async ({
    owner,
    repo,
    path,
  }: {
    owner: string;
    repo: string;
    path: string;
  }) => {
    return await executeGetPackageJson({ owner, repo, path });
  };

  return {
    fetchPackageJson,
    isExecutingGetPackageJson,
    resultGetPackageJson: resultGetPackageJson.data,
  };
}
