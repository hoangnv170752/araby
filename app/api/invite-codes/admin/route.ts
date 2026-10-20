import { db } from "../../../lib/prisma";
import type { Varchar } from "@prisma/orm-postgres/target/codec-types";

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
      db.orm.public.InviteCode
        .orderBy((c) => c.createdAt.desc())
        .offset(offset)
        .limit(limit)
        .all(),
      db.orm.public.InviteCode.aggregate((a) => ({ count: a.count() })),
    ]);

    // Get waitlist emails for each code
    const waitlistIds = codes.map((c) => c.waitlistId);
    const waitlistUsers = waitlistIds.length > 0
      ? await db.orm.public.Waitlist
          .where((w) => w.id.in(waitlistIds))
          .all()
      : [];

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
        total: total.count,
        pages: Math.ceil(total.count / limit),
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
    const existingCode = await db.orm.public.InviteCode
      .where({ code: code.toUpperCase() as Varchar<8> })
      .first();

    if (!existingCode) {
      return Response.json({ error: "Code not found" }, { status: 404 });
    }

    const updated = await db.orm.public.InviteCode
      .where({ id: existingCode.id })
      .update({ isActive });

    if (!updated) {
      return Response.json({ error: "Failed to update" }, { status: 500 });
    }

    return Response.json({ code: updated.code, isActive: updated.isActive });
  } catch (error) {
    console.error("[invite-codes/admin] patch error:", error);
    return Response.json({ error: "Failed to update code" }, { status: 500 });
  }
}
