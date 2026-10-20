"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch {
      setLoggingOut(false);
    }
  };

  const navStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 24px",
    background: "var(--card)",
    borderBottom: "1px solid var(--border)",
  };

  const logoStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "var(--gold)",
    fontSize: "18px",
    fontWeight: 600,
    textDecoration: "none",
  };

  const linksStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const linkStyle = (active: boolean): React.CSSProperties => ({
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: 500,
    textDecoration: "none",
    color: active ? "var(--night)" : "var(--text)",
    background: active ? "var(--gold)" : "transparent",
    transition: "all 0.2s",
  });

  const logoutStyle: React.CSSProperties = {
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: 500,
    color: "var(--muted)",
    background: "transparent",
    border: "1px solid var(--border)",
    cursor: loggingOut ? "not-allowed" : "pointer",
    opacity: loggingOut ? 0.6 : 1,
    transition: "all 0.2s",
  };

  return (
    <nav style={navStyle}>
      <Link href="/admin" style={logoStyle}>
        <span style={{ fontSize: "24px" }}>&#127769;</span>
        Araby Admin
      </Link>

      <div style={linksStyle}>
        <Link
          href="/admin"
          style={linkStyle(isActive("/admin"))}
          onMouseEnter={(e) => {
            if (!isActive("/admin")) {
              e.currentTarget.style.background = "rgba(201, 168, 76, 0.1)";
              e.currentTarget.style.color = "var(--gold)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive("/admin")) {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--text)";
            }
          }}
        >
          Dashboard
        </Link>
        <Link
          href="/admin/codes"
          style={linkStyle(isActive("/admin/codes"))}
          onMouseEnter={(e) => {
            if (!isActive("/admin/codes")) {
              e.currentTarget.style.background = "rgba(201, 168, 76, 0.1)";
              e.currentTarget.style.color = "var(--gold)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive("/admin/codes")) {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--text)";
            }
          }}
        >
          Codes
        </Link>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          style={logoutStyle}
          onMouseEnter={(e) => {
            if (!loggingOut) {
              e.currentTarget.style.borderColor = "var(--gold)";
              e.currentTarget.style.color = "var(--gold)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.color = "var(--muted)";
          }}
        >
          {loggingOut ? "..." : "Logout"}
        </button>
      </div>
    </nav>
  );
}
