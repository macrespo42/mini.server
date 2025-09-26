import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { User, users } from "../schema.js";

export async function createUser(user: User) {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  const { password, ...userWithoutPassword } = result;
  return userWithoutPassword;
}

export async function deleteAllUsers() {
  await db.delete(users);
}

export async function getUserByEmail(email: string) {
  const [result] = await db.select().from(users).where(eq(users.email, email));
  return result;
}

export async function updateUserInfos(
  id: string,
  newEmail: string,
  newPassword: string,
) {
  const [user] = await db
    .update(users)
    .set({ email: newEmail, password: newPassword })
    .where(eq(users.id, id))
    .returning();
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
