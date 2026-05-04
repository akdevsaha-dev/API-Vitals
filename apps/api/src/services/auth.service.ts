import { db, userTable } from "@repo/database";
import { signinInput, signupInput } from "../validations/vals";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
export const createUser = async ({ email, password }: signupInput) => {
  const existingUser = await db.query.userTable.findFirst({
    where: eq(userTable.email, email),
  });
  if (existingUser) {
    throw new Error("User already exists");
  }
  const passwordHash = await bcrypt.hash(password, 10);
  try {
    const [user] = await db
      .insert(userTable)
      .values({
        email,
        passwordHash,
      })
      .returning({
        id: userTable.id,
        email: userTable.email,
      });

    return user;
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code?: string }).code === "23505"
    ) {
      throw new Error("User already exists");
    }

    throw new Error("Failed to create user");
  }
};

export const getUser = async ({ email, password }: signinInput) => {
  const user = await db.query.userTable.findFirst({
    where: eq(userTable.email, email),
  });
  if (!user) {
    throw new Error("Invalid email or password");
  }
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }
  return {
    id: user.id,
    email: user.email,
  };
};

export const getUserById = async (userId: string) => {
  const [user] = await db
    .select({
      id: userTable.id,
      email: userTable.email,
    })
    .from(userTable)
    .where(eq(userTable.id, userId))
    .limit(1);
  return user;
};
