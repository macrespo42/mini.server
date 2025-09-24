import type { NextFunction, Request, Response } from "express";

export function errorHandler(
  error: Error,
  _: Request,
  res: Response,
  __: NextFunction,
) {
  console.log(error.message);
  res.status(500).json({
    error: "Something went wrong on our end",
  });
}
