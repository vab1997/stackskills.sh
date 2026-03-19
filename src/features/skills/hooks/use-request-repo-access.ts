import { authClient } from "@/features/auth/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function useRequestRepoAccess() {
  const [isExecutingRequestRepoAccess, setIsExecutingRequestRepoAccess] =
    useState(false);
  const router = useRouter();

  const requestRepoAccess = async () => {
    try {
      setIsExecutingRequestRepoAccess(true);

      const result = await authClient.linkSocial({
        provider: "github",
        callbackURL: "/oauth-popup-callback",
        scopes: ["public_repo"],
        disableRedirect: true,
      });

      const url = result?.data?.url;
      if (!url) throw new Error("No OAuth URL returned");

      const popup = window.open(
        url,
        "oauth",
        "width=600,height=700,left=400,top=200",
      );

      // fallback if popup is blocked by browser
      if (!popup) {
        window.location.href = url;
        return;
      }

      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        if (event.data?.type !== "oauth-complete") return;
        window.removeEventListener("message", handleMessage);
        router.refresh();
        setIsExecutingRequestRepoAccess(false);
      };

      window.addEventListener("message", handleMessage);

      // cleanup if user closes popup manually
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          window.removeEventListener("message", handleMessage);
          setIsExecutingRequestRepoAccess(false);
        }
      }, 500);
    } catch {
      toast.error("Failed to request repository access");
      setIsExecutingRequestRepoAccess(false);
    }
  };

  return {
    requestRepoAccess,
    isExecutingRequestRepoAccess,
  };
}
