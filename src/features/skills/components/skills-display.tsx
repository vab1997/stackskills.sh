import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  ArrowDownToLine,
  BadgeCheck,
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  Package,
  Zap,
} from "lucide-react";
import { useState } from "react";
import type { SkillsApiSkill, SkillsByDependency } from "../types";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCopy();
          }}
          className="text-muted-foreground hover:bg-secondary hover:text-foreground blur-in ease inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md p-1.5 transition-colors duration-150 active:scale-90 motion-reduce:transition-none"
          aria-label="Copy command"
        >
          {copied ? (
            <Check className="text-primary animate-in zoom-in-50 size-3.5 duration-150 ease-out motion-reduce:animate-none" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent>{copied ? "Copied!" : "Copy command"}</TooltipContent>
    </Tooltip>
  );
}

function SkillItem({ skill }: { skill: SkillsApiSkill }) {
  return (
    <div className="group/item bg-muted/30 hover:border-border hover:bg-muted/60 ease flex items-center gap-3 rounded-lg border border-transparent px-3 transition-[background-color,border-color] duration-150">
      <div className="group/link relative flex min-w-0 flex-1 items-center gap-3 py-2">
        <Badge
          variant="outline"
          className="shrink-0 border-green-500/50 bg-green-500/10 font-mono text-xs text-green-500"
        >
          {skill.name}
        </Badge>
        <Badge
          variant="secondary"
          className="shrink-0 border font-mono text-xs tabular-nums"
        >
          <BadgeCheck className="size-3.5" />
          {skill.source}
        </Badge>
        <code className="text-muted-foreground min-w-0 flex-1 truncate font-mono text-xs">
          {skill.command}
        </code>
        <Badge
          variant="secondary"
          className="shrink-0 border font-mono text-xs tabular-nums"
        >
          <ArrowDownToLine className="size-3.5" />
          {skill.installs}
        </Badge>
        <div className="text-muted-foreground group-hover/link:bg-sidebar-accent flex w-0 shrink-0 items-center overflow-hidden rounded-4xl transition-[width] duration-200 ease-in-out group-hover/link:w-14 motion-reduce:transition-none">
          <div className="flex min-w-14 shrink-0 translate-x-full items-center justify-end px-1 transition-transform duration-200 ease-in-out group-hover/link:translate-x-0 motion-reduce:transition-none">
            <CopyButton text={skill.command} />
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={skill.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-muted-foreground hover:bg-secondary hover:text-foreground inline-flex items-center justify-center rounded-md p-1.5 transition-colors duration-150"
                  aria-label="Open skill"
                >
                  <ExternalLink className="size-3.5" />
                </a>
              </TooltipTrigger>
              <TooltipContent>Open skill</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}

function TechnologyRow({
  name,
  skills,
}: {
  name: string;
  skills: SkillsApiSkill[];
}) {
  return (
    <Collapsible className="group/collapsible bg-background">
      <CollapsibleTrigger className="hover:bg-muted/60 data-[state=open]:bg-muted/40 flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition duration-50">
        <div className="flex items-center gap-3">
          <Package className="text-muted-foreground size-4" />
          <span className="text-foreground font-mono text-sm font-medium">
            {name}
          </span>
        </div>
        <Badge
          variant="secondary"
          className={cn(
            "ml-1 border font-mono text-xs tabular-nums",
            skills.length > 0
              ? "border-primary/20 bg-primary/10 text-primary"
              : "border-border bg-secondary text-muted-foreground",
          )}
        >
          {skills.length}
        </Badge>
        <div className="ml-auto flex items-center gap-2">
          <ChevronDown className="text-muted-foreground size-4 transition-transform duration-200 ease-in-out group-data-[state=open]/collapsible:rotate-180 motion-reduce:transition-none" />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="data-[state=closed]:animate-out data-[state=open]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-2 data-[state=closed]:slide-out-to-top-2 overflow-hidden duration-100 motion-reduce:animate-none">
        {skills.length > 0 ? (
          <div className="flex flex-col gap-1.5 px-4 pt-1 pb-3">
            {skills.map((skill) => (
              <SkillItem key={skill.url} skill={skill} />
            ))}
          </div>
        ) : (
          <div className="px-4 pt-1 pb-3">
            <p className="text-muted-foreground py-3 text-center text-xs">
              No skills available for this dependency.
            </p>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}

export function SkillDisplay({ skills }: { skills: SkillsByDependency }) {
  return (
    <div className="mx-auto w-full">
      <div className="border-border overflow-hidden rounded-2xl border">
        <div className="divide-border/50 divide-y">
          {skills && Object.keys(skills).length > 0 ? (
            Object.entries(skills).map(([key, value]) => (
              <TechnologyRow key={key} name={key} skills={value} />
            ))
          ) : (
            <div className="text-muted-foreground flex flex-col items-center justify-center py-10">
              <Zap className="mb-3 size-8 opacity-40" />
              <p className="text-sm">No skills found for your stack.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
