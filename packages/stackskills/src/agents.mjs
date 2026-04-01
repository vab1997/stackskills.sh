// Universal — install to .agents/skills/, always included (no -a flag needed)
export const UNIVERSAL_AGENTS = [
  { value: "amp",          label: "Amp",          hint: ".agents/skills/" },
  { value: "antigravity",  label: "Antigravity",  hint: ".agents/skills/" },
  { value: "cline",        label: "Cline",        hint: ".agents/skills/" },
  { value: "codex",        label: "Codex",        hint: ".agents/skills/" },
  { value: "cursor",       label: "Cursor",       hint: ".agents/skills/" },
  { value: "deepagents",   label: "Deep Agents",  hint: ".agents/skills/" },
  { value: "gemini-cli",   label: "Gemini CLI",   hint: ".agents/skills/" },
  { value: "github-copilot", label: "GitHub Copilot", hint: ".agents/skills/" },
  { value: "kimi-cli",     label: "Kimi Code CLI", hint: ".agents/skills/" },
  { value: "opencode",     label: "OpenCode",     hint: ".agents/skills/" },
  { value: "replit",       label: "Replit",       hint: ".agents/skills/" },
  { value: "warp",         label: "Warp",         hint: ".agents/skills/" },
];

// Additional — require explicit -a flag, user-selectable
export const ADDITIONAL_AGENTS = [
  { value: "augment",       label: "Augment",       hint: ".augment/skills/"      },
  { value: "claude-code",   label: "Claude Code",   hint: ".claude/skills/"       },
  { value: "codebuddy",     label: "CodeBuddy",     hint: ".codebuddy/skills/"    },
  { value: "command-code",  label: "Command Code",  hint: ".commandcode/skills/"  },
  { value: "continue",      label: "Continue",      hint: ".continue/skills/"     },
  { value: "cortex",        label: "Cortex Code",   hint: ".cortex/skills/"       },
  { value: "crush",         label: "Crush",         hint: ".crush/skills/"        },
  { value: "goose",         label: "Goose",         hint: ".goose/skills/"        },
  { value: "junie",         label: "Junie",         hint: ".junie/skills/"        },
  { value: "kilo",          label: "Kilo Code",     hint: ".kilocode/skills/"     },
  { value: "kiro-cli",      label: "Kiro CLI",      hint: ".kiro/skills/"         },
  { value: "mistral-vibe",  label: "Mistral Vibe",  hint: ".vibe/skills/"         },
  { value: "openclaw",      label: "OpenClaw",      hint: "skills/"               },
  { value: "openhands",     label: "OpenHands",     hint: ".openhands/skills/"    },
  { value: "roo",           label: "Roo Code",      hint: ".roo/skills/"          },
  { value: "trae",          label: "Trae",          hint: ".trae/skills/"         },
  { value: "windsurf",      label: "Windsurf",      hint: ".windsurf/skills/"     },
  { value: "zencoder",      label: "Zencoder",      hint: ".zencoder/skills/"     },
];
