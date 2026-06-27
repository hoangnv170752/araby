import { en, type Translations } from "./en";
import { ar } from "./ar";
import { fr } from "./fr";
import type { Locale } from "../locales";

export const translations: Record<Locale, Translations> = {
  en,
  ar,
  fr,
};

export type { Translations };
