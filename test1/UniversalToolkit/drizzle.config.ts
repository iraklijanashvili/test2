import { defineConfig } from "drizzle-kit";
import 'dotenv/config';

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set, ensure the database is provisioned");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: process.env.DATABASE_URL.startsWith('sqlite') ? "sqlite" : "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
