"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "../i18n";

gsap.registerPlugin(ScrollTrigger);

export default function Stats() {
  const { t, dir } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  const stats = [
    { num: t.stats.muslimUsers.num, label: t.stats.muslimUsers.label },
    { num: t.stats.halalEconomy.num, label: t.stats.halalEconomy.label },
    { num: t.stats.wellnessMarket.num, label: t.stats.wellnessMarket.label },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      itemsRef.current.forEach((item, index) => {
        if (!item) return;

        const numEl = item.querySelector(".stat-num");
        const labelEl = item.querySelector(".stat-label");

        gsap.set([numEl, labelEl], { opacity: 0, y: 30 });

        ScrollTrigger.create({
          trigger: item,
          start: "top 85%",
          onEnter: () => {
            gsap.to(numEl, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              delay: index * 0.1,
              ease: "power3.out",
            });
            gsap.to(labelEl, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              delay: index * 0.1 + 0.15,
              ease: "power3.out",
            });
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      dir={dir}
      style={{
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        padding: "36px 40px",
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 0,
      }}
    >
      {stats.map((stat, index) => (
        <div
          key={index}
          ref={(el) => {
            itemsRef.current[index] = el;
          }}
          style={{
            textAlign: "center",
            padding: "0 20px",
            borderRight: index < stats.length - 1 ? "1px solid var(--border)" : "none",
          }}
        >
          <span
            className="stat-num font-urbanist"
            style={{
              fontSize: "38px",
              fontWeight: 700,
              color: "var(--gold)",
              display: "block",
            }}
          >
            {stat.num}
          </span>
          <div
            className="stat-label"
            style={{
              color: "var(--muted)",
              fontSize: "13px",
              marginTop: "4px",
            }}
          >
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
