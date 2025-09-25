import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { User, users } from "../schema.js";

export async function createUser(user: User) {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  const { password, ...userWithoutPassord } = result;
  return userWithoutPassord;
}

export async function deleteAllUsers() {
  await db.delete(users);
}

export async function getUserByEmail(email: string) {
  const [result] = await db.select().from(users).where(eq(users.email, email));
  return result;
}
