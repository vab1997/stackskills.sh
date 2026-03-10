import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Package,
  XCircle,
} from "lucide-react";

type AnalysisStatus = "idle" | "loading" | "error" | "empty" | "success";

export function AnalysisSectionBody({
  status,
  skillKeys,
  skillCount,
  onRetry,
  onReset,
}: {
  status: AnalysisStatus;
  skillKeys: string[];
  skillCount: number;
  onRetry: () => void;
  onReset: () => void;
}) {
  const wrapperClass =
    "animate-in fade-in-0 slide-in-from-bottom-2 duration-200 ease-out motion-reduce:animate-none";

  if (status === "idle") {
    return (
      <div className={wrapperClass}>
        <div className="text-muted-foreground flex flex-col items-center justify-center py-12">
          <Package className="mb-3 size-8 opacity-40" />
          <p className="text-sm">Waiting for dependencies input...</p>
        </div>
      </div>
    );
  }
  if (status === "loading") {
    return (
      <div className={wrapperClass}>
        <div className="flex items-center gap-2 text-white/60">
          <Loader2 className="size-5 animate-spin" />
          <span>Loading skills...</span>
        </div>
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className={wrapperClass}>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-red-500">
            <XCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Analysis failed</span>
          </div>
          <p className="text-muted-foreground text-xs">
            Something went wrong while analyzing your dependencies.
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
  if (status === "empty") {
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
  // status === "success"
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
