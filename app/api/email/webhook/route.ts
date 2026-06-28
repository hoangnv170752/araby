import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const RESEND_WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET;

interface EmailReceivedEvent {
  type: "email.received";
  created_at: string;
  data: {
    email_id: string;
    created_at: string;
    from: string;
    to: string[];
    bcc: string[];
    cc: string[];
    received_for: string[];
    message_id: string;
    subject: string;
    text?: string;
    html?: string;
    attachments: Array<{
      filename: string;
      content_type: string;
      content: string;
    }>;
  };
}

type ResendWebhookEvent = EmailReceivedEvent;

async function verifySignature(
  payload: string,
  signature: string | null,
  secret: string
): Promise<boolean> {
  if (!signature) return false;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

export const POST = async (request: NextRequest) => {
  try {
    const payload = await request.text();
    const signature = request.headers.get("resend-signature");

    // Verify webhook signature
    if (RESEND_WEBHOOK_SECRET) {
      const isValid = await verifySignature(payload, signature, RESEND_WEBHOOK_SECRET);
      if (!isValid) {
        console.error("Invalid webhook signature");
        return NextResponse.json(
          { success: false, error: "Invalid signature" },
          { status: 401 }
        );
      }
    }

    const event: ResendWebhookEvent = JSON.parse(payload);

    if (event.type === "email.received") {
      const { data } = event;

      console.log("=== New Email Received ===");
      console.log("From:", data.from);
      console.log("To:", data.to.join(", "));
      console.log("Subject:", data.subject);
      console.log("Date:", data.created_at);
      console.log("Message ID:", data.message_id);

      if (data.text) {
        console.log("Body (text):", data.text.substring(0, 500));
      }

      if (data.attachments?.length > 0) {
        console.log("Attachments:", data.attachments.map(a => a.filename).join(", "));
      }

      console.log("==========================");

      // TODO: Store email in database, send notification, etc.
      // Example: await db.emails.create({ data: { ... } });

      return NextResponse.json({
        success: true,
        message: "Email received",
        email_id: data.email_id
      });
    }

    return NextResponse.json({ success: true, message: "Event received" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process webhook" },
      { status: 500 }
    );
  }
};
