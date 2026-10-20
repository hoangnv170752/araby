import bcrypt from "bcrypt";
import { db } from "./prisma";

const SALT_ROUNDS = 12;

// Hash a password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// Verify a password against a hash
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Create admin user or update existing user to admin
export async function createOrUpdateAdmin(
  email: string,
  password: string
): Promise<{ success: boolean; message: string }> {
  const passwordHash = await hashPassword(password);

  const existingUser = await db.waitlist.findFirst({
    where: { email: { equals: email } },
  });

  if (existingUser) {
    await db.waitlist.update({
      where: { id: existingUser.id },
      data: {
        passwordHash,
        role: "admin",
      },
    });
    return { success: true, message: "Admin password updated" };
  }

  await db.waitlist.create({
    data: {
      email,
      passwordHash,
      role: "admin",
      feedback: "Admin account",
      locale: "en",
    },
  });

  return { success: true, message: "Admin created" };
}

// Authenticate user with email and password
export async function authenticateUser(
  email: string,
  password: string
): Promise<{
  success: boolean;
  user?: { id: string; email: string; role: string };
  error?: string;
}> {
  const user = await db.waitlist.findFirst({
    where: { email: { equals: email } },
  });

  if (!user) {
    return { success: false, error: "USER_NOT_FOUND" };
  }

  if (!user.passwordHash) {
    return { success: false, error: "NO_PASSWORD_SET" };
  }

  const isValid = await verifyPassword(password, user.passwordHash);

  if (!isValid) {
    return { success: false, error: "INVALID_PASSWORD" };
  }

  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
}

// Check if user is admin
export async function isAdmin(email: string): Promise<boolean> {
  const user = await db.waitlist.findFirst({
    where: { email: { equals: email } },
  });
  return user?.role === "admin";
}
