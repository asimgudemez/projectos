import { ArrowRight, Sparkles } from "lucide-react";

import type { ProjectWorkspaceData } from "@/lib/project-workspace-data";
import {
  equipmentStatusStyle,
  materialStatusStyle,
  riskLevelDot,
} from "@/lib/project-workspace-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { WorkspaceSection } from "@/components/project-workspace/workspace-section";

type OverviewPageProps = {
  workspace: ProjectWorkspaceData;
};

export function OverviewPage({ workspace }: OverviewPageProps) {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      <WorkspaceSection title="Executive Brief" hint="AI generated · Updated 07:04">
        <p className="text-[11px] font-medium text-violet-400/90">AI Summary</p>
        <div className="mt-4 space-y-4">
          {workspace.executiveBrief.map((paragraph) => (
            <p
              key={paragraph}
              className="text-[15px] leading-[1.75] text-foreground/90"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </WorkspaceSection>

      <div className="grid gap-8 lg:grid-cols-2">
        <WorkspaceSection title="Critical Risks" hint={`${workspace.criticalRisks.length} active`}>
          <div className="space-y-4">
            {workspace.criticalRisks.map((risk) => (
              <div key={risk.id} className="flex gap-3">
                <span
                  aria-hidden
                  className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", riskLevelDot[risk.level])}
                />
                <div>
                  <p className="text-sm font-medium text-foreground">{risk.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{risk.impact}</p>
                  <p className="mt-1 text-xs text-muted-foreground/70">{risk.owner}</p>
                </div>
              </div>
            ))}
          </div>
        </WorkspaceSection>

        <WorkspaceSection title="Today's Priorities" hint="Action required">
          <div className="space-y-0">
            {workspace.todaysPriorities.map((item, index) => (
              <div
                key={item.id}
                className={cn(
                  "py-3",
                  index < workspace.todaysPriorities.length - 1 &&
                    "border-b border-white/[0.04]"
                )}
              >
                <p className="text-sm text-foreground">{item.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.due} · {item.owner}
                </p>
              </div>
            ))}
          </div>
        </WorkspaceSection>
      </div>

      <WorkspaceSection title="Upcoming Milestones">
        <div className="divide-y divide-white/[0.04]">
          {workspace.milestones.map((milestone) => (
            <div
              key={milestone.id}
              className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0"
            >
              <div>
                <p className="text-sm text-foreground">{milestone.name}</p>
                <p
                  className={cn(
                    "mt-0.5 text-xs capitalize",
                    milestone.status === "at-risk"
                      ? "text-amber-400"
                      : "text-muted-foreground"
                  )}
                >
                  {milestone.status.replace("-", " ")}
                </p>
              </div>
              <p className="shrink-0 text-xs tabular-nums text-muted-foreground">
                {milestone.date}
              </p>
            </div>
          ))}
        </div>
      </WorkspaceSection>

      <div className="grid gap-8 lg:grid-cols-2">
        <WorkspaceSection title="Latest RFIs">
          <div className="divide-y divide-white/[0.04]">
            {workspace.rfis.map((rfi) => (
              <div key={rfi.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium text-foreground">{rfi.number}</p>
                  <p className="text-xs text-muted-foreground">{rfi.daysOpen}d open</p>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{rfi.subject}</p>
                <p className="mt-1 text-xs text-violet-400/80">{rfi.status}</p>
              </div>
            ))}
          </div>
        </WorkspaceSection>

        <WorkspaceSection title="Latest Submittals">
          <div className="divide-y divide-white/[0.04]">
            {workspace.submittals.map((sub) => (
              <div key={sub.id} className="py-3 first:pt-0 last:pb-0">
                <p className="text-sm font-medium text-foreground">{sub.number}</p>
                <p className="mt-1 text-sm text-muted-foreground">{sub.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {sub.status} · {sub.reviewer}
                </p>
              </div>
            ))}
          </div>
        </WorkspaceSection>
      </div>

      <WorkspaceSection title="Recent Documents">
        <div className="grid gap-3 sm:grid-cols-2">
          {workspace.documents.map((doc) => (
            <div
              key={doc.id}
              className="rounded-lg bg-white/[0.03] px-4 py-3 ring-1 ring-white/[0.04]"
            >
              <p className="text-sm text-foreground">{doc.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {doc.type} · {doc.updated}
              </p>
            </div>
          ))}
        </div>
      </WorkspaceSection>

      <div className="grid gap-8 lg:grid-cols-3">
        <WorkspaceSection title="Material Delivery Status">
          <div className="space-y-4">
            {workspace.materials.map((item) => (
              <div key={item.id}>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-foreground">{item.name}</p>
                  <span
                    className={cn(
                      "shrink-0 text-[10px] font-medium uppercase",
                      materialStatusStyle[item.status]
                    )}
                  >
                    {item.status.replace("-", " ")}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{item.detail}</p>
              </div>
            ))}
          </div>
        </WorkspaceSection>

        <WorkspaceSection title="Manpower Status">
          <div className="space-y-4">
            {workspace.manpower.map((item) => {
              const pct = Math.round((item.actual / item.planned) * 100);
              const isLow = pct < 85;

              return (
                <div key={item.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{item.trade}</span>
                    <span
                      className={cn(
                        "tabular-nums",
                        isLow ? "text-amber-400" : "text-muted-foreground"
                      )}
                    >
                      {item.actual}/{item.planned}
                    </span>
                  </div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        isLow ? "bg-amber-400" : "bg-emerald-400"
                      )}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </WorkspaceSection>

        <WorkspaceSection title="Equipment Status">
          <div className="space-y-4">
            {workspace.equipment.map((item) => (
              <div key={item.id}>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-foreground">{item.name}</p>
                  <span
                    className={cn(
                      "shrink-0 text-[10px] font-medium uppercase",
                      equipmentStatusStyle[item.status]
                    )}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{item.detail}</p>
              </div>
            ))}
          </div>
        </WorkspaceSection>
      </div>

      <WorkspaceSection title="AI Recommendations" hint="Suggested next actions">
        <div className="grid gap-4 lg:grid-cols-3">
          {workspace.aiRecommendations.map((rec) => (
            <div
              key={rec.id}
              className="rounded-lg bg-white/[0.03] p-4 ring-1 ring-white/[0.04]"
            >
              <Sparkles className="size-4 text-violet-400/80" />
              <p className="mt-3 text-sm font-medium text-foreground">{rec.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {rec.impact}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 h-8 w-full border-white/[0.08] bg-transparent text-xs hover:bg-white/[0.04]"
              >
                {rec.action}
                <ArrowRight className="size-3" data-icon="inline-end" />
              </Button>
            </div>
          ))}
        </div>
      </WorkspaceSection>
    </div>
  );
}
