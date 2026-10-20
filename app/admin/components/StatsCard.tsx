interface StatsCardProps {
  label: string;
  value: string | number;
  color?: "gold" | "teal" | "muted";
}

export default function StatsCard({ label, value, color = "gold" }: StatsCardProps) {
  const colorMap = {
    gold: "var(--gold)",
    teal: "var(--teal)",
    muted: "var(--muted)",
  };

  const cardStyle: React.CSSProperties = {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "14px",
    color: "var(--muted)",
    fontWeight: 500,
  };

  const valueStyle: React.CSSProperties = {
    fontSize: "32px",
    fontWeight: 700,
    color: colorMap[color],
  };

  return (
    <div style={cardStyle}>
      <span style={labelStyle}>{label}</span>
      <span style={valueStyle}>{value}</span>
    </div>
  );
}
