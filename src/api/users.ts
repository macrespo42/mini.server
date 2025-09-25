import type { Request, Response, NextFunction } from "express";
import { createUser, getUserByEmail } from "../lib/db/queries/users.js";
import { checkPasswordHash, hashPassword, makeJWT } from "../auth.js";
import type { User } from "../lib/db/schema.js";
import { UnauthorizedError } from "../middlewares/errorHandler.js";
import { config } from "../config.js";

type Params = {
  email: string;
  password: string;
  expireInSeconds?: string;
};

type UserSecure = Omit<User, "password">;

export async function handlerCreateUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const params: Params = req.body;
  const hashedPassword = await hashPassword(params.password);
  try {
    const user: UserSecure = await createUser({
      email: params.email,
      password: hashedPassword,
    });

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
}

export async function handlerLogin(req: Request, res: Response) {
  const params: Params = req.body;

  let exp = 3600;
  if (params.expireInSeconds && Number(params.expireInSeconds) < 3600) {
    exp = Number(params.expireInSeconds);
  }

  const userToLog = await getUserByEmail(params.email);

  const canLogin = await checkPasswordHash(params.password, userToLog.password);
  if (!canLogin) {
    throw new UnauthorizedError("Unauthorized");
  } else {
    const { password, ...secured } = userToLog;
    const token = makeJWT(userToLog.id, exp, config.secret);

    res.status(200).json({ token, ...secured });
  }
}
