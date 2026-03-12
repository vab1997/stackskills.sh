import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SelectRepo } from "@/features/skills/components/select-repo";
import { TextAreaInput } from "@/features/skills/components/text-area-input";
import { FileJson, GitBranch } from "lucide-react";
import { toast } from "sonner";
import { useGetRepositories } from "../hooks/use-get-repositories";

interface DependencyInputProps {
  onSubmit: ({
    packageJsonFromRepository,
    packageJsonFromPaste,
  }: {
    packageJsonFromRepository?: string;
    packageJsonFromPaste?: string[];
  }) => void;
  disabledButtonAnalyze: boolean;
  hasRepoAccess: boolean;
}

export function DependencyInput({
  onSubmit,
  disabledButtonAnalyze,
  hasRepoAccess,
}: DependencyInputProps) {
  const { isExecutingGetRepositories, resultGetRepositories } =
    useGetRepositories({ hasRepoAccess });

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
    <Tabs defaultValue="repository" className="w-full">
      <TabsList className="bg-muted/50 w-full">
        <TabsTrigger
          value="repository"
          className="text-muted-foreground flex-1 gap-2"
        >
          <GitBranch className="size-3.5" />
          From repository
        </TabsTrigger>

        <TabsTrigger
          value="paste"
          className="text-muted-foreground flex-1 gap-2"
        >
          <FileJson className="size-3.5" />
          Paste package.json
        </TabsTrigger>
      </TabsList>

      <TabsContent value="paste" className="mt-4">
        <TextAreaInput
          disabledButtonAnalyze={disabledButtonAnalyze}
          onSubmit={handleManualPackageJsonsSubmit}
        />
      </TabsContent>

      <TabsContent value="repository" className="mt-4">
        <SelectRepo
          hasRepoAccess={hasRepoAccess}
          repositories={resultGetRepositories}
          isLoadingRepositories={isExecutingGetRepositories}
          disabledButtonAnalyze={disabledButtonAnalyze}
          onSubmit={handleSelectedRepoSubmit}
        />
      </TabsContent>
    </Tabs>
  );
}
