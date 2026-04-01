#!/usr/bin/env node
import {
  cancel,
  groupMultiselect,
  intro,
  isCancel,
  log,
  multiselect,
  note,
  outro,
  spinner,
} from "@clack/prompts";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { ADDITIONAL_AGENTS, UNIVERSAL_AGENTS } from "./agents.mjs";
import {
  identifyTechnologiesFromMap,
  searchCuratedSkills,
} from "./identify-tech-map.mjs";
import { installAll } from "./install-skills.mjs";
import { mergeDependencies } from "./merge-dependencies.mjs";
import { searchSkillsForTechnologies } from "./search-skills.mjs";

const LOGO_LINES = [
  "███████╗████████╗ █████╗  ██████╗██╗  ██╗███████╗██╗  ██╗██╗██╗     ██╗     ███████╗",
  "██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝██╔════╝██║ ██╔╝██║██║     ██║     ██╔════╝",
  "███████╗   ██║   ███████║██║     █████╔╝ ███████╗█████╔╝ ██║██║     ██║     ███████╗",
  "╚════██║   ██║   ██╔══██║██║     ██╔═██╗ ╚════██║██╔═██╗ ██║██║     ██║     ╚════██║",
  "███████║   ██║   ██║  ██║╚██████╗██║  ██╗███████║██╗  ██╗██║███████╗███████╗███████║",
  "╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚══════╝",
];

const __dirname = dirname(fileURLToPath(import.meta.url));
const { version } = JSON.parse(
  readFileSync(resolve(__dirname, "../package.json"), "utf-8"),
);

async function main() {
  console.log("\n" + LOGO_LINES.join("\n"));
  intro(
    `stackskills v${version} — Discover agent skills for your tech stack`,
  );

  const pkgPath = resolve(process.cwd(), "package.json");
  let pkg;
  try {
    pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  } catch {
    log.error("No package.json found in the current directory.");
    process.exit(1);
  }

  const packages = mergeDependencies(pkg.dependencies, pkg.devDependencies);

  const technologies = identifyTechnologiesFromMap(packages);
  log.step(`Detected ${technologies.length} technologies`);

  note(technologies.join(", "), "Detected technologies");

  const s = spinner();

  s.start("Fetching skills from skills.sh...");
  const [skillsByTech, curatedSkills] = await Promise.all([
    searchSkillsForTechnologies(technologies),
    searchCuratedSkills(packages),
  ]);
  s.stop(`Found skills for ${skillsByTech.length} technologies`);

  const options = {};
  for (const { technology, skills } of skillsByTech) {
    options[technology] = skills.map((skill) => ({
      value: skill,
      label: skill.name,
      hint: `${skill.installs.toLocaleString()} installs`,
    }));
  }
  if (curatedSkills.length > 0) {
    options["⭐ curated"] = curatedSkills.map((skill) => ({
      value: skill,
      label: skill.name,
      hint: `${skill.installs.toLocaleString()} installs`,
    }));
  }

  const selected = await groupMultiselect({
    message: "Select skills to install:",
    options,
  });

  if (isCancel(selected) || selected.length === 0) {
    cancel("No skills selected.");
    process.exit(0);
  }

  note(
    selected.map((s) => `• ${s.name}`).join("\n"),
    `${selected.length} skill(s) selected`,
  );

  note(
    UNIVERSAL_AGENTS.map((a) => `• ${a.label}`).join("\n"),
    "Universal (.agents/skills) — always included",
  );

  const selectedAdditional = await multiselect({
    message: "Additional agents (optional):",
    options: ADDITIONAL_AGENTS,
  });

  if (isCancel(selectedAdditional)) {
    cancel("Cancelled.");
    process.exit(0);
  }

  const allAgents = [
    ...UNIVERSAL_AGENTS.map((a) => a.value),
    ...selectedAdditional.map((a) => a.value),
  ];

  log.step(
    `Installing ${selected.length} skill(s) to ${allAgents.length} agent(s)...`,
  );
  console.log("");

  const { installed, failed, errors } = await installAll(selected, allAgents);

  console.log("");

  if (errors.length > 0) {
    for (const { name, output } of errors) {
      const clean = output.replace(/\x1b\[[0-9;]*m/g, "");
      const reason =
        clean
          .split("\n")
          .map((l) => l.trim())
          .find(
            (l) =>
              l.startsWith("No matching") ||
              l.startsWith("Error") ||
              l.startsWith("error"),
          ) ?? "installation failed";
      log.warn(`${name}: ${reason}`);
    }
  }

  outro(
    failed === 0
      ? `Successfully installed ${installed} skill(s).`
      : `Installed ${installed}, failed ${failed}.`,
  );
}

main().catch((err) => {
  log.error(err.message ?? String(err));
  process.exit(1);
});
