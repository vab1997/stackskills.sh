import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface DiscoveryStepPanelProps {
  title: string;
  description: string;
  icon: LucideIcon;
  stepIndex: number;
  currentStep: number;
  headerAction?: ReactNode;
  children: ReactNode;
}

const getPanelStateClassName = ({
  stepIndex,
  currentStep,
}: Pick<DiscoveryStepPanelProps, "stepIndex" | "currentStep">) => {
  if (currentStep === stepIndex) {
    return "opacity-100";
  }

  if (currentStep > stepIndex) {
    return "opacity-60";
  }

  return "pointer-events-none opacity-40";
};

export function DiscoveryStepPanel({
  title,
  description,
  icon: Icon,
  stepIndex,
  currentStep,
  headerAction,
  children,
}: DiscoveryStepPanelProps) {
  return (
    <section
      className={cn(
        "border-border rounded-xl border p-6 transition-all duration-300",
        getPanelStateClassName({ stepIndex, currentStep }),
      )}
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="bg-secondary flex size-9 items-center justify-center rounded-lg">
          <Icon className="text-muted-foreground size-4" />
        </div>

        <div>
          <h2 className="text-foreground text-sm font-semibold">{title}</h2>
          <p className="text-muted-foreground text-xs">{description}</p>
        </div>

        {headerAction ? <div className="ml-auto">{headerAction}</div> : null}
      </div>

      {children}
    </section>
  );
}
