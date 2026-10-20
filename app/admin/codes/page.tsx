"use client";

import { useEffect, useState } from "react";

interface InviteCode {
  id: string;
  code: string;
  email: string | null;
  maxUses: number;
  currentUses: number;
  isActive: boolean;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function CodesPage() {
  const [codes, setCodes] = useState<InviteCode[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toggling, setToggling] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;

    const fetchCodes = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/invite-codes/admin?page=${page}&limit=10`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (!cancelled) {
          setCodes(data.codes);
          setPagination(data.pagination);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load codes");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchCodes();

    return () => {
      cancelled = true;
    };
  }, [page]);

  const toggleCode = async (code: string, currentActive: boolean) => {
    setToggling(code);
    try {
      const res = await fetch("/api/invite-codes/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, isActive: !currentActive }),
      });
      if (!res.ok) throw new Error("Failed to update");

      // Update local state
      setCodes((prev) =>
        prev.map((c) =>
          c.code === code ? { ...c, isActive: !currentActive } : c
        )
      );
    } catch {
      setError("Failed to update code");
    } finally {
      setToggling(null);
    }
  };

  const containerStyle: React.CSSProperties = {
    width: "100%",
  };

  const headerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  };

  const tableContainerStyle: React.CSSProperties = {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    overflow: "hidden",
  };

  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
  };

  const thStyle: React.CSSProperties = {
    padding: "16px",
    textAlign: "left",
    fontSize: "13px",
    fontWeight: 600,
    color: "var(--muted)",
    borderBottom: "1px solid var(--border)",
    background: "var(--night)",
  };

  const tdStyle: React.CSSProperties = {
    padding: "16px",
    fontSize: "14px",
    borderBottom: "1px solid var(--border)",
  };

  const codeStyle: React.CSSProperties = {
    fontFamily: "monospace",
    fontSize: "14px",
    color: "var(--gold)",
    fontWeight: 600,
  };

  const badgeStyle = (active: boolean): React.CSSProperties => ({
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: 600,
    background: active ? "rgba(42, 127, 127, 0.2)" : "rgba(138, 143, 154, 0.2)",
    color: active ? "var(--teal-light)" : "var(--muted)",
  });

  const buttonStyle = (active: boolean, isLoading: boolean): React.CSSProperties => ({
    padding: "6px 12px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: 500,
    border: "1px solid",
    borderColor: active ? "rgba(220, 38, 38, 0.3)" : "rgba(42, 127, 127, 0.3)",
    background: "transparent",
    color: active ? "#f87171" : "var(--teal-light)",
    cursor: isLoading ? "not-allowed" : "pointer",
    opacity: isLoading ? 0.5 : 1,
    transition: "all 0.2s",
  });

  const paginationStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    borderTop: "1px solid var(--border)",
    background: "var(--night)",
  };

  const pageButtonStyle = (disabled: boolean): React.CSSProperties => ({
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: 500,
    border: "1px solid var(--border)",
    background: "transparent",
    color: disabled ? "var(--muted)" : "var(--text)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
  });

  if (loading && codes.length === 0) {
    return (
      <div style={containerStyle}>
        <h1 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "24px" }}>
          Invite Codes
        </h1>
        <div style={tableContainerStyle}>
          <p style={{ padding: "24px", color: "var(--muted)" }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={{ fontSize: "24px", fontWeight: 600 }}>Invite Codes</h1>
        {pagination && (
          <span style={{ color: "var(--muted)", fontSize: "14px" }}>
            {pagination.total} total codes
          </span>
        )}
      </div>

      {error && (
        <div
          style={{
            padding: "12px 16px",
            marginBottom: "16px",
            background: "rgba(220, 38, 38, 0.1)",
            border: "1px solid rgba(220, 38, 38, 0.3)",
            borderRadius: "8px",
            color: "#f87171",
          }}
        >
          {error}
        </div>
      )}

      <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Code</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Uses</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {codes.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ ...tdStyle, textAlign: "center", color: "var(--muted)" }}>
                  No invite codes found
                </td>
              </tr>
            ) : (
              codes.map((code) => (
                <tr key={code.id}>
                  <td style={tdStyle}>
                    <span style={codeStyle}>{code.code}</span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ color: code.email ? "var(--text)" : "var(--muted)" }}>
                      {code.email || "-"}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ color: code.currentUses >= code.maxUses ? "var(--muted)" : "var(--text)" }}>
                      {code.currentUses}/{code.maxUses}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span style={badgeStyle(code.isActive)}>
                      {code.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => toggleCode(code.code, code.isActive)}
                      disabled={toggling === code.code}
                      style={buttonStyle(code.isActive, toggling === code.code)}
                      onMouseEnter={(e) => {
                        if (toggling !== code.code) {
                          e.currentTarget.style.background = code.isActive
                            ? "rgba(220, 38, 38, 0.1)"
                            : "rgba(42, 127, 127, 0.1)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      {toggling === code.code
                        ? "..."
                        : code.isActive
                        ? "Deactivate"
                        : "Activate"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {pagination && pagination.pages > 1 && (
          <div style={paginationStyle}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              style={pageButtonStyle(page === 1)}
            >
              Previous
            </button>
            <span style={{ color: "var(--muted)", fontSize: "14px" }}>
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
              disabled={page === pagination.pages}
              style={pageButtonStyle(page === pagination.pages)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
