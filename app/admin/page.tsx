import StatsCard from "./components/StatsCard";

interface Stats {
  totalCodes: number;
  activeCodes: number;
  exhaustedCodes: number;
  totalUsages: number;
  totalRemainingUses: number;
  averageUsesPerCode: string | number;
  recentUsages: Array<{
    id: string;
    featureUsed: string | null;
    usedAt: string;
  }>;
}

async function getStats(): Promise<Stats | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/invite-codes/admin/stats`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
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
