import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { Engine, GameGenre } from "../lib/types";

const GENRES: GameGenre[] = ["rpg", "action", "adventure", "simulation", "strategy"];
const PLATFORMS: Engine[] = ["unity", "unreal", "web"];
const MAX_LEN = 500;

export function InputStep({
  onSubmit,
  submitting,
  error,
}: {
  onSubmit: (idea: string, genre: GameGenre, platform: Engine) => void;
  submitting: boolean;
  error: string | null;
}) {
  const { t } = useTranslation();
  const [idea, setIdea] = useState("");
  const [genre, setGenre] = useState<GameGenre>("rpg");
  const [platform, setPlatform] = useState<Engine>("unity");

  const canSubmit = idea.trim().length >= 5 && !submitting;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit(idea.trim(), genre, platform);
  }

  return (
    <section className="mx-auto max-w-2xl px-4 pb-16 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-extrabold leading-tight sm:text-4xl">
          {t("hero.title1")} <span className="gradient-text">{t("hero.title2")}</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-aegis-muted sm:text-base">{t("hero.subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-5 sm:p-7">
        <h2 className="text-lg font-bold">{t("input.cardTitle")}</h2>
        <p className="mt-1 text-sm text-aegis-muted">{t("input.cardSubtitle")}</p>

        <label className="mt-5 block text-sm font-medium text-aegis-text" htmlFor="idea">
          {t("input.label")}
        </label>
        <div className="relative mt-2">
          <textarea
            id="idea"
            value={idea}
            maxLength={MAX_LEN}
            onChange={(e) => setIdea(e.target.value)}
            placeholder={t("input.placeholder") ?? undefined}
            rows={4}
            className="w-full resize-none rounded-xl border border-aegis-border bg-aegis-bg/60 p-3 text-sm text-aegis-text placeholder:text-aegis-muted/60 focus:border-aegis-violet"
          />
          <span className="pointer-events-none absolute bottom-2 right-3 text-xs text-aegis-muted">
            {idea.length}/{MAX_LEN}
          </span>
        </div>

        <fieldset className="mt-5">
          <legend className="text-sm font-medium text-aegis-text">{t("input.genre")}</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {GENRES.map((g) => (
              <button
                type="button"
                key={g}
                onClick={() => setGenre(g)}
                aria-pressed={genre === g}
                className={[
                  "rounded-lg border px-3 py-1.5 text-sm transition-colors",
                  genre === g
                    ? "border-aegis-violet bg-aegis-violet/15 text-white"
                    : "border-aegis-border text-aegis-muted hover:text-aegis-text",
                ].join(" ")}
              >
                {t(`input.genres.${g}`)}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-5">
          <legend className="text-sm font-medium text-aegis-text">{t("input.platform")}</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {PLATFORMS.map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => setPlatform(p)}
                aria-pressed={platform === p}
                className={[
                  "rounded-lg border px-3 py-1.5 text-sm transition-colors",
                  platform === p
                    ? "border-aegis-blue bg-aegis-blue/15 text-white"
                    : "border-aegis-border text-aegis-muted hover:text-aegis-text",
                ].join(" ")}
              >
                {t(`input.platforms.${p}`)}
              </button>
            ))}
          </div>
        </fieldset>

        {error && (
          <p role="alert" className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 p-2.5 text-sm text-red-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-6 w-full rounded-xl bg-aegis-gradient py-3 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? t("input.submitting") : t("input.submit")}
        </button>
        <p className="mt-2 text-center text-xs text-aegis-muted">{t("input.estimate")}</p>
      </form>
    </section>
  );
}
