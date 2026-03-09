import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileJson, GitBranch } from "lucide-react";
import { toast } from "sonner";
import { SelectRepo } from "./select-repo";
import { TextAreaInput } from "./text-area-input";

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
          Paste
        </TabsTrigger>
        <TabsTrigger
          value="repository"
          className="text-muted-foreground flex-1 gap-2"
        >
          <GitBranch className="size-3.5" />
          Repository
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
          disabledButtonAnalyze={disabledButtonAnalyze}
          onSubmit={handleSelectedRepoSubmit}
        />
      </TabsContent>
    </Tabs>
  );
}
