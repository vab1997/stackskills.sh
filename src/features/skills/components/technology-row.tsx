import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
import { CopyButton } from "@/features/skills/components/copy-button";
import type { SkillsApiSkill } from "@/features/skills/types";
import { cn } from "@/lib/utils";
import {
  ArrowDownToLine,
  BadgeCheck,
  ChevronDown,
  ExternalLink,
  Package,
  Sparkles,
} from "lucide-react";

function SkillItem({
  skill,
  isSelected,
  onToggle,
}: {
  skill: SkillsApiSkill;
  isSelected: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={cn(
        "group/item bg-muted/30 ease flex items-center gap-3 rounded-lg border border-transparent px-3 transition-[background-color,border-color] duration-150",
        isSelected
          ? "border-green-500/40 bg-green-500/10"
          : "bg-secondary/50 hover:border-border border-transparent",
      )}
    >
      <Checkbox
        checked={isSelected}
        onCheckedChange={onToggle}
        onClick={(e) => e.stopPropagation()}
        className="shrink-0"
      />

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

export function TechnologyRow({
  name,
  skills,
  selectedSkills,
  onToggleSkill,
}: {
  name: string;
  skills: SkillsApiSkill[];
  selectedSkills: Set<string>;
  onToggleSkill: ({ command }: { command: string }) => void;
}) {
  const selectedInCategory = skills.filter((s) =>
    selectedSkills.has(s.command),
  ).length;

  const isCurated = name === "curated";

  return (
    <Collapsible className="group/collapsible bg-background">
      <CollapsibleTrigger className="hover:bg-muted/60 data-[state=open]:bg-muted/40 flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors duration-150">
        <div className="flex items-center gap-3">
          {isCurated ? (
            <Sparkles className="text-muted-foreground size-4" />
          ) : (
            <Package className="text-muted-foreground size-4" />
          )}
          <span className="text-foreground font-mono text-sm font-medium">
            {isCurated ? "Bonus skills" : name}
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
        {selectedInCategory > 0 && (
          <Badge className="ml-1 border-0 bg-green-500/10 font-mono text-xs text-green-500">
            {selectedInCategory} selected
          </Badge>
        )}
        <div className="ml-auto flex items-center gap-2">
          <ChevronDown className="text-muted-foreground size-4 transition-transform duration-200 ease-in-out group-data-[state=open]/collapsible:rotate-180 motion-reduce:transition-none" />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="data-[state=closed]:animate-out data-[state=open]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-2 data-[state=closed]:slide-out-to-top-2 overflow-hidden duration-100 motion-reduce:animate-none">
        {skills.length > 0 ? (
          <div className="flex flex-col gap-1.5 px-4 pt-1 pb-3">
            {skills.map((skill) => (
              <SkillItem
                key={skill.url}
                skill={skill}
                isSelected={selectedSkills.has(skill.command)}
                onToggle={() => onToggleSkill({ command: skill.command })}
              />
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
