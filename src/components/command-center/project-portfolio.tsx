import { ArrowUpRight, MapPin } from "lucide-react";

import { portfolioProjects, statusStyles } from "@/lib/command-center-data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CommandCenterSection } from "@/components/command-center/section";

export function ProjectPortfolio() {
  return (
    <CommandCenterSection aria-label="Project portfolio" delay={320}>
      <div className="space-y-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Project Portfolio
            </h2>
            <p className="mt-1.5 text-[13px] text-muted-foreground">
              Which projects need my attention?
            </p>
          </div>
          <button
            type="button"
            className="hidden items-center gap-1 text-[13px] text-muted-foreground transition-colors duration-200 hover:text-foreground sm:inline-flex"
          >
            View all
            <ArrowUpRight className="size-3.5" />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {portfolioProjects.map((project) => {
            const styles = statusStyles[project.status];

            return (
              <div
                key={project.name}
                className="rounded-2xl bg-white/[0.03] p-6 transition-all duration-200 hover:bg-white/[0.05]"
              >
                <div className="space-y-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <h3 className="text-base font-medium tracking-tight text-foreground">
                        {project.name}
                      </h3>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="size-3 shrink-0" />
                        {project.location}
                      </p>
                    </div>
                    <Badge variant="ghost" className={styles.badge}>
                      {project.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Health</p>
                      <p className="mt-1 text-xl font-semibold tracking-tight">
                        {project.health}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Progress</p>
                      <p className="mt-1 text-xl font-semibold tracking-tight">
                        {project.progress}%
                      </p>
                    </div>
                  </div>

                  <div className="h-1 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className={cn(
                        "h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out",
                        styles.bar
                      )}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Next Milestone
                    </p>
                    <p className="mt-1 text-sm text-foreground">
                      {project.nextMilestone}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Due {project.milestoneDate}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </CommandCenterSection>
  );
}
