import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { links } from "@/lib/links";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "../client";
import { useCurrentUser } from "../hooks/use-current-user";

export function ConnectedGithubAccount() {
  const router = useRouter();
  const handleSignOut = async () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.push(links.home),
      },
    });
  };
  const currentUser = useCurrentUser();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage
            src={currentUser?.image ?? ""}
            alt={currentUser?.name ?? ""}
          />
          <AvatarFallback>{currentUser?.name?.charAt(0) ?? ""}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-foreground text-sm font-medium">
            {currentUser?.name ?? ""}
          </p>
          <p className="text-muted-foreground text-xs">Connected via GitHub</p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="default"
        onClick={handleSignOut}
        className="w-fit gap-1 px-2 transition-[background-color,transform] active:scale-[0.97]"
      >
        <LogOutIcon className="size-3" />
        Log out
      </Button>
    </div>
  );
}
