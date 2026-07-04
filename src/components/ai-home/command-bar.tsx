"use client";

import { ArrowUp, Search, Sparkles } from "lucide-react";

import { quickActions } from "@/lib/ai-home-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PremiumSurface } from "@/components/ai-home/premium-surface";

export function CommandBar() {
  return (
    <section className="space-y-5">
      <PremiumSurface glass className="overflow-hidden p-2">
        <div className="flex items-center gap-3 rounded-xl bg-background/40 px-4 py-2 ring-1 ring-white/[0.04]">
          <Search className="size-5 shrink-0 text-muted-foreground" />
          <input
            type="text"
            placeholder="Ask ProjectOS anything..."
            className="h-14 flex-1 bg-transparent text-lg text-foreground placeholder:text-muted-foreground/70 outline-none"
          />
          <Button
            size="icon-lg"
            className="size-12 shrink-0 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25 hover:from-violet-500 hover:to-indigo-500"
            aria-label="Submit query"
          >
            <ArrowUp className="size-5" />
          </Button>
        </div>
      </PremiumSurface>

      <div className="flex flex-wrap gap-2.5">
        {quickActions.map((action) => (
          <button
            key={action.label}
            type="button"
            className={cn(
              "group inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-4 py-2.5",
              "text-sm font-medium text-muted-foreground transition-all duration-200",
              "hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-foreground",
              "hover:shadow-[0_4px_20px_-4px_rgba(139,92,246,0.3)]"
            )}
          >
            <action.icon className="size-3.5 text-violet-400/70 transition-colors group-hover:text-violet-300" />
            {action.label}
          </button>
        ))}
      </div>

      <p className="flex items-center gap-2 text-xs text-muted-foreground/70">
        <Sparkles className="size-3 text-violet-400/60" />
        Intelligence layer active across 12 projects · Last sync 4 min ago
      </p>
    </section>
  );
}
