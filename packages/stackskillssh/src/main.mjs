import "./config.mjs";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
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
import { AGENTS } from "./agents.mjs";
import { identifyTechnologies } from "./identify-tech.mjs";
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
  intro(`stackskills.sh v${version} — Discover AI agent skills for your tech stack`);

  const pkgPath = resolve(process.cwd(), "package.json");
  let pkg;
  try {
    pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  } catch {
    log.error("No package.json found in the current directory.");
    process.exit(1);
  }

  const packages = mergeDependencies(pkg.dependencies, pkg.devDependencies);

  const s = spinner();

  s.start("Detecting technologies in your stack...");
  const technologies = await identifyTechnologies(packages);
  s.stop(`Detected ${technologies.length} technologies`);
  
  log.info("technologies:", technologies);

  s.start("Fetching skills from skills.sh...");
  const skillsByTech = await searchSkillsForTechnologies(technologies);
  s.stop(`Found skills for ${skillsByTech.length} technologies`);

  const options = {};
  for (const { technology, skills } of skillsByTech) {
    options[technology] = skills.map((skill) => ({
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

  const selectedAgents = await multiselect({
    message: "Which agents do you want to install to?",
    options: AGENTS,
  });

  if (isCancel(selectedAgents) || selectedAgents.length === 0) {
    cancel("No agents selected.");
    process.exit(0);
  }

  log.step(`Installing ${selected.length} skill(s) to ${selectedAgents.length} agent(s)...`);
  console.log("");

  const { installed, failed, errors } = await installAll(selected, selectedAgents);

  console.log("");

  if (errors.length > 0) {
    for (const { name, output } of errors) {
      log.warn(`${name} failed:\n${output.trim()}`);
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
