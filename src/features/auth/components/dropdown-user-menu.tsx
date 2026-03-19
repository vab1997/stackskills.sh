"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/features/auth/client";
import { links } from "@/lib/links";
import type { User } from "better-auth";
import { ChevronDownIcon, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export function DropdownUserMenu({ user }: { user: User }) {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="flex w-fit items-center justify-center gap-2"
        >
          <Avatar>
            <AvatarImage src={user.image ?? ""} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          {user.name}
          <ChevronDownIcon className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem
            variant="destructive"
            onClick={() =>
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => router.push(links.home),
                },
              })
            }
          >
            <LogOutIcon />
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
