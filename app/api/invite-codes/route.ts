import { db } from "../../lib/prisma";
import { createInviteCode, checkInviteCode } from "../../lib/invite-code";

// POST: Generate a new invite code for a waitlist user
export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return Response.json({ error: "Email required" }, { status: 400 });
  }

  try {
    // Find waitlist user
    const waitlistUser = await db.orm.public.Waitlist
      .where({ email })
      .first();

    if (!waitlistUser) {
      return Response.json({ error: "Email not on waitlist" }, { status: 404 });
    }

    // Check if already has a code
    const existingCode = await db.orm.public.InviteCode
      .where({ waitlistId: waitlistUser.id })
      .first();

    if (existingCode) {
      return Response.json({
        code: existingCode.code,
        remainingUses: existingCode.maxUses - existingCode.currentUses,
        message: "Existing code returned",
      });
    }

    // Generate new code
    const inviteCode = await createInviteCode(waitlistUser.id);

    return Response.json({
      code: inviteCode.code,
      remainingUses: inviteCode.maxUses,
      message: "New invite code generated",
    });
  } catch (error) {
    console.error("[invite-codes] error:", error);
    return Response.json({ error: "Failed to generate code" }, { status: 500 });
  }
}

// GET: Validate an invite code
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return Response.json({ error: "Code required" }, { status: 400 });
  }

  const result = await checkInviteCode(code);
  return Response.json(result);
}
