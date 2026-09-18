import { useTranslation } from "react-i18next";

const ITEMS = ["governance", "multiEngine", "faster", "studios"] as const;

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-aegis-border">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-6 text-sm sm:grid-cols-4 sm:px-6">
        {ITEMS.map((key) => (
          <div key={key}>
            <div className="font-medium text-aegis-text">{t(`footer.${key}.title`)}</div>
            <div className="text-aegis-muted">{t(`footer.${key}.desc`)}</div>
          </div>
        ))}
      </div>
    </footer>
  );
}
