"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function OrnamentDivider() {
  const dividerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(dividerRef.current, { opacity: 0, scale: 0.8 });

      ScrollTrigger.create({
        trigger: dividerRef.current,
        start: "top 90%",
        onEnter: () => {
          gsap.to(dividerRef.current, {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "back.out(1.7)",
          });
        },
      });
    }, dividerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={dividerRef}
      className="font-amiri"
      style={{
        textAlign: "center",
        padding: "20px",
        color: "rgba(201,168,76,0.3)",
        fontSize: "22px",
        letterSpacing: "12px",
      }}
    >
      ✦ ✦ ✦
    </div>
  );
}
