"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error === "INVALID_PASSWORD" ? "Invalid password" :
                 data.error === "USER_NOT_FOUND" ? "User not found" :
                 data.error === "NO_PASSWORD_SET" ? "No password set for this account" :
                 "Login failed");
        setLoading(false);
        return;
      }

      if (data.user?.role !== "admin") {
        setError("Access denied. Admin only.");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    background: "var(--night)",
    color: "var(--text)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  };

  const containerStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: "400px",
    padding: "40px",
    background: "var(--card)",
    borderRadius: "12px",
    border: "1px solid var(--border)",
  };

  const titleStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    marginBottom: "32px",
    fontSize: "24px",
    fontWeight: 600,
    color: "var(--gold)",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 16px",
    marginBottom: "16px",
    background: "var(--night)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    color: "var(--text)",
    fontSize: "15px",
    outline: "none",
    transition: "border-color 0.2s",
  };

  const buttonStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px",
    marginTop: "8px",
    background: loading ? "var(--muted)" : "var(--gold)",
    color: "var(--night)",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: 600,
    cursor: loading ? "not-allowed" : "pointer",
    transition: "background 0.2s",
  };

  const errorStyle: React.CSSProperties = {
    padding: "12px",
    marginBottom: "16px",
    background: "rgba(220, 38, 38, 0.1)",
    border: "1px solid rgba(220, 38, 38, 0.3)",
    borderRadius: "8px",
    color: "#f87171",
    fontSize: "14px",
    textAlign: "center",
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={titleStyle}>
          <span style={{ fontSize: "32px" }}>&#127769;</span>
          Araby Admin
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div style={errorStyle}>{error}</div>}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--gold)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--gold)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={buttonStyle}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.background = "var(--gold-light)";
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.background = "var(--gold)";
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
