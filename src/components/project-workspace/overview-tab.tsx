import { ArrowRight, Sparkles } from "lucide-react";

import type { ProjectWorkspaceData } from "@/lib/project-workspace-data";
import { Button } from "@/components/ui/button";
import { WorkspaceSection } from "@/components/project-workspace/workspace-section";

export function OverviewExecutiveBrief({
  items,
}: {
  items: ProjectWorkspaceData["executiveBrief"];
}) {
  return (
    <WorkspaceSection title="Today's Executive Brief" hint="Project intelligence">
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 text-[15px] leading-relaxed text-foreground/90"
          >
            <span
              aria-hidden
              className="mt-2 size-1 shrink-0 rounded-full bg-violet-400"
            />
            {item}
          </li>
        ))}
      </ul>
      <Button
        size="sm"
        className="mt-5 h-9 bg-violet-600 text-white hover:bg-violet-500"
      >
        Review Recommendations
        <ArrowRight className="size-3.5" data-icon="inline-end" />
      </Button>
    </WorkspaceSection>
  );
}

export function OverviewCriticalIssues({
  issues,
}: {
  issues: ProjectWorkspaceData["criticalIssues"];
}) {
  return (
    <WorkspaceSection
      title="Critical Issues"
      hint={`${issues.length} open`}
      className="h-full"
    >
      <div className="space-y-0">
        {issues.map((issue, index) => (
          <div
            key={issue.id}
            className={
              index < issues.length - 1
                ? "border-b border-white/[0.04] pb-4 mb-4"
                : ""
            }
          >
            <div className="flex items-start gap-3">
              <span
                aria-hidden
                className={`mt-1.5 size-1.5 shrink-0 rounded-full ${
                  issue.priority === "critical"
                    ? "bg-rose-400"
                    : issue.priority === "high"
                      ? "bg-amber-400"
                      : "bg-muted-foreground/40"
                }`}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">
                  {issue.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {issue.impact}
                </p>
                <p className="mt-1 text-xs text-muted-foreground/80">
                  {issue.owner}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </WorkspaceSection>
  );
}

export function OverviewMilestones({
  milestones,
}: {
  milestones: ProjectWorkspaceData["milestones"];
}) {
  return (
    <WorkspaceSection
      title="Upcoming Milestones"
      hint={`${milestones.length} scheduled`}
      className="h-full"
    >
      <div className="space-y-0">
        {milestones.map((milestone, index) => (
          <div
            key={milestone.id}
            className={`flex items-start justify-between gap-4 py-3 ${
              index < milestones.length - 1
                ? "border-b border-white/[0.04]"
                : ""
            }`}
          >
            <div className="min-w-0">
              <p className="text-sm text-foreground">{milestone.name}</p>
              <p
                className={`mt-0.5 text-xs capitalize ${
                  milestone.status === "at-risk"
                    ? "text-amber-400"
                    : "text-muted-foreground"
                }`}
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
  );
}

export function OverviewAiRecommendations({
  recommendations,
}: {
  recommendations: ProjectWorkspaceData["aiRecommendations"];
}) {
  return (
    <WorkspaceSection title="AI Recommendations" hint="Suggested actions">
      <div className="grid gap-4 lg:grid-cols-3">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="rounded-lg bg-white/[0.03] p-4 ring-1 ring-white/[0.04]"
          >
            <Sparkles className="size-4 text-violet-400/80" />
            <p className="mt-3 text-sm font-medium text-foreground">
              {rec.title}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {rec.impact}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 h-8 w-full border-white/[0.08] bg-transparent text-xs hover:bg-white/[0.04]"
            >
              {rec.action}
            </Button>
          </div>
        ))}
      </div>
    </WorkspaceSection>
  );
}

export function OverviewRecentActivity({
  activity,
}: {
  activity: ProjectWorkspaceData["recentActivity"];
}) {
  return (
    <WorkspaceSection title="Recent Activity" className="h-full">
      <div>
        {activity.map((item, index) => (
          <div
            key={item.id}
            className={`flex gap-4 py-3 ${
              index < activity.length - 1
                ? "border-b border-white/[0.04]"
                : ""
            }`}
          >
            <time className="w-16 shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
              {item.time}
            </time>
            <p className="text-sm text-foreground">{item.text}</p>
          </div>
        ))}
      </div>
    </WorkspaceSection>
  );
}

export function OverviewProjectTeam({
  team,
}: {
  team: ProjectWorkspaceData["team"];
}) {
  return (
    <WorkspaceSection
      title="Project Team"
      hint={`${team.length} members`}
      className="h-full"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {team.map((member) => (
          <div
            key={member.id}
            className="rounded-lg bg-white/[0.03] px-4 py-3 ring-1 ring-white/[0.04]"
          >
            <p className="text-sm font-medium text-foreground">{member.name}</p>
            <p className="mt-0.5 text-xs text-violet-400/90">{member.role}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {member.company}
            </p>
          </div>
        ))}
      </div>
    </WorkspaceSection>
  );
}
