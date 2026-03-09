import { DropdownUserMenu } from "@/features/auth/components/dropdown-user-menu";
import { SignInButton } from "@/features/auth/components/sign-in-button";
import { links } from "@/lib/links";
import type { User } from "better-auth";
import Link from "next/link";

export function Header({ user }: { user?: User }) {
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

        <div className="flex items-center gap-2">
          {user && <DropdownUserMenu user={user} />}
          {!user && <SignInButton />}
        </div>
      </div>
    </header>
  );
}
