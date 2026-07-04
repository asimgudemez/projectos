import {
  manpowerGaps,
  materialsMissing,
  rfisWaiting,
} from "@/lib/command-center-data";
import { WorkspaceSection } from "@/components/command-center/workspace-primitives";

function OperationBlock({
  title,
  count,
  sublabel,
  items,
}: {
  title: string;
  count: number;
  sublabel: string;
  items: { id: string; label: string; project: string; detail: string }[];
}) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          <span className="tabular-nums text-foreground">{count}</span> {sublabel}
        </p>
      </div>
      <div>
        {items.map((item) => (
          <div
            key={item.id}
            className="border-b border-white/[0.04] py-2.5 last:border-0"
          >
            <p className="text-sm text-foreground">{item.label}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {item.project} · {item.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function OperationsGrid() {
  return (
    <WorkspaceSection label="Operations">
      <div className="grid gap-8 md:grid-cols-3 md:gap-6">
        <OperationBlock
          title="Which RFIs are waiting"
          count={rfisWaiting.total}
          sublabel={`${rfisWaiting.overdue} overdue`}
          items={rfisWaiting.items}
        />
        <OperationBlock
          title="Which materials are missing"
          count={materialsMissing.total}
          sublabel="delivery exceptions"
          items={materialsMissing.items}
        />
        <OperationBlock
          title="Which manpower is below target"
          count={manpowerGaps.total}
          sublabel="sites under planned headcount"
          items={manpowerGaps.items}
        />
      </div>
    </WorkspaceSection>
  );
}
