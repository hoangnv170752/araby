"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "../i18n";

gsap.registerPlugin(ScrollTrigger);

export default function Roadmap() {
  const { t, dir } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  const phases = [
    {
      phase: t.roadmap.phase1.phase,
      title: t.roadmap.phase1.title,
      desc: t.roadmap.phase1.desc,
      tags: t.roadmap.phase1.tags,
    },
    {
      phase: t.roadmap.phase2.phase,
      title: t.roadmap.phase2.title,
      desc: t.roadmap.phase2.desc,
      tags: t.roadmap.phase2.tags,
    },
    {
      phase: t.roadmap.phase3.phase,
      title: t.roadmap.phase3.title,
      desc: t.roadmap.phase3.desc,
      tags: t.roadmap.phase3.tags,
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

      itemsRef.current.forEach((item, index) => {
        if (!item) return;

        const phase = item.querySelector(".roadmap-phase");
        const content = item.querySelector(".roadmap-content");

        gsap.set([phase, content], { opacity: 0, y: 30 });

        ScrollTrigger.create({
          trigger: item,
          start: "top 85%",
          onEnter: () => {
            gsap.to(phase, {
              opacity: 1,
              y: 0,
              duration: 0.5,
              delay: index * 0.1,
              ease: "power3.out",
            });
            gsap.to(content, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              delay: index * 0.1 + 0.1,
              ease: "power3.out",
            });

            // Animate tags
            const tags = content?.querySelectorAll(".tag");
            if (tags) {
              gsap.fromTo(
                tags,
                { opacity: 0, scale: 0.8 },
                {
                  opacity: 1,
                  scale: 1,
                  duration: 0.4,
                  stagger: 0.05,
                  delay: index * 0.1 + 0.3,
                  ease: "back.out(1.7)",
                }
              );
            }
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="roadmap"
      dir={dir}
      className="section-pad"
      style={{
        background: "var(--deep)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
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
            {t.roadmap.eyebrow}
          </p>
          <h2
            className="section-title font-urbanist"
            style={{
              fontSize: "clamp(28px, 4vw, 46px)",
              color: "var(--white)",
              lineHeight: 1.2,
              marginBottom: "56px",
              maxWidth: "400px",
            }}
          >
            {t.roadmap.title}
          </h2>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 0,
          }}
        >
          {phases.map((item, index) => (
            <div
              key={index}
              ref={(el) => {
                itemsRef.current[index] = el;
              }}
              style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr",
                gap: "24px",
                padding: "28px 0",
                borderBottom:
                  index < phases.length - 1
                    ? "1px solid var(--border)"
                    : "none",
                position: "relative",
              }}
            >
              <div
                className="roadmap-phase"
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "2px",
                  color: "var(--gold)",
                  textTransform: "uppercase",
                  paddingTop: "4px",
                }}
              >
                {item.phase}
              </div>
              <div className="roadmap-content">
                <h4
                  className="font-urbanist"
                  style={{
                    fontSize: "18px",
                    color: "var(--white)",
                    marginBottom: "8px",
                  }}
                >
                  {item.title}
                </h4>
                <p
                  style={{
                    color: "var(--muted)",
                    fontSize: "14px",
                    lineHeight: 1.7,
                  }}
                >
                  {item.desc}
                </p>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "6px",
                    marginTop: "12px",
                  }}
                >
                  {item.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="tag"
                      style={{
                        background: "var(--gold-dim)",
                        color: "var(--gold-light)",
                        fontSize: "11px",
                        padding: "3px 10px",
                        borderRadius: "20px",
                        border: "1px solid rgba(201,168,76,0.15)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
