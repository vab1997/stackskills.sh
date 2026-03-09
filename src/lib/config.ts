import { z } from "zod/v4";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
});

export type Config = z.infer<typeof envSchema>;

export const config: Config = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
});
