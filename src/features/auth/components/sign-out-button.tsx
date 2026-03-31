import { Button } from "@/components/ui/button";
import { links } from "@/lib/links";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "../client";

export function SignOutButton() {
  const router = useRouter();
  const handleSignOut = async () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.push(links.home),
      },
    });
  };
  return (
    <Button
      variant="ghost"
      size="xs"
      onClick={handleSignOut}
      className="w-fit gap-1 px-2 transition-[background-color,transform] active:scale-[0.97]"
    >
      <LogOutIcon className="size-3" />
      Log out
    </Button>
  );
}
