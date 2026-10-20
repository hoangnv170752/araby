import { useInviteCode, checkInviteCode } from "../../../lib/invite-code";

// GET: Get code info
export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const result = await checkInviteCode(code);
  return Response.json(result);
}

// POST: Use the invite code (consume one use)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const body = await request.json().catch(() => ({}));

  // Get IP and user agent for tracking
  const ipAddress = request.headers.get("x-forwarded-for")?.split(",")[0];
  const userAgent = request.headers.get("user-agent");

  const result = await useInviteCode(code, {
    featureUsed: body.featureUsed,
    fingerprint: body.fingerprint,
    ipAddress: ipAddress ?? undefined,
    userAgent: userAgent ?? undefined,
  });

  if (!result.success) {
    const statusCode =
      result.error === "INVALID_CODE"
        ? 404
        : result.error === "CODE_EXHAUSTED"
          ? 410
          : 400;
    return Response.json({ error: result.error }, { status: statusCode });
  }

  return Response.json({
    success: true,
    remainingUses: result.remainingUses,
  });
}
