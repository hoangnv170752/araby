"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Nav() {
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([logoRef.current, linksRef.current?.children, ctaRef.current], {
        opacity: 0,
        y: -20,
      });

      const tl = gsap.timeline({ delay: 0.2 });

      tl.to(logoRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
      })
        .to(
          linksRef.current?.children || [],
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=0.3"
        )
        .to(
          ctaRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
          },
          "-=0.2"
        );
    }, navRef);

    return () => ctx.revert();
  }, []);

  return (
    <nav
      ref={navRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "18px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(13,17,23,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        ref={logoRef}
        className="font-amiri"
        style={{
          fontSize: "22px",
          color: "var(--gold)",
          letterSpacing: "1px",
        }}
      >
        أرابي <span style={{ color: "var(--white)" }}>· Araby</span>
      </div>

      <ul
        ref={linksRef}
        style={{
          display: "flex",
          gap: "32px",
          listStyle: "none",
        }}
        className="hidden md:flex"
      >
        {["Features", "Market", "Roadmap"].map((link) => (
          <li key={link}>
            <a
              href={`#${link.toLowerCase()}`}
              style={{
                color: "var(--muted)",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 500,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--white)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
            >
              {link}
            </a>
          </li>
        ))}
      </ul>

      <a
        ref={ctaRef}
        href="#waitlist"
        style={{
          background: "var(--gold)",
          color: "var(--night)",
          padding: "9px 22px",
          borderRadius: "6px",
          fontSize: "14px",
          fontWeight: 600,
          textDecoration: "none",
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--gold-light)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "var(--gold)")}
      >
        Join Waitlist
      </a>
    </nav>
  );
}
