import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Whether a database is configured. When false, the app falls back to seed data
// so the public site keeps working before Postgres is wired up.
export const hasDb = !!process.env.DATABASE_URL;

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

/** Returns the Drizzle client, throwing a clear error if DATABASE_URL is unset. */
export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not set. Provision Neon Postgres (Vercel → Storage) and pull env vars with `vercel env pull .env.local`.",
    );
  }
  if (!_db) {
    const sql = neon(process.env.DATABASE_URL);
    _db = drizzle(sql, { schema });
  }
  return _db;
}

export { schema };
