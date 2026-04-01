import type { ComponentType } from "react";

import { ClaudeCodeIcon } from "@/components/agents/claude-code";
import { GooseIcon } from "@/components/agents/goose";
import { KiloIcon } from "@/components/agents/kilo";
import { OpenClawIcon } from "@/components/agents/open-claw";
import { QwenCodeIcon } from "@/components/agents/qwen-code";
import { RooIcon } from "@/components/agents/roo";
import { TraeIcon } from "@/components/agents/trae";
import { WindsurfIcon } from "@/components/agents/windsurf";

export type AgentConfig = {
  value: string;
  label: string;
  icon?: ComponentType<{ className?: string }>;
  universal?: boolean;
};

export const AGENTS: AgentConfig[] = [
  // Universal — always included (.agents/skills), no -a flag needed
  { value: "cursor", label: "Cursor", universal: true },
  { value: "github-copilot", label: "GitHub Copilot", universal: true },
  { value: "opencode", label: "OpenCode", universal: true },
  { value: "cline", label: "Cline", universal: true },
  { value: "codex", label: "Codex", universal: true },
  { value: "amp", label: "Amp", universal: true },
  { value: "antigravity", label: "Antigravity", universal: true },
  { value: "gemini-cli", label: "Gemini CLI", universal: true },
  { value: "kimi-code-cli", label: "Kimi Code CLI", universal: true },
  { value: "kiro-cli", label: "Kiro CLI", universal: true },
  { value: "warp", label: "Warp", universal: true },
  // Additional agents — require explicit -a flag
  { value: "claude-code", label: "Claude Code", icon: ClaudeCodeIcon },
  { value: "open-claw", label: "Open Claw", icon: OpenClawIcon },
  { value: "goose", label: "Goose", icon: GooseIcon },
  { value: "qwen-code", label: "Qwen Code", icon: QwenCodeIcon },
  { value: "trae", label: "Trae", icon: TraeIcon },
  { value: "trae-cn", label: "Trae CN", icon: TraeIcon },
  { value: "kilo", label: "Kilo Code", icon: KiloIcon },
  { value: "kilo-cli", label: "Kilo CLI", icon: KiloIcon },
  { value: "windsurf", label: "Windsurf", icon: WindsurfIcon },
  { value: "roo", label: "Roo Code", icon: RooIcon },
];

export const UNIVERSAL_AGENTS = AGENTS.filter((a) => a.universal).sort(
  (a, b) => a.label.localeCompare(b.label),
);

export const ADDITIONAL_AGENTS = AGENTS.filter((a) => !a.universal).sort(
  (a, b) => a.label.localeCompare(b.label),
);
