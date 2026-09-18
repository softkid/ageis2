import { useTranslation } from "react-i18next";
import type { Engine, GenerateJob } from "../lib/types";
import { packageDownloadUrl } from "../lib/api";

const ENGINES: Engine[] = ["unity", "unreal", "web"];

function ENGINE_LABEL(t: (k: string) => string, e: Engine) {
  return t(`input.platforms.${e}`);
}

export function OutputStep({ job, onStartOver }: { job: GenerateJob; onStartOver: () => void }) {
  const { t } = useTranslation();
  const storyFile = job.stages.find((s) => s.key === "story")?.files.find((f) => f.path.endsWith("premise.md"));
  const allFiles = job.stages.flatMap((s) => s.files);

  return (
    <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-2xl">
          ✅
        </div>
        <h2 className="text-2xl font-extrabold sm:text-3xl">{t("output.ready")}</h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-aegis-muted">{t("output.subtitle")}</p>
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-aegis-border bg-gradient-to-r from-aegis-violet/10 via-aegis-blue/10 to-aegis-cyan/10 p-5">
          <h3 className="text-lg font-bold">{job.title}</h3>
          <p className="mt-1 text-sm text-aegis-muted">{job.tagline}</p>
        </div>

        {storyFile && (
          <div className="border-b border-aegis-border p-5">
            <h4 className="text-sm font-semibold text-aegis-text">{t("output.storyPreview")}</h4>
            <p className="mt-2 whitespace-pre-line text-sm text-aegis-muted">
              {storyFile.content.replace(/^#.*\n+/, "")}
            </p>
          </div>
        )}

        <div className="border-b border-aegis-border p-5">
          <h4 className="text-sm font-semibold text-aegis-text">
            {t("output.filesTitle")} ({allFiles.length})
          </h4>
          <ul className="mt-2 divide-y divide-aegis-border/60 text-sm">
            {allFiles.map((f) => (
              <li key={f.path} className="flex items-center justify-between gap-3 py-1.5">
                <code className="truncate text-aegis-text/90">{f.path}</code>
                <span className="shrink-0 text-xs text-aegis-muted">{(f.sizeBytes / 1024).toFixed(1)} KB</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-5">
          <h4 className="text-sm font-semibold text-aegis-text">{t("output.packageTitle")}</h4>
          <p className="mt-1 text-xs text-aegis-muted">{t("output.packageSubtitle")}</p>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {ENGINES.map((engine) => (
              <a
                key={engine}
                href={packageDownloadUrl(job.id, engine)}
                download
                className="flex items-center justify-between rounded-xl border border-aegis-border px-4 py-3 text-sm transition-colors hover:border-aegis-violet"
              >
                <span className="font-medium">{ENGINE_LABEL(t, engine)}</span>
                <span className="text-aegis-violet">{t("output.download")} ↓</span>
              </a>
            ))}
          </div>
          <p className="mt-3 text-xs text-aegis-muted">{t("output.contentLanguageNote")}</p>
        </div>
      </div>

      <button
        onClick={onStartOver}
        className="mx-auto mt-6 block rounded-xl border border-aegis-border px-6 py-2.5 text-sm text-aegis-muted hover:text-aegis-text"
      >
        {t("output.startOver")}
      </button>
    </section>
  );
}
