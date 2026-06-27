"use client";

import { useState, useRef, useEffect } from "react";
import { useI18n, locales, localeNames, type Locale } from "../i18n";

export default function LanguageSwitcher() {
  const { locale, setLocale, mounted } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  // Prevent hydration mismatch by showing a placeholder until mounted
  if (!mounted) {
    return (
      <div
        style={{
          padding: "8px 12px",
          background: "rgba(201, 168, 76, 0.1)",
          border: "1px solid rgba(201, 168, 76, 0.2)",
          borderRadius: "6px",
          minWidth: "80px",
          height: "36px",
        }}
      />
    );
  }

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "8px 12px",
          background: "rgba(201, 168, 76, 0.1)",
          border: "1px solid rgba(201, 168, 76, 0.2)",
          borderRadius: "6px",
          color: "var(--gold)",
          fontSize: "13px",
          fontWeight: 500,
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(201, 168, 76, 0.15)";
          e.currentTarget.style.borderColor = "rgba(201, 168, 76, 0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(201, 168, 76, 0.1)";
          e.currentTarget.style.borderColor = "rgba(201, 168, 76, 0.2)";
        }}
      >
        <span>{localeNames[locale]}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            right: 0,
            minWidth: "140px",
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            padding: "4px",
            zIndex: 1000,
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          }}
        >
          {locales.map((l) => (
            <button
              key={l}
              onClick={() => handleSelect(l)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                width: "100%",
                padding: "10px 12px",
                background: l === locale ? "rgba(201, 168, 76, 0.15)" : "transparent",
                border: "none",
                borderRadius: "6px",
                color: l === locale ? "var(--gold)" : "var(--text)",
                fontSize: "13px",
                fontWeight: l === locale ? 600 : 400,
                cursor: "pointer",
                transition: "all 0.15s",
                textAlign: "left",
              }}
              onMouseEnter={(e) => {
                if (l !== locale) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                }
              }}
              onMouseLeave={(e) => {
                if (l !== locale) {
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              <span>{localeNames[l]}</span>
              {l === locale && (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  style={{ marginLeft: "auto" }}
                >
                  <path
                    d="M3 7L6 10L11 4"
                    stroke="var(--gold)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
