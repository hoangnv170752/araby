# Live Demo Features

The "Try It" section allows users to interact with real Islamic APIs without signing up. All data is fetched live from [AlAdhan API](https://aladhan.com/prayer-times-api).

## Available Demos

### 1. Prayer Times (Namaz Vakitleri)

Fetches accurate prayer schedules for any city worldwide.

**API Endpoint:** `GET /v1/timingsByCity/{date}`

**Features:**

- Select country and city from dropdown
- Choose calculation method (e.g., Umm Al-Qura, ISNA, MWL)
- Displays 7 prayer times:
  - Fajr
  - Sunrise
  - Dhuhr
  - Asr (Shafi'i) - Standard calculation
  - Asr (Hanafi) - Later time for Hanafi madhab
  - Maghrib
  - Isha
- **Next prayer indicator** - Highlights upcoming prayer
- **Countdown timer** - Live countdown to next prayer (updates every second)
- Shows location, Gregorian date, and Hijri date

**API Parameters:**

| Parameter   | Description                           |
| ----------- | ------------------------------------- |
| `city`    | City name (e.g., "Dubai", "Istanbul") |
| `country` | Country name (e.g., "UAE", "Turkey")  |
| `method`  | Calculation method (1-15)             |
| `school`  | 0 = Shafi'i, 1 = Hanafi               |

**Example Response:**

```json
{
  "timings": {
    "Fajr": "03:16",
    "Sunrise": "05:27",
    "Dhuhr": "12:59",
    "Asr": "16:45",
    "Maghrib": "20:31",
    "Isha": "22:01"
  }
}
```

---

### 2. Hijri Calendar

Converts Gregorian dates to Islamic Hijri calendar.

**API Endpoint:** `GET /v1/gToH/{date}`

**Features:**

- Date picker for Gregorian date input
- Displays both calendars side by side:
  - **Gregorian:** Day, month, year, weekday
  - **Hijri:** Day, month (Arabic + English), year, designation (AH)
- Shows Islamic month name in Arabic script

**Example Response:**

```json
{
  "gregorian": {
    "date": "27-06-2026",
    "day": "27",
    "month": { "en": "June" },
    "year": "2026",
    "weekday": { "en": "Saturday" }
  },
  "hijri": {
    "date": "12-01-1448",
    "day": "12",
    "month": { "en": "Muḥarram", "ar": "مُحَرَّم" },
    "year": "1448",
    "designation": { "abbreviated": "AH" }
  }
}
```

---

### 3. Asma Al Husna (99 Names of Allah)

Explore the 99 beautiful names of Allah.

**API Endpoint:** `GET /v1/asmaAlHusna/{number}`

**Features:**

- Input field for name number (1-99)
- "Show Name" button to fetch specific name
- "Random" button to get a random name
- Displays:
  - Arabic name (large, styled with Amiri font)
  - Transliteration (Latin script)
  - English meaning
- Audio playback for pronunciation

**Example Response:**

```json
{
  "number": 1,
  "name": "الرَّحْمَنُ",
  "transliteration": "Ar-Rahman",
  "en": {
    "meaning": "The Most Gracious"
  }
}
```

---

### 4. Random Ayah (Quran Verse)

Draw a random verse from the Holy Quran.

**API Endpoint:** `GET /v1/ayah/{reference}/editions/{editions}`

**Features:**

- Translation selector:
  - Sahih International (English)
  - Pickthall (English)
  - Hamidullah (French)
  - Diyanet (Turkish)
- "Draw Ayah" button fetches random verse
- Displays:
  - Arabic text (RTL, Amiri font)
  - Translation in selected language
  - Surah name (Arabic + English)
  - Verse number
- Audio playback for Ayah recitation

**Editions Available:**

| Code              | Language | Translator          |
| ----------------- | -------- | ------------------- |
| `en.sahih`      | English  | Sahih International |
| `en.pickthall`  | English  | Pickthall           |
| `fr.hamidullah` | French   | Hamidullah          |
| `tr.diyanet`    | Turkish  | Diyanet             |

**Example Response:**

```json
{
  "text": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
  "surah": {
    "name": "سُورَةُ الفَاتِحَة",
    "englishName": "Al-Fatiha"
  },
  "numberInSurah": 1
}
```

---

## UI Components

### Styling

All demo components use consistent styling:

```typescript
const inputStyle = {
  background: "rgba(0,0,0,0.3)",
  border: "1px solid var(--border)",
  color: "var(--text)",
  padding: "9px 14px",
  borderRadius: "6px",
  fontSize: "14px",
};

const buttonStyle = {
  background: "var(--gold)",
  color: "var(--night)",
  padding: "9px 22px",
  borderRadius: "6px",
  fontWeight: 600,
};

const resultBoxStyle = {
  background: "rgba(0,0,0,0.25)",
  border: "1px solid var(--border)",
  borderRadius: "10px",
  padding: "20px",
};
```

### States

Each demo handles these states:

- **Loading:** Pulsing animation with "Fetching live data…"
- **Error:** Red warning message with error details
- **Empty:** Instructional text guiding user action
- **Success:** Formatted results display

### Responsive Design

- Tab navigation collapses on mobile
- Grid layouts stack vertically
- Touch-friendly button sizes (min 44px)
- Reduced padding on smaller screens

---

## Internationalization

All demo text is translated in 4 languages:

| Key                   | EN             | AR                               | FR                | TR              |
| --------------------- | -------------- | -------------------------------- | ----------------- | --------------- |
| `tryIt.tabs.prayer` | Prayer Times   | مواقيت الصلاة        | Heures de Prière | Namaz Vakitleri |
| `tryIt.tabs.hijri`  | Hijri Calendar | التقويم الهجري      | Calendrier Hijri  | Hicri Takvim    |
| `tryIt.tabs.husna`  | Asma Al Husna  | أسماء الله الحسنى | Asma Al Husna     | Esmaü'l-Hüsna |
| `tryIt.tabs.ayah`   | Random Ayah    | آية عشوائية            | Ayah Aléatoire   | Rastgele Ayet   |

Translations located in:

- `app/i18n/translations/en.ts`
- `app/i18n/translations/ar.ts`
- `app/i18n/translations/fr.ts`
- `app/i18n/translations/tr.ts`

---

## File Structure

```
app/
├── components/
│   └── TryIt.tsx          # Main demo component
├── data/
│   └── cities.ts          # Country/city dropdown data
└── i18n/
    └── translations/      # Multi-language support
```

## External APIs Used

| API           | Base URL                         | Documentation                                                     |
| ------------- | -------------------------------- | ----------------------------------------------------------------- |
| AlAdhan       | `https://api.aladhan.com/v1`   | [aladhan.com/prayer-times-api](https://aladhan.com/prayer-times-api) |
| AlQuran Cloud | `https://api.alquran.cloud/v1` | [alquran.cloud/api](https://alquran.cloud/api)                       |
