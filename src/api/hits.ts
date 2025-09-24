import type { Request, Response } from "express";
import { config } from "../config.js";
import fs from "node:fs";
import { ForbiddenError } from "../middlewares/errorHandler.js";
import { deleteAllUsers } from "../lib/db/queries/users.js";

export async function handlerHits(_: Request, res: Response) {
  res.set("Content-Type", "text/html; charset=utf-8");
  const file = fs.readFileSync("src/app/metrics.html");
  const html = file.toString();
  res.send(html.replace("NUM", `${config.fileServerHits}`));
}

export async function handlerReset(_: Request, res: Response) {
  if (config.platform !== "DEV") {
    throw new ForbiddenError("Forbidden");
  }
  await deleteAllUsers();
  res.send("OK");
  config.fileServerHits = 0;
}
