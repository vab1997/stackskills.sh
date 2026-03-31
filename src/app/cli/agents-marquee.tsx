import { AmpIcon } from "@/components/agents/amp";
import { AntigravityIcon } from "@/components/agents/antigravity";
import { ClaudeCodeIcon } from "@/components/agents/claude-code";
import { ClineIcon } from "@/components/agents/cline";
import { CodexIcon } from "@/components/agents/codex";
import { CopilotIcon } from "@/components/agents/copilot";
import { CursorIcon } from "@/components/agents/cursor";
import { GeminiIcon } from "@/components/agents/gemini";
import { GooseIcon } from "@/components/agents/goose";
import { KiloIcon } from "@/components/agents/kilo";
import { KiroCliIcon } from "@/components/agents/kiro-cli";
import { OpenCodeIcon } from "@/components/agents/opencode";
import { RooIcon } from "@/components/agents/roo";
import { TraeIcon } from "@/components/agents/trae";
import { WindsurfIcon } from "@/components/agents/windsurf";
import { Marquee } from "@/components/ui/marquee";

const ICON_CLASS =
  "size-14 grayscale hover:grayscale-0 transition-all duration-300 cursor-default";

const ROW_ONE = [
  <ClaudeCodeIcon key="claude-code" className={ICON_CLASS} />,
  <CursorIcon key="cursor" className={ICON_CLASS} />,
  <WindsurfIcon key="windsurf" className={ICON_CLASS} />,
  <CopilotIcon key="copilot" className={ICON_CLASS} />,
  <CodexIcon key="codex" className={ICON_CLASS} />,
  <OpenCodeIcon key="opencode" className={ICON_CLASS} />,
  <GeminiIcon key="gemini" className={ICON_CLASS} />,
  <GooseIcon key="goose" className={ICON_CLASS} />,
  <ClineIcon key="cline" className={ICON_CLASS} />,
  <RooIcon key="roo" className={ICON_CLASS} />,
  <TraeIcon key="trae" className={ICON_CLASS} />,
  <KiloIcon key="kilo" className={ICON_CLASS} />,
  <KiroCliIcon key="kiro-cli" className={ICON_CLASS} />,
  <AmpIcon key="amp" className={ICON_CLASS} />,
  <AntigravityIcon key="antigravity" className={ICON_CLASS} />,
];

export function AgentsMarquee() {
  return (
    <div className="flex flex-col gap-2 overflow-hidden">
      <p className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
        Available for these agents
      </p>
      <div className="relative">
        <Marquee pauseOnHover className="h-12 [--duration:50s]">
          {ROW_ONE.map((icon) => icon)}
        </Marquee>
      </div>
    </div>
  );
}
