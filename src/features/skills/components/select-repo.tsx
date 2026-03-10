import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetPackagejson } from "@/features/skills/hooks/use-get-package-json";
import { useGetRepositories } from "@/features/skills/hooks/use-get-repositories";
import { useRequestRepoAccess } from "@/features/skills/hooks/use-request-repo-access";
import { Github, Loader2, Package } from "lucide-react";
import { useState } from "react";
import ShikiHighlighter from "react-shiki";
import { toast } from "sonner";

export function SelectRepo({
  hasRepoAccess,
  disabledButtonAnalyze,
  onSubmit,
}: {
  hasRepoAccess: boolean;
  disabledButtonAnalyze: boolean;
  onSubmit: ({ packageJson }: { packageJson: string }) => void;
}) {
  const [selectedRepo, setSelectedRepo] = useState<string>("");
  const { isExecutingGetRepositories, resultGetRepositories } =
    useGetRepositories({ hasRepoAccess });
  const { fetchPackageJson, isExecutingGetPackageJson, resultGetPackageJson } =
    useGetPackagejson();
  const { requestRepoAccess, isExecutingRequestRepoAccess } =
    useRequestRepoAccess();

  const handleSelectedRepo = async (value: string) => {
    try {
      const [owner, repo] = value.split("/");
      if (!owner || !repo) {
        toast.error("Invalid repository URL", {
          description: "Please enter a valid repository URL",
        });
        return;
      }
      setSelectedRepo(value);
      await fetchPackageJson({ owner, repo, path: "package.json" });
    } catch {
      toast.error("Failed to fetch package.json", {
        description: "Please try again.",
      });
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <label htmlFor="repo-select" className="text-muted-foreground text-sm">
        GitHub repository URL
      </label>

      {hasRepoAccess ? (
        isExecutingGetRepositories ? (
          <div className="flex items-center gap-2 text-white/60">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading repositories...</span>
          </div>
        ) : (
          <Select
            value={selectedRepo}
            onValueChange={handleSelectedRepo}
            name="repo-select"
          >
            <SelectTrigger className="w-full border-white/10 bg-white/5">
              <SelectValue placeholder="Select a repository" />
            </SelectTrigger>
            <SelectContent>
              {resultGetRepositories &&
                resultGetRepositories.map((repo) => (
                  <SelectItem key={repo.id} value={repo.full_name}>
                    <span className="flex items-center gap-2">
                      {repo.private ? "🔒" : "📂"} {repo.full_name}
                    </span>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        )
      ) : (
        <Button
          onClick={requestRepoAccess}
          type="button"
          variant="outline"
          size="icon"
          className="w-fit gap-1 px-2 active:scale-[0.97]"
          disabled={isExecutingRequestRepoAccess}
        >
          {isExecutingRequestRepoAccess ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Connecting GitHub Repositories...
            </>
          ) : (
            <>
              <Github className="size-4" />
              Connect GitHub Repositories
            </>
          )}
        </Button>
      )}

      {isExecutingGetPackageJson && (
        <div className="flex items-center gap-2 text-white/60">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading package.json...</span>
        </div>
      )}

      {resultGetPackageJson && !isExecutingGetPackageJson && (
        <div className="h-full max-h-80 overflow-y-auto rounded-lg border border-white/10 p-4">
          <div className="mb-2 flex items-center gap-2 text-white/60">
            <Package className="h-4 w-4" />
            <span className="text-sm font-medium">package.json</span>
          </div>
          <ShikiHighlighter
            language="json"
            theme="github-dark-high-contrast"
            style={{
              textAlign: "left",
              fontSize: "12px",
            }}
            showLanguage={false}
          >
            {resultGetPackageJson}
          </ShikiHighlighter>
        </div>
      )}

      {selectedRepo && !isExecutingGetPackageJson && resultGetPackageJson && (
        <Button
          variant="outline"
          onClick={() => onSubmit({ packageJson: resultGetPackageJson })}
          disabled={!selectedRepo || !!disabledButtonAnalyze}
          className="w-full transition-[background-color,transform] active:scale-[0.97]"
          size="lg"
        >
          Analyze Dependencies
        </Button>
      )}
    </div>
  );
}
