import { ArrowUpRight, MapPin } from "lucide-react";

import {
  portfolioProjects,
  statusStyles,
} from "@/lib/ai-home-data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { PremiumSurface } from "@/components/ai-home/premium-surface";

export function ProjectPortfolio() {
  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Project Portfolio
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Live health scores across active construction programs
          </p>
        </div>
        <button
          type="button"
          className="hidden items-center gap-1 text-sm font-medium text-violet-400 transition-colors hover:text-violet-300 sm:flex"
        >
          View all projects
          <ArrowUpRight className="size-4" />
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {portfolioProjects.map((project) => {
          const styles = statusStyles[project.status];

          return (
            <PremiumSurface
              key={project.name}
              className="group cursor-pointer p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-500/20 hover:shadow-[0_16px_48px_-16px_rgba(139,92,246,0.25)]"
            >
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <h3 className="text-lg font-semibold tracking-tight text-foreground">
                      {project.name}
                    </h3>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="size-3 shrink-0" />
                      {project.location}
                    </p>
                  </div>
                  <Badge variant="outline" className={styles.badge}>
                    {project.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Health
                    </p>
                    <p className="mt-1 text-2xl font-semibold tracking-tight">
                      {project.health}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Progress
                    </p>
                    <p className="mt-1 text-2xl font-semibold tracking-tight">
                      {project.progress}%
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Overall progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className={cn(
                        "h-full rounded-full bg-gradient-to-r transition-all duration-500",
                        styles.bar
                      )}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3">
                  <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                    Next Milestone
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {project.nextMilestone}
                  </p>
                  <p className="mt-0.5 text-xs text-violet-400/80">
                    Due {project.milestoneDate}
                  </p>
                </div>
              </div>
            </PremiumSurface>
          );
        })}
      </div>
    </section>
  );
}
