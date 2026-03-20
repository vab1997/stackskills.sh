"use client";

import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { signInWithGithub } from "@/features/auth/client";
import { Github } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function SignInButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGithub();
    } catch {
      toast.error("Sign in failed", {
        description: "Could not sign in with GitHub. Please try again.",
      });
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="w-fit gap-1 px-2 transition-[background-color,transform] active:scale-[0.97]"
      onClick={handleSignIn}
      disabled={isLoading}
      aria-busy={isLoading}
    >
      {isLoading ? (
        <Loader className="size-4" />
      ) : (
        <Github className="size-4" />
      )}
      Sign in with GitHub
    </Button>
  );
}
