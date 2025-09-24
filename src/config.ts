import type { MigrationConfig } from "drizzle-orm/migrator";

process.loadEnvFile();

const DB_URL = process.env.DB_URL;
if (!DB_URL) {
  throw new Error("DB_URL is undefined");
}

const migrationConfig: MigrationConfig = {
  migrationsFolder: "src/lib/db/",
};

type APIConfig = {
  fileServerHits: number;
  db: {
    url: string;
    migrationConfig: MigrationConfig;
  };
};

export const config: APIConfig = {
  fileServerHits: 0,
  db: {
    url: DB_URL,
    migrationConfig,
  },
};
