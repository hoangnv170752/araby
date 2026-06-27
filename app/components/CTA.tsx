"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
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
      setSubmitted(true);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="waitlist"
      style={{
        padding: "96px 40px",
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
          السلام عليكم
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
          Be first to know
          <br />
          when we launch.
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
          Join the waitlist. We&apos;ll reach out before public launch with early
          access.
        </p>

        {!submitted ? (
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
              placeholder="your@email.com"
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
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--gold)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
              }}
              required
            />
            <button
              type="submit"
              style={{
                background: "var(--gold)",
                color: "var(--night)",
                padding: "13px 24px",
                borderRadius: "7px",
                border: "none",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
                transition: "background 0.2s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--gold-light)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--gold)";
              }}
            >
              Join Waitlist
            </button>
          </form>
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
              ✓ You&apos;re on the list! We&apos;ll be in touch.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
