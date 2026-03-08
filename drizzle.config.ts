import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const url = process.env.DATABASE_URL;

if (url === undefined) {
  throw new Error("DATABASE_URL is not set in environment variables");
}

export default defineConfig({
  out: "./src/db/drizzle/",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  migrations: {
    table: "drizzle_migrations",
    schema: "public",
  },
  dbCredentials: {
    url,
  },
});
