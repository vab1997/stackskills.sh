import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CopyButton } from "@/features/skills/components/copy-button";
import type {
  SkillsApiSkill,
  SkillsByDependency,
} from "@/features/skills/types";
import {
  ADDITIONAL_AGENTS,
  UNIVERSAL_AGENTS,
} from "@/features/skills/utils/agents";
import { BadgeCheck, Bot, ListChecks, Terminal, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

// rendering-hoist-jsx: static badge list computed once at module load
const universalAgentBadges = UNIVERSAL_AGENTS.map((agent) => (
  <Badge
    key={agent.value}
    variant="secondary"
    className="border-border/50 text-muted-foreground border font-mono text-xs opacity-60"
  >
    {agent.label}
  </Badge>
));

function getSkillNameFromCommand(command: string): string {
  const parts = command.trim().split(" ");
  const last = parts[parts.length - 1] ?? "";
  return last.length === 0 ? command : last;
}

export function CommandBuilder({
  selectedSkills,
  allSkills,
  onClearAll,
  onRemoveSkill,
  selectedAgents,
  onAddAgent,
  onRemoveAgent,
}: {
  selectedSkills: Set<string>;
  allSkills: SkillsByDependency;
  onClearAll: () => void;
  onRemoveSkill: ({ name, command }: { name: string; command: string }) => void;
  selectedAgents: Set<string>;
  onAddAgent: (value: string) => void;
  onRemoveAgent: (value: string) => void;
}) {
  const shouldReduceMotion = useReducedMotion() ?? false;

  const seen = new Set<string>();
  const selectedSkillsData: SkillsApiSkill[] = [];
  for (const skills of Object.values(allSkills)) {
    for (const skill of skills) {
      if (selectedSkills.has(skill.command) && !seen.has(skill.command)) {
        seen.add(skill.command);
        selectedSkillsData.push(skill);
      }
    }
  }

  const availableAgents = ADDITIONAL_AGENTS.filter(
    (a) => !selectedAgents.has(a.value),
  );
  const selectedAgentsData = ADDITIONAL_AGENTS.filter((a) =>
    selectedAgents.has(a.value),
  );

  const agentArgs = [...selectedAgents].flatMap((a) => ["-a", a]).join(" ");
  const combinedCommand =
    selectedSkillsData.length === 0
      ? ""
      : selectedSkillsData
          .map((skill) => {
            const withNpxY = skill.command.replace(/^npx\s/, "npx -y ");
            return agentArgs ? `${withNpxY} ${agentArgs} -y` : `${withNpxY} -y`;
          })
          .join(" && ");

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={shouldReduceMotion ? {} : { y: 24, opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
      className="fixed bottom-6 left-1/2 z-50 w-full max-w-2xl -translate-x-1/2 px-4"
    >
      <div className="border-border bg-background overflow-hidden rounded-2xl border shadow-2xl">
        {/* Header */}
        <div className="border-border flex items-center justify-between border-b p-3">
          <div className="flex items-center gap-2">
            <div className="bg-primary/20 flex size-7 items-center justify-center rounded-lg">
              <ListChecks className="text-primary size-4" />
            </div>
            <span className="text-foreground text-sm font-medium">
              Install {selectedSkills.size} skill
              {selectedSkills.size !== 1 ? "s" : ""}
            </span>
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
              key={skill.id}
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

        {/* Agent Selector */}
        <div className="border-border space-y-2.5 border-b p-3">
          {/* Universal agents — always included */}
          <div>
            <p className="text-muted-foreground mb-1.5 flex items-center gap-1.5 font-mono text-xs">
              <BadgeCheck className="size-3" />
              Agent universal — always included (.agents/skills)
            </p>
            <div className="flex flex-wrap gap-1">{universalAgentBadges}</div>
          </div>

          {/* Additional agents */}
          <div>
            <div className="flex items-center gap-2">
              <Bot className="text-muted-foreground size-4 shrink-0" />
              <Select
                value=""
                onValueChange={(val) => {
                  if (val) onAddAgent(val);
                }}
              >
                <SelectTrigger className="h-7 w-48 font-mono text-xs">
                  <SelectValue placeholder="Add agent" />
                </SelectTrigger>
                <SelectContent>
                  {availableAgents.map((agent) => {
                    const Icon = agent.icon;
                    return (
                      <SelectItem
                        key={agent.value}
                        value={agent.value}
                        className="font-mono text-xs"
                      >
                        {Icon && <Icon className="size-8 rounded-full" />}
                        {agent.label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            {selectedAgentsData.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {selectedAgentsData.map((agent) => (
                  <Badge
                    key={agent.value}
                    variant="secondary"
                    className="border-primary/30 bg-primary/10 text-primary gap-1.5 border pr-1.5 font-mono text-xs"
                  >
                    {agent.label}
                    <button
                      onClick={() => onRemoveAgent(agent.value)}
                      className="hover:bg-primary/20 rounded p-0.5 transition-colors"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Command */}
        <div className="flex items-center gap-2 p-3">
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
