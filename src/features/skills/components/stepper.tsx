import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface Step {
  label: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-between gap-0",
        className,
      )}
    >
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;
        const isLast = index === steps.length - 1;

        return (
          <div
            key={step.label}
            className={cn("flex flex-1 items-center", isLast && "flex-none")}
          >
            <div className="flex shrink-0 items-center gap-3">
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition-all duration-300",
                  isCompleted &&
                    "border-accent bg-accent text-accent-foreground",
                  isActive && "border-accent text-accent scale-110",
                  !isCompleted &&
                    !isActive &&
                    "border-border text-muted-foreground",
                )}
              >
                {isCompleted ? (
                  <Check className="size-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div className="hidden sm:block">
                <p
                  className={cn(
                    "text-sm leading-none font-medium transition-colors duration-300",
                    isActive && "text-foreground",
                    isCompleted && "text-accent",
                    !isActive && !isCompleted && "text-muted-foreground",
                  )}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-muted-foreground mt-1 text-xs">
                    {step.description}
                  </p>
                )}
              </div>
            </div>

            {!isLast && (
              <div className="relative mx-4 min-h-[0.3px] w-full min-w-16 bg-white/20">
                <AnimatePresence>
                  <motion.div
                    key={`step-${index}-progress`}
                    className="absolute inset-x-0 top-0 origin-top bg-white"
                    style={{ height: "100%" }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: currentStep >= 1 ? 1 : 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  />
                </AnimatePresence>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
