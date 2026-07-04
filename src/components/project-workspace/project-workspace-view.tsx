"use client";

import type { ProjectWorkspaceData } from "@/lib/project-workspace-data";
import { workspaceTabs } from "@/lib/project-workspace-data";
import {
  OverviewAiRecommendations,
  OverviewCriticalIssues,
  OverviewExecutiveBrief,
  OverviewMilestones,
  OverviewProjectTeam,
  OverviewRecentActivity,
} from "@/components/project-workspace/overview-tab";
import { ProjectWorkspaceHeader } from "@/components/project-workspace/workspace-header";
import { TabPlaceholder } from "@/components/project-workspace/tab-placeholder";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type ProjectWorkspaceViewProps = {
  workspace: ProjectWorkspaceData;
};

export function ProjectWorkspaceView({ workspace }: ProjectWorkspaceViewProps) {
  return (
    <div className="flex w-full flex-col gap-6 lg:gap-8">
      <ProjectWorkspaceHeader workspace={workspace} />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList
          variant="line"
          className="h-auto w-full justify-start gap-0 overflow-x-auto rounded-none border-b border-white/[0.06] bg-transparent p-0"
        >
          {workspaceTabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className={cn(
                "shrink-0 rounded-none border-0 border-b-2 border-transparent bg-transparent px-4 py-3 text-sm text-muted-foreground shadow-none",
                "data-active:border-violet-500 data-active:bg-transparent data-active:text-foreground"
              )}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6 lg:mt-8 lg:space-y-8">
          <OverviewExecutiveBrief items={workspace.executiveBrief} />

          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            <OverviewCriticalIssues issues={workspace.criticalIssues} />
            <OverviewMilestones milestones={workspace.milestones} />
          </div>

          <OverviewAiRecommendations recommendations={workspace.aiRecommendations} />

          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            <OverviewRecentActivity activity={workspace.recentActivity} />
            <OverviewProjectTeam team={workspace.team} />
          </div>
        </TabsContent>

        {workspaceTabs
          .filter((tab) => tab.id !== "overview")
          .map((tab) => (
            <TabsContent
              key={tab.id}
              value={tab.id}
              className="mt-6 lg:mt-8"
            >
              <TabPlaceholder tabLabel={tab.label} />
            </TabsContent>
          ))}
      </Tabs>
    </div>
  );
}
