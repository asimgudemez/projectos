import { Brain } from "lucide-react";

import { aiConfidence, riskPredictions } from "@/lib/command-center-data";
import { CommandCenterSection } from "@/components/command-center/section";
import { RiskGauge } from "@/components/command-center/risk-gauge";

export function PredictionCenter() {
  return (
    <CommandCenterSection aria-label="Prediction center" delay={480}>
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Prediction Center
          </h2>
          <p className="mt-1.5 text-[13px] text-muted-foreground">
            What risks lie ahead for my portfolio?
          </p>
        </div>

        <div className="rounded-3xl bg-white/[0.03] px-6 py-10 sm:px-10">
          <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-10">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-6">
              {riskPredictions.map((prediction, index) => (
                <RiskGauge
                  key={prediction.label}
                  label={prediction.label}
                  value={prediction.value}
                  color={prediction.color}
                  ringColor={prediction.ringColor}
                  size={96}
                  delay={560 + index * 60}
                />
              ))}
            </div>

            <div className="flex flex-col items-center justify-center px-2 text-center lg:min-w-[160px]">
              <Brain className="size-6 text-violet-400/70" />
              <p className="mt-4 text-[13px] text-muted-foreground">
                AI Confidence
              </p>
              <p className="mt-1 text-4xl font-semibold tracking-tight text-foreground">
                {aiConfidence}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </CommandCenterSection>
  );
}
