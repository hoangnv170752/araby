import * as React from "react";

interface WaitlistEmailProps {
  email: string;
}

export function WaitlistEmail({ email }: WaitlistEmailProps) {
  return (
    <div
      style={{
        fontFamily: "sans-serif",
        background: "#0a0a0f",
        color: "#e8e0d0",
        padding: "40px",
        maxWidth: "520px",
        margin: "0 auto",
        borderRadius: "12px",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <h1
          style={{
            fontSize: "28px",
            color: "#c9a84c",
            margin: "0 0 8px",
            fontWeight: 700,
          }}
        >
          أرابي · Araby
        </h1>
        <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>
          Your Islamic Companion
        </p>
      </div>

      <p style={{ fontSize: "16px", lineHeight: 1.6, marginBottom: "24px" }}>
        السلام عليكم,
      </p>

      <p style={{ fontSize: "16px", lineHeight: 1.6, marginBottom: "24px" }}>
        You&apos;re on the list! We&apos;ve received your email{" "}
        <strong style={{ color: "#c9a84c" }}>{email}</strong> and
        will reach out before the public launch with early access.
      </p>

      <p style={{ fontSize: "16px", lineHeight: 1.6, marginBottom: "32px" }}>
        Araby brings you prayer times, the Hijri calendar, Quran reader, and
        the 99 Names of Allah — everything your faith needs, in one place.
      </p>

      <div
        style={{
          borderTop: "1px solid #2a2a3a",
          paddingTop: "24px",
          textAlign: "center",
          color: "#666",
          fontSize: "13px",
        }}
      >
        <p style={{ margin: 0 }}>جزاك الله خيرًا · Araby Team · 2026</p>
      </div>
    </div>
  );
}
