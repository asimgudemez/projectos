import {
  attentionQueue,
  liveSignals,
  morningBrief,
  workspaceContext,
} from "@/lib/command-center-data";
import { WorkspaceSection } from "@/components/command-center/workspace-primitives";

export function WorkspaceHeader() {
  return (
    <header className="space-y-6 border-b border-white/[0.06] pb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
            Command Center
          </p>
          <h1 className="text-[1.75rem] font-semibold tracking-tight text-foreground sm:text-[2rem]">
            {workspaceContext.greeting}
          </h1>
          <p className="text-sm text-muted-foreground">
            {workspaceContext.dateLabel} · {workspaceContext.syncLabel}
          </p>
        </div>

        <dl className="flex gap-8 text-sm">
          <div>
            <dt className="text-muted-foreground">Projects</dt>
            <dd className="mt-0.5 font-medium tabular-nums text-foreground">
              {workspaceContext.activeProjects}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Need you</dt>
            <dd className="mt-0.5 font-medium tabular-nums text-foreground">
              {workspaceContext.attentionCount}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Decisions</dt>
            <dd className="mt-0.5 font-medium tabular-nums text-foreground">
              {workspaceContext.decisionsCount}
            </dd>
          </div>
        </dl>
      </div>
    </header>
  );
}

export function MorningBrief() {
  return (
    <WorkspaceSection label="What is happening" hint="Morning brief">
      <p className="max-w-4xl text-[15px] leading-[1.7] text-foreground/90">
        {morningBrief}
      </p>

      <ul className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6">
        {liveSignals.map((signal) => (
          <li
            key={signal.time}
            className="flex items-center gap-2 text-xs text-muted-foreground"
          >
            <span className="font-mono tabular-nums">{signal.time}</span>
            <span>{signal.text}</span>
          </li>
        ))}
      </ul>
    </WorkspaceSection>
  );
}

export function AttentionQueue() {
  return (
    <WorkspaceSection
      label="What needs my attention"
      hint={`${attentionQueue.length} items`}
    >
      <div>
        {attentionQueue.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 border-b border-white/[0.04] py-3 last:border-0"
          >
            <span
              aria-hidden
              className={`mt-1.5 size-1.5 shrink-0 rounded-full ${
                item.priority === "critical"
                  ? "bg-rose-400"
                  : item.priority === "high"
                    ? "bg-amber-400"
                    : "bg-muted-foreground/40"
              }`}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-foreground">{item.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {item.project} · {item.reason}
              </p>
            </div>
          </div>
        ))}
      </div>
    </WorkspaceSection>
  );
}
