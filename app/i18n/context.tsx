"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { type Locale, defaultLocale, isRTL } from "./locales";
import { translations, type Translations } from "./translations";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
  isRTL: boolean;
  dir: "ltr" | "rtl";
  mounted: boolean;
}

const I18nContext = createContext<I18nContextType | null>(null);

const STORAGE_KEY = "araby-locale";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [mounted, setMounted] = useState(false);

  // Load saved locale on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved && translations[saved]) {
      setLocaleState(saved);
    }
    setMounted(true);
  }, []);

  // Update HTML attributes when locale changes
  useEffect(() => {
    if (!mounted) return;

    const dir = isRTL(locale) ? "rtl" : "ltr";
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, mounted]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(STORAGE_KEY, newLocale);
  }, []);

  const value: I18nContextType = {
    locale,
    setLocale,
    t: translations[locale],
    isRTL: isRTL(locale),
    dir: isRTL(locale) ? "rtl" : "ltr",
    mounted,
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

// Hook for translation function with interpolation
export function useTranslation() {
  const { t, locale, isRTL, dir, mounted } = useI18n();

  const interpolate = useCallback(
    (text: string, params: Record<string, string | number>) => {
      let result = text;
      Object.entries(params).forEach(([key, value]) => {
        result = result.replace(new RegExp(`\\{${key}\\}`, "g"), String(value));
      });
      return result;
    },
    []
  );

  return { t, locale, isRTL, dir, interpolate, mounted };
}
