import type { MigrationConfig } from "drizzle-orm/migrator";
import process from "node:process";

process.loadEnvFile();

const DB_URL = process.env.DB_URL;
if (!DB_URL) {
  throw new Error("DB_URL is undefined");
}

const PLATFORM = process.env.PLATFORM;
if (!PLATFORM) {
  throw new Error("PLATFORM is undefined");
}

const SECRET = process.env.SECRET;
if (!SECRET) {
  throw new Error("SECRET is undefined");
}

const POLKA_KEY = process.env.POLKA_KEY;
if (!POLKA_KEY) {
  throw new Error("POLKA_KEY is undefined");
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
  platform: string;
  secret: string;
  polkaKey: string;
};

export const config: APIConfig = {
  fileServerHits: 0,
  db: {
    url: DB_URL,
    migrationConfig,
  },
  platform: PLATFORM,
  secret: SECRET,
  polkaKey: POLKA_KEY,
};
