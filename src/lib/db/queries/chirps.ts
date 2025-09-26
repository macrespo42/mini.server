import { db } from "../index.js";
import { type Chirp, chirps } from "../schema.js";
import { asc, eq } from "drizzle-orm";

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

export async function getAllChirps() {
  return await db.select().from(chirps).orderBy(asc(chirps.createdAt));
}

export async function getChirp(id: string) {
  const [result] = await db.select().from(chirps).where(eq(chirps.id, id));
  return result;
}

export async function deleteChirp(id: string) {
  const rows = await db.delete(chirps).where(eq(chirps.id, id)).returning();
  return rows.length > 0;
}
