import { Brain, Sparkles } from "lucide-react";

import { aiConfidence, riskPredictions } from "@/lib/ai-home-data";
import { PremiumSurface } from "@/components/ai-home/premium-surface";
import { RiskGauge } from "@/components/ai-home/risk-gauge";

export function PredictionCenter() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Prediction Center
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          AI-calibrated risk forecasts across your portfolio
        </p>
      </div>

      <PremiumSurface glow glass className="overflow-hidden">
        <div className="relative p-8 sm:p-10">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-indigo-600/5 via-transparent to-violet-600/5" />

          <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              {riskPredictions.map((prediction) => (
                <RiskGauge
                  key={prediction.label}
                  label={prediction.label}
                  value={prediction.value}
                  color={prediction.color}
                  ringColor={prediction.ringColor}
                  size={110}
                />
              ))}
            </div>

            <div className="flex flex-col items-center justify-center rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-indigo-500/5 p-8 lg:min-w-[220px]">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-violet-500/20 ring-1 ring-violet-400/20">
                <Brain className="size-7 text-violet-300" />
              </div>
              <p className="mt-4 text-sm font-medium text-muted-foreground">
                AI Confidence
              </p>
              <p className="mt-1 text-5xl font-semibold tracking-tight text-foreground">
                {aiConfidence}%
              </p>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-violet-400/80">
                <Sparkles className="size-3" />
                Model v2.4 · 847 data points
              </p>
            </div>
          </div>
        </div>
      </PremiumSurface>
    </section>
  );
}
