import { AppShell } from "@/components/layout/app-shell";
import { CommandInput } from "@/components/command-center/command-input";
import { DecisionsToday } from "@/components/command-center/decisions-today";
import { OperationsGrid } from "@/components/command-center/operations-grid";
import { ProjectStatusStrip } from "@/components/command-center/project-status-strip";
import { ScheduleToday } from "@/components/command-center/schedule-today";
import {
  AttentionQueue,
  MorningBrief,
  WorkspaceHeader,
} from "@/components/command-center/workspace-header";

export const metadata = {
  title: "Command Center",
};

export default function CommandCenterPage() {
  return (
    <AppShell
      title="Command Center"
      description="Construction director workspace"
      wide
    >
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-6xl flex-col gap-10 pb-6">
        <WorkspaceHeader />
        <MorningBrief />

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          <AttentionQueue />
          <DecisionsToday />
        </div>

        <ProjectStatusStrip />
        <OperationsGrid />
        <ScheduleToday />
        <CommandInput />
      </div>
    </AppShell>
  );
}
