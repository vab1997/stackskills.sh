"use client";

import { links } from "@/lib/links";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function HeaderNavLink() {
  const pathname = usePathname();
  const isCli = pathname === links.cli;

  return (
    <Link
      href={isCli ? links.home : links.cli}
      className="font-jersey-15 text-2xl font-medium tracking-tight uppercase"
    >
      {isCli ? "[ home ]" : "[ try cli ]"}
    </Link>
  );
}
