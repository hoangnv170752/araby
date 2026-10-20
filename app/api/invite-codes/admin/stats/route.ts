import { db } from "../../../../lib/prisma";

// GET: Get invite code statistics
export async function GET() {
  // TODO: Add authentication check
  try {
    const [totalCodes, activeCodes, totalUsages, recentUsages] =
      await Promise.all([
        db.invite_codes.count(),
        db.invite_codes.count({
          where: { isActive: { equals: true } },
        }),
        db.invite_code_usages.count(),
        db.invite_code_usages.findMany({
          take: 10,
          orderBy: { usedAt: "desc" },
        }),
      ]);

    // Calculate exhausted codes (currentUses >= maxUses)
    const allCodes = await db.invite_codes.findMany();
    const exhaustedCodes = allCodes.filter(
      (c) => c.currentUses >= c.maxUses
    ).length;

    // Get total remaining uses
    const totalRemainingUses = allCodes.reduce(
      (sum, c) => sum + Math.max(0, c.maxUses - c.currentUses),
      0
    );

    return Response.json({
      totalCodes,
      activeCodes,
      exhaustedCodes,
      totalUsages,
      totalRemainingUses,
      averageUsesPerCode:
        totalCodes > 0 ? (totalUsages / totalCodes).toFixed(2) : 0,
      recentUsages: recentUsages.map((u) => ({
        id: u.id,
        featureUsed: u.featureUsed,
        usedAt: u.usedAt,
      })),
    });
  } catch (error) {
    console.error("[invite-codes/admin/stats] error:", error);
    return Response.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
