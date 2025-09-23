import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses } from "./middlewares/logResponses.js";
import { middlewareIncServerHits } from "./middlewares/incServerHits.js";
import { handlerHits, handlerReset } from "./api/hits.js";
import { handlerValidateChirp } from "./api/chirps.js";

const app = express();
const PORT = 8080;

// middlewares
app.use(middlewareLogResponses);

// serv static files
app.use("/app", middlewareIncServerHits, express.static("./src/app"));

// routes
app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", handlerHits);
app.post("/admin/reset", handlerReset);
app.post("/api/validate_chirp", handlerValidateChirp);

app.listen(PORT, () => {
  console.log(`Server is running at localhost:${PORT}`);
});
