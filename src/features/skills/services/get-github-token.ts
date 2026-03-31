import { db } from "@/db";
import { account } from "@/db/schema";
import { and, eq } from "drizzle-orm/sql";

export async function getGithubToken(userId: string): Promise<string | null> {
  "use cache";
  const result = await db
    .select({ accessToken: account.accessToken })
    .from(account)
    .where(and(eq(account.userId, userId), eq(account.providerId, "github")))
    .limit(1);
  return result[0]?.accessToken ?? null;
}
