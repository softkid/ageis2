import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { GenerateJob } from "../lib/types";

const STAGE_ORDER = ["story", "characters", "quests", "assets", "code"] as const;

function StatusBadge({ status }: { status: "pending" | "running" | "completed" }) {
  const { t } = useTranslation();
  const styles = {
    pending: "border-aegis-border text-aegis-muted",
    running: "border-aegis-blue/50 bg-aegis-blue/10 text-aegis-blue",
    completed: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
  } as const;
  return (
    <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}>
      {t(`process.status.${status}`)}
    </span>
  );
}

function GovernanceBadge({ status }: { status: "pass" | "warn" | "fail" }) {
  const { t } = useTranslation();
  const styles = {
    pass: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
    warn: "border-amber-500/40 bg-amber-500/10 text-amber-400",
    fail: "border-red-500/40 bg-red-500/10 text-red-400",
  } as const;
  return (
    <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles[status]}`}>
      {t(`process.governance.status.${status}`)}
    </span>
  );
}

export function ProcessStep({ job, onViewOutput }: { job: GenerateJob; onViewOutput: () => void }) {
  const { t } = useTranslation();
  const [revealed, setRevealed] = useState(0); // how many stages fully completed
  const [showGovernance, setShowGovernance] = useState(false);

  useEffect(() => {
    setRevealed(0);
    setShowGovernance(false);
    let cancelled = false;
    let elapsed = 0;

    const timers: ReturnType<typeof setTimeout>[] = [];
    job.stages.forEach((stage, idx) => {
      const stepMs = Math.min(stage.durationMs, 1400) * 0.5 + 350;
      elapsed += stepMs;
      timers.push(
        setTimeout(() => {
          if (!cancelled) setRevealed(idx + 1);
        }, elapsed)
      );
    });
    timers.push(
      setTimeout(() => {
        if (!cancelled) setShowGovernance(true);
      }, elapsed + 400)
    );

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [job.id]);

  const orderedStages = STAGE_ORDER.map((key) => job.stages.find((s) => s.key === key)).filter(
    (s): s is (typeof job.stages)[number] => Boolean(s)
  );

  return (
    <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-extrabold sm:text-2xl">{t("process.title")}</h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-aegis-muted">{t("process.subtitle")}</p>
      </div>

      <ol className="card divide-y divide-aegis-border">
        {orderedStages.map((stage, idx) => {
          const status = idx < revealed ? "completed" : idx === revealed ? "running" : "pending";
          return (
            <li key={stage.key} className="flex items-start gap-3 p-4 sm:p-5">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-aegis-gradient text-xs font-bold text-white">
                {idx + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold">{t(`process.stage.${stage.key}.title`)}</h3>
                  <StatusBadge status={status} />
                </div>
                <p className="mt-0.5 text-sm text-aegis-muted">{t(`process.stage.${stage.key}.desc`)}</p>
                {status === "completed" && (
                  <p className="mt-1.5 truncate text-xs text-aegis-text/80">{stage.summary}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <div
        className={[
          "card mt-6 p-4 transition-opacity duration-500 sm:p-5",
          showGovernance ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
        aria-hidden={!showGovernance}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-bold">{t("process.governance.title")}</h3>
          <span
            className={
              job.governancePassed
                ? "rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400"
                : "rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400"
            }
          >
            {job.governancePassed ? t("process.governance.allPassed") : t("process.governance.reviewRecommended")}
          </span>
        </div>
        <p className="mt-1 text-sm text-aegis-muted">{t("process.governance.subtitle")}</p>
        <ul className="mt-3 space-y-2">
          {job.governance.map((check) => (
            <li key={check.key} className="flex items-start justify-between gap-3 rounded-lg border border-aegis-border p-3">
              <div className="min-w-0">
                <div className="text-sm font-medium">{t(`process.governance.check.${check.key}`)}</div>
                <div className="mt-0.5 text-xs text-aegis-muted">{check.detail}</div>
              </div>
              <GovernanceBadge status={check.status} />
            </li>
          ))}
        </ul>

        <button
          onClick={onViewOutput}
          className="mt-5 w-full rounded-xl bg-aegis-gradient py-3 text-sm font-semibold text-white sm:w-auto sm:px-8"
        >
          {t("process.viewOutput")}
        </button>
      </div>
    </section>
  );
}
