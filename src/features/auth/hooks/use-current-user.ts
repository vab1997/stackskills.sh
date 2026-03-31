import { authClient } from "@/features/auth/client";

export function useCurrentUser() {
  const currentUser = authClient.useSession();
  return currentUser.data?.user;
}
