import { ArrowRight } from "lucide-react";

import { recommendedAction } from "@/lib/ai-home-data";
import { Button } from "@/components/ui/button";

export function RecommendedAction() {
  return (
    <section className="rounded-3xl bg-white/[0.025] px-8 py-10 sm:px-12 sm:py-12">
      <p className="text-sm font-medium text-violet-400/90">
        Recommended Action
      </p>

      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-[1.75rem]">
        {recommendedAction.title}
      </h2>

      <div className="mt-8 grid gap-8 sm:grid-cols-2 sm:gap-12">
        <div className="space-y-1.5">
          <p className="text-sm text-muted-foreground">Potential Impact</p>
          <p className="text-[17px] leading-relaxed text-foreground">
            {recommendedAction.impact}
          </p>
        </div>
        <div className="space-y-1.5">
          <p className="text-sm text-muted-foreground">Estimated Time</p>
          <p className="text-[17px] leading-relaxed text-foreground">
            {recommendedAction.estimatedTime}
          </p>
        </div>
      </div>

      <div className="mt-10">
        <Button
          size="lg"
          className="h-12 rounded-full bg-violet-600 px-8 text-[15px] font-medium text-white hover:bg-violet-500"
        >
          Start Investigation
          <ArrowRight className="size-4" data-icon="inline-end" />
        </Button>
      </div>
    </section>
  );
}
