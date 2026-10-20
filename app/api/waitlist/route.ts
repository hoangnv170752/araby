import { Resend } from "resend";
import { WaitlistEmail } from "../../components/emails/WaitlistEmail";
import { InviteCodeEmail } from "../../components/emails/InviteCodeEmail";
import { db } from "../../lib/prisma";
import { createInviteCode } from "../../lib/invite-code";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { email, feedback, locale } = await request.json();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Invalid email address" }, { status: 400 });
  }

  try {
    // Check if user already exists
    const existingUser = await db.orm.public.Waitlist
      .where({ email })
      .first();

    let waitlistEntry;
    let isNewUser = false;

    if (existingUser) {
      waitlistEntry = existingUser;
    } else {
      // Create new waitlist entry
      waitlistEntry = await db.orm.public.Waitlist.create({
        email,
        feedback: feedback ?? null,
        locale: locale ?? "en",
      });
      isNewUser = true;
    }

    // Auto-generate invite code for new users
    let inviteCode = null;
    if (isNewUser) {
      inviteCode = await createInviteCode(waitlistEntry.id);
    } else {
      // Get existing invite code
      const existingCode = await db.orm.public.InviteCode
        .where({ waitlistId: waitlistEntry.id })
        .first();
      inviteCode = existingCode;
    }

    // Send confirmation email with invite code
    const { data, error: emailError } = await resend.emails.send({
      from: "Araby <noreply@araby.digital>",
      to: [email],
      subject: isNewUser
        ? "You're on the Araby waitlist! Here's your invite code 🌙"
        : "Your Araby invite code 🌙",
      react: inviteCode
        ? InviteCodeEmail({
            email,
            inviteCode: inviteCode.code,
            remainingUses: inviteCode.maxUses - inviteCode.currentUses,
          })
        : WaitlistEmail({ email }),
    });

    if (emailError) {
      console.error("[waitlist] Resend error:", JSON.stringify(emailError));
      // DB already saved — don't fail the whole request
      return Response.json(
        {
          id: waitlistEntry.id,
          inviteCode: inviteCode?.code,
          warning: "Saved but email not sent.",
        },
        { status: 200 }
      );
    }

    return Response.json(
      {
        id: data?.id,
        inviteCode: inviteCode?.code,
        isNewUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[waitlist] db error:", error);
    return Response.json(
      { error: "Failed to save. Please try again." },
      { status: 500 }
    );
  }
}
