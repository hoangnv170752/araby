"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { num: "1.9B", label: "Muslim users worldwide" },
  { num: "$2T", label: "Global halal economy" },
  { num: "$7.3B", label: "Spiritual wellness apps market by 2033" },
];

export default function Stats() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

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
          key={stat.num}
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
