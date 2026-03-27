"use server";

import { getGithubToken } from "@/features/skills/services";
import type { GithubRepo } from "@/features/skills/types";
import { CACHE_TAGS, GITHUB_API_URL } from "@/lib/constants";

async function getRepositoriesFromGithub({ token }: { token: string }) {
  "use cache";
  const response = await fetch(
    `${GITHUB_API_URL}/user/repos?per_page=100&sort=updated&type=owner`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
      cache: "force-cache",
      next: {
        tags: [CACHE_TAGS.GITHUB_REPOSITORIES],
      },
    },
  );

  if (!response.ok) {
    throw new Error("GitHub API error");
  }

  return (await response.json()) as GithubRepo[];
}

export async function getRepositories({ userId }: { userId: string }) {
  const token = await getGithubToken(userId);

  if (!token) {
    throw new Error("No GitHub token found");
  }

  const repos = await getRepositoriesFromGithub({ token });

  const filtered: GithubRepo[] = repos.map((repo: GithubRepo) => ({
    id: repo.id,
    name: repo.name,
    full_name: repo.full_name,
    private: repo.private,
    description: repo.description,
    owner: { login: repo.owner.login },
  }));

  return filtered;
}
