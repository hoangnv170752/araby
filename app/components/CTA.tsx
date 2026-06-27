"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "../i18n";

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const { t, dir, locale } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");

  useEffect(() => {
    const ctx = gsap.context(() => {
      const arabic = contentRef.current?.querySelector(".cta-arabic");
      const title = contentRef.current?.querySelector(".cta-title");
      const sub = contentRef.current?.querySelector(".cta-sub");
      const form = contentRef.current?.querySelector(".email-form");

      if (!arabic || !title || !sub || !form) return;

      gsap.set([arabic, title, sub, form], { opacity: 0, y: 40 });

      ScrollTrigger.create({
        trigger: contentRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.to(arabic, {
            opacity: 0.5,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          });
          gsap.to(title, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.1,
            ease: "power3.out",
          });
          gsap.to(sub, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.2,
            ease: "power3.out",
          });
          gsap.to(form, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.3,
            ease: "power3.out",
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSending(true);
    setSendError("");

    gsap.to(".email-form", {
      scale: 0.95,
      duration: 0.1,
      ease: "power2.in",
      onComplete: () => {
        gsap.to(".email-form", {
          scale: 1,
          duration: 0.3,
          ease: "elastic.out(1, 0.5)",
        });
      },
    });

    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, feedback: feedback.trim() || null, locale }),
    });

    setSending(false);

    if (res.ok) {
      setSubmitted(true);
    } else {
      try {
        const body = await res.json();
        setSendError(body.error ?? "Something went wrong. Please try again.");
      } catch {
        setSendError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <section
      ref={sectionRef}
      id="waitlist"
      dir={dir}
      className="section-pad"
      style={{
        textAlign: "center",
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
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(201,168,76,0.08) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div ref={contentRef} style={{ position: "relative", zIndex: 10 }}>
        <p
          className="cta-arabic font-amiri"
          dir="rtl"
          style={{
            fontSize: "36px",
            color: "var(--gold)",
            opacity: 0.5,
            marginBottom: "24px",
          }}
        >
          {t.cta.arabic}
        </p>
        <h2
          className="cta-title font-urbanist"
          style={{
            fontSize: "clamp(30px, 5vw, 54px)",
            color: "var(--white)",
            marginBottom: "20px",
            lineHeight: 1.15,
          }}
        >
          {t.cta.title}
        </h2>
        <p
          className="cta-sub"
          style={{
            color: "var(--muted)",
            fontSize: "17px",
            maxWidth: "440px",
            margin: "0 auto 40px",
          }}
        >
          {t.cta.subtitle}
        </p>

        {!submitted ? (
          <>
          <form
            onSubmit={handleSubmit}
            className="email-form"
            style={{
              display: "flex",
              gap: "10px",
              maxWidth: "420px",
              margin: "0 auto",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.cta.emailPlaceholder}
              style={{
                flex: 1,
                minWidth: "220px",
                background: "var(--card)",
                border: "1px solid var(--border)",
                color: "var(--text)",
                padding: "13px 18px",
                borderRadius: "7px",
                fontSize: "14px",
                outline: "none",
                transition: "border-color 0.2s",
                textAlign: dir === "rtl" ? "right" : "left",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--gold)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
              }}
              required
            />
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={t.cta.feedbackPlaceholder ?? "Any thoughts or features you'd like? (optional)"}
              rows={3}
              style={{
                width: "100%",
                background: "var(--card)",
                border: "1px solid var(--border)",
                color: "var(--text)",
                padding: "13px 18px",
                borderRadius: "7px",
                fontSize: "14px",
                outline: "none",
                transition: "border-color 0.2s",
                resize: "vertical",
                fontFamily: "inherit",
                textAlign: dir === "rtl" ? "right" : "left",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--gold)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
              }}
            />
            <button
              type="submit"
              disabled={sending}
              style={{
                background: "var(--gold)",
                color: "var(--night)",
                padding: "13px 24px",
                borderRadius: "7px",
                border: "none",
                fontWeight: 600,
                fontSize: "14px",
                cursor: sending ? "not-allowed" : "pointer",
                transition: "background 0.2s",
                whiteSpace: "nowrap",
                opacity: sending ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!sending) e.currentTarget.style.background = "var(--gold-light)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--gold)";
              }}
            >
              {sending ? "…" : t.cta.button}
            </button>
          </form>
          {sendError && (
            <p style={{ color: "#e05c5c", fontSize: "13px", marginTop: "12px" }}>
              {sendError}
            </p>
          )}
          </>
        ) : (
          <div
            className="email-form"
            style={{
              background: "var(--gold-dim)",
              border: "1px solid rgba(201,168,76,0.3)",
              borderRadius: "7px",
              padding: "16px 32px",
              maxWidth: "420px",
              margin: "0 auto",
            }}
          >
            <p style={{ color: "var(--gold)", fontWeight: 500 }}>
              {t.cta.success}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
