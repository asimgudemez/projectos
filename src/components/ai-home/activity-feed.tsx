import {
  Bot,
  CheckCircle2,
  ClipboardCheck,
  FileUp,
} from "lucide-react";

import { liveActivity, type ActivityItem } from "@/lib/ai-home-data";
import { cn } from "@/lib/utils";

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
    <section className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Live Activity
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Recent signals from your portfolio
        </p>
      </div>

      <div className="space-y-0">
        {liveActivity.map((item, index) => {
          const isLast = index === liveActivity.length - 1;

          return (
            <div
              key={`${item.time}-${item.title}`}
              className={cn(
                "flex gap-5 py-5",
                !isLast && "border-b border-white/[0.04]"
              )}
            >
              <ActivityIcon category={item.category} />
              <div className="min-w-0 flex-1">
                <p className="font-mono text-xs text-muted-foreground">
                  {item.time}
                </p>
                <p className="mt-1 text-[15px] text-foreground">{item.title}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
