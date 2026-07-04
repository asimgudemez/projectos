import { cn } from "@/lib/utils";
import { heroKpis, type KpiMetric } from "@/lib/ai-home-data";
import { PremiumSurface } from "@/components/ai-home/premium-surface";
import { HardHat, TrendingDown, TrendingUp } from "lucide-react";

function TrendIndicator({
  direction,
}: {
  direction: KpiMetric["trendDirection"];
}) {
  if (direction === "up") {
    return <TrendingUp className="size-3" />;
  }
  if (direction === "down") {
    return <TrendingDown className="size-3" />;
  }
  return <HardHat className="size-3" />;
}

function KpiCard({ metric }: { metric: KpiMetric }) {

  return (
    <PremiumSurface
      className={cn(
        "group relative overflow-hidden p-6 transition-all duration-300",
        "hover:-translate-y-1 hover:border-violet-500/20 hover:shadow-[0_16px_48px_-16px_rgba(139,92,246,0.35)]"
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100",
          metric.accent
        )}
      />
      <div className="relative space-y-5">
        <div className="flex items-start justify-between">
          <div
            className={cn(
              "flex size-11 items-center justify-center rounded-xl bg-gradient-to-br ring-1 ring-white/10",
              metric.accent
            )}
          >
            <metric.icon className="size-5 text-white/90" />
          </div>
          <div
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium ring-1 ring-white/10",
              metric.trendDirection === "up" &&
                "bg-emerald-500/10 text-emerald-400",
              metric.trendDirection === "down" &&
                "bg-rose-500/10 text-rose-400",
              metric.trendDirection === "neutral" &&
                "bg-white/5 text-muted-foreground"
            )}
          >
            <TrendIndicator direction={metric.trendDirection} />
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {metric.label}
          </p>
          <p className="mt-1 text-4xl font-semibold tracking-tight text-foreground">
            {metric.value}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {metric.trend}
          </p>
        </div>
      </div>
    </PremiumSurface>
  );
}

export function HeroSection() {
  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm font-medium tracking-wide text-violet-400/80 uppercase">
          Construction Intelligence
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Good Evening, Asim 👋
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Your construction portfolio has been analyzed.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {heroKpis.map((metric) => (
          <KpiCard key={metric.label} metric={metric} />
        ))}
      </div>
    </section>
  );
}
