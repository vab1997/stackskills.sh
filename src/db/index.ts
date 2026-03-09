import * as schema from "@/db/schema";
import { config } from "@/lib/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: config.DATABASE_URL,
  ssl: config.DATABASE_URL.includes("neon.tech")
    ? { rejectUnauthorized: false }
    : undefined,
});

export const db = drizzle(pool, { schema });
