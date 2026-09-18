import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import ko from "./locales/ko.json";
import zh from "./locales/zh.json";
import ja from "./locales/ja.json";

export const SUPPORTED_LOCALES = [
  { code: "en", label: "English" },
  { code: "ko", label: "한국어" },
  { code: "zh", label: "中文" },
  { code: "ja", label: "日本語" },
] as const;

export type LocaleCode = (typeof SUPPORTED_LOCALES)[number]["code"];

const STORAGE_KEY = "aegis-locale";

function detectInitialLocale(): LocaleCode {
  const saved = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
  if (saved && SUPPORTED_LOCALES.some((l) => l.code === saved)) return saved as LocaleCode;

  const browser = typeof navigator !== "undefined" ? navigator.language.slice(0, 2) : "en";
  if (SUPPORTED_LOCALES.some((l) => l.code === browser)) return browser as LocaleCode;
  return "en"; // English-first default
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ko: { translation: ko },
    zh: { translation: zh },
    ja: { translation: ja },
  },
  lng: detectInitialLocale(),
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export function setLocale(code: LocaleCode) {
  i18n.changeLanguage(code);
  window.localStorage.setItem(STORAGE_KEY, code);
  document.documentElement.lang = code;
}

export default i18n;
