"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(footerRef.current?.children || [], { opacity: 0, y: 20 });

      ScrollTrigger.create({
        trigger: footerRef.current,
        start: "top 95%",
        onEnter: () => {
          gsap.to(footerRef.current?.children || [], {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power3.out",
          });
        },
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      style={{
        padding: "28px 40px",
        borderTop: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div
        className="font-amiri"
        style={{
          fontSize: "18px",
          color: "var(--gold)",
        }}
      >
        أرابي · Araby
      </div>
      <div
        style={{
          color: "var(--muted)",
          fontSize: "13px",
        }}
      >
        Built with AlAdhan & AlQuran Cloud APIs · 2026
      </div>
    </footer>
  );
}
