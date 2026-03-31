"use client";

import { Button } from "@/components/ui/button";
import { AnalysisSectionBody } from "@/features/skills/components/analysis-section";
import { DependencyInput } from "@/features/skills/components/dependency-input";
import { DiscoveryStepPanel } from "@/features/skills/components/discovery-step-panel";
import { SkillDisplay } from "@/features/skills/components/skills-display";
import { Stepper } from "@/features/skills/components/stepper";
import type { StreamPhase } from "@/features/skills/hooks/use-stream-skills";
import { useStreamSkills } from "@/features/skills/hooks/use-stream-skills";
import type { GithubRepo } from "@/features/skills/types";
import { User } from "better-auth/types";
import { Package, RotateCcw, Search, Sparkles, Zap } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

const STEPS = [
  { label: "Dependencies", description: "Add your source" },
  { label: "Analyzing", description: "Extracting key deps" },
  { label: "Skills", description: "Relevant skills" },
];

interface DependenciesSubmitPayload {
  packageJsonFromRepository?: string;
  packageJsonFromPaste?: string[];
}

const getPackageJsons = ({
  packageJsonFromRepository,
  packageJsonFromPaste,
}: DependenciesSubmitPayload) => {
  if (packageJsonFromRepository) {
    return [packageJsonFromRepository];
  }

  return packageJsonFromPaste ?? [];
};

const getSkillsSummary = (
  skills: ReturnType<typeof useStreamSkills>["streamState"]["skills"],
) => {
  const skillsByDependency = skills ?? {};
  const technologyCount = Object.keys(skillsByDependency).length;
  const totalSkills = Object.values(skillsByDependency).reduce(
    (acc, value) => acc + value.length,
    0,
  );

  const subtitle =
    technologyCount > 0
      ? `${technologyCount} technologies, ${totalSkills} skills found`
      : "Skills will appear after analysis";

  return {
    skillsByDependency,
    technologyCount,
    subtitle,
  };
};

export function SkillsDiscoveryFlow({
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
  const latestRequestRef = useRef(0);

  const handleReset = () => {
    latestRequestRef.current += 1;
    setCurrentStep(0);
    setLastPackageJsons([]);
    resetStream();
    setResetKey((k) => k + 1);
  };

  const syncStepWithPhase = (phase: StreamPhase) => {
    if (phase === "complete") {
      setCurrentStep(2);
      return;
    }

    if (phase === "idle") {
      setCurrentStep(0);
      return;
    }

    setCurrentStep(1);
  };

  const startAnalysis = async (packageJsons: string[]) => {
    if (packageJsons.length === 0) {
      return;
    }

    latestRequestRef.current += 1;
    const requestId = latestRequestRef.current;

    setLastPackageJsons(packageJsons);
    setCurrentStep(1);

    const finalPhase = await streamSkills(packageJsons);
    if (requestId !== latestRequestRef.current) {
      return;
    }

    syncStepWithPhase(finalPhase);
  };

  const handleRetry = async () => {
    if (lastPackageJsons.length === 0) {
      handleReset();
      return;
    }

    await startAnalysis(lastPackageJsons);
  };

  const handleDependenciesSubmit = async ({
    packageJsonFromRepository,
    packageJsonFromPaste,
  }: DependenciesSubmitPayload) => {
    const packageJsons = getPackageJsons({
      packageJsonFromRepository,
      packageJsonFromPaste,
    });

    if (packageJsons.length === 0) {
      toast.error("No package.json provided", {
        description: "Please provide a package.json",
      });
      return;
    }

    await startAnalysis(packageJsons);
  };

  const { skillsByDependency, technologyCount, subtitle } = getSkillsSummary(
    streamState.skills,
  );

  return (
    <div className="my-8 flex w-full flex-1 flex-col gap-8">
      <div className="mb-10">
        <Stepper steps={STEPS} currentStep={currentStep} />
      </div>

      <DiscoveryStepPanel
        title="Dependencies"
        description="Choose how to provide your dependencies"
        icon={Package}
        stepIndex={0}
        currentStep={currentStep}
      >
        <DependencyInput
          key={resetKey}
          onSubmit={handleDependenciesSubmit}
          disabledButtonAnalyze={currentStep > 0}
          disableRepositoryTab={!user}
          repositories={repositories}
        />
      </DiscoveryStepPanel>

      <DiscoveryStepPanel
        title="Analysis"
        description="Identifying key dependencies from your stack"
        icon={Search}
        stepIndex={1}
        currentStep={currentStep}
      >
        <AnalysisSectionBody
          streamState={streamState}
          onRetry={handleRetry}
          onReset={handleReset}
        />
      </DiscoveryStepPanel>

      <DiscoveryStepPanel
        title="Skills"
        description={subtitle}
        icon={Sparkles}
        stepIndex={2}
        currentStep={currentStep}
        headerAction={
          currentStep === 2 ? (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5"
              onClick={handleReset}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Start over
            </Button>
          ) : null
        }
      >
        {technologyCount > 0 ? (
          <SkillDisplay skills={skillsByDependency} />
        ) : (
          <div className="text-muted-foreground flex flex-col items-center justify-center py-12">
            <Zap className="mb-3 size-8 opacity-40" />
            <p className="text-sm">Skills will appear after analysis...</p>
          </div>
        )}
      </DiscoveryStepPanel>
    </div>
  );
}
