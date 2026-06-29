export const en = {
  // Navigation
  nav: {
    features: "Features",
    market: "Market",
    roadmap: "Roadmap",
    joinWaitlist: "Join Waitlist",
    demo: "Demo",
    tryIt: "Try it",
  },

  // Hero
  hero: {
    eyebrow: "Islamic Digital Platform",
    titleLine1: "Your faith.",
    titleLine2: "Digitized.",
    titleLine3: "Connected.",
    arabicText: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    description:
      "Know your next Salah before it arrives. Read the Quran in 40+ editions. Live by the Hijri calendar. Discover a new name of Allah every day.",
    cta: "Join Waitlist",
    ctaNote: "Early access · No spam",
  },

  // Stats
  stats: {
    muslimUsers: {
      num: "1.9B",
      label: "Muslim users worldwide",
    },
    halalEconomy: {
      num: "$2T",
      label: "Global halal economy",
    },
    wellnessMarket: {
      num: "$7.3B",
      label: "Spiritual wellness apps market by 2033",
    },
  },

  // Features
  features: {
    eyebrow: "What's Inside",
    title: "Six pillars. One app.",
    prayerTimes: {
      title: "Prayer Times",
      desc: "Accurate prayer schedules for any city in the world, updated in real-time. Countdown to the next Salah, customizable notification alerts.",
      api: "↳ Araby API · /prayer-times",
    },
    hijriCalendar: {
      title: "Hijri Calendar",
      desc: "Convert between Gregorian and Islamic dates. Track Ramadan, Eid, and all major Islamic holidays automatically.",
      api: "↳ Araby API · /hijri-calendar",
    },
    quranReader: {
      title: "Quran Reader",
      desc: "Full text of the Holy Quran with multiple editions, translations, search, and a random Ayah feature for daily reflection.",
      api: "↳ Araby API · /quran",
    },
    asmaAlHusna: {
      title: "Asma Al Husna",
      desc: "Explore all 99 Beautiful Names of Allah — in Arabic script, transliteration, and meaning. One name highlighted each day.",
      api: "↳ Araby API · /asma-al-husna",
    },
    halalFinder: {
      title: "Halal Restaurant Finder",
      desc: "Discover halal-certified restaurants and eateries near you. Filter by cuisine, rating, and certification standard — wherever you are in the world.",
      api: "↳ Araby API · /halal-places  · Coming soon",
    },
    arabicLearning: {
      title: "Learn Arabic",
      desc: "Interactive lessons built for beginners and intermediate learners — from the Arabic alphabet to Quranic vocabulary, with audio pronunciation guides.",
      api: "↳ Araby API · /arabic-learning  · Coming soon",
    },
  },

  // Try It (Live Demo)
  tryIt: {
    eyebrow: "Live Demo",
    title: "Try it right now",
    description: "Real data, real APIs — no signup needed.",
    tabs: {
      prayer: "Prayer Times",
      hijri: "Hijri Calendar",
      husna: "Asma Al Husna",
      ayah: "Random Ayah",
    },
    prayer: {
      title: "Prayer Times",
      desc: "Get accurate Salah schedule for any city worldwide.",
      country: "Country",
      city: "City",
      method: "Method",
      fetchTimes: "Fetch Times",
      loading: "Fetching live data…",
      emptyState: "Enter a city and click Fetch Times ↑",
      next: "Next",
    },
    hijri: {
      title: "Hijri Calendar",
      desc: "Convert any Gregorian date to the Islamic Hijri calendar.",
      date: "Date",
      convert: "Convert Date",
      emptyState: "Pick a date and click Convert ↑",
      gregorian: "Gregorian",
      hijriLabel: "Hijri · Islamic",
      designation: "Designation",
    },
    husna: {
      title: "Asma Al Husna",
      desc: "Explore each of the 99 beautiful names of Allah.",
      nameNumber: "Name number (1–99)",
      showName: "Show Name",
      random: "Random ↻",
      emptyState: "Choose a number and click Show Name ↑",
      nameOf: "Name {number} of 99",
    },
    ayah: {
      title: "Random Ayah",
      desc: "A verse from the Quran, drawn randomly — with Arabic text and English translation.",
      translation: "Translation",
      drawAyah: "Draw Ayah ↻",
      emptyState: 'Click "Draw Ayah" to receive a verse ↑',
      surah: "Surah",
      verse: "Verse",
    },
  },

  // Monetization
  monetization: {
    eyebrow: "How It Makes Money",
    title: "Three revenue streams, built for this community",
    stream1: {
      label: "Stream 01",
      title: "Freemium Subscriptions",
      desc: "Core features free forever. Premium tier unlocks ad-free experience, offline Quran audio, advanced prayer analytics, and widgets.",
      potential: "Est. $2–5/month per user · High retention",
    },
    stream2: {
      label: "Stream 02",
      title: "Ramadan Surge Revenue",
      desc: "Islamic app sessions spike 15% during Ramadan. Time-limited premium bundles, donation features, and sponsored charitable campaigns drive massive seasonal revenue.",
      potential: "$1.7B total app revenue in Ramadan 2025",
      badge: "Best fit",
    },
    stream3: {
      label: "Stream 03",
      title: "B2B API & White Label",
      desc: "License the platform to mosques, Islamic schools, and halal businesses. White-label versions for regional markets in MENA and Southeast Asia.",
      potential: "Higher margins · Recurring B2B contracts",
    },
  },

  // Market
  market: {
    eyebrow: "Market Opportunity",
    title: "Why now is the right time",
    stats: {
      downloads: {
        num: "62M+",
        label: "Downloads for Muslim Pro — built with zero marketing budget",
      },
      valuation: {
        num: "$300M",
        label: "Valuation of Wahed, a halal investment app",
      },
      population: {
        num: "2.2B",
        label: "Projected global Muslim population by 2030",
      },
      retention: {
        num: "Daily",
        label: "Users open Islamic apps multiple times a day — exceptional retention",
      },
    },
    textTitle: "Islamic apps monetize better than they look",
    textP1:
      "Muslim Pro generates 90% of its revenue from ads and 10% from subscriptions — even though the majority of its users are in developing markets. The gap between downloads and revenue is the opportunity.",
    textP2:
      "Users in the Arab Gulf, UK, and North America convert at much higher rates and pay far more per subscription than the global average.",
    highlight:
      "Key insight: Only 8.1% of Quran Majeed's revenue came from India and Pakistan — despite those countries accounting for 35.6% of downloads. Target the diaspora first.",
  },

  // Roadmap
  roadmap: {
    eyebrow: "Build Plan",
    title: "From MVP to ecosystem",
    phase1: {
      phase: "Phase 1",
      title: "Core Religious Tools",
      desc: "Launch with the four API-powered features: prayer times, Hijri calendar, Quran reader, Asma Al Husna. Nail the UX and localization for Arabic, English, and one regional language.",
      tags: ["Prayer Times API", "Hijri Calendar", "Quran API", "Al Husna API"],
    },
    phase2: {
      phase: "Phase 2",
      title: "Engagement & Retention",
      desc: "Add daily Ayah notifications, Tasbih counter, Dua library, and mosque locator. Introduce freemium tier. Run first Ramadan campaign.",
      tags: ["Notifications", "Offline mode", "Freemium"],
    },
    phase3: {
      phase: "Phase 3",
      title: "Community & Monetization",
      desc: "Open community features: Islamic Q&A, local events, halal directory. Launch B2B white-label offering for mosques and Islamic schools. Explore charity donation integration.",
      tags: ["Community", "B2B API", "Donations", "Marketplace"],
    },
  },

  // CTA
  cta: {
    arabic: "السلام عليكم",
    title: "Be first to know when we launch.",
    subtitle: "Join the waitlist. We'll reach out before public launch with early access.",
    emailPlaceholder: "your@email.com",
    feedbackPlaceholder: "Any thoughts or features you'd like? (optional)",
    button: "Join Waitlist",
    success: "✓ You're on the list! We'll be in touch.",
  },

  // Footer
  footer: {
    builtWith: "Built with AlAdhan & AlQuran Cloud APIs · 2026",
  },
};

export type Translations = typeof en;
