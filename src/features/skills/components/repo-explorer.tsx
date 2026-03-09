"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetSkills } from "@/features/skills/hooks/use-get-skills";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Loader2,
  Package,
  Search,
  Sparkles,
  XCircle,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DependencyInput } from "./dependency-input";
import { SkillDisplay } from "./skills-display";
import { Stepper } from "./stepper";

const STEPS = [
  { label: "Dependencies", description: "Add your source" },
  { label: "Analyzing", description: "Extracting key deps" },
  { label: "Skills", description: "Relevant skills" },
];

export function RepoExplorer({ hasRepoAccess }: { hasRepoAccess: boolean }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [lastPackageJsons, setLastPackageJsons] = useState<string[]>([]);

  const {
    fetchSkills,
    isExecutingGetSkills,
    resultGetSkills: skills,
  } = useGetSkills();

  const handleGetSkills = async ({
    packageJsonFromRepository,
    packageJsonFromPaste,
  }: {
    packageJsonFromRepository?: string;
    packageJsonFromPaste?: string[];
  }) => {
    const packageJsons = packageJsonFromRepository
      ? [packageJsonFromRepository]
      : packageJsonFromPaste
        ? packageJsonFromPaste
        : [];

    if (packageJsons.length === 0) {
      toast.error("No package.json provided", {
        description: "Please provide a package.json",
      });
      return;
    }

    setLastPackageJsons(packageJsons);
    try {
      setCurrentStep(1);
      await fetchSkills(packageJsons);
      setCurrentStep(2);
    } catch {
      setCurrentStep(1);
      toast.error("Something went wrong while analyzing your dependencies.", {
        description: "Please try again.",
      });
    }
  };

  return (
    <div className="mt-6 flex w-full flex-1 flex-col gap-8">
      <div className="mb-10">
        <Stepper steps={STEPS} currentStep={currentStep} />
      </div>

      {/* step 0: dependencies */}
      <div className="flex flex-col gap-8">
        {/* Step 1: Dependencies */}
        <section
          className={cn(
            "border-border rounded-xl border p-6 transition-all duration-500",
            currentStep === 0
              ? "opacity-100"
              : currentStep > 0
                ? "pointer-events-none opacity-60"
                : "opacity-40",
          )}
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="bg-secondary flex size-9 items-center justify-center rounded-lg">
              <Package className="text-muted-foreground size-4" />
            </div>
            <div>
              <h2 className="text-foreground text-sm font-semibold">
                Dependencies
              </h2>
              <p className="text-muted-foreground text-xs">
                Choose how to provide your dependencies
              </p>
            </div>
          </div>
          <DependencyInput
            onSubmit={handleGetSkills}
            disabledButtonAnalyze={currentStep > 0}
            hasRepoAccess={hasRepoAccess}
          />
        </section>
      </div>

      {/* Step 2: Analyzing */}
      <section
        className={cn(
          "border-border rounded-xl border p-6 transition-all duration-500",
          currentStep === 1
            ? "opacity-100"
            : currentStep > 1
              ? "opacity-60"
              : "pointer-events-none opacity-40",
        )}
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="bg-secondary flex size-9 items-center justify-center rounded-lg">
            <Search className="text-muted-foreground size-4" />
          </div>
          <div>
            <h2 className="text-foreground text-sm font-semibold">Analysis</h2>
            <p className="text-muted-foreground text-xs">
              Identifying key dependencies from your stack
            </p>
          </div>
        </div>

        {currentStep === 0 && (
          <div className="text-muted-foreground flex flex-col items-center justify-center py-12">
            <Package className="mb-3 size-8 opacity-40" />
            <p className="text-sm">Waiting for dependencies input...</p>
          </div>
        )}

        {isExecutingGetSkills ? (
          <div className="flex items-center gap-2 text-white/60">
            <Loader2 className="size-5 animate-spin duration-150" />
            <span>Loading skills...</span>
          </div>
        ) : currentStep === 1 ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-red-500">
              <XCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Analysis failed</span>
            </div>
            <p className="text-muted-foreground text-xs">
              Something went wrong while analyzing your dependencies.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-fit"
              onClick={() => fetchSkills(lastPackageJsons)}
            >
              Try again
            </Button>
          </div>
        ) : currentStep > 1 && skills && Object.keys(skills).length > 0 ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-green-500">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm font-medium">Analysis complete</span>
            </div>
            <div className="flex flex-col flex-wrap gap-2">
              <span className="text-muted-foreground text-xs font-medium">
                Found {Object.keys(skills).length} technologies
              </span>
              <div className="flex flex-wrap gap-2">
                {Object.keys(skills).map((tech) => (
                  <Badge
                    key={tech}
                    variant="outline"
                    className="shrink-0 border-green-500/50 bg-green-500/10 font-mono text-xs text-green-500"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </section>

      {/* Step 3: Skills */}
      <section
        className={cn(
          "border-border rounded-xl border p-6 transition-all duration-300",
          currentStep === 2 ? "opacity-100" : "pointer-events-none opacity-40",
        )}
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="bg-secondary flex size-9 items-center justify-center rounded-lg">
            <Sparkles className="text-muted-foreground size-4" />
          </div>
          <div>
            <h2 className="text-foreground text-sm font-semibold">Skills</h2>
            <p className="text-muted-foreground text-xs">
              {skills && Object.keys(skills).length > 0
                ? `${Object.keys(skills).length} technologies, ${Object.values(skills).reduce((acc, value) => acc + value.length, 0)} skills found`
                : "Skills will appear after analysis"}
            </p>
          </div>
        </div>
        {skills ? (
          <SkillDisplay skills={skills} />
        ) : (
          <div className="text-muted-foreground flex flex-col items-center justify-center py-12">
            <Zap className="mb-3 size-8 opacity-40" />
            <p className="text-sm">Skills will appear after analysis...</p>
          </div>
        )}
      </section>
    </div>
  );
}
