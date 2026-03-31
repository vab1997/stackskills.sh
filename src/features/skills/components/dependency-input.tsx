import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignInButton } from "@/features/auth/components/sign-in-button";
import { SelectRepo } from "@/features/skills/components/select-repo";
import { TextAreaInput } from "@/features/skills/components/text-area-input";
import { FileJson, GitBranch } from "lucide-react";
import { toast } from "sonner";
import { GithubRepo } from "../types";

interface DependencyInputProps {
  onSubmit: ({
    packageJsonFromRepository,
    packageJsonFromPaste,
  }: {
    packageJsonFromRepository?: string;
    packageJsonFromPaste?: string[];
  }) => void;
  disabledButtonAnalyze: boolean;
  disableRepositoryTab: boolean;
  repositories?: GithubRepo[] | null;
}

export function DependencyInput({
  repositories,
  onSubmit,
  disabledButtonAnalyze,
  disableRepositoryTab,
}: DependencyInputProps) {
  const handleSelectedRepoSubmit = ({
    packageJson,
  }: {
    packageJson: string;
  }) => {
    if (!packageJson) {
      toast.error("No package.json loaded", {
        description: "Select a repository or paste a package.json below",
      });
      return;
    }
    onSubmit({
      packageJsonFromRepository: packageJson,
    });
  };

  const handleManualPackageJsonsSubmit = ({
    packageJsonFromPaste,
  }: {
    packageJsonFromPaste: string[];
  }) => {
    onSubmit({
      packageJsonFromPaste,
    });
  };

  return (
    <Tabs defaultValue="paste" className="w-full">
      <TabsList className="bg-muted/50 w-full">
        <TabsTrigger
          value="paste"
          className="text-muted-foreground flex-1 gap-2"
        >
          <FileJson className="size-3.5" />
          Paste package.json
        </TabsTrigger>
        <TabsTrigger
          value="repository"
          className="text-muted-foreground flex-1 gap-2"
        >
          <GitBranch className="size-3.5" />
          From repository
        </TabsTrigger>
      </TabsList>

      <TabsContent value="paste" className="mt-4">
        <TextAreaInput
          disabledButtonAnalyze={disabledButtonAnalyze}
          onSubmit={handleManualPackageJsonsSubmit}
        />
      </TabsContent>

      <TabsContent value="repository" className="mt-4">
        {disableRepositoryTab ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <p className="text-muted-foreground text-sm">
              Sign in to access your public repositories
            </p>
            <SignInButton />
          </div>
        ) : (
          <SelectRepo
            repositories={repositories}
            disabledButtonAnalyze={disabledButtonAnalyze}
            onSubmit={handleSelectedRepoSubmit}
          />
        )}
      </TabsContent>
    </Tabs>
  );
}
