"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const streams = [
  {
    label: "Stream 01",
    title: "Freemium Subscriptions",
    desc: "Core features free forever. Premium tier unlocks ad-free experience, offline Quran audio, advanced prayer analytics, and widgets.",
    potential: "Est. $2–5/month per user · High retention",
    featured: false,
  },
  {
    label: "Stream 02",
    title: "Ramadan Surge Revenue",
    desc: "Islamic app sessions spike 15% during Ramadan. Time-limited premium bundles, donation features, and sponsored charitable campaigns drive massive seasonal revenue.",
    potential: "$1.7B total app revenue in Ramadan 2025",
    featured: true,
    badge: "Best fit",
  },
  {
    label: "Stream 03",
    title: "B2B API & White Label",
    desc: "License the platform to mosques, Islamic schools, and halal businesses. White-label versions for regional markets in MENA and Southeast Asia.",
    potential: "Higher margins · Recurring B2B contracts",
    featured: false,
  },
];

export default function Monetization() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const eyebrow = headerRef.current?.querySelector(".section-eyebrow");
      const title = headerRef.current?.querySelector(".section-title");

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

      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        gsap.set(card, { opacity: 0, y: 50, scale: 0.95 });

        ScrollTrigger.create({
          trigger: card,
          start: "top 85%",
          onEnter: () => {
            gsap.to(card, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.7,
              delay: index * 0.15,
              ease: "power3.out",
            });
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="market"
      style={{
        background: "var(--deep)",
        padding: "96px 40px",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
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
            How It Makes Money
          </p>
          <h2
            className="section-title font-urbanist"
            style={{
              fontSize: "clamp(28px, 4vw, 46px)",
              color: "var(--white)",
              lineHeight: 1.2,
              marginBottom: "56px",
              maxWidth: "480px",
            }}
          >
            Three revenue streams, built for this community
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
          }}
        >
          {streams.map((stream, index) => (
            <div
              key={stream.title}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              style={{
                background: stream.featured
                  ? "linear-gradient(135deg, #161E28, #1C2535)"
                  : "var(--card)",
                border: stream.featured
                  ? "1px solid var(--gold)"
                  : "1px solid var(--border)",
                borderRadius: "12px",
                padding: "32px",
                position: "relative",
                overflow: "hidden",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!stream.featured) {
                  e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)";
                }
                gsap.to(e.currentTarget, {
                  scale: 1.02,
                  y: -5,
                  duration: 0.3,
                  ease: "power2.out",
                });
              }}
              onMouseLeave={(e) => {
                if (!stream.featured) {
                  e.currentTarget.style.borderColor = "var(--border)";
                }
                gsap.to(e.currentTarget, {
                  scale: 1,
                  y: 0,
                  duration: 0.3,
                  ease: "power2.out",
                });
              }}
            >
              {stream.badge && (
                <div
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                    background: "var(--gold)",
                    color: "var(--night)",
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "1px",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    textTransform: "uppercase",
                  }}
                >
                  {stream.badge}
                </div>
              )}
              <div
                style={{
                  fontSize: "11px",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: "var(--teal-light)",
                  fontWeight: 600,
                  marginBottom: "10px",
                }}
              >
                {stream.label}
              </div>
              <h3
                className="font-urbanist"
                style={{
                  fontSize: "22px",
                  color: "var(--white)",
                  marginBottom: "12px",
                }}
              >
                {stream.title}
              </h3>
              <p
                style={{
                  color: "var(--muted)",
                  fontSize: "14px",
                  lineHeight: 1.7,
                }}
              >
                {stream.desc}
              </p>
              <div
                style={{
                  marginTop: "20px",
                  paddingTop: "20px",
                  borderTop: "1px solid var(--border)",
                  fontSize: "13px",
                  color: "var(--gold)",
                  fontWeight: 500,
                }}
              >
                {stream.potential}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
