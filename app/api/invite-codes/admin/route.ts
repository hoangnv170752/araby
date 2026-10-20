import { db } from "../../../lib/prisma";

// GET: List all invite codes (admin only - add auth!)
export async function GET(request: Request) {
  // TODO: Add authentication check here
  // if (!isAdmin(request)) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
  const offset = (page - 1) * limit;

  try {
    const [codes, total] = await Promise.all([
      db.invite_codes.findMany({
        skip: offset,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      db.invite_codes.count(),
    ]);

    // Get waitlist emails for each code
    const waitlistIds = codes.map((c) => c.waitlistId);
    const waitlistUsers = await db.waitlist.findMany({
      where: { id: { in: waitlistIds } },
    });

    const waitlistMap = new Map(waitlistUsers.map((w) => [w.id, w.email]));

    const codesWithEmail = codes.map((code) => ({
      ...code,
      email: waitlistMap.get(code.waitlistId) ?? null,
    }));

    return Response.json({
      codes: codesWithEmail,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[invite-codes/admin] error:", error);
    return Response.json({ error: "Failed to fetch codes" }, { status: 500 });
  }
}

// PATCH: Deactivate/reactivate a code
export async function PATCH(request: Request) {
  // TODO: Add authentication check
  const { code, isActive } = await request.json();

  if (!code || typeof isActive !== "boolean") {
    return Response.json(
      { error: "code and isActive required" },
      { status: 400 }
    );
  }

  try {
    const existingCode = await db.invite_codes.findFirst({
      where: { code: { equals: code.toUpperCase() } },
    });

    if (!existingCode) {
      return Response.json({ error: "Code not found" }, { status: 404 });
    }

    const updated = await db.invite_codes.update({
      where: { id: existingCode.id },
      data: { isActive },
    });

    return Response.json({ code: updated.code, isActive: updated.isActive });
  } catch (error) {
    console.error("[invite-codes/admin] patch error:", error);
    return Response.json({ error: "Failed to update code" }, { status: 500 });
  }
}
