import { en, type Translations } from "./en";
import { ar } from "./ar";
import { fr } from "./fr";
import { tr } from "./tr";
import type { Locale } from "../locales";

export const translations: Record<Locale, Translations> = {
  en,
  ar,
  fr,
  tr,
};

export type { Translations };
