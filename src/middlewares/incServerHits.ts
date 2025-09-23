import type { NextFunction, Request, Response } from "express";
import { config } from "../config.js";

export function middlewareIncServerHits(
  _: Request,
  __: Response,
  next: NextFunction,
) {
  config.fileServerHits++;
  next();
}
