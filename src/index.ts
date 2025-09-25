import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses } from "./middlewares/logResponses.js";
import { middlewareIncServerHits } from "./middlewares/incServerHits.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { handlerHits, handlerReset } from "./api/hits.js";
import {
  handleGetChirp,
  handlerCreateChirp,
  handlerGetAllChirps,
} from "./api/chirps.js";
import { config } from "./config.js";

import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { handlerCreateUser, handlerLogin } from "./api/users.js";

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();
const PORT = 8080;

// middlewares appication level
app.use(express.json());
app.use(middlewareLogResponses);

// serv static files
app.use("/app", middlewareIncServerHits, express.static("./src/app"));

// routes
app.get("/api/healthz", handlerReadiness);
app.post("/api/users", handlerCreateUser);
app.post("/api/chirps", handlerCreateChirp);
app.get("/api/chirps", handlerGetAllChirps);
app.get("/api/chirps/:id", handleGetChirp);
app.post("/api/login", handlerLogin);

app.get("/admin/metrics", handlerHits);
app.post("/admin/reset", handlerReset);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at localhost:${PORT}`);
});
