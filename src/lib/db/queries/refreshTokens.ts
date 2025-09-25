import { eq, gt, and, isNull } from "drizzle-orm";
import { db } from "../index.js";
import { refreshTokens } from "../schema.js";

export async function createRefreshToken(userID: string, token: string) {
  const rows = await db
    .insert(refreshTokens)
    .values({
      userID: userID,
      token,
      expiresAt: new Date(Date.now() + 60 * 60 * 24 * 60 * 1000),
      revokedAt: null,
    })
    .returning();
  return rows.length > 0;
}

export async function getRefreshToken(token: string) {
  const [result] = await db
    .select()
    .from(refreshTokens)
    .where(
      and(
        eq(refreshTokens.token, token),
        gt(refreshTokens.expiresAt, new Date()),
        isNull(refreshTokens.revokedAt),
      ),
    )
    .limit(1);
  return result;
}

export async function revokeRefreshToken(token: string) {
  await db
    .update(refreshTokens)
    .set({ revokedAt: new Date() })
    .where(eq(refreshTokens.token, token));
}
