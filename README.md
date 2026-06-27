# أرابي · Araby

**Your Islamic Companion** — prayer times, Hijri calendar, Quran reader, and the 99 Names of Allah. Everything your faith needs, in one place.

---

## Features

- **Prayer Times** — Accurate Salah schedules for any city worldwide via `Araby API /prayer-times`
- **Hijri Calendar** — Gregorian ↔ Islamic date conversion via `Araby API /hijri-calendar`
- **Quran Reader** — Full Quran text with 40+ editions and translations via `Araby API /quran`
- **Asma Al Husna** — All 99 Beautiful Names of Allah in Arabic, transliteration & meaning via `Araby API /asma-al-husna`

## Tech Stack

- **Framework** — Next.js 16 (App Router, Turbopack)
- **Styling** — Tailwind CSS v4
- **Animations** — GSAP + ScrollTrigger
- **Fonts** — Urbanist (Latin UI), Cairo (Arabic UI), Amiri (Arabic scripture)
- **Backend** — Supabase
- **Deployment** — Vercel

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
├── components/
│   ├── Nav.tsx          # Fixed navigation bar
│   ├── Hero.tsx         # Hero section with Bismillah
│   ├── Stats.tsx        # Market statistics
│   ├── TryIt.tsx        # Live API demo (Prayer, Hijri, Husna, Ayah)
│   ├── Features.tsx     # Four pillars feature grid
│   ├── Monetization.tsx # Revenue stream cards
│   ├── Market.tsx       # Market opportunity section
│   ├── Roadmap.tsx      # Phase-based build plan
│   ├── CTA.tsx          # Waitlist signup
│   └── Footer.tsx       # Site footer
├── globals.css          # Tailwind v4 theme + font config
├── layout.tsx           # Root layout with local fonts
└── page.tsx             # Page composition
font/
├── Urbanist/            # Urbanist variable font (local)
└── Cairo/               # Cairo variable font (local)
docs/
├── arabic-countries.json  # Country codes with Arabic & English names
└── al-quran.yaml          # Quran reference data
```

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Deployment

Deploy instantly to Vercel — `vercel.json` is included. Push to GitHub and import the repository at [vercel.com/new](https://vercel.com/new).
