"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const marketNumbers = [
  { num: "62M+", label: "Downloads for Muslim Pro — built with zero marketing budget" },
  { num: "$300M", label: "Valuation of Wahed, a halal investment app" },
  { num: "2.2B", label: "Projected global Muslim population by 2030" },
  { num: "Daily", label: "Users open Islamic apps multiple times a day — exceptional retention" },
];

export default function Market() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const numbersRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const eyebrow = headerRef.current?.querySelector(".section-eyebrow");
      const title = headerRef.current?.querySelector(".section-title");

      if (!eyebrow || !title) return;

      gsap.set([eyebrow, title], { opacity: 0, y: 30 });

      ScrollTrigger.create({
        trigger: headerRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.to(eyebrow, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
          });
          gsap.to(title, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: 0.1,
            ease: "power3.out",
          });
        },
      });

      // Numbers animation
      const rows = numbersRef.current?.querySelectorAll(".market-row");
      if (rows) {
        gsap.set(rows, { opacity: 0, x: -30 });

        ScrollTrigger.create({
          trigger: numbersRef.current,
          start: "top 80%",
          onEnter: () => {
            gsap.to(rows, {
              opacity: 1,
              x: 0,
              duration: 0.6,
              stagger: 0.1,
              ease: "power3.out",
            });
          },
        });
      }

      // Text animation
      const textElements = textRef.current?.children;
      if (textElements) {
        gsap.set(textElements, { opacity: 0, y: 30 });

        ScrollTrigger.create({
          trigger: textRef.current,
          start: "top 80%",
          onEnter: () => {
            gsap.to(textElements, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.1,
              ease: "power3.out",
            });
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        padding: "96px 40px",
        maxWidth: "1100px",
        margin: "0 auto",
      }}
    >
      <div ref={headerRef}>
        <p
          className="section-eyebrow"
          style={{
            fontSize: "11px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "var(--gold)",
            fontWeight: 600,
            marginBottom: "14px",
          }}
        >
          Market Opportunity
        </p>
        <h2
          className="section-title font-urbanist"
          style={{
            fontSize: "clamp(28px, 4vw, 46px)",
            color: "var(--white)",
            lineHeight: 1.2,
          }}
        >
          Why now is the right time
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "48px",
          alignItems: "center",
          marginTop: "56px",
        }}
      >
        <div
          ref={numbersRef}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          {marketNumbers.map((item) => (
            <div
              key={item.num}
              className="market-row"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                padding: "20px 24px",
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
              }}
            >
              <div
                className="font-urbanist"
                style={{
                  fontSize: "28px",
                  color: "var(--gold)",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  minWidth: "90px",
                }}
              >
                {item.num}
              </div>
              <div
                style={{
                  color: "var(--muted)",
                  fontSize: "14px",
                }}
              >
                {item.label}
              </div>
            </div>
          ))}
        </div>

        <div ref={textRef}>
          <h3
            className="font-urbanist"
            style={{
              fontSize: "28px",
              color: "var(--white)",
              marginBottom: "16px",
            }}
          >
            Islamic apps monetize better than they look
          </h3>
          <p
            style={{
              color: "var(--muted)",
              fontSize: "15px",
              lineHeight: 1.8,
              marginBottom: "14px",
            }}
          >
            Muslim Pro generates 90% of its revenue from ads and 10% from
            subscriptions — even though the majority of its users are in
            developing markets. The gap between downloads and revenue is the
            opportunity.
          </p>
          <p
            style={{
              color: "var(--muted)",
              fontSize: "15px",
              lineHeight: 1.8,
              marginBottom: "14px",
            }}
          >
            Users in the Arab Gulf, UK, and North America convert at much higher
            rates and pay far more per subscription than the global average.
          </p>
          <div
            style={{
              background: "var(--gold-dim)",
              border: "1px solid rgba(201,168,76,0.2)",
              borderRadius: "8px",
              padding: "16px 20px",
              fontSize: "14px",
              color: "var(--text)",
              marginTop: "20px",
            }}
          >
            <strong style={{ color: "var(--gold)" }}>Key insight:</strong> Only
            8.1% of Quran Majeed&apos;s revenue came from India and Pakistan — despite
            those countries accounting for 35.6% of downloads. Target the
            diaspora first.
          </div>
        </div>
      </div>
    </section>
  );
}
