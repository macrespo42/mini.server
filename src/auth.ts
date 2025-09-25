import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import type { Request } from "express";
import crypto from "node:crypto";
import { UnauthorizedError } from "./middlewares/errorHandler.js";

const TOKEN_ISSUER = "chirpy";
type Payload = Pick<jwt.JwtPayload, "iss" | "sub" | "iat" | "exp">;

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

export async function checkPasswordHash(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}

export function makeJWT(
  userID: string,
  expiresIn: number,
  secret: string,
): string {
  const iat = Math.floor(Date.now() / 1000);
  const payload: Payload = {
    iss: TOKEN_ISSUER,
    sub: userID,
    iat,
    exp: iat + expiresIn,
  };
  const token = jwt.sign(payload, secret);
  return token;
}

export function validateJWT(tokenString: string, secret: string): string {
  let decoded: Payload;
  try {
    decoded = jwt.verify(tokenString, secret) as JwtPayload;
  } catch (error) {
    throw new UnauthorizedError("Invalid token");
  }

  if (decoded.iss !== TOKEN_ISSUER) {
    throw new Error("Invalid issuer");
  }

  if (!decoded.sub) {
    throw new Error("No userID in token");
  }

  return decoded.sub;
}

export function getBearerToken(req: Request): string {
  const bearer = req.get("Authorization");
  if (!bearer) {
    throw new Error("No bearer token provided");
  }

  const [_, tokenString] = bearer.split(" ");
  return tokenString;
}

export function makeRefreshToken() {
  const rawToken = crypto.randomBytes(32);
  return rawToken.toString("hex");
}
