"use client";

import { Button } from "@/components/ui/button";
import { AnalysisSectionBody } from "@/features/skills/components/analysis-section";
import { DependencyInput } from "@/features/skills/components/dependency-input";
import { DiscoveryStepPanel } from "@/features/skills/components/discovery-step-panel";
import { SkillDisplay } from "@/features/skills/components/skills-display";
import { Stepper } from "@/features/skills/components/stepper";
import { useFetchSkills } from "@/features/skills/hooks/use-fetch-skills";
import { useIdentifyTech } from "@/features/skills/hooks/use-identify-tech";
import type { AnalysisState, GithubRepo } from "@/features/skills/types";
import {
  getAnalysisErrorMessage,
  getCompletedState,
  getEmptyDependenciesState,
  getErrorState,
  getFetchingState,
  getNoTechnologiesState,
  getSkillsSummary,
  hasDependencies,
  INITIAL_ANALYSIS_STATE,
} from "@/features/skills/utils/analysis-state";
import { User } from "better-auth/types";
import { Package, RotateCcw, Search, Sparkles, Zap } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

const STEPS = [
  { label: "Dependencies", description: "Add your source" },
  { label: "Analyzing", description: "Extracting key deps" },
  { label: "Skills", description: "Relevant skills" },
];

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
  const [analysisState, setAnalysisState] = useState<AnalysisState>(
    INITIAL_ANALYSIS_STATE,
  );
  const { identifyTech } = useIdentifyTech();
  const { fetchSkills } = useFetchSkills();
  const latestRequestRef = useRef(0);

  const isStaleRequest = (requestId: number) => {
    return requestId !== latestRequestRef.current;
  };

  const beginAnalysis = (packageJsons: string[]) => {
    latestRequestRef.current += 1;
    const requestId = latestRequestRef.current;

    setLastPackageJsons(packageJsons);
    setCurrentStep(1);
    setAnalysisState({ ...INITIAL_ANALYSIS_STATE, phase: "identifying" });

    return requestId;
  };

  const resolveTechnologies = (packageJsons: string[]) => {
    return identifyTech({ packageJsons });
  };

  const resolveSkills = async (technologies: string[]) => {
    const result = await fetchSkills({ technologies });

    if (!result?.data) {
      throw new Error("Failed to fetch skills");
    }

    return result.data.skills;
  };

  const handleReset = () => {
    latestRequestRef.current += 1;
    setCurrentStep(0);
    setLastPackageJsons([]);
    setAnalysisState(INITIAL_ANALYSIS_STATE);
    setResetKey((k) => k + 1);
  };

  const startAnalysis = async (packageJsons: string[]) => {
    const requestId = beginAnalysis(packageJsons);

    if (!hasDependencies(packageJsons)) {
      if (isStaleRequest(requestId)) return;
      setAnalysisState(getEmptyDependenciesState());
      return;
    }

    const technologies = resolveTechnologies(packageJsons);
    if (isStaleRequest(requestId)) return;

    if (technologies.length === 0) {
      setAnalysisState(getNoTechnologiesState());
      return;
    }

    setAnalysisState(getFetchingState(technologies));

    try {
      const skills = await resolveSkills(technologies);
      if (isStaleRequest(requestId)) return;

      setAnalysisState(getCompletedState(technologies, skills));
      if (Object.keys(skills).length > 0) setCurrentStep(2);
    } catch (err) {
      if (isStaleRequest(requestId)) return;
      setAnalysisState(
        getErrorState(technologies, getAnalysisErrorMessage(err)),
      );
    }
  };

  const handleRetry = async () => {
    if (lastPackageJsons.length === 0) {
      handleReset();
      return;
    }

    await startAnalysis(lastPackageJsons);
  };

  const handleDependenciesSubmit = async ({
    packageJsons,
  }: {
    packageJsons: string[];
  }) => {
    if (packageJsons.length === 0) {
      toast.error("No package.json provided", {
        description: "Please provide a package.json",
      });
      return;
    }

    await startAnalysis(packageJsons);
  };

  const { skillsByDependency, technologyCount, subtitle } = getSkillsSummary(
    analysisState.skills,
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
          onDependenciesSubmit={handleDependenciesSubmit}
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
          analysisState={analysisState}
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
