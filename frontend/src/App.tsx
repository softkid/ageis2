import { useState } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { StepIndicator, type WizardStep } from "./components/StepIndicator";
import { InputStep } from "./components/InputStep";
import { ProcessStep } from "./components/ProcessStep";
import { OutputStep } from "./components/OutputStep";
import { startGeneration, fetchJob } from "./lib/api";
import type { Engine, GameGenre, GenerateJob } from "./lib/types";

const STEP_ORDER: WizardStep[] = ["input", "process", "output"];

export default function App() {
  const [step, setStep] = useState<WizardStep>("input");
  const [furthest, setFurthest] = useState<WizardStep>("input");
  const [job, setJob] = useState<GenerateJob | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function goTo(next: WizardStep) {
    setStep(next);
    if (STEP_ORDER.indexOf(next) > STEP_ORDER.indexOf(furthest)) setFurthest(next);
  }

  async function handleGenerate(idea: string, genre: GameGenre, platform: Engine) {
    setSubmitting(true);
    setError(null);
    try {
      const { jobId } = await startGeneration({ idea, genre, platform });
      const fullJob = await fetchJob(jobId);
      setJob(fullJob);
      goTo("process");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleStartOver() {
    setJob(null);
    setStep("input");
    setFurthest("input");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <StepIndicator current={step} furthestReached={furthest} onJump={goTo} />

      <main className="flex-1">
        {step === "input" && <InputStep onSubmit={handleGenerate} submitting={submitting} error={error} />}
        {step === "process" && job && <ProcessStep job={job} onViewOutput={() => goTo("output")} />}
        {step === "output" && job && <OutputStep job={job} onStartOver={handleStartOver} />}
      </main>

      <Footer />
    </div>
  );
}
