import { heroKpis } from "@/lib/ai-home-data";
import { cn } from "@/lib/utils";

export function PortfolioMetrics() {
  return (
    <section aria-label="Portfolio metrics">
      <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 sm:gap-x-10">
        {heroKpis.map((metric) => (
          <div key={metric.label} className="space-y-2">
            <p className="text-sm text-muted-foreground">{metric.label}</p>
            <p className="text-3xl font-semibold tracking-tight text-foreground">
              {metric.value}
            </p>
            <p
              className={cn(
                "text-xs leading-relaxed",
                metric.trendDirection === "up" && "text-emerald-400/80",
                metric.trendDirection === "down" && "text-muted-foreground",
                metric.trendDirection === "neutral" && "text-muted-foreground"
              )}
            >
              {metric.trend}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
