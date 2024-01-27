import { env } from "@/env.mjs";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema",
  driver: "mysql2",
  out: "./src/db",
  dbCredentials: {
    uri: env.DATABASE_URL,
  },
  tablesFilter: ["rohi.dev_*"],
  verbose: true,
  strict: true,
});
