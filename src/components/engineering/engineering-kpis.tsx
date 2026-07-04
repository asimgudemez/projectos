import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileStack,
  FileWarning,
  Timer,
} from "lucide-react";

import type { EngineeringKpis } from "@/lib/engineering-data";
import { cn } from "@/lib/utils";

type EngineeringKpisBarProps = {
  kpis: EngineeringKpis;
};

export function EngineeringKpisBar({ kpis }: EngineeringKpisBarProps) {
  const items = [
    { label: "Open RFIs", value: String(kpis.openRfis), icon: FileWarning },
    {
      label: "Approved RFIs",
      value: String(kpis.approvedRfis),
      icon: CheckCircle2,
      accent: "text-emerald-400",
    },
    {
      label: "Avg Approval Time",
      value: `${kpis.avgApprovalDays}d`,
      icon: Timer,
    },
    {
      label: "Pending Drawings",
      value: String(kpis.pendingDrawings),
      icon: FileStack,
    },
    {
      label: "Pending Submittals",
      value: String(kpis.pendingSubmittals),
      icon: Clock,
    },
    {
      label: "Critical Issues",
      value: String(kpis.criticalIssues),
      icon: AlertTriangle,
      accent: "text-rose-400",
    },
  ];

  return (
    <div className="overflow-hidden rounded-xl bg-white/[0.03] ring-1 ring-white/[0.06]">
      <div className="grid grid-cols-2 divide-x divide-y divide-white/[0.06] lg:flex lg:divide-y-0">
        {items.map((item) => (
          <div
            key={item.label}
            className="min-w-0 flex-1 px-4 py-4 lg:px-5 lg:py-4"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-[10px] font-medium tracking-[0.06em] text-muted-foreground uppercase">
                {item.label}
              </p>
              <item.icon className={cn("size-3.5 opacity-50", item.accent)} />
            </div>
            <p
              className={cn(
                "mt-1.5 text-xl font-semibold tabular-nums tracking-tight",
                item.accent
              )}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
