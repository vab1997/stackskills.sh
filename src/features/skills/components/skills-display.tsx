import { CommandBuilder } from "@/features/skills/components/command-builder";
import { TechnologyRow } from "@/features/skills/components/technology-row";
import type { SkillsByDependency } from "@/features/skills/types";
import { Zap } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useState } from "react";

export function SkillDisplay({ skills }: { skills: SkillsByDependency }) {
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());
  const [selectedAgents, setSelectedAgents] = useState<Set<string>>(new Set());

  function handleToggleSkill({ command }: { command: string }) {
    setSelectedSkills((prev) => {
      const next = new Set(prev);
      if (next.has(command)) {
        next.delete(command);
      } else {
        next.add(command);
      }
      return next;
    });
  }

  function handleClearAll() {
    setSelectedSkills(new Set());
  }

  function handleRemoveSkill({ command }: { command: string }) {
    setSelectedSkills((prev) => {
      const next = new Set(prev);
      next.delete(command);
      return next;
    });
  }

  function handleAddAgent(value: string) {
    setSelectedAgents((prev) => new Set([...prev, value]));
  }

  function handleRemoveAgent(value: string) {
    setSelectedAgents((prev) => {
      const next = new Set(prev);
      next.delete(value);
      return next;
    });
  }

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
            selectedAgents={selectedAgents}
            onAddAgent={handleAddAgent}
            onRemoveAgent={handleRemoveAgent}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
