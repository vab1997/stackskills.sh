"use server";

import { getSessionUser } from "@/features/auth/server";
import { getGithubToken } from "@/features/skills/services";
import { GITHUB_API_URL } from "@/lib/constants";
import { actionClient } from "@/lib/safe-action";
import z from "zod";

export const getPackageJsonFromGithubAction = actionClient
  .inputSchema(
    z.object({
      owner: z.string(),
      repo: z.string(),
      path: z.string(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const { owner, repo, path } = parsedInput;
    const session = await getSessionUser();

    if (!session) {
      throw new Error("Unauthorized");
    }

    if (!session.user) {
      throw new Error("Unauthorized");
    }

    const token = await getGithubToken(session.user.id);
    if (!token) {
      throw new Error("No GitHub token found");
    }

    const response = await fetch(
      `${GITHUB_API_URL}/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.raw+json",
        },
      },
    );

    if (response.status === 404) {
      throw new Error("File not found");
    }

    if (!response.ok) {
      throw new Error("GitHub API error");
    }

    return await response.text();
  });
