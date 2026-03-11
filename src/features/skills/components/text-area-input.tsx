import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { FileJson, Plus, X } from "lucide-react";
import { Fragment, useRef, useState } from "react";
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
  const nextId = useRef(1);
  const [entries, setEntries] = useState<{ id: number; value: string }[]>([
    { id: 0, value: "" },
  ]);
  const [errors, setErrors] = useState<Record<number, string | null>>({});

  const addPackageJson = () => {
    const id = nextId.current++;
    setEntries((prev) => [...prev, { id, value: "" }]);
  };

  const removePackageJson = (id: number) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const updatePackageJson = (id: number, value: string) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, value } : e)));
    setErrors((prev) => ({ ...prev, [id]: null }));
  };

  const handleBlur = (id: number, value: string) => {
    setErrors((prev) => ({ ...prev, [id]: validatePackageJson(value) }));
  };

  const handleSubmit = () => {
    const filled = entries.filter((e) => e.value.trim());
    const newErrors = Object.fromEntries(
      filled.map((e) => [e.id, validatePackageJson(e.value)]),
    );
    setErrors(newErrors);
    if (Object.values(newErrors).some((e) => e !== null)) return;

    onSubmit({
      packageJsonFromPaste: filled.map((e) => e.value),
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
          disabled={disabledButtonAnalyze || entries.length >= 4}
          className="w-fit gap-2 border-dashed active:scale-[0.97]"
          type="button"
        >
          <Plus className="size-3.5" />
          Add package.json
        </Button>
      </header>
      <div className="mb-4 flex flex-col gap-3">
        {entries.map((entry, index) => (
          <Fragment key={entry.id}>
            <div
              className={cn(
                "group/card border-border bg-background overflow-hidden rounded-lg border transition-colors",
                errors[entry.id] ? "border-destructive" : "border-border",
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-between border-b px-3 py-1.5",
                )}
              >
                <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                  <FileJson className="size-3" />
                  package.json {entries.length > 1 && `#${index + 1}`}
                </span>
                {entries.length > 1 && (
                  <button
                    onClick={() => removePackageJson(entry.id)}
                    className="text-muted-foreground hover:bg-destructive/15 hover:text-destructive -mr-1 flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs transition ease-in-out active:scale-[0.97]"
                    aria-label="Remove this package.json"
                  >
                    <X className="size-3" />
                    <span className="hidden sm:inline">Remove</span>
                  </button>
                )}
              </div>

              <Textarea
                id={`paste-package-json-${entry.id}`}
                placeholder='{"dependencies": { "react": "^18.0.0", ... }}'
                value={entry.value}
                onChange={(e) => updatePackageJson(entry.id, e.target.value)}
                onBlur={() => handleBlur(entry.id, entry.value)}
                disabled={disabledButtonAnalyze}
                aria-invalid={!!errors[entry.id]}
                aria-describedby={
                  errors[entry.id] ? `error-${entry.id}` : undefined
                }
                className="max-h-56 min-h-28 overflow-y-auto rounded-t-none border-none font-mono text-sm"
              />
            </div>

            {errors[entry.id] && (
              <p id={`error-${entry.id}`} className="text-destructive text-xs">
                {errors[entry.id]}
              </p>
            )}
          </Fragment>
        ))}
      </div>

      <Button
        variant="outline"
        onClick={handleSubmit}
        disabled={
          !entries.some((e) => e.value.trim()) || !!disabledButtonAnalyze
        }
        className="w-full transition-[background-color,transform] active:scale-[0.99]"
        size="lg"
      >
        Analyze Dependencies
      </Button>
    </div>
  );
}
