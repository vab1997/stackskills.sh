import { logger } from "@/lib/logger";
import { useState } from "react";
import { identifyTechnologiesFromMap } from "../services/identify-tech-map";

export function parsePackageJsons(packageJsons: string[]): {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
} {
  const dependencies: Record<string, string> = {};
  const devDependencies: Record<string, string> = {};
  for (const pkgStr of packageJsons) {
    try {
      const pkg = JSON.parse(pkgStr);
      Object.assign(dependencies, pkg.dependencies ?? {});
      Object.assign(devDependencies, pkg.devDependencies ?? {});
    } catch {
      logger.warn("Skipping invalid package.json entry");
    }
  }
  return { dependencies, devDependencies };
}

export function useIdentifyTech() {
  const [isIdentifying, setIsIdentifying] = useState(false);

  const identifyTech = ({ packageJsons }: { packageJsons: string[] }) => {
    setIsIdentifying(true);
    const { dependencies, devDependencies } = parsePackageJsons(packageJsons);
    const technologies = identifyTechnologiesFromMap(
      dependencies,
      devDependencies,
    );
    setIsIdentifying(false);
    return technologies;
  };

  return { identifyTech, isIdentifying };
}
