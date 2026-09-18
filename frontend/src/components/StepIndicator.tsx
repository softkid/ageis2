import { useTranslation } from "react-i18next";

export type WizardStep = "input" | "process" | "output";
const ORDER: WizardStep[] = ["input", "process", "output"];

export function StepIndicator({
  current,
  furthestReached,
  onJump,
}: {
  current: WizardStep;
  furthestReached: WizardStep;
  onJump: (step: WizardStep) => void;
}) {
  const { t } = useTranslation();
  const currentIdx = ORDER.indexOf(current);
  const furthestIdx = ORDER.indexOf(furthestReached);

  return (
    <ol className="mx-auto flex max-w-md items-center justify-center gap-2 px-4 py-6 sm:gap-4">
      {ORDER.map((step, idx) => {
        const isActive = step === current;
        const isDone = idx < currentIdx;
        const isReachable = idx <= furthestIdx;
        return (
          <li key={step} className="flex items-center gap-2 sm:gap-4">
            <button
              disabled={!isReachable}
              onClick={() => isReachable && onJump(step)}
              className={[
                "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-aegis-gradient text-white"
                  : isDone
                  ? "border border-aegis-violet/50 text-aegis-violet"
                  : "border border-aegis-border text-aegis-muted",
                isReachable ? "cursor-pointer" : "cursor-not-allowed opacity-60",
              ].join(" ")}
            >
              <span
                className={[
                  "flex h-5 w-5 items-center justify-center rounded-full text-xs",
                  isActive ? "bg-white/20" : "bg-aegis-panel",
                ].join(" ")}
              >
                {idx + 1}
              </span>
              {t(`steps.${step}`)}
            </button>
            {idx < ORDER.length - 1 && <span className="text-aegis-border">→</span>}
          </li>
        );
      })}
    </ol>
  );
}
