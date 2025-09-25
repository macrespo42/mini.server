import { describe, it, expect, beforeAll } from "vitest";
import { makeJWT, validateJWT, hashPassword, checkPasswordHash } from "./auth";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });
});

describe("JWT validation", () => {
  const userID = "901cce48-5e17-43e1-98e8-bf0bcea5d19e";
  const secret = "toto";

  const token = makeJWT(userID, 10_000, secret);
  it("Should be valid token", () => {
    const decoded = validateJWT(token, secret);
    expect(decoded).toEqual(userID);
  });

  it("Should be invalid token when giving it a bad secret", () => {
    expect(() => validateJWT(token, "titi")).toThrowError();
  });
});
