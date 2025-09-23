import express from "express";

const app = express();
const PORT = 8080;

app.use("/app", express.static("./src/app"));

async function handlerReadiness(
  _: express.Request,
  res: express.Response,
): Promise<void> {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.send("OK");
}

app.get("/healthz", handlerReadiness);

app.listen(PORT, () => {
  console.log(`Server is running at localhost:${PORT}`);
});
