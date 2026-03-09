import { authClient } from "../client";

export function useCurrentUser() {
  const currentUser = authClient.useSession();
  return currentUser.data?.user;
}
