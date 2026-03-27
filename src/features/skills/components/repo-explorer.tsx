"use client";

import { Button } from "@/components/ui/button";
import { AnalysisSectionBody } from "@/features/skills/components/analysis-section";
import { DependencyInput } from "@/features/skills/components/dependency-input";
import { SkillDisplay } from "@/features/skills/components/skills-display";
import { Stepper } from "@/features/skills/components/stepper";
import { useStreamSkills } from "@/features/skills/hooks/use-stream-skills";
import { cn } from "@/lib/utils";
import { User } from "better-auth/types";
import { Package, RotateCcw, Search, Sparkles, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { GithubRepo } from "../types";

const STEPS = [
  { label: "Dependencies", description: "Add your source" },
  { label: "Analyzing", description: "Extracting key deps" },
  { label: "Skills", description: "Relevant skills" },
];

export function RepoExplorer({
  user,
  repositories,
}: {
  user?: User;
  repositories?: GithubRepo[] | null;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [lastPackageJsons, setLastPackageJsons] = useState<string[]>([]);
  const [resetKey, setResetKey] = useState(0);

  const { streamSkills, resetStream, streamState } = useStreamSkills();

  const handleReset = () => {
    setCurrentStep(0);
    setLastPackageJsons([]);
    resetStream();
    setResetKey((k) => k + 1);
  };

  const runFetch = async (packageJsons: string[]) => {
    setCurrentStep(1);
    const finalPhase = await streamSkills(packageJsons);
    if (finalPhase === "complete") setCurrentStep(2);
  };

  const handleRetry = async () => {
    try {
      await runFetch(lastPackageJsons);
    } catch {
      toast.error("Something went wrong while analyzing your dependencies.", {
        description: "Please try again.",
      });
    }
  };

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
      await runFetch(packageJsons);
    } catch {
      toast.error("Something went wrong while analyzing your dependencies.", {
        description: "Please try again.",
      });
    }
  };

  const skills = streamState.skills ?? {};
  const skillKeys = Object.keys(skills);
  const skillCount = skillKeys.length;

  return (
    <div className="my-8 flex w-full flex-1 flex-col gap-8">
      <div className="mb-10">
        <Stepper steps={STEPS} currentStep={currentStep} />
      </div>

      {/* Step 1: Dependencies */}
      <section
        className={cn(
          "border-border rounded-xl border p-6 transition-all duration-300",
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
          key={resetKey}
          onSubmit={handleGetSkills}
          disabledButtonAnalyze={currentStep > 0}
          disableTabs={!user}
          repositories={repositories}
        />
      </section>

      {/* Step 2: Analyzing */}
      <section
        className={cn(
          "rounded-xl border p-6 transition-all duration-300",
          !user
            ? "opacity-100"
            : currentStep === 1
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

        {user ? (
          <AnalysisSectionBody
            streamState={streamState}
            onRetry={handleRetry}
            onReset={handleReset}
          />
        ) : null}
      </section>

      {/* Step 3: Skills */}
      <section
        className={cn(
          "border-border rounded-xl border p-6 transition-all duration-300",
          !user
            ? "opacity-100"
            : currentStep === 2
              ? "opacity-100"
              : currentStep > 2
                ? "opacity-60"
                : "pointer-events-none opacity-40",
        )}
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="bg-secondary flex size-9 items-center justify-center rounded-lg">
            <Sparkles className="text-muted-foreground size-4" />
          </div>
          <div>
            <h2 className="text-foreground text-sm font-semibold">Skills</h2>
            <p className="text-muted-foreground text-xs">
              {skillCount > 0
                ? `${skillCount} technologies, ${Object.values(skills).reduce((acc, value) => acc + value.length, 0)} skills found`
                : "Skills will appear after analysis"}
            </p>
          </div>
          {currentStep === 2 && (
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto gap-1.5"
              onClick={handleReset}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Start over
            </Button>
          )}
        </div>
        {skillCount > 0 ? (
          <SkillDisplay skills={skills} />
        ) : user ? (
          <div className="text-muted-foreground flex flex-col items-center justify-center py-12">
            <Zap className="mb-3 size-8 opacity-40" />
            <p className="text-sm">Skills will appear after analysis...</p>
          </div>
        ) : null}
      </section>
    </div>
  );
}
