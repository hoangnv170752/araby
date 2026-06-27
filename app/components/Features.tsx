"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: "🕌",
    title: "Prayer Times",
    desc: "Accurate prayer schedules for any city in the world, updated in real-time. Countdown to the next Salah, customizable notification alerts.",
    api: "↳ Araby API · /prayer-times",
  },
  {
    icon: "🌙",
    title: "Hijri Calendar",
    desc: "Convert between Gregorian and Islamic dates. Track Ramadan, Eid, and all major Islamic holidays automatically.",
    api: "↳ Araby API · /hijri-calendar",
  },
  {
    icon: "📖",
    title: "Quran Reader",
    desc: "Full text of the Holy Quran with multiple editions, translations, search, and a random Ayah feature for daily reflection.",
    api: "↳ Araby API · /quran",
  },
  {
    icon: "✨",
    title: "Asma Al Husna",
    desc: "Explore all 99 Beautiful Names of Allah — in Arabic script, transliteration, and meaning. One name highlighted each day.",
    api: "↳ Araby API · /asma-al-husna",
  },
];

export default function Features() {
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
          gsap.to(eyebrow, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" });
          gsap.to(title, { opacity: 1, y: 0, duration: 0.6, delay: 0.1, ease: "power3.out" });
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
              delay: index * 0.1,
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
      id="features"
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
          What&apos;s Inside
        </p>
        <h2
          className="section-title font-urbanist"
          style={{
            fontSize: "clamp(28px, 4vw, 46px)",
            color: "var(--white)",
            lineHeight: 1.2,
            marginBottom: "56px",
            maxWidth: "520px",
          }}
        >
          Four pillars. One app.
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "2px",
          background: "var(--border)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        {features.map((feature, index) => (
          <div
            key={feature.title}
            ref={(el) => {
              cardsRef.current[index] = el;
            }}
            style={{
              background: "var(--card)",
              padding: "40px",
              transition: "background 0.2s",
              cursor: "default",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#1A2230";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--card)";
            }}
          >
            <div
              className="feature-icon"
              style={{
                width: "44px",
                height: "44px",
                background: "var(--gold-dim)",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                marginBottom: "20px",
                border: "1px solid rgba(201,168,76,0.2)",
              }}
            >
              {feature.icon}
            </div>
            <h3
              className="font-urbanist"
              style={{
                fontSize: "20px",
                color: "var(--white)",
                marginBottom: "10px",
              }}
            >
              {feature.title}
            </h3>
            <p
              style={{
                color: "var(--muted)",
                fontSize: "14px",
                lineHeight: 1.7,
              }}
            >
              {feature.desc}
            </p>
            <div
              style={{
                marginTop: "16px",
                fontSize: "11px",
                color: "var(--teal-light)",
                fontFamily: "'Inter', monospace",
                letterSpacing: "0.5px",
              }}
            >
              {feature.api}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
