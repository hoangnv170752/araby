"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { COUNTRIES } from "../data/cities";
import { useTranslation } from "../i18n";

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
  const { t, dir } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<TabName>("prayer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prayer state
  const [prayerCountryCode, setPrayerCountryCode] = useState("AE");
  const [prayerCity, setPrayerCity] = useState("Dubai");
  const prayerCountryEntry = COUNTRIES.find((c) => c.code === prayerCountryCode) ?? COUNTRIES[0];
  const prayerCountry = prayerCountryEntry.nameEn;
  const [prayerMethod, setPrayerMethod] = useState("4");
  const [prayerResult, setPrayerResult] = useState<{
    prayers: PrayerTime[];
    meta: { city: string; country: string; readable: string; hijri: string };
    nextIdx: number;
  } | null>(null);
  const [countdown, setCountdown] = useState<string>("");

  // Hijri state - initialize with current date on client
  const [hijriDate, setHijriDate] = useState(() => {
    if (typeof window !== "undefined") {
      return new Date().toISOString().split("T")[0];
    }
    return "";
  });
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
  const [ayahAudioUrl, setAyahAudioUrl] = useState<string | null>(null);
  const [ayahPlaying, setAyahPlaying] = useState(false);
  const ayahAudioRef = useRef<HTMLAudioElement | null>(null);

  // Husna audio state (Web Speech API)
  const [husnaSpeaking, setHusnaSpeaking] = useState(false);

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

  // Countdown timer for next prayer
  useEffect(() => {
    if (!prayerResult || prayerResult.nextIdx === -1) {
      return;
    }

    const updateCountdown = () => {
      const nextPrayer = prayerResult.prayers[prayerResult.nextIdx];
      if (!nextPrayer) return;

      const [h, m] = nextPrayer.time.split(":").map(Number);
      const now = new Date();
      const prayerTime = new Date();
      prayerTime.setHours(h, m, 0, 0);

      const diff = prayerTime.getTime() - now.getTime();
      if (diff <= 0) {
        setCountdown("");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      if (hours > 0) {
        setCountdown(`${hours}h ${mins}m ${secs}s`);
      } else if (mins > 0) {
        setCountdown(`${mins}m ${secs}s`);
      } else {
        setCountdown(`${secs}s`);
      }
    };

    // Use setTimeout for initial call to avoid synchronous setState
    const initialTimeout = setTimeout(updateCountdown, 0);
    const interval = setInterval(updateCountdown, 1000);
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [prayerResult]);

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

      const time = data.data.timings;
      const date = data.data.date;
      const prayers = [
        { name: "Fajr", time: time.Fajr },
        { name: "Sunrise", time: time.Sunrise },
        { name: "Dhuhr", time: time.Dhuhr },
        { name: "Asr (Shafi)", time: time.Asr },
        { name: "Asr (Hanafi)", time: time.Asr },  // Will be updated below
        { name: "Maghrib", time: time.Maghrib },
        { name: "Isha", time: time.Isha },
      ];

      // Fetch Hanafi Asr time separately (school=1 for Hanafi)
      const hanafiFetch = await fetch(`https://api.aladhan.com/v1/timingsByCity/${d}?city=${encodeURIComponent(prayerCity)}&country=${encodeURIComponent(prayerCountry)}&method=${prayerMethod}&school=1`);
      const hanafiData = await hanafiFetch.json();
      if (hanafiData.code === 200) {
        prayers[4] = { name: "Asr (Hanafi)", time: hanafiData.data.timings.Asr };
      }

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
    setAyahAudioUrl(null);
    setAyahPlaying(false);
    try {
      const [textRes] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/ayah/random/editions/quran-uthmani,${ayahEdition}`),
      ]);
      const textData = await textRes.json();
      if (textData.code !== 200) throw new Error(textData.status);
      const [arabic, trans] = textData.data;
      setAyahResult({ arabic, translation: trans });

      // Fetch audio for the same ayah number
      const ayahNum = arabic.number;
      const audioData = await (await fetch(`https://api.alquran.cloud/v1/ayah/${ayahNum}/ar.alafasy`)).json();
      if (audioData.code === 200 && audioData.data.audio) {
        setAyahAudioUrl(audioData.data.audio);
      }
    } catch (e) {
      setError(`Could not fetch Ayah. ${e}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleAyahAudio = () => {
    const audio = ayahAudioRef.current;
    if (!audio || !ayahAudioUrl) return;
    if (ayahPlaying) {
      audio.pause();
      setAyahPlaying(false);
    } else {
      audio.play();
      setAyahPlaying(true);
    }
  };

  const speakHusna = (text: string) => {
    if (!window.speechSynthesis) return;
    if (husnaSpeaking) {
      window.speechSynthesis.cancel();
      setHusnaSpeaking(false);
      return;
    }
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = "ar-SA";
    utt.rate = 0.8;
    utt.onend = () => setHusnaSpeaking(false);
    setHusnaSpeaking(true);
    window.speechSynthesis.speak(utt);
  };

  const tabs: { name: TabName; icon: string; label: string }[] = [
    { name: "prayer", icon: "🕌", label: t.tryIt.tabs.prayer },
    { name: "hijri", icon: "🌙", label: t.tryIt.tabs.hijri },
    { name: "husna", icon: "✨", label: t.tryIt.tabs.husna },
    { name: "ayah", icon: "📖", label: t.tryIt.tabs.ayah },
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
      dir={dir}
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
            {t.tryIt.eyebrow}
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
            {t.tryIt.title}
          </h2>
          <p
            className="section-desc"
            style={{
              color: "var(--muted)",
              fontSize: "15px",
              marginBottom: "48px",
            }}
          >
            {t.tryIt.description}
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
                      {t.tryIt.prayer.title}
                    </div>
                    <div
                      style={{
                        color: "var(--muted)",
                        fontSize: "13px",
                        marginTop: "4px",
                      }}
                    >
                      {t.tryIt.prayer.desc}
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
                      {t.tryIt.prayer.country}
                    </label>
                    <select
                      value={prayerCountryCode}
                      onChange={(e) => {
                        const code = e.target.value;
                        setPrayerCountryCode(code);
                        const entry = COUNTRIES.find((c) => c.code === code);
                        if (entry) setPrayerCity(entry.cities[0]);
                      }}
                      style={{ ...inputStyle, minWidth: "180px" }}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor = "var(--gold)")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor = "var(--border)")
                      }
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.nameEn}
                        </option>
                      ))}
                    </select>
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
                      {t.tryIt.prayer.city}
                    </label>
                    <select
                      value={prayerCity}
                      onChange={(e) => setPrayerCity(e.target.value)}
                      style={{ ...inputStyle, minWidth: "160px" }}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor = "var(--gold)")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor = "var(--border)")
                      }
                    >
                      {prayerCountryEntry.cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
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
                      {t.tryIt.prayer.method}
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
                    {t.tryIt.prayer.fetchTimes}
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
                      {t.tryIt.prayer.loading}
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
                      {t.tryIt.prayer.emptyState}
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
                              {i === prayerResult.nextIdx && ` · ${t.tryIt.prayer.next}`}
                            </div>
                            <div
                              className="font-urbanist"
                              style={{ fontSize: "22px", color: "var(--gold)" }}
                            >
                              {p.time}
                            </div>
                            {i === prayerResult.nextIdx && countdown && (
                              <div
                                style={{
                                  marginTop: "8px",
                                  fontSize: "12px",
                                  color: "var(--teal-light)",
                                  fontFamily: "monospace",
                                }}
                              >
                                ⏱ {countdown}
                              </div>
                            )}
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
                      {t.tryIt.hijri.title}
                    </div>
                    <div
                      style={{
                        color: "var(--muted)",
                        fontSize: "13px",
                        marginTop: "4px",
                      }}
                    >
                      {t.tryIt.hijri.desc}
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
                      {t.tryIt.hijri.date}
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
                    {t.tryIt.hijri.convert}
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
                      {t.tryIt.prayer.loading}
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
                      {t.tryIt.hijri.emptyState}
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
                            {t.tryIt.hijri.gregorian}
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
                            {t.tryIt.hijri.hijriLabel}
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
                        {t.tryIt.hijri.designation}: {hijriResult.hijri.designation}
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
                      {t.tryIt.husna.title}
                    </div>
                    <div
                      style={{
                        color: "var(--muted)",
                        fontSize: "13px",
                        marginTop: "4px",
                      }}
                    >
                      {t.tryIt.husna.desc}
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
                      {t.tryIt.husna.nameNumber}
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
                    {t.tryIt.husna.showName}
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
                    {t.tryIt.husna.random}
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
                      {t.tryIt.prayer.loading}
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
                      {t.tryIt.husna.emptyState}
                    </div>
                  )}
                  {!loading && !error && husnaResult && (
                    <div style={{ textAlign: "center", padding: "16px" }}>
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
                        style={{ fontSize: "15px", color: "var(--muted)", marginBottom: "16px" }}
                      >
                        {husnaResult.en.meaning}
                      </div>
                      <button
                        onClick={() => speakHusna(husnaResult.name)}
                        style={{
                          background: husnaSpeaking ? "var(--teal)" : "var(--gold-dim)",
                          border: `1px solid ${husnaSpeaking ? "var(--teal-light)" : "rgba(201,168,76,0.3)"}`,
                          color: husnaSpeaking ? "var(--white)" : "var(--gold)",
                          borderRadius: "20px",
                          padding: "6px 18px",
                          fontSize: "13px",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        {husnaSpeaking ? "⏹ Stop" : "🔊 Listen"}
                      </button>
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
                      {t.tryIt.ayah.title}
                    </div>
                    <div
                      style={{
                        color: "var(--muted)",
                        fontSize: "13px",
                        marginTop: "4px",
                      }}
                    >
                      {t.tryIt.ayah.desc}
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
                      {t.tryIt.ayah.translation}
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
                    {t.tryIt.ayah.drawAyah}
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
                      {t.tryIt.prayer.loading}
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
                      {t.tryIt.ayah.emptyState}
                    </div>
                  )}
                  {ayahAudioUrl && (
                    <audio
                      ref={ayahAudioRef}
                      src={ayahAudioUrl}
                      onEnded={() => setAyahPlaying(false)}
                      style={{ display: "none" }}
                    />
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
                        style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "16px" }}
                      >
                        {t.tryIt.ayah.surah} {ayahResult.arabic.surah.englishName} (
                        {ayahResult.arabic.surah.name}) · {t.tryIt.ayah.verse}{" "}
                        {ayahResult.arabic.numberInSurah} ·{" "}
                        {ayahResult.translation.edition.englishName}
                      </div>
                      {ayahAudioUrl && (
                        <button
                          onClick={toggleAyahAudio}
                          style={{
                            background: ayahPlaying ? "var(--teal)" : "var(--gold-dim)",
                            border: `1px solid ${ayahPlaying ? "var(--teal-light)" : "rgba(201,168,76,0.3)"}`,
                            color: ayahPlaying ? "var(--white)" : "var(--gold)",
                            borderRadius: "20px",
                            padding: "6px 18px",
                            fontSize: "13px",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          {ayahPlaying ? "⏸ Pause" : "▶ Play Recitation"}
                        </button>
                      )}
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
