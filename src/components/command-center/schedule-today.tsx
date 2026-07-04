import { meetingsToday } from "@/lib/command-center-data";
import { WorkspaceSection } from "@/components/command-center/workspace-primitives";

export function ScheduleToday() {
  return (
    <WorkspaceSection
      label="What meetings are today"
      hint={`${meetingsToday.length} scheduled`}
    >
      <div>
        {meetingsToday.map((meeting) => (
          <div
            key={meeting.id}
            className="grid grid-cols-[3.5rem_1fr] gap-4 border-b border-white/[0.04] py-3 last:border-0"
          >
            <time className="font-mono text-xs tabular-nums text-muted-foreground">
              {meeting.time}
            </time>
            <div>
              <p className="text-sm text-foreground">{meeting.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {[meeting.project, meeting.location].filter(Boolean).join(" · ")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </WorkspaceSection>
  );
}
