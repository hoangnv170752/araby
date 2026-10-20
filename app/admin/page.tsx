import { db } from "../lib/prisma";
import StatsCard from "./components/StatsCard";

interface Stats {
  totalCodes: number;
  activeCodes: number;
  exhaustedCodes: number;
  totalUsages: number;
  totalRemainingUses: number;
  recentUsages: Array<{
    id: string;
    featureUsed: string | null;
    usedAt: Date | string;
  }>;
}

async function getStats(): Promise<Stats | null> {
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

    const exhaustedCodes = allCodes.filter(
      (c) => c.currentUses >= c.maxUses
    ).length;

    const totalRemainingUses = allCodes.reduce(
      (sum, c) => sum + Math.max(0, c.maxUses - c.currentUses),
      0
    );

    return {
      totalCodes: totalStats.count,
      activeCodes: activeStats.count,
      exhaustedCodes,
      totalUsages: usageStats.count,
      totalRemainingUses,
      recentUsages: recentUsages.map((u) => ({
        id: u.id,
        featureUsed: u.featureUsed,
        usedAt: u.usedAt,
      })),
    };
  } catch (error) {
    console.error("[admin/dashboard] error:", error);
    return null;
  }
}

function formatTimeAgo(dateInput: Date | string): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
    marginBottom: "32px",
  };

  const sectionStyle: React.CSSProperties = {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    padding: "24px",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "18px",
    fontWeight: 600,
    color: "var(--text)",
    marginBottom: "16px",
  };

  const listStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  };

  const listItemStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    background: "var(--night)",
    borderRadius: "8px",
  };

  if (!stats) {
    return (
      <div>
        <h1 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "24px" }}>
          Dashboard
        </h1>
        <div style={sectionStyle}>
          <p style={{ color: "var(--muted)" }}>
            Failed to load stats. Make sure the database is connected.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "24px" }}>
        Dashboard
      </h1>

      <div style={gridStyle}>
        <StatsCard label="Total Codes" value={stats.totalCodes} color="gold" />
        <StatsCard label="Active Codes" value={stats.activeCodes} color="teal" />
        <StatsCard label="Total Usages" value={stats.totalUsages} color="gold" />
        <StatsCard label="Exhausted" value={stats.exhaustedCodes} color="muted" />
        <StatsCard label="Remaining Uses" value={stats.totalRemainingUses} color="teal" />
      </div>

      <div style={sectionStyle}>
        <h2 style={titleStyle}>Recent Activity</h2>
        {stats.recentUsages.length === 0 ? (
          <p style={{ color: "var(--muted)" }}>No recent activity</p>
        ) : (
          <div style={listStyle}>
            {stats.recentUsages.map((usage) => (
              <div key={usage.id} style={listItemStyle}>
                <span style={{ color: "var(--gold)", fontWeight: 500 }}>
                  {usage.featureUsed || "unknown"}
                </span>
                <span style={{ color: "var(--muted)", fontSize: "13px" }}>
                  {formatTimeAgo(usage.usedAt)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
