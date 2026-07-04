import { Sparkles } from "lucide-react";

import type { ImportInsights } from "@/lib/import/types";
import { cn } from "@/lib/utils";

type ImportInsightsPanelProps = {
  insights: ImportInsights;
};

const categoryStyle = {
  delay: "border-rose-500/20 bg-rose-500/[0.04]",
  pending: "border-amber-500/20 bg-amber-500/[0.04]",
  material: "border-orange-500/20 bg-orange-500/[0.04]",
  follow_up: "border-violet-500/20 bg-violet-500/[0.04]",
};

export function ImportInsightsPanel({ insights }: ImportInsightsPanelProps) {
  return (
    <div className="rounded-xl bg-white/[0.025] ring-1 ring-white/[0.06]">
      <div className="border-b border-white/[0.06] px-4 py-4 lg:px-5">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-violet-400" />
          <h3 className="text-sm font-semibold text-foreground">AI import insights</h3>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Generated from imported technical deliverables data
        </p>
      </div>

      <div className="divide-y divide-white/[0.04]">
        {insights.items.map((item) => (
          <div key={item.id} className="px-4 py-4 lg:px-5">
            <div
              className={cn(
                "rounded-lg border px-4 py-3",
                categoryStyle[item.category]
              )}
            >
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-medium text-foreground">{item.title}</p>
                <span className="shrink-0 text-lg font-semibold tabular-nums">
                  {item.count}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.detail}
              </p>
              {item.references.length > 0 ? (
                <p className="mt-2 font-mono text-[11px] text-muted-foreground/80">
                  {item.references.join(" · ")}
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
