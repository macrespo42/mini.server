import type { Request, Response } from "express";
import { config } from "../config.js";
import fs from "node:fs";

export async function handlerHits(_: Request, res: Response) {
  res.set("Content-Type", "text/html; charset=utf-8");
  const file = fs.readFileSync("src/app/metrics.html");
  const html = file.toString();
  res.send(html.replace("NUM", `${config.fileServerHits}`));
}

export async function handlerReset(req: Request, res: Response) {
  res.send("OK");
  config.fileServerHits = 0;
}
