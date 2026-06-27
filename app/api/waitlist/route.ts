import { Resend } from "resend";
import { WaitlistEmail } from "../../components/emails/WaitlistEmail";
import { supabase } from "../../lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { email, feedback, locale } = await request.json();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Invalid email address" }, { status: 400 });
  }

  // Save to Supabase (upsert — ignore duplicate email)
  const { error: dbError } = await supabase.from("waitlist").upsert(
    { email, feedback: feedback ?? null, locale: locale ?? "en" },
    { onConflict: "email", ignoreDuplicates: true }
  );

  if (dbError) {
    console.error("[waitlist] db:", dbError.message);
    return Response.json({ error: "Failed to save. Please try again." }, { status: 500 });
  }

  // Send confirmation email
  const { data, error: emailError } = await resend.emails.send({
    from: "Araby <noreply@araby.digital>",
    to: [email],
    subject: "You're on the Araby waitlist! 🌙",
    react: WaitlistEmail({ email }),
  });

  if (emailError) {
    console.error("[waitlist] Resend error:", JSON.stringify(emailError));
    // DB already saved — don't fail the whole request
    return Response.json({ id: null, warning: "Saved but email not sent." }, { status: 200 });
  }

  return Response.json({ id: data?.id }, { status: 200 });
}
