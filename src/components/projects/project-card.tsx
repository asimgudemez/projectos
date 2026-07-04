import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  Sparkles,
} from "lucide-react";

import {
  healthLabels,
  healthStyles,
  type Project,
} from "@/lib/projects-data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";

type ProjectCardProps = {
  project: Project;
};

function DataCell({
  label,
  value,
  className,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <p className="text-[10px] font-medium tracking-[0.06em] text-muted-foreground uppercase">
        {label}
      </p>
      <div className="mt-1 text-sm text-foreground">{value}</div>
    </div>
  );
}

export function ProjectCard({ project }: ProjectCardProps) {
  const styles = healthStyles[project.health];

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-xl bg-white/[0.025] ring-1 ring-white/[0.06]",
        "transition-colors duration-200 hover:bg-white/[0.035] hover:ring-white/[0.1]"
      )}
    >
      <div className="border-b border-white/[0.04] px-5 py-4 lg:px-6 lg:py-5">
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className={cn("mt-2 size-2 shrink-0 rounded-full", styles.dot)}
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  {project.name}
                </h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {project.client}
                </p>
              </div>
              <Badge variant="ghost" className={cn("shrink-0 text-xs", styles.text)}>
                {healthLabels[project.health]}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid flex-1 gap-4 px-5 py-4 sm:grid-cols-2 lg:grid-cols-4 lg:px-6 lg:py-5">
        <DataCell label="Country" value={project.country} />
        <DataCell label="Contract Value" value={project.contractValueLabel} />
        <DataCell
          label="Progress"
          value={
            <div className="space-y-2">
              <span className="font-medium tabular-nums">{project.progress}%</span>
              <div className="h-1 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className={cn("h-full rounded-full", styles.bar)}
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
          }
        />
        <DataCell
          label="Health"
          value={
            <span className={cn("font-medium tabular-nums", styles.text)}>
              {project.healthScore}%
            </span>
          }
        />
        <DataCell label="Risk" value={project.riskLevel} />
        <DataCell label="Phase" value={project.currentPhase} />
        <DataCell label="PM" value={project.projectManager} />
        <DataCell label="CM" value={project.constructionManager} />
      </div>

      <div className="mt-auto border-t border-white/[0.04] px-5 py-4 lg:px-6">
        <DataCell
          label="Next Milestone"
          value={
            <span className="text-sm leading-snug">
              {project.nextMilestone}
              <span className="text-muted-foreground">
                {" "}
                · {project.nextMilestoneDate}
              </span>
            </span>
          }
          className="mb-4"
        />

        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href={`/projects/${project.id}`}
            className={cn(
              buttonVariants({ size: "default" }),
              "h-9 flex-1 bg-violet-600 text-white hover:bg-violet-500"
            )}
          >
            Open Workspace
            <ArrowUpRight className="size-3.5" data-icon="inline-end" />
          </Link>
          <Button
            variant="outline"
            className="h-9 flex-1 border-white/[0.08] bg-transparent hover:bg-white/[0.04]"
          >
            <Sparkles className="size-3.5" data-icon="inline-start" />
            AI Summary
          </Button>
          <Button
            variant="outline"
            className="h-9 flex-1 border-white/[0.08] bg-transparent hover:bg-white/[0.04]"
          >
            <BarChart3 className="size-3.5" data-icon="inline-start" />
            Reports
          </Button>
        </div>
      </div>
    </article>
  );
}
