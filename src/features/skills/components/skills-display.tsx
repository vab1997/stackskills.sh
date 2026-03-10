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
import type {
  SkillsApiSkill,
  SkillsByDependency,
} from "@/features/skills/types";
import { cn } from "@/lib/utils";
import {
  ArrowDownToLine,
  BadgeCheck,
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  ListChecks,
  Package,
  Terminal,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";

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

function TechnologyRow({
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

  return (
    <Collapsible className="group/collapsible bg-background">
      <CollapsibleTrigger className="hover:bg-muted/60 data-[state=open]:bg-muted/40 flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors duration-150">
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
                onToggle={() =>
                  onToggleSkill({
                    command: skill.command,
                  })
                }
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

function CommandBuilder({
  selectedSkills,
  allSkills,
  onClearAll,
  onRemoveSkill,
}: {
  selectedSkills: Set<string>;
  allSkills: SkillsByDependency;
  onClearAll: () => void;
  onRemoveSkill: ({ name, command }: { name: string; command: string }) => void;
}) {
  const getSkillNameFromCommand = (command: string) => {
    const parts = command.trim().split(" ");
    const last = parts[parts.length - 1] ?? "";
    if (last.length === 0) return command;
    return last;
  };

  const selectedSkillsData = useMemo(() => {
    const result: SkillsApiSkill[] = [];
    for (const skills of Object.values(allSkills)) {
      for (const skill of skills) {
        if (selectedSkills.has(skill.command)) {
          result.push(skill);
        }
      }
    }
    return result;
  }, [selectedSkills, allSkills]);

  const combinedCommand = useMemo(() => {
    if (selectedSkillsData.length === 0) return "";
    const commands = selectedSkillsData.map((skill) => skill.command);
    return commands.join(" && ");
  }, [selectedSkillsData]);

  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={shouldReduceMotion ? {} : { y: 24, opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
      className="fixed bottom-6 left-1/2 z-50 w-full max-w-2xl -translate-x-1/2 px-4"
    >
      <div className="border-primary/30 bg-background shadow-primary/10 overflow-hidden rounded-2xl border shadow-2xl">
        {/* Header */}
        <div className="border-border bg-primary/5 flex items-center justify-between border-b p-3">
          <div className="flex items-center gap-2">
            <div className="bg-primary/20 flex size-7 items-center justify-center rounded-lg">
              <ListChecks className="text-primary size-4" />
            </div>
            <div>
              <span className="text-foreground text-sm font-medium">
                Install {selectedSkills.size} skill
                {selectedSkills.size !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
          <button
            onClick={onClearAll}
            className="text-muted-foreground hover:bg-secondary hover:text-foreground flex items-center gap-1 rounded-lg px-2 py-1 text-xs transition-colors"
          >
            <X className="size-3" />
            Clear all
          </button>
        </div>

        {/* Selected Skills Tags */}
        <div className="border-border flex flex-wrap gap-2 border-b p-3">
          {selectedSkillsData.map((skill) => (
            <Badge
              key={skill.command}
              variant="secondary"
              className="border-primary/30 bg-primary/10 text-primary gap-1.5 border pr-1.5 font-mono text-xs"
            >
              {getSkillNameFromCommand(skill.command)}
              <button
                onClick={() =>
                  onRemoveSkill({ name: skill.name, command: skill.command })
                }
                className="hover:bg-primary/20 rounded p-0.5 transition-colors"
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>

        {/* Command */}
        <div className="bg-secondary/30 flex items-center gap-2 p-3">
          <Terminal className="text-primary size-4 shrink-0" />
          <code className="text-foreground min-w-0 flex-1 truncate font-mono text-xs">
            {combinedCommand}
          </code>
          <CopyButton text={combinedCommand} />
        </div>
      </div>
    </motion.div>
  );
}

export function SkillDisplay({ skills }: { skills: SkillsByDependency }) {
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());

  const handleToggleSkill = ({ command }: { command: string }) => {
    setSelectedSkills((prev) => {
      const next = new Set(prev);
      if (next.has(command)) {
        next.delete(command);
      } else {
        next.add(command);
      }
      return next;
    });
  };

  const handleClearAll = () => {
    setSelectedSkills(new Set());
  };

  const handleRemoveSkill = ({ command }: { command: string }) => {
    setSelectedSkills((prev) => {
      const next = new Set(prev);
      next.delete(command);
      return next;
    });
  };

  return (
    <div className="mx-auto w-full">
      <div className="border-border overflow-hidden rounded-lg border">
        <div className="divide-border/50 divide-y">
          {Object.keys(skills).length > 0 ? (
            Object.entries(skills).map(([key, value], index) => (
              <div
                key={key}
                className="animate-in fade-in-0 slide-in-from-bottom-1 duration-200 ease-out motion-reduce:animate-none"
                style={{
                  animationDelay: `${Math.min(index, 7) * 40}ms`,
                  animationFillMode: "both",
                }}
              >
                <TechnologyRow
                  name={key}
                  skills={value}
                  selectedSkills={selectedSkills}
                  onToggleSkill={handleToggleSkill}
                />
              </div>
            ))
          ) : (
            <div className="text-muted-foreground flex flex-col items-center justify-center py-10">
              <Zap className="mb-3 size-8 opacity-40" />
              <p className="text-sm">No skills found for your stack.</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedSkills.size > 0 && (
          <CommandBuilder
            selectedSkills={selectedSkills}
            allSkills={skills}
            onClearAll={handleClearAll}
            onRemoveSkill={handleRemoveSkill}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
