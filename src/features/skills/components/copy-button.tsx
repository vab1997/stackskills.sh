import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCopy();
          }}
          className="text-muted-foreground hover:bg-secondary hover:text-foreground blur-in ease inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md p-1.5 transition-colors duration-150 active:scale-90 motion-reduce:transition-none"
          aria-label="Copy command"
        >
          {copied ? (
            <Check className="text-primary animate-in zoom-in-50 size-3.5 duration-150 ease-out motion-reduce:animate-none" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent>{copied ? "Copied!" : "Copy command"}</TooltipContent>
    </Tooltip>
  );
}
