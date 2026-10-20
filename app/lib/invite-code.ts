import { db } from "./prisma";
import type { Varchar } from "@prisma/orm-postgres/target/codec-types";

// Generate a unique, easy-to-type 8-character code
// Uses uppercase letters and digits, excluding confusing chars (0/O, 1/I/L)
export function generateInviteCode(): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Create a new invite code for a waitlist user
export async function createInviteCode(waitlistId: string) {
  let code = generateInviteCode();
  let attempts = 0;

  // Ensure uniqueness (unlikely collision but safe)
  while (attempts < 5) {
    const existing = await db.orm.public.InviteCode
      .where({ code: code as Varchar<8> })
      .first();
    if (!existing) break;
    code = generateInviteCode();
    attempts++;
  }

  return db.orm.public.InviteCode.create({
    code: code as Varchar<8>,
    waitlistId,
    maxUses: 10,
    currentUses: 0,
    isActive: true,
  });
}

// Validate and use an invite code
export async function useInviteCode(
  code: string,
  options?: {
    featureUsed?: string;
    fingerprint?: string;
    ipAddress?: string;
    userAgent?: string;
  }
) {
  const inviteCode = await db.orm.public.InviteCode
    .where({ code: code.toUpperCase() as Varchar<8> })
    .first();

  if (!inviteCode) {
    return { success: false, error: "INVALID_CODE" as const };
  }

  if (!inviteCode.isActive) {
    return { success: false, error: "CODE_INACTIVE" as const };
  }

  if (inviteCode.expiresAt && new Date(inviteCode.expiresAt) < new Date()) {
    return { success: false, error: "CODE_EXPIRED" as const };
  }

  if (inviteCode.currentUses >= inviteCode.maxUses) {
    return { success: false, error: "CODE_EXHAUSTED" as const };
  }

  // Update usage count
  const updatedCode = await db.orm.public.InviteCode
    .where({ id: inviteCode.id })
    .update({ currentUses: inviteCode.currentUses + 1 });

  // Create usage record
  await db.orm.public.InviteCodeUsage.create({
    inviteCodeId: inviteCode.id,
    featureUsed: options?.featureUsed ?? null,
    fingerprint: (options?.fingerprint ?? null) as Varchar<64> | null,
    ipAddress: options?.ipAddress ?? null,
    userAgent: options?.userAgent ?? null,
  });

  return {
    success: true,
    remainingUses: inviteCode.maxUses - inviteCode.currentUses - 1,
    inviteCode: updatedCode,
  };
}

// Check remaining uses without consuming
export async function checkInviteCode(code: string) {
  const inviteCode = await db.orm.public.InviteCode
    .where({ code: code.toUpperCase() as Varchar<8> })
    .first();

  if (!inviteCode) {
    return { valid: false, error: "INVALID_CODE" as const };
  }

  const remainingUses = inviteCode.maxUses - inviteCode.currentUses;
  const isExpired = inviteCode.expiresAt
    ? new Date(inviteCode.expiresAt) < new Date()
    : false;

  return {
    valid: inviteCode.isActive && remainingUses > 0 && !isExpired,
    remainingUses,
    maxUses: inviteCode.maxUses,
    isActive: inviteCode.isActive,
    expiresAt: inviteCode.expiresAt,
  };
}

// Get invite code with waitlist info
export async function getInviteCodeWithOwner(code: string) {
  const inviteCode = await db.orm.public.InviteCode
    .where({ code: code.toUpperCase() as Varchar<8> })
    .first();

  if (!inviteCode) return null;

  const waitlist = await db.orm.public.Waitlist
    .where({ id: inviteCode.waitlistId })
    .first();

  return {
    ...inviteCode,
    waitlist,
  };
}
