import {
  projectSnapshots,
  statusDot,
  statusLabels,
} from "@/lib/command-center-data";
import { cn } from "@/lib/utils";
import { WorkspaceSection } from "@/components/command-center/workspace-primitives";

export function ProjectStatusStrip() {
  const healthy = projectSnapshots.filter((p) => p.status === "healthy");
  const atRisk = projectSnapshots.filter((p) => p.status === "at-risk");
  const critical = projectSnapshots.filter((p) => p.status === "critical");

  return (
    <WorkspaceSection
      label="Which projects are healthy · which are in danger"
      hint={`${healthy.length} healthy · ${atRisk.length} at risk · ${critical.length} critical`}
    >
      <div className="grid gap-px overflow-hidden rounded-lg bg-white/[0.04] sm:grid-cols-2 lg:grid-cols-3">
        {projectSnapshots.map((project) => (
          <button
            key={project.id}
            type="button"
            className="flex items-center justify-between bg-background px-4 py-3 text-left transition-colors hover:bg-white/[0.02]"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span
                aria-hidden
                className={cn("size-1.5 shrink-0 rounded-full", statusDot[project.status])}
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {project.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {statusLabels[project.status]}
                </p>
              </div>
            </div>
            <p className="shrink-0 text-sm font-medium tabular-nums text-foreground">
              {project.health}%
            </p>
          </button>
        ))}
      </div>
    </WorkspaceSection>
  );
}
