import { db } from "../../../../lib/prisma";

// GET: Get invite code statistics
export async function GET() {
  // TODO: Add authentication check
  try {
    const [totalStats, activeStats, usageStats, recentUsages, allCodes] =
      await Promise.all([
        db.orm.public.InviteCode.aggregate((a) => ({ count: a.count() })),
        db.orm.public.InviteCode
          .where({ isActive: true })
          .aggregate((a) => ({ count: a.count() })),
        db.orm.public.InviteCodeUsage.aggregate((a) => ({ count: a.count() })),
        db.orm.public.InviteCodeUsage
          .orderBy((u) => u.usedAt.desc())
          .limit(10)
          .all(),
        db.orm.public.InviteCode.all(),
      ]);

    // Calculate exhausted codes (currentUses >= maxUses)
    const exhaustedCodes = allCodes.filter(
      (c) => c.currentUses >= c.maxUses
    ).length;

    // Get total remaining uses
    const totalRemainingUses = allCodes.reduce(
      (sum, c) => sum + Math.max(0, c.maxUses - c.currentUses),
      0
    );

    return Response.json({
      totalCodes: totalStats.count,
      activeCodes: activeStats.count,
      exhaustedCodes,
      totalUsages: usageStats.count,
      totalRemainingUses,
      averageUsesPerCode:
        totalStats.count > 0
          ? (usageStats.count / totalStats.count).toFixed(2)
          : 0,
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
