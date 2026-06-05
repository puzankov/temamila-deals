import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Load local env (vercel env pull writes .env.local); fall back to .env.
config({ path: ".env.local" });
config({ path: ".env" });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
