import { db } from "../index.js";
import { type Chirp, chirps } from "../schema.js";

export async function createChirp(chirp: Chirp) {
  const [result] = await db
    .insert(chirps)
    .values({
      body: chirp.body,
      userId: chirp.userId,
    })
    .onConflictDoNothing()
    .returning();
  return result;
}
