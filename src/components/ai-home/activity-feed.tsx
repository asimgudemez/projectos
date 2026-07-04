import {
  Bot,
  CheckCircle2,
  ClipboardCheck,
  FileUp,
} from "lucide-react";

import { liveActivity, type ActivityItem } from "@/lib/ai-home-data";
import { cn } from "@/lib/utils";
import { PremiumSurface } from "@/components/ai-home/premium-surface";

const categoryConfig: Record<
  ActivityItem["category"],
  { icon: typeof Bot; color: string; bg: string }
> = {
  approval: {
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 ring-emerald-500/20",
  },
  document: {
    icon: FileUp,
    color: "text-sky-400",
    bg: "bg-sky-500/10 ring-sky-500/20",
  },
  ai: {
    icon: Bot,
    color: "text-violet-400",
    bg: "bg-violet-500/10 ring-violet-500/20",
  },
  inspection: {
    icon: ClipboardCheck,
    color: "text-amber-400",
    bg: "bg-amber-500/10 ring-amber-500/20",
  },
};

export function ActivityFeed() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Live Activity Feed
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Real-time signals from sites, consultants and AI monitoring
        </p>
      </div>

      <PremiumSurface className="p-6 sm:p-8">
        <div className="relative space-y-0">
          {liveActivity.map((item, index) => {
            const config = categoryConfig[item.category];
            const Icon = config.icon;
            const isLast = index === liveActivity.length - 1;

            return (
              <div key={`${item.time}-${item.title}`} className="relative flex gap-5 pb-8 last:pb-0">
                {!isLast && (
                  <div className="absolute top-10 left-[19px] h-[calc(100%-12px)] w-px bg-gradient-to-b from-white/10 to-transparent" />
                )}

                <div
                  className={cn(
                    "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-xl ring-1",
                    config.bg
                  )}
                >
                  <Icon className={cn("size-4", config.color)} />
                </div>

                <div className="min-w-0 flex-1 pt-1.5">
                  <p className="font-mono text-xs font-medium tracking-wider text-violet-400/70">
                    {item.time}
                  </p>
                  <p className="mt-1 text-base font-medium text-foreground">
                    {item.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </PremiumSurface>
    </section>
  );
}
