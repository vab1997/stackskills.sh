import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { FileJson, Plus, X } from "lucide-react";
import { Fragment, useState } from "react";
import z from "zod";

const depsSchema = z.record(z.string(), z.string());

const packageJsonSchema = z
  .object({
    name: z.string().optional(),
    version: z.string().optional(),
    dependencies: depsSchema.optional(),
    devDependencies: depsSchema.optional(),
    peerDependencies: depsSchema.optional(),
  })
  .refine(
    (d) =>
      Object.keys(d.dependencies ?? {}).length > 0 ||
      Object.keys(d.devDependencies ?? {}).length > 0 ||
      Object.keys(d.peerDependencies ?? {}).length > 0,
    { message: "Must include at least one dependency section with entries" },
  );

function validatePackageJson(content: string): string | null {
  if (!content.trim()) return null;
  try {
    const parsed = JSON.parse(content);
    const result = packageJsonSchema.safeParse(parsed);
    if (!result.success) {
      return result.error.issues[0].message;
    }
    return null;
  } catch {
    return "Invalid JSON — check for missing commas or quotes";
  }
}

export function TextAreaInput({
  disabledButtonAnalyze,
  onSubmit,
}: {
  disabledButtonAnalyze: boolean;
  onSubmit: ({
    packageJsonFromPaste,
  }: {
    packageJsonFromPaste: string[];
  }) => void;
}) {
  const [manualPackageJsons, setManualPackageJsons] = useState<string[]>([""]);
  const [errors, setErrors] = useState<(string | null)[]>([null]);

  const addPackageJson = () => {
    setManualPackageJsons((prev) => [...prev, ""]);
    setErrors((prev) => [...prev, null]);
  };

  const removePackageJson = (index: number) => {
    setManualPackageJsons((prev) => prev.filter((_, i) => i !== index));
    setErrors((prev) => prev.filter((_, i) => i !== index));
  };

  const updatePackageJson = (index: number, value: string) => {
    setManualPackageJsons((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    setErrors((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
  };

  const handleBlur = (index: number) => {
    const error = validatePackageJson(manualPackageJsons[index]);
    setErrors((prev) => {
      const next = [...prev];
      next[index] = error;
      return next;
    });
  };

  const handleSubmit = () => {
    const filled = manualPackageJsons.filter((p) => p.trim());
    const newErrors = filled.map(validatePackageJson);
    setErrors(newErrors);
    if (newErrors.some((e) => e !== null)) return;

    onSubmit({
      packageJsonFromPaste: filled,
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <header className="flex items-center justify-between">
        <label
          htmlFor="paste-package-json-0"
          className="text-muted-foreground text-sm"
        >
          Paste your package.json contents (max 4)
        </label>

        <Button
          variant="outline"
          size="sm"
          onClick={addPackageJson}
          disabled={disabledButtonAnalyze || manualPackageJsons.length >= 4}
          className="w-fit gap-2 border-dashed active:scale-[0.97]"
          type="button"
        >
          <Plus className="size-3.5" />
          Add package.json
        </Button>
      </header>
      <div className="mb-4 flex flex-col gap-3">
        {manualPackageJsons.map((pkg, index) => (
          <Fragment key={index}>
            <div
              className={cn(
                "group/card border-border bg-muted/30 overflow-hidden rounded-lg border transition-colors",
                errors[index] ? "border-destructive" : "border-border",
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-between border-b px-3 py-1.5",
                )}
              >
                <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                  <FileJson className="size-3" />
                  package.json{" "}
                  {manualPackageJsons.length > 1 && `#${index + 1}`}
                </span>
                {manualPackageJsons.length > 1 && (
                  <button
                    onClick={() => removePackageJson(index)}
                    className="text-muted-foreground hover:bg-destructive/15 hover:text-destructive -mr-1 flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs transition ease-in-out active:scale-[0.97]"
                    aria-label="Remove this package.json"
                  >
                    <X className="size-3" />
                    <span className="hidden sm:inline">Remove</span>
                  </button>
                )}
              </div>

              <Textarea
                id={`paste-package-json-${index}`}
                placeholder='{"dependencies": { "react": "^18.0.0", ... }}'
                value={pkg}
                onChange={(e) => updatePackageJson(index, e.target.value)}
                onBlur={() => handleBlur(index)}
                disabled={disabledButtonAnalyze}
                aria-invalid={!!errors[index]}
                aria-describedby={errors[index] ? `error-${index}` : undefined}
                className="bg-muted/50 max-h-56 min-h-28 overflow-y-auto rounded-t-none border-none font-mono text-sm"
              />
            </div>

            {errors[index] && (
              <p id={`error-${index}`} className="text-destructive text-xs">
                {errors[index]}
              </p>
            )}
          </Fragment>
        ))}
      </div>

      <Button
        variant="outline"
        onClick={handleSubmit}
        disabled={
          !manualPackageJsons.some((p) => p.trim()) || !!disabledButtonAnalyze
        }
        className="w-full transition-[background-color,transform] active:scale-[0.99]"
        size="lg"
      >
        Analyze Dependencies
      </Button>
    </div>
  );
}
