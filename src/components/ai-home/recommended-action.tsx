import { ArrowRight, Clock, Target, Zap } from "lucide-react";

import { recommendedAction } from "@/lib/ai-home-data";
import { Button } from "@/components/ui/button";
import { PremiumSurface } from "@/components/ai-home/premium-surface";

export function RecommendedAction() {
  return (
    <section>
      <PremiumSurface
        glow
        className="overflow-hidden border-violet-500/20 bg-gradient-to-br from-violet-500/[0.08] via-card/90 to-indigo-500/[0.05]"
      >
        <div className="grid gap-8 p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
              <Zap className="size-3" />
              Recommended Action
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {recommendedAction.title}
              </h2>
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                {recommendedAction.context}
              </p>
            </div>

            <div className="flex flex-wrap gap-6">
              <div className="space-y-1">
                <p className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  <Target className="size-3" />
                  Potential Impact
                </p>
                <p className="text-lg font-semibold text-emerald-400">
                  {recommendedAction.impact}
                </p>
              </div>
              <div className="space-y-1">
                <p className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  <Clock className="size-3" />
                  Estimated Time
                </p>
                <p className="text-lg font-semibold text-foreground">
                  {recommendedAction.estimatedTime}
                </p>
              </div>
            </div>
          </div>

          <Button
            size="lg"
            className="h-14 w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 text-base font-medium text-white shadow-xl shadow-violet-500/25 hover:from-violet-500 hover:to-indigo-500 lg:w-auto"
          >
            Start Investigation
            <ArrowRight className="size-5" data-icon="inline-end" />
          </Button>
        </div>
      </PremiumSurface>
    </section>
  );
}
