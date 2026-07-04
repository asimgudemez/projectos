import { portfolioMetrics } from "@/lib/command-center-data";
import { cn } from "@/lib/utils";
import { CommandCenterSection } from "@/components/command-center/section";

export function MetricsRow() {
  return (
    <CommandCenterSection aria-label="Portfolio metrics" delay={80}>
      <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 sm:gap-x-6">
        {portfolioMetrics.map((metric) => (
          <div key={metric.label} className="space-y-2">
            <p className="text-[13px] text-muted-foreground">{metric.label}</p>
            <p className="text-[2rem] font-semibold leading-none tracking-tight text-foreground">
              {metric.value}
            </p>
            <p
              className={cn(
                "text-xs leading-relaxed text-muted-foreground",
                metric.trendDirection === "up" && "text-emerald-400/90"
              )}
            >
              {metric.trend}
            </p>
          </div>
        ))}
      </div>
    </CommandCenterSection>
  );
}
