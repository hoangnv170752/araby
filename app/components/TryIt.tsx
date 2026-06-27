"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type TabName = "prayer" | "hijri" | "husna" | "ayah";

interface PrayerTime {
  name: string;
  time: string;
}

interface HusnaData {
  number: number;
  name: string;
  transliteration: string;
  en: { meaning: string };
}

interface AyahData {
  text: string;
  surah: { name: string; englishName: string };
  numberInSurah: number;
}

export default function TryIt() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<TabName>("prayer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prayer state
  const [prayerCity, setPrayerCity] = useState("Dubai");
  const [prayerCountry, setPrayerCountry] = useState("UAE");
  const [prayerMethod, setPrayerMethod] = useState("4");
  const [prayerResult, setPrayerResult] = useState<{
    prayers: PrayerTime[];
    meta: { city: string; country: string; readable: string; hijri: string };
    nextIdx: number;
  } | null>(null);

  // Hijri state
  const [hijriDate, setHijriDate] = useState("");
  const [hijriResult, setHijriResult] = useState<{
    gregorian: { day: string; month: string; year: string; weekday: string };
    hijri: {
      day: string;
      month: string;
      monthAr: string;
      year: string;
      weekday: string;
      designation: string;
    };
  } | null>(null);

  // Husna state
  const [husnaNum, setHusnaNum] = useState(1);
  const [husnaResult, setHusnaResult] = useState<HusnaData | null>(null);

  // Ayah state
  const [ayahEdition, setAyahEdition] = useState("en.sahih");
  const [ayahResult, setAyahResult] = useState<{
    arabic: AyahData;
    translation: AyahData & { edition: { englishName: string } };
  } | null>(null);

  useEffect(() => {
    setHijriDate(new Date().toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const eyebrow = headerRef.current?.querySelector(".section-eyebrow");
      const title = headerRef.current?.querySelector(".section-title");
      const desc = headerRef.current?.querySelector(".section-desc");

      if (!eyebrow || !title || !desc || !contentRef.current) return;

      gsap.set([eyebrow, title, desc, contentRef.current], {
        opacity: 0,
        y: 30,
      });

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
          gsap.to(desc, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: 0.2,
            ease: "power3.out",
          });
          gsap.to(contentRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.3,
            ease: "power3.out",
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const switchTab = (name: TabName) => {
    setActiveTab(name);
    setError(null);
  };

  const fetchPrayer = async () => {
    setLoading(true);
    setError(null);
    try {
      const today = new Date();
      const d = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
      const url = `https://api.aladhan.com/v1/timingsByCity/${d}?city=${encodeURIComponent(prayerCity)}&country=${encodeURIComponent(prayerCountry)}&method=${prayerMethod}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.code !== 200) throw new Error(data.status);

      const t = data.data.timings;
      const date = data.data.date;
      const prayers = [
        { name: "Fajr", time: t.Fajr },
        { name: "Sunrise", time: t.Sunrise },
        { name: "Dhuhr", time: t.Dhuhr },
        { name: "Asr", time: t.Asr },
        { name: "Maghrib", time: t.Maghrib },
        { name: "Isha", time: t.Isha },
      ];

      const now = new Date();
      const nowMins = now.getHours() * 60 + now.getMinutes();
      let nextIdx = -1;
      for (let i = 0; i < prayers.length; i++) {
        const [h, m] = prayers[i].time.split(":").map(Number);
        if (h * 60 + m > nowMins) {
          nextIdx = i;
          break;
        }
      }

      setPrayerResult({
        prayers,
        meta: {
          city: prayerCity,
          country: prayerCountry,
          readable: date.readable,
          hijri: `${date.hijri.day} ${date.hijri.month.en} ${date.hijri.year} H`,
        },
        nextIdx,
      });
    } catch (e) {
      setError(`Could not fetch — check city/country name. ${e}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchHijri = async () => {
    if (!hijriDate) return;
    setLoading(true);
    setError(null);
    try {
      const [y, m, d] = hijriDate.split("-");
      const formatted = `${d}-${m}-${y}`;
      const url = `https://api.aladhan.com/v1/gToH/${formatted}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.code !== 200) throw new Error(data.status);

      const g = data.data.gregorian;
      const h = data.data.hijri;

      setHijriResult({
        gregorian: {
          day: g.day,
          month: g.month.en,
          year: g.year,
          weekday: g.weekday.en,
        },
        hijri: {
          day: h.day,
          month: h.month.en,
          monthAr: h.month.ar,
          year: h.year,
          weekday: h.weekday.en,
          designation: `${h.designation.abbreviated} (${h.designation.expanded})`,
        },
      });
    } catch (e) {
      setError(`Could not convert date. ${e}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchHusna = async () => {
    if (husnaNum < 1 || husnaNum > 99) {
      setError("Please enter a number between 1 and 99.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const url = `https://api.aladhan.com/v1/asmaAlHusna/${husnaNum}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.code !== 200) throw new Error(data.status);
      setHusnaResult(data.data[0]);
    } catch (e) {
      setError(`Could not fetch. ${e}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchAyah = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `https://api.alquran.cloud/v1/ayah/random/editions/quran-uthmani,${ayahEdition}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.code !== 200) throw new Error(data.status);
      const [arabic, trans] = data.data;
      setAyahResult({ arabic, translation: trans });
    } catch (e) {
      setError(`Could not fetch Ayah. ${e}`);
    } finally {
      setLoading(false);
    }
  };

  const tabs: { name: TabName; icon: string; label: string }[] = [
    { name: "prayer", icon: "🕌", label: "Prayer Times" },
    { name: "hijri", icon: "🌙", label: "Hijri Calendar" },
    { name: "husna", icon: "✨", label: "Asma Al Husna" },
    { name: "ayah", icon: "📖", label: "Random Ayah" },
  ];

  const inputStyle: React.CSSProperties = {
    background: "rgba(0,0,0,0.3)",
    border: "1px solid var(--border)",
    color: "var(--text)",
    padding: "9px 14px",
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
    minWidth: "140px",
  };

  const buttonStyle: React.CSSProperties = {
    background: "var(--gold)",
    color: "var(--night)",
    padding: "9px 22px",
    borderRadius: "6px",
    border: "none",
    fontWeight: 600,
    fontSize: "13px",
    cursor: "pointer",
    transition: "background 0.2s",
    whiteSpace: "nowrap",
  };

  const resultBoxStyle: React.CSSProperties = {
    background: "rgba(0,0,0,0.35)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    padding: "24px",
    minHeight: "80px",
  };

  return (
    <section
      ref={sectionRef}
      id="tryout"
      style={{
        padding: "96px 40px",
        background: "var(--deep)",
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
            Live Demo
          </p>
          <h2
            className="section-title font-urbanist"
            style={{
              fontSize: "clamp(28px, 4vw, 46px)",
              color: "var(--white)",
              lineHeight: 1.2,
              marginBottom: "8px",
              maxWidth: "520px",
            }}
          >
            Try it right now
          </h2>
          <p
            className="section-desc"
            style={{
              color: "var(--muted)",
              fontSize: "15px",
              marginBottom: "48px",
            }}
          >
            Real data, real APIs — no signup needed.
          </p>
        </div>

        <div ref={contentRef}>
          {/* Tabs */}
          <div
            style={{
              display: "flex",
              gap: "6px",
              flexWrap: "wrap",
              marginBottom: 0,
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => switchTab(tab.name)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px 8px 0 0",
                  border: "1px solid",
                  borderBottom: "none",
                  borderColor:
                    activeTab === tab.name
                      ? "rgba(201,168,76,0.25)"
                      : "var(--border)",
                  background:
                    activeTab === tab.name ? "#1A2535" : "var(--card)",
                  color:
                    activeTab === tab.name ? "var(--gold)" : "var(--muted)",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "color 0.2s, background 0.2s",
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Panel */}
          <div
            style={{
              background: "#1A2535",
              border: "1px solid rgba(201,168,76,0.15)",
              borderRadius: "0 12px 12px 12px",
              padding: "32px",
            }}
          >
            {/* Prayer Panel */}
            {activeTab === "prayer" && (
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    marginBottom: "24px",
                    gap: "20px",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div
                      className="font-urbanist"
                      style={{ fontSize: "20px", color: "var(--white)" }}
                    >
                      Prayer Times
                    </div>
                    <div
                      style={{
                        color: "var(--muted)",
                        fontSize: "13px",
                        marginTop: "4px",
                      }}
                    >
                      Get accurate Salah schedule for any city worldwide.
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: "11px",
                      background: "rgba(0,0,0,0.3)",
                      padding: "4px 10px",
                      borderRadius: "4px",
                      color: "var(--teal-light)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    GET /timingsByCity/&#123;date&#125;
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                    alignItems: "flex-end",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                    }}
                  >
                    <label
                      style={{
                        fontSize: "11px",
                        color: "var(--muted)",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      City
                    </label>
                    <input
                      value={prayerCity}
                      onChange={(e) => setPrayerCity(e.target.value)}
                      style={inputStyle}
                      placeholder="e.g. Cairo"
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor = "var(--gold)")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor = "var(--border)")
                      }
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                    }}
                  >
                    <label
                      style={{
                        fontSize: "11px",
                        color: "var(--muted)",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      Country
                    </label>
                    <input
                      value={prayerCountry}
                      onChange={(e) => setPrayerCountry(e.target.value)}
                      style={{ ...inputStyle, minWidth: "100px" }}
                      placeholder="e.g. Egypt"
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor = "var(--gold)")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor = "var(--border)")
                      }
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                    }}
                  >
                    <label
                      style={{
                        fontSize: "11px",
                        color: "var(--muted)",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      Method
                    </label>
                    <select
                      value={prayerMethod}
                      onChange={(e) => setPrayerMethod(e.target.value)}
                      style={inputStyle}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor = "var(--gold)")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor = "var(--border)")
                      }
                    >
                      <option value="2">ISNA (North America)</option>
                      <option value="3">Muslim World League</option>
                      <option value="4">Umm Al-Qura (Mecca)</option>
                      <option value="5">Egyptian Authority</option>
                      <option value="1">
                        University of Islamic Sciences, Karachi
                      </option>
                    </select>
                  </div>
                  <button
                    onClick={fetchPrayer}
                    disabled={loading}
                    style={{
                      ...buttonStyle,
                      opacity: loading ? 0.5 : 1,
                      cursor: loading ? "not-allowed" : "pointer",
                    }}
                    onMouseEnter={(e) => {
                      if (!loading)
                        e.currentTarget.style.background = "var(--gold-light)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "var(--gold)";
                    }}
                  >
                    Fetch Times
                  </button>
                </div>

                <div style={resultBoxStyle}>
                  {loading && (
                    <div
                      className="animate-pulse-soft"
                      style={{
                        color: "var(--gold)",
                        fontSize: "13px",
                        textAlign: "center",
                        padding: "16px 0",
                      }}
                    >
                      Fetching live data…
                    </div>
                  )}
                  {error && (
                    <div
                      style={{
                        color: "#f87171",
                        fontSize: "14px",
                        textAlign: "center",
                        padding: "16px 0",
                      }}
                    >
                      ⚠ {error}
                    </div>
                  )}
                  {!loading && !error && !prayerResult && (
                    <div
                      style={{
                        color: "var(--muted)",
                        fontSize: "14px",
                        textAlign: "center",
                        padding: "16px 0",
                      }}
                    >
                      Enter a city and click Fetch Times ↑
                    </div>
                  )}
                  {!loading && !error && prayerResult && (
                    <>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(3, 1fr)",
                          gap: "12px",
                        }}
                      >
                        {prayerResult.prayers.map((p, i) => (
                          <div
                            key={p.name}
                            style={{
                              background:
                                i === prayerResult.nextIdx
                                  ? "rgba(201,168,76,0.12)"
                                  : "rgba(201,168,76,0.06)",
                              border:
                                i === prayerResult.nextIdx
                                  ? "1px solid var(--gold)"
                                  : "1px solid rgba(201,168,76,0.1)",
                              borderRadius: "8px",
                              padding: "14px 16px",
                              textAlign: "center",
                            }}
                          >
                            <div
                              style={{
                                fontSize: "11px",
                                textTransform: "uppercase",
                                letterSpacing: "1.5px",
                                color: "var(--muted)",
                                marginBottom: "6px",
                              }}
                            >
                              {p.name}
                              {i === prayerResult.nextIdx && " · Next"}
                            </div>
                            <div
                              className="font-urbanist"
                              style={{ fontSize: "22px", color: "var(--gold)" }}
                            >
                              {p.time}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div
                        style={{
                          marginTop: "16px",
                          fontSize: "12px",
                          color: "var(--muted)",
                          display: "flex",
                          gap: "20px",
                          flexWrap: "wrap",
                        }}
                      >
                        <span>
                          📍 {prayerResult.meta.city},{" "}
                          {prayerResult.meta.country}
                        </span>
                        <span>📅 {prayerResult.meta.readable}</span>
                        <span>🌙 {prayerResult.meta.hijri}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Hijri Panel */}
            {activeTab === "hijri" && (
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    marginBottom: "24px",
                    gap: "20px",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div
                      className="font-urbanist"
                      style={{ fontSize: "20px", color: "var(--white)" }}
                    >
                      Hijri Calendar
                    </div>
                    <div
                      style={{
                        color: "var(--muted)",
                        fontSize: "13px",
                        marginTop: "4px",
                      }}
                    >
                      Convert any Gregorian date to the Islamic Hijri calendar.
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: "11px",
                      background: "rgba(0,0,0,0.3)",
                      padding: "4px 10px",
                      borderRadius: "4px",
                      color: "var(--teal-light)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    GET /gToH/&#123;date&#125;
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                    alignItems: "flex-end",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                    }}
                  >
                    <label
                      style={{
                        fontSize: "11px",
                        color: "var(--muted)",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      Date
                    </label>
                    <input
                      type="date"
                      value={hijriDate}
                      onChange={(e) => setHijriDate(e.target.value)}
                      style={inputStyle}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor = "var(--gold)")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor = "var(--border)")
                      }
                    />
                  </div>
                  <button
                    onClick={fetchHijri}
                    disabled={loading}
                    style={{
                      ...buttonStyle,
                      opacity: loading ? 0.5 : 1,
                      cursor: loading ? "not-allowed" : "pointer",
                    }}
                    onMouseEnter={(e) => {
                      if (!loading)
                        e.currentTarget.style.background = "var(--gold-light)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "var(--gold)";
                    }}
                  >
                    Convert Date
                  </button>
                </div>

                <div style={resultBoxStyle}>
                  {loading && (
                    <div
                      className="animate-pulse-soft"
                      style={{
                        color: "var(--gold)",
                        fontSize: "13px",
                        textAlign: "center",
                        padding: "16px 0",
                      }}
                    >
                      Fetching live data…
                    </div>
                  )}
                  {error && (
                    <div
                      style={{
                        color: "#f87171",
                        fontSize: "14px",
                        textAlign: "center",
                        padding: "16px 0",
                      }}
                    >
                      ⚠ {error}
                    </div>
                  )}
                  {!loading && !error && !hijriResult && (
                    <div
                      style={{
                        color: "var(--muted)",
                        fontSize: "14px",
                        textAlign: "center",
                        padding: "16px 0",
                      }}
                    >
                      Pick a date and click Convert ↑
                    </div>
                  )}
                  {!loading && !error && hijriResult && (
                    <>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "16px",
                        }}
                      >
                        <div
                          style={{
                            background: "rgba(201,168,76,0.06)",
                            border: "1px solid rgba(201,168,76,0.1)",
                            borderRadius: "8px",
                            padding: "20px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "11px",
                              textTransform: "uppercase",
                              letterSpacing: "1.5px",
                              color: "var(--muted)",
                              marginBottom: "8px",
                            }}
                          >
                            Gregorian
                          </div>
                          <div
                            className="font-urbanist"
                            style={{ fontSize: "28px", color: "var(--gold)" }}
                          >
                            {hijriResult.gregorian.day}
                          </div>
                          <div
                            className="font-urbanist"
                            style={{ fontSize: "20px", color: "var(--white)" }}
                          >
                            {hijriResult.gregorian.month}{" "}
                            {hijriResult.gregorian.year}
                          </div>
                          <div
                            style={{
                              color: "var(--muted)",
                              fontSize: "12px",
                              marginTop: "6px",
                            }}
                          >
                            {hijriResult.gregorian.weekday}
                          </div>
                        </div>
                        <div
                          style={{
                            background: "rgba(201,168,76,0.06)",
                            border: "1px solid rgba(201,168,76,0.1)",
                            borderRadius: "8px",
                            padding: "20px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "11px",
                              textTransform: "uppercase",
                              letterSpacing: "1.5px",
                              color: "var(--muted)",
                              marginBottom: "8px",
                            }}
                          >
                            Hijri · Islamic
                          </div>
                          <div
                            className="font-urbanist"
                            style={{ fontSize: "28px", color: "var(--gold)" }}
                          >
                            {hijriResult.hijri.day}
                          </div>
                          <div
                            className="font-urbanist"
                            style={{ fontSize: "20px", color: "var(--white)" }}
                          >
                            {hijriResult.hijri.month} {hijriResult.hijri.year}
                          </div>
                          <div
                            style={{
                              color: "var(--muted)",
                              fontSize: "12px",
                              marginTop: "6px",
                            }}
                          >
                            {hijriResult.hijri.weekday}
                          </div>
                          <div
                            className="font-amiri"
                            dir="rtl"
                            style={{
                              fontSize: "20px",
                              color: "var(--gold)",
                              marginTop: "8px",
                            }}
                          >
                            {hijriResult.hijri.monthAr}
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          marginTop: "16px",
                          fontSize: "12px",
                          color: "var(--muted)",
                        }}
                      >
                        Designation: {hijriResult.hijri.designation}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Husna Panel */}
            {activeTab === "husna" && (
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    marginBottom: "24px",
                    gap: "20px",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div
                      className="font-urbanist"
                      style={{ fontSize: "20px", color: "var(--white)" }}
                    >
                      Asma Al Husna
                    </div>
                    <div
                      style={{
                        color: "var(--muted)",
                        fontSize: "13px",
                        marginTop: "4px",
                      }}
                    >
                      Explore each of the 99 beautiful names of Allah.
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: "11px",
                      background: "rgba(0,0,0,0.3)",
                      padding: "4px 10px",
                      borderRadius: "4px",
                      color: "var(--teal-light)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    GET /asmaAlHusna/&#123;number&#125;
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                    alignItems: "flex-end",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                    }}
                  >
                    <label
                      style={{
                        fontSize: "11px",
                        color: "var(--muted)",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      Name number (1–99)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={husnaNum}
                      onChange={(e) =>
                        setHusnaNum(parseInt(e.target.value) || 1)
                      }
                      style={{ ...inputStyle, minWidth: "100px" }}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor = "var(--gold)")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor = "var(--border)")
                      }
                    />
                  </div>
                  <button
                    onClick={fetchHusna}
                    disabled={loading}
                    style={{
                      ...buttonStyle,
                      opacity: loading ? 0.5 : 1,
                      cursor: loading ? "not-allowed" : "pointer",
                    }}
                    onMouseEnter={(e) => {
                      if (!loading)
                        e.currentTarget.style.background = "var(--gold-light)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "var(--gold)";
                    }}
                  >
                    Show Name
                  </button>
                  <button
                    onClick={() => {
                      setHusnaNum(Math.ceil(Math.random() * 99));
                      setTimeout(fetchHusna, 0);
                    }}
                    disabled={loading}
                    style={{
                      ...buttonStyle,
                      background: "var(--teal)",
                      opacity: loading ? 0.5 : 1,
                      cursor: loading ? "not-allowed" : "pointer",
                    }}
                    onMouseEnter={(e) => {
                      if (!loading)
                        e.currentTarget.style.background = "var(--teal-light)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "var(--teal)";
                    }}
                  >
                    Random ↻
                  </button>
                </div>

                <div style={resultBoxStyle}>
                  {loading && (
                    <div
                      className="animate-pulse-soft"
                      style={{
                        color: "var(--gold)",
                        fontSize: "13px",
                        textAlign: "center",
                        padding: "16px 0",
                      }}
                    >
                      Fetching live data…
                    </div>
                  )}
                  {error && (
                    <div
                      style={{
                        color: "#f87171",
                        fontSize: "14px",
                        textAlign: "center",
                        padding: "16px 0",
                      }}
                    >
                      ⚠ {error}
                    </div>
                  )}
                  {!loading && !error && !husnaResult && (
                    <div
                      style={{
                        color: "var(--muted)",
                        fontSize: "14px",
                        textAlign: "center",
                        padding: "16px 0",
                      }}
                    >
                      Choose a number and click Show Name ↑
                    </div>
                  )}
                  {!loading && !error && husnaResult && (
                    <div style={{ textAlign: "center", padding: "16px" }}>
                      <div
                        style={{
                          display: "inline-block",
                          background: "var(--gold-dim)",
                          color: "var(--gold)",
                          fontSize: "11px",
                          padding: "3px 10px",
                          borderRadius: "20px",
                          marginBottom: "16px",
                        }}
                      >
                        Name {husnaResult.number} of 99
                      </div>
                      <div
                        className="font-amiri"
                        dir="rtl"
                        style={{
                          fontSize: "52px",
                          color: "var(--gold)",
                          marginBottom: "12px",
                        }}
                      >
                        {husnaResult.name}
                      </div>
                      <div
                        style={{
                          fontSize: "22px",
                          color: "var(--white)",
                          marginBottom: "6px",
                        }}
                      >
                        {husnaResult.transliteration}
                      </div>
                      <div
                        style={{ fontSize: "15px", color: "var(--muted)" }}
                      >
                        {husnaResult.en.meaning}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Ayah Panel */}
            {activeTab === "ayah" && (
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    marginBottom: "24px",
                    gap: "20px",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div
                      className="font-urbanist"
                      style={{ fontSize: "20px", color: "var(--white)" }}
                    >
                      Random Ayah
                    </div>
                    <div
                      style={{
                        color: "var(--muted)",
                        fontSize: "13px",
                        marginTop: "4px",
                      }}
                    >
                      A verse from the Quran, drawn randomly — with Arabic text
                      and English translation.
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: "11px",
                      background: "rgba(0,0,0,0.3)",
                      padding: "4px 10px",
                      borderRadius: "4px",
                      color: "var(--teal-light)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    GET /ayah/random/editions/&#123;editions&#125;
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                    alignItems: "flex-end",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                    }}
                  >
                    <label
                      style={{
                        fontSize: "11px",
                        color: "var(--muted)",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      Translation
                    </label>
                    <select
                      value={ayahEdition}
                      onChange={(e) => setAyahEdition(e.target.value)}
                      style={inputStyle}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor = "var(--gold)")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor = "var(--border)")
                      }
                    >
                      <option value="en.sahih">
                        Sahih International (English)
                      </option>
                      <option value="en.pickthall">Pickthall (English)</option>
                      <option value="fr.hamidullah">Hamidullah (French)</option>
                      <option value="tr.diyanet">Diyanet (Turkish)</option>
                    </select>
                  </div>
                  <button
                    onClick={fetchAyah}
                    disabled={loading}
                    style={{
                      ...buttonStyle,
                      opacity: loading ? 0.5 : 1,
                      cursor: loading ? "not-allowed" : "pointer",
                    }}
                    onMouseEnter={(e) => {
                      if (!loading)
                        e.currentTarget.style.background = "var(--gold-light)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "var(--gold)";
                    }}
                  >
                    Draw Ayah ↻
                  </button>
                </div>

                <div style={resultBoxStyle}>
                  {loading && (
                    <div
                      className="animate-pulse-soft"
                      style={{
                        color: "var(--gold)",
                        fontSize: "13px",
                        textAlign: "center",
                        padding: "16px 0",
                      }}
                    >
                      Fetching live data…
                    </div>
                  )}
                  {error && (
                    <div
                      style={{
                        color: "#f87171",
                        fontSize: "14px",
                        textAlign: "center",
                        padding: "16px 0",
                      }}
                    >
                      ⚠ {error}
                    </div>
                  )}
                  {!loading && !error && !ayahResult && (
                    <div
                      style={{
                        color: "var(--muted)",
                        fontSize: "14px",
                        textAlign: "center",
                        padding: "16px 0",
                      }}
                    >
                      Click &quot;Draw Ayah&quot; to receive a verse ↑
                    </div>
                  )}
                  {!loading && !error && ayahResult && (
                    <div style={{ padding: "8px" }}>
                      <div
                        className="font-amiri"
                        dir="rtl"
                        style={{
                          fontSize: "28px",
                          color: "var(--gold-light)",
                          lineHeight: 1.8,
                          textAlign: "right",
                          marginBottom: "20px",
                          paddingBottom: "20px",
                          borderBottom: "1px solid var(--border)",
                        }}
                      >
                        {ayahResult.arabic.text}
                      </div>
                      <div
                        style={{
                          fontSize: "15px",
                          color: "var(--text)",
                          lineHeight: 1.8,
                          marginBottom: "16px",
                          fontStyle: "italic",
                        }}
                      >
                        &quot;{ayahResult.translation.text}&quot;
                      </div>
                      <div
                        style={{ fontSize: "12px", color: "var(--muted)" }}
                      >
                        Surah {ayahResult.arabic.surah.englishName} (
                        {ayahResult.arabic.surah.name}) · Verse{" "}
                        {ayahResult.arabic.numberInSurah} ·{" "}
                        {ayahResult.translation.edition.englishName}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
