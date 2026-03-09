"use server";

import { getSessionUser } from "@/features/auth/server";
import { getGithubToken, hasRepoScope } from "@/features/skills/services";
import type { GithubRepo } from "@/features/skills/types";
import { GITHUB_API_URL } from "@/lib/constants";
import { actionClient } from "@/lib/safe-action";

export const getRepositoriesAction = actionClient.action(async () => {
  const session = await getSessionUser();

  if (!session.user) {
    throw new Error("Unauthorized");
  }

  const hasAccess = await hasRepoScope(session.user.id);
  if (!hasAccess) {
    throw new Error("Missing repo scope");
  }

  const token = await getGithubToken(session.user.id);
  if (!token) {
    throw new Error("No GitHub token found");
  }

  const response = await fetch(
    `${GITHUB_API_URL}/user/repos?per_page=100&sort=updated&type=owner`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("GitHub API error");
  }

  const repos = await response.json();
  const filtered: GithubRepo[] = repos.map((repo: GithubRepo) => ({
    id: repo.id,
    name: repo.name,
    full_name: repo.full_name,
    private: repo.private,
    description: repo.description,
    owner: { login: repo.owner.login },
  }));

  return filtered;
});
