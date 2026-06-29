"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "../i18n";

gsap.registerPlugin(ScrollTrigger);

export default function Features() {
  const { t, dir } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const features = [
    {
      icon: "🕌",
      title: t.features.prayerTimes.title,
      desc: t.features.prayerTimes.desc,
      api: t.features.prayerTimes.api,
      soon: false,
    },
    {
      icon: "🌙",
      title: t.features.hijriCalendar.title,
      desc: t.features.hijriCalendar.desc,
      api: t.features.hijriCalendar.api,
      soon: false,
    },
    {
      icon: "📖",
      title: t.features.quranReader.title,
      desc: t.features.quranReader.desc,
      api: t.features.quranReader.api,
      soon: false,
    },
    {
      icon: "✨",
      title: t.features.asmaAlHusna.title,
      desc: t.features.asmaAlHusna.desc,
      api: t.features.asmaAlHusna.api,
      soon: false,
    },
    {
      icon: "🍽️",
      title: t.features.halalFinder.title,
      desc: t.features.halalFinder.desc,
      api: t.features.halalFinder.api,
      soon: true,
    },
    {
      icon: "🔤",
      title: t.features.arabicLearning.title,
      desc: t.features.arabicLearning.desc,
      api: t.features.arabicLearning.api,
      soon: true,
    },
  ];

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
      dir={dir}
      className="section-pad"
      style={{
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
          {t.features.eyebrow}
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
          {t.features.title}
        </h2>
      </div>

      <div className="grid-features">
        {features.map((feature, index) => (
          <div
            key={index}
            ref={(el) => {
              cardsRef.current[index] = el;
            }}
            style={{
              background: feature.soon ? "rgba(42,127,127,0.04)" : "var(--card)",
              padding: "40px",
              transition: "background 0.2s",
              cursor: "default",
              position: "relative",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#1A2230";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = feature.soon ? "rgba(42,127,127,0.04)" : "var(--card)";
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
            {feature.soon && (
              <div
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  background: "rgba(42,127,127,0.15)",
                  border: "1px solid rgba(58,175,175,0.3)",
                  color: "var(--teal-light)",
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  padding: "3px 10px",
                  borderRadius: "20px",
                }}
              >
                Coming soon
              </div>
            )}
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
