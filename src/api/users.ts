import type { Request, Response, NextFunction } from "express";
import { createUser } from "../lib/db/queries/users.js";

export async function handlerCreateUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  type Params = {
    email: string;
  };

  const params: Params = req.body;
  try {
    const user = await createUser({ email: params.email });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
}
