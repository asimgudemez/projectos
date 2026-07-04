import { ArrowRight } from "lucide-react";

import { recommendedAction } from "@/lib/command-center-data";
import { Button } from "@/components/ui/button";
import { CommandCenterSection } from "@/components/command-center/section";

export function RecommendedAction() {
  return (
    <CommandCenterSection aria-label="Recommended next action" delay={160}>
      <div className="rounded-3xl bg-white/[0.03] px-6 py-9 sm:px-10 sm:py-12">
        <p className="text-[13px] font-medium text-violet-400/90">
          Recommended Action
        </p>

        <h2 className="mt-3 text-[1.75rem] font-semibold leading-tight tracking-tight text-foreground">
          {recommendedAction.title}
        </h2>

        <div className="mt-8 grid gap-8 sm:grid-cols-2 sm:gap-12">
          <div className="space-y-1.5">
            <p className="text-[13px] text-muted-foreground">Potential Impact</p>
            <p className="text-[17px] leading-relaxed text-foreground">
              {recommendedAction.impact}
            </p>
          </div>
          <div className="space-y-1.5">
            <p className="text-[13px] text-muted-foreground">Estimated Time</p>
            <p className="text-[17px] leading-relaxed text-foreground">
              {recommendedAction.estimatedTime}
            </p>
          </div>
        </div>

        <div className="mt-10">
          <Button
            size="lg"
            className="h-12 rounded-full bg-violet-600 px-8 text-[15px] font-medium text-white transition-all duration-200 hover:bg-violet-500 hover:shadow-[0_8px_24px_-8px_rgba(139,92,246,0.55)]"
          >
            Start Investigation
            <ArrowRight className="size-4" data-icon="inline-end" />
          </Button>
        </div>
      </div>
    </CommandCenterSection>
  );
}
