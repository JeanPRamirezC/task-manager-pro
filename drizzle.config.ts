// drizzle.config.ts
import type { Config } from "drizzle-kit";
import "dotenv/config"; // 👈 Importa .env para acceder a process.env

const config: Config = {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
};

export default config;
