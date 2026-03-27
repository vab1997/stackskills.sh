import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SelectRepo } from "@/features/skills/components/select-repo";
import { TextAreaInput } from "@/features/skills/components/text-area-input";
import { cn } from "@/lib/utils";
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
  disableTabs: boolean;
  repositories?: GithubRepo[] | null;
}

export function DependencyInput({
  repositories,
  onSubmit,
  disabledButtonAnalyze,
  disableTabs,
}: DependencyInputProps) {
  // const { isExecutingGetRepositories, resultGetRepositories } =
  //   useGetRepositories();

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
      <TabsList
        className={cn("bg-muted/50 w-full", disableTabs ? "opacity-60" : "")}
      >
        <TabsTrigger
          value="repository"
          className="text-muted-foreground flex-1 gap-2"
          disabled={disableTabs}
        >
          <GitBranch className="size-3.5" />
          From repository
        </TabsTrigger>

        <TabsTrigger
          value="paste"
          className="text-muted-foreground flex-1 gap-2"
          disabled={disableTabs}
        >
          <FileJson className="size-3.5" />
          Paste package.json
        </TabsTrigger>
      </TabsList>

      {!disableTabs ? (
        <>
          <TabsContent value="paste" className="mt-4">
            <TextAreaInput
              disabledButtonAnalyze={disabledButtonAnalyze}
              onSubmit={handleManualPackageJsonsSubmit}
            />
          </TabsContent>

          <TabsContent value="repository" className="mt-4">
            <SelectRepo
              repositories={repositories}
              disabledButtonAnalyze={disabledButtonAnalyze}
              onSubmit={handleSelectedRepoSubmit}
            />
          </TabsContent>
        </>
      ) : null}
    </Tabs>
  );
}
