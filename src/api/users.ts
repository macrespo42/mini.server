import type { Request, Response, NextFunction } from "express";
import { createUser, getUserByEmail } from "../lib/db/queries/users.js";
import {
  checkPasswordHash,
  getBearerToken,
  hashPassword,
  makeJWT,
  makeRefreshToken,
} from "../auth.js";
import type { User } from "../lib/db/schema.js";
import { UnauthorizedError } from "../middlewares/errorHandler.js";
import { config } from "../config.js";
import {
  createRefreshToken,
  getRefreshToken,
  revokeRefreshToken,
} from "../lib/db/queries/refreshTokens.js";

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

  const userToLog = await getUserByEmail(params.email);

  const canLogin = await checkPasswordHash(params.password, userToLog.password);
  if (!canLogin) {
    throw new UnauthorizedError("Unauthorized");
  } else {
    const { password, ...secured } = userToLog;
    const token = makeJWT(userToLog.id, 3600, config.secret);

    const refreshToken = makeRefreshToken();
    const saved = await createRefreshToken(userToLog.id, refreshToken);
    if (!saved) {
      throw new Error("Could not save refresh token");
    }

    res.status(200).json({ token, refreshToken, ...secured });
  }
}

export async function handlerRefresh(req: Request, res: Response) {
  const token = getBearerToken(req);

  const refreshToken = await getRefreshToken(token);
  if (!refreshToken) {
    throw new UnauthorizedError("Unauthorized");
  }

  const user = refreshToken.userID;
  const accessToken = makeJWT(user, 3600, config.secret);

  type response = {
    token: string;
  };
  res.status(200).json({ token: accessToken } satisfies response);
}

export async function handlerRevoke(req: Request, res: Response) {
  const token = getBearerToken(req);
  await revokeRefreshToken(token);
  res.status(204).send();
}
