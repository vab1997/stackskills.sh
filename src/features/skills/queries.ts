import { authClient } from "@/features/auth/client";

export const requestRepoAccess = async () => {
  await authClient.linkSocial({
    provider: "github",
    callbackURL: "/",
    scopes: ["repo"],
  });
};
