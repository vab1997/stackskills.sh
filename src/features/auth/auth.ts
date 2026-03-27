import { db } from "@/db/index";
import { config } from "@/lib/config";
import { getBaseURL } from "@/lib/get-base-url";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  baseURL: getBaseURL(),
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  socialProviders: {
    github: {
      clientId: config.GITHUB_CLIENT_ID,
      clientSecret: config.GITHUB_CLIENT_SECRET,
      scope: ["read:user", "user:email", "public_repo"],
    },
  },
  plugins: [nextCookies()],
  advanced: {
    database: {
      generateId: () => crypto.randomUUID(),
    },
  },
});
