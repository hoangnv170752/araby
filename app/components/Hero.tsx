"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useTranslation } from "../i18n";

export default function Hero() {
  const { t, dir } = useTranslation();
  const heroRef = useRef<HTMLElement>(null);
  const ornamentRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const arabicRef = useRef<HTMLParagraphElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(
        [
          ornamentRef.current,
          eyebrowRef.current,
          titleRef.current,
          arabicRef.current,
          subRef.current,
          actionsRef.current,
        ],
        { opacity: 0, y: 40 }
      );

      const tl = gsap.timeline({ delay: 0.5 });

      tl.to(ornamentRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 1,
        ease: "elastic.out(1, 0.5)",
      })
        .to(
          eyebrowRef.current,
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          "-=0.5"
        )
        .to(
          titleRef.current,
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          "-=0.4"
        )
        .to(
          arabicRef.current,
          { opacity: 0.7, y: 0, duration: 0.6, ease: "power3.out" },
          "-=0.4"
        )
        .to(
          subRef.current,
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          "-=0.3"
        )
        .to(
          actionsRef.current,
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          "-=0.2"
        );

      gsap.to(ornamentRef.current, {
        y: -10,
        duration: 3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 1.5,
      });

      gsap.to(ornamentRef.current?.querySelector("svg") || null, {
        filter: "drop-shadow(0 0 20px rgba(201, 168, 76, 0.6))",
        duration: 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      dir={dir}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "120px 24px 80px",
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
        style={{
          width: "80px",
          height: "80px",
          marginBottom: "28px",
          position: "relative",
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
        ref={eyebrowRef}
        style={{
          fontSize: "12px",
          fontWeight: 600,
          letterSpacing: "3px",
          color: "var(--gold)",
          textTransform: "uppercase",
          marginBottom: "20px",
        }}
      >
        {t.hero.eyebrow}
      </p>

      <h1
        ref={titleRef}
        className="font-urbanist"
        style={{
          fontSize: "clamp(42px, 7vw, 88px)",
          fontWeight: 700,
          lineHeight: 1.05,
          color: "var(--white)",
          marginBottom: "12px",
        }}
      >
        {t.hero.titleLine1}
        <br />
        <em className="gradient-text" style={{ fontStyle: "italic" }}>
          {t.hero.titleLine3}
        </em>
      </h1>

      <p
        ref={arabicRef}
        className="font-amiri"
        style={{
          fontSize: "28px",
          color: "var(--gold-light)",
          marginBottom: "24px",
          opacity: 0.7,
          direction: "rtl",
        }}
      >
        {t.hero.arabicText}
      </p>

      <p
        ref={subRef}
        style={{
          maxWidth: "520px",
          color: "var(--muted)",
          fontSize: "18px",
          lineHeight: 1.7,
          marginBottom: "44px",
        }}
      >
        {t.hero.description}
      </p>

      <div
        ref={actionsRef}
        style={{
          display: "flex",
          gap: "14px",
          flexWrap: "wrap",
          justifyContent: "center",
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
