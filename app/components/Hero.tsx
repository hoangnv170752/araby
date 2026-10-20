"use client";

import { useEffect, useRef } from "react";
import { useTranslation } from "../i18n";

export default function Hero() {
  const { t, dir } = useTranslation();
  const ornamentRef = useRef<HTMLDivElement>(null);

  // Decorative floating/glow — loaded lazily so GSAP stays out of the critical path
  useEffect(() => {
    let ctx: { revert: () => void } | undefined;
    import("gsap").then(({ default: gsap }) => {
      ctx = gsap.context(() => {
        gsap.to(ornamentRef.current, {
          y: -10,
          duration: 3,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });

        gsap.to(ornamentRef.current?.querySelector("svg") || null, {
          filter: "drop-shadow(0 0 20px rgba(201, 168, 76, 0.6))",
          duration: 2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });
    });

    return () => ctx?.revert();
  }, []);

  return (
    <section
      dir={dir}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "clamp(80px, 15vw, 120px) 20px clamp(60px, 10vw, 80px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background gradient */}
      <div
        style={{
          content: "''",
          position: "absolute",
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(201,168,76,0.06) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(42,127,127,0.08) 0%, transparent 40%),
            radial-gradient(circle at 60% 80%, rgba(201,168,76,0.04) 0%, transparent 35%)
          `,
          pointerEvents: "none",
        }}
      />

      {/* Ornament */}
      <div
        ref={ornamentRef}
        className="hero-fade-in"
        style={{
          width: "80px",
          height: "80px",
          marginBottom: "28px",
          position: "relative",
          animationDelay: "0.2s",
        }}
      >
        <svg
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", height: "100%" }}
        >
          <polygon
            points="40,4 52,28 78,28 58,46 66,72 40,56 14,72 22,46 2,28 28,28"
            fill="none"
            stroke="#C9A84C"
            strokeWidth="1.5"
            opacity="0.6"
          />
          <circle cx="40" cy="40" r="10" fill="none" stroke="#C9A84C" strokeWidth="1" />
          <circle cx="40" cy="40" r="3" fill="#C9A84C" opacity="0.8" />
        </svg>
      </div>

      <p
        className="hero-fade-in"
        style={{
          fontSize: "12px",
          fontWeight: 600,
          letterSpacing: "3px",
          color: "var(--gold)",
          textTransform: "uppercase",
          marginBottom: "20px",
          animationDelay: "0.35s",
        }}
      >
        {t.hero.eyebrow}
      </p>

      <h1
        className="font-urbanist hero-fade-in"
        style={{
          fontSize: "clamp(42px, 7vw, 88px)",
          fontWeight: 700,
          lineHeight: 1.05,
          color: "var(--white)",
          marginBottom: "12px",
          animationDelay: "0.1s",
          animationDuration: "0.5s",
        }}
      >
        {t.hero.titleLine1}
        <br />
        <em className="gradient-text" style={{ fontStyle: "italic" }}>
          {t.hero.titleLine3}
        </em>
      </h1>

      <p
        className="font-amiri hero-fade-in"
        style={{
          fontSize: "clamp(20px, 5vw, 28px)",
          color: "var(--gold-light)",
          marginBottom: "24px",
          opacity: 0.7,
          direction: "rtl",
          animationDelay: "0.5s",
        }}
      >
        {t.hero.arabicText}
      </p>

      <p
        className="hero-fade-in"
        style={{
          maxWidth: "520px",
          color: "var(--muted)",
          fontSize: "18px",
          lineHeight: 1.7,
          marginBottom: "44px",
          animationDelay: "0.6s",
        }}
      >
        {t.hero.description}
      </p>

      <div
        className="hero-fade-in"
        style={{
          display: "flex",
          gap: "14px",
          flexWrap: "wrap",
          justifyContent: "center",
          animationDelay: "0.7s",
        }}
      >
        <a
          href="#waitlist"
          style={{
            background: "var(--gold)",
            color: "var(--night)",
            padding: "14px 32px",
            borderRadius: "7px",
            fontWeight: 600,
            fontSize: "15px",
            textDecoration: "none",
            transition: "transform 0.15s, background 0.2s",
            display: "inline-block",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--gold-light)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--gold)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          {t.hero.cta}
        </a>
        <a
          href="#features"
          style={{
            border: "1px solid var(--border)",
            color: "var(--text)",
            padding: "14px 32px",
            borderRadius: "7px",
            fontWeight: 500,
            fontSize: "15px",
            textDecoration: "none",
            transition: "border-color 0.2s, color 0.2s",
            display: "inline-block",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--gold)";
            e.currentTarget.style.color = "var(--gold)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.color = "var(--text)";
          }}
        >
          {t.nav.features}
        </a>
      </div>
    </section>
  );
}
