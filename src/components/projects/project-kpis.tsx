import {
  AlertTriangle,
  CalendarClock,
  CircleDollarSign,
  FolderKanban,
  ShieldCheck,
} from "lucide-react";

import { getProjectKpis, type Project } from "@/lib/projects-data";
import { cn } from "@/lib/utils";

type ProjectKpisProps = {
  projects: Project[];
};

export function ProjectKpis({ projects }: ProjectKpisProps) {
  const kpis = getProjectKpis(projects);

  const items = [
    {
      label: "Total Projects",
      value: String(kpis.total),
      icon: FolderKanban,
    },
    {
      label: "Healthy",
      value: String(kpis.healthy),
      icon: ShieldCheck,
      accent: "text-emerald-400",
    },
    {
      label: "At Risk",
      value: String(kpis.atRisk),
      icon: AlertTriangle,
      accent: "text-amber-400",
    },
    {
      label: "Delayed",
      value: String(kpis.delayed),
      icon: AlertTriangle,
      accent: "text-rose-400",
    },
    {
      label: "Revenue",
      value: kpis.revenueLabel,
      icon: CircleDollarSign,
    },
    {
      label: "Upcoming Milestones",
      value: String(kpis.upcomingMilestones),
      icon: CalendarClock,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-white/[0.06] sm:grid-cols-3 lg:grid-cols-6">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-col justify-between bg-background px-4 py-4 sm:px-5 sm:py-5"
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-medium tracking-[0.06em] text-muted-foreground uppercase">
              {item.label}
            </p>
            <item.icon
              className={cn("size-3.5 shrink-0 opacity-50", item.accent)}
            />
          </div>
          <p
            className={cn(
              "mt-3 text-2xl font-semibold tracking-tight tabular-nums text-foreground",
              item.accent
            )}
          >
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
