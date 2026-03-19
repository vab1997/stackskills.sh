import { Loader } from "@/components/loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { StreamState } from "@/features/skills/hooks/use-stream-skills";
import {
  AlertCircle,
  CheckCircle2,
  Package,
  Settings,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export function AnalysisSectionBody({
  streamState,
  onRetry,
  onReset,
}: {
  streamState: StreamState;
  onRetry: () => void;
  onReset: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const {
    phase,
    technologies,
    fetchedCount,
    totalCount,
    skills,
    errorMessage,
  } = streamState;

  const wrapperClass =
    "animate-in fade-in-0 slide-in-from-bottom-2 duration-200 ease-out motion-reduce:animate-none";

  const transition = {
    duration: prefersReducedMotion ? 0 : 0.2,
    ease: "easeInOut" as const,
  };

  if (phase === "idle") {
    return (
      <div className={wrapperClass}>
        <div className="text-muted-foreground flex flex-col items-center justify-center py-12">
          <Package className="mb-3 size-8 opacity-40" />
          <p className="text-sm">Waiting for dependencies input...</p>
        </div>
      </div>
    );
  }

  if (phase === "detecting") {
    return (
      <div className={wrapperClass}>
        <AnimatePresence mode="wait">
          <motion.div
            key="detecting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
          >
            <div className="flex animate-pulse items-center gap-2 text-sm text-white/60">
              <Settings className="mr-1 size-4 animate-spin" />
              <span className="inline-flex items-baseline">
                <span>Detecting technologies</span>
                <span
                  className="animate-ellipsis ml-1 inline-block"
                  aria-hidden="true"
                ></span>
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  if (phase === "technologies_found") {
    return (
      <div className={wrapperClass}>
        <AnimatePresence mode="wait">
          <motion.div
            key="technologies_found"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
          >
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech) => (
                  <Badge
                    key={tech}
                    variant="outline"
                    className="shrink-0 border-green-500/50 bg-green-500/10 font-mono text-xs text-green-500"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
              <div className="flex animate-pulse items-center gap-2 text-sm text-white/60">
                <Loader className="size-4" />
                <span>Fetching skills...</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  if (phase === "fetching_skills" || phase === "skill_fetched") {
    return (
      <div className={wrapperClass}>
        <AnimatePresence mode="wait">
          <motion.div
            key="fetching"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
          >
            <div className="flex flex-col gap-3">
              {technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech) => (
                    <Badge
                      key={tech}
                      variant="outline"
                      className="shrink-0 border-green-500/50 bg-green-500/10 font-mono text-xs text-green-500"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex animate-pulse items-center gap-2 text-sm text-white/60">
                <Loader className="size-4" />
                <span>
                  Fetching skills ({fetchedCount} / {totalCount})
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className={wrapperClass}>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-red-500">
            <XCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Analysis failed</span>
          </div>
          <p className="text-muted-foreground text-xs">
            {errorMessage ??
              "Something went wrong while analyzing your dependencies."}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="w-fit"
              onClick={onRetry}
            >
              Try again
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-fit"
              onClick={onReset}
            >
              Start over
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const skillKeys = skills ? Object.keys(skills) : [];
  const skillCount = skillKeys.length;

  if (phase === "complete" && skillCount === 0) {
    return (
      <div className={wrapperClass}>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-yellow-500">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">
              No technologies identified
            </span>
          </div>
          <p className="text-muted-foreground text-xs">
            No stack-defining technologies were found in your dependencies. The
            packages may be utility tools without a dedicated Claude skill
            catalog.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="w-fit"
            onClick={onReset}
          >
            Start over
          </Button>
        </div>
      </div>
    );
  }

  // phase === "complete" with skills
  return (
    <div className={wrapperClass}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-green-500">
          <CheckCircle2 className="h-4 w-4" />
          <span className="text-sm font-medium">Analysis complete</span>
        </div>
        <div className="flex flex-col flex-wrap gap-2">
          <span className="text-muted-foreground text-xs font-medium">
            Found {skillCount} technologies
          </span>
          <div className="flex flex-wrap gap-2">
            {skillKeys.map((tech) => (
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
    </div>
  );
}
