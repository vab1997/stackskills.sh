import { getSessionUser } from "@/features/auth/server";
import { hasRepoScope } from "@/features/skills/services";

export async function hasRepoScopeFn() {
  const session = await getSessionUser();
  if (!session.user) {
    return false;
  }
  return await hasRepoScope(session.user.id);
}
