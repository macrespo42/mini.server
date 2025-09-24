import type { NextFunction, Request, Response } from "express";

export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export function errorHandler(
  err: Error,
  _: Request,
  res: Response,
  __: NextFunction,
) {
  console.log(err.message);
  if (err instanceof BadRequestError) {
    res.status(400).json({ error: err.message ?? "Bad Request" });
  } else if (err instanceof UnauthorizedError) {
    res.status(401).json({ error: err.message ?? "Unauthorized" });
  } else if (err instanceof ForbiddenError) {
    res.status(403).json({ error: err.message ?? "Forbidden" });
  } else if (err instanceof NotFoundError) {
    res.status(404).json({ error: err.message ?? "Not Found" });
  } else {
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
}
