import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConnectedGithubAccount } from "@/features/auth/components/connected-github-account";
import { useGetPackagejson } from "@/features/skills/hooks/use-get-package-json";
import type { GithubRepo } from "@/features/skills/types";
import { GitBranch, Package } from "lucide-react";
import { useState } from "react";
import ShikiHighlighter from "react-shiki";
import { toast } from "sonner";

export function RepositoryPackageJsonSelector({
  repositories,
  disabledButtonAnalyze,
  onSubmit,
}: {
  repositories?: GithubRepo[] | null;
  disabledButtonAnalyze: boolean;
  onSubmit: ({ packageJson }: { packageJson: string }) => void;
}) {
  const [selectedRepo, setSelectedRepo] = useState<string>("");

  const { fetchPackageJson, isExecutingGetPackageJson, resultGetPackageJson } =
    useGetPackagejson();

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
        GitHub repository
      </label>

      {repositories && repositories.length === 0 ? (
        <div className="flex items-center gap-2 text-white/60">
          <Loader className="size-4" />
          <span>No repositories found</span>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <ConnectedGithubAccount />

          <Select
            value={selectedRepo}
            onValueChange={handleSelectedRepo}
            name="repo-select"
          >
            <SelectTrigger className="w-full border-white/10 bg-white/5">
              <SelectValue placeholder="Select a repository" />
            </SelectTrigger>
            <SelectContent>
              {repositories &&
                repositories.map((repo) => (
                  <SelectItem key={repo.id} value={repo.full_name}>
                    <span className="flex items-center gap-2">
                      <GitBranch className="size-3.5" />
                      {repo.full_name}
                    </span>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {isExecutingGetPackageJson && (
        <div className="flex items-center gap-2 text-white/60">
          <Loader className="size-4" />
          <span>Loading package.json...</span>
        </div>
      )}

      {resultGetPackageJson && !isExecutingGetPackageJson && (
        <div className="h-full max-h-80 rounded-lg border border-white/10 p-4">
          <div className="mb-2 flex items-center gap-2 text-white/60">
            <Package className="size-4" />
            <span className="text-sm font-medium">package.json</span>
          </div>
          <ShikiHighlighter
            language="json"
            theme="github-dark-high-contrast"
            style={{
              textAlign: "left",
              fontSize: "12px",
              overflowY: "auto",
              scrollbarWidth: "thin",
              scrollbarColor: "var(--border) transparent",
              maxHeight: "250px",
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
