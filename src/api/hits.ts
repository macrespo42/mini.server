import type { Request, Response } from "express";
import { config } from "../config.js";

export async function handlerHits(_: Request, res: Response) {
  res.send(`Hits: ${config.fileServerHits}`);
}

export async function handlerReset(_: Request, res: Response) {
  res.send("OK");
  config.fileServerHits = 0;
}
