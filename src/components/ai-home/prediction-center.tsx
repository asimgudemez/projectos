import { Brain } from "lucide-react";

import { aiConfidence, riskPredictions } from "@/lib/ai-home-data";
import { RiskGauge } from "@/components/ai-home/risk-gauge";

export function PredictionCenter() {
  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Prediction Center
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          AI-calibrated risk forecasts
        </p>
      </div>

      <div className="rounded-3xl bg-white/[0.025] p-8 sm:p-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {riskPredictions.map((prediction) => (
              <RiskGauge
                key={prediction.label}
                label={prediction.label}
                value={prediction.value}
                color={prediction.color}
                ringColor={prediction.ringColor}
                size={96}
              />
            ))}
          </div>

          <div className="flex flex-col items-center justify-center px-4 text-center lg:min-w-[180px]">
            <Brain className="size-6 text-violet-400/70" />
            <p className="mt-4 text-sm text-muted-foreground">AI Confidence</p>
            <p className="mt-1 text-4xl font-semibold tracking-tight text-foreground">
              {aiConfidence}%
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
