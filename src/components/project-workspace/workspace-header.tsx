import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import {
  healthLabels,
  healthStyles,
} from "@/lib/projects-data";
import type { ProjectWorkspaceData } from "@/lib/project-workspace-data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

type ProjectWorkspaceHeaderProps = {
  workspace: ProjectWorkspaceData;
};

export function ProjectWorkspaceHeader({ workspace }: ProjectWorkspaceHeaderProps) {
  const { project } = workspace;
  const styles = healthStyles[project.health];

  const metrics = [
    {
      label: "Health",
      value: `${project.healthScore}%`,
      sub: healthLabels[project.health],
      accent: styles.text,
    },
    {
      label: "Progress",
      value: `${project.progress}%`,
      sub: project.currentPhase,
    },
    {
      label: "Budget",
      value: workspace.budgetLabel,
      sub: workspace.budgetVariance,
    },
    {
      label: "Delay",
      value: workspace.delayDays === 0 ? "0 days" : `${workspace.delayDays} days`,
      sub: workspace.delayLabel,
      accent: workspace.delayDays > 0 ? "text-rose-400" : "text-emerald-400",
    },
    {
      label: "Risk",
      value: project.riskLevel,
      sub: project.status,
      accent:
        project.riskLevel === "Critical" || project.riskLevel === "High"
          ? "text-amber-400"
          : undefined,
    },
  ];

  return (
    <header className="space-y-5 border-b border-white/[0.06] pb-6 lg:pb-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <Link
            href="/projects"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "-ml-2 h-8 text-muted-foreground hover:text-foreground"
            )}
          >
            <ArrowLeft className="size-3.5" data-icon="inline-start" />
            Projects
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground lg:text-3xl">
              {project.name}
            </h1>
            <Badge variant="ghost" className={cn("text-xs", styles.text)}>
              {healthLabels[project.health]}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground">
            {project.client} · {project.country} · {project.contractValueLabel}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl bg-white/[0.03] ring-1 ring-white/[0.06]">
        <div className="grid grid-cols-2 divide-x divide-y divide-white/[0.06] lg:flex lg:divide-y-0">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="min-w-0 flex-1 px-4 py-4 lg:px-6 lg:py-5"
            >
              <p className="text-[10px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
                {metric.label}
              </p>
              <p
                className={cn(
                  "mt-1 text-lg font-semibold tabular-nums tracking-tight text-foreground lg:text-xl",
                  metric.accent
                )}
              >
                {metric.value}
              </p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {metric.sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
