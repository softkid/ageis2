import { useTranslation } from "react-i18next";
import { SUPPORTED_LOCALES, setLocale, type LocaleCode } from "../i18n";

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  return (
    <label className="flex items-center gap-2 text-sm text-aegis-muted">
      <span className="hidden sm:inline">{t("common.language")}</span>
      <select
        aria-label={t("common.language")}
        value={i18n.language}
        onChange={(e) => setLocale(e.target.value as LocaleCode)}
        className="rounded-lg border border-aegis-border bg-aegis-panel px-2 py-1.5 text-sm text-aegis-text focus:border-aegis-violet"
      >
        {SUPPORTED_LOCALES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </label>
  );
}
