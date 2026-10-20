import { db } from "./prisma";

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
    const existing = await db.invite_codes.findFirst({
      where: { code: { equals: code } },
    });
    if (!existing) break;
    code = generateInviteCode();
    attempts++;
  }

  return db.invite_codes.create({
    data: {
      code,
      waitlistId,
      maxUses: 10,
      currentUses: 0,
      isActive: true,
    },
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
  const inviteCode = await db.invite_codes.findFirst({
    where: { code: { equals: code.toUpperCase() } },
  });

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

  // Transaction: increment usage and record
  const [updatedCode] = await db.$transaction([
    db.invite_codes.update({
      where: { id: inviteCode.id },
      data: { currentUses: inviteCode.currentUses + 1 },
    }),
    db.invite_code_usages.create({
      data: {
        inviteCodeId: inviteCode.id,
        featureUsed: options?.featureUsed ?? null,
        fingerprint: options?.fingerprint ?? null,
        ipAddress: options?.ipAddress ?? null,
        userAgent: options?.userAgent ?? null,
      },
    }),
  ]);

  return {
    success: true,
    remainingUses: updatedCode.maxUses - updatedCode.currentUses,
    inviteCode: updatedCode,
  };
}

// Check remaining uses without consuming
export async function checkInviteCode(code: string) {
  const inviteCode = await db.invite_codes.findFirst({
    where: { code: { equals: code.toUpperCase() } },
  });

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
  const inviteCode = await db.invite_codes.findFirst({
    where: { code: { equals: code.toUpperCase() } },
  });

  if (!inviteCode) return null;

  const waitlist = await db.waitlist.findFirst({
    where: { id: { equals: inviteCode.waitlistId } },
  });

  return {
    ...inviteCode,
    waitlist,
  };
}
