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
    <div className="overflow-hidden rounded-xl bg-white/[0.04] ring-1 ring-white/[0.06]">
      <div className="grid grid-cols-2 divide-x divide-white/[0.06] md:grid-cols-3 lg:flex lg:divide-x lg:divide-y-0">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex min-w-0 flex-1 flex-col justify-between px-5 py-4 lg:px-6 lg:py-5"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-[11px] font-medium tracking-[0.06em] text-muted-foreground uppercase">
                {item.label}
              </p>
              <item.icon
                className={cn("size-3.5 shrink-0 opacity-50", item.accent)}
              />
            </div>
            <p
              className={cn(
                "mt-2 text-xl font-semibold tracking-tight tabular-nums text-foreground lg:text-2xl",
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
