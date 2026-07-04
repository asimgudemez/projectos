import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  Calendar,
  MapPin,
  Sparkles,
  User,
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

function MetaField({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="flex items-center gap-1.5 text-sm text-foreground">
        {Icon ? <Icon className="size-3 shrink-0 text-muted-foreground" /> : null}
        <span className="truncate">{value}</span>
      </p>
    </div>
  );
}

export function ProjectCard({ project }: ProjectCardProps) {
  const styles = healthStyles[project.health];

  return (
    <article
      className={cn(
        "group flex flex-col rounded-2xl bg-white/[0.025] ring-1 ring-white/[0.06] transition-all duration-200",
        "hover:bg-white/[0.04] hover:ring-white/[0.1]"
      )}
    >
      <div className="flex items-start gap-4 border-b border-white/[0.04] p-5 sm:p-6">
        <div
          className={cn(
            "mt-1 size-2 shrink-0 rounded-full",
            styles.dot
          )}
          aria-label={`Health: ${healthLabels[project.health]}`}
        />

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 space-y-1">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                {project.name}
              </h2>
              <p className="text-sm text-muted-foreground">{project.client}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="ghost" className={cn("text-xs", styles.text)}>
                {healthLabels[project.health]}
              </Badge>
              <Badge variant="outline" className="border-white/[0.08] text-xs">
                {project.status}
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3" />
              {project.country}
            </span>
            <span>{project.contractValueLabel}</span>
            <span>Risk: {project.riskLevel}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-5 sm:grid-cols-2 sm:gap-5 sm:p-6">
        <MetaField label="Project Director" value={project.projectDirector} icon={User} />
        <MetaField
          label="Construction Manager"
          value={project.constructionManager}
          icon={User}
        />
        <MetaField label="Current Phase" value={project.currentPhase} />
        <MetaField
          label="Next Milestone"
          value={`${project.nextMilestone} · ${project.nextMilestoneDate}`}
          icon={Calendar}
        />
        <MetaField label="Start Date" value={project.startDate} />
        <MetaField label="Finish Date" value={project.finishDate} />
      </div>

      <div className="mt-auto space-y-4 border-t border-white/[0.04] p-5 sm:p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Progress</span>
              <span className="tabular-nums text-foreground">
                {project.progress}%
              </span>
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className={cn("h-full rounded-full transition-all", styles.bar)}
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Health Score</span>
              <span className={cn("tabular-nums font-medium", styles.text)}>
                {project.healthScore}%
              </span>
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className={cn("h-full rounded-full transition-all", styles.bar)}
                style={{ width: `${project.healthScore}%` }}
              />
            </div>
          </div>
        </div>

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
