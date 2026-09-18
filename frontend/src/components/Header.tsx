import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { GoogleLoginButton } from "./GoogleLoginButton";

export function Header() {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-20 border-b border-aegis-border bg-aegis-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden>
            <path d="M16 3 29 27H3L16 3Z" fill="url(#g)" />
            <path d="M16 12 22.5 24h-13L16 12Z" fill="#0a0e1a" />
            <defs>
              <linearGradient id="g" x1="3" y1="3" x2="29" y2="27">
                <stop stopColor="#7c5cff" />
                <stop offset="1" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
          </svg>
          <div className="min-w-0">
            <div className="truncate text-base font-bold leading-tight">{t("app.name")}</div>
            <div className="hidden truncate text-xs text-aegis-muted sm:block">{t("app.tagline")}</div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <LanguageSwitcher />
          <GoogleLoginButton />
        </div>
      </div>
    </header>
  );
}
