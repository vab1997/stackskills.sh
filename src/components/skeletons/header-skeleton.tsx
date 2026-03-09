import { links } from "@/lib/links";
import Link from "next/link";

export function HeaderSkeleton() {
  return (
    <header
      className="bg-background sticky top-0 z-50"
      aria-label="Main navigation"
    >
      <div className="flex h-14 items-center justify-between gap-6 px-4">
        <div className="flex items-center gap-2 text-white">
          <Link
            href={links.home}
            className="font-jersey-15 text-2xl font-medium tracking-tight"
          >
            StackSkills
          </Link>
        </div>
      </div>
    </header>
  );
}
