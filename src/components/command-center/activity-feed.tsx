import {
  Bot,
  CheckCircle2,
  ClipboardCheck,
  FileUp,
} from "lucide-react";

import { liveActivity, type ActivityItem } from "@/lib/command-center-data";
import { cn } from "@/lib/utils";
import { CommandCenterSection } from "@/components/command-center/section";

function ActivityIcon({
  category,
}: {
  category: ActivityItem["category"];
}) {
  const className = "mt-0.5 size-4 shrink-0";

  switch (category) {
    case "approval":
      return <CheckCircle2 className={cn(className, "text-emerald-400/80")} />;
    case "document":
      return <FileUp className={cn(className, "text-sky-400/80")} />;
    case "ai":
      return <Bot className={cn(className, "text-violet-400/80")} />;
    case "inspection":
      return <ClipboardCheck className={cn(className, "text-amber-400/80")} />;
  }
}

export function ActivityFeed() {
  return (
    <CommandCenterSection aria-label="Live activity feed" delay={400}>
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Live Activity Feed
          </h2>
          <p className="mt-1.5 text-[13px] text-muted-foreground">
            What happened across my portfolio today?
          </p>
        </div>

        <div>
          {liveActivity.map((item, index) => {
            const isLast = index === liveActivity.length - 1;

            return (
              <div
                key={`${item.time}-${item.title}`}
                className={cn(
                  "flex gap-4 py-5 transition-colors duration-200 first:pt-0",
                  !isLast && "border-b border-white/[0.04]"
                )}
              >
                <ActivityIcon category={item.category} />
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-xs tracking-wide text-muted-foreground">
                    {item.time}
                  </p>
                  <p className="mt-1 text-[15px] leading-snug text-foreground">
                    {item.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </CommandCenterSection>
  );
}
