process.loadEnvFile();

const DB_URL = process.env.DB_URL;
if (!DB_URL) {
  throw new Error("DB_URL is undefined");
}

type APIConfig = {
  fileServerHits: number;
  dbURL: string;
};

export const config: APIConfig = {
  fileServerHits: 0,
  dbURL: DB_URL,
};
