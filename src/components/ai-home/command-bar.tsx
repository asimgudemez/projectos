"use client";

import { ArrowUp } from "lucide-react";

import { quickActions } from "@/lib/ai-home-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function CommandBar() {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3 rounded-2xl bg-white/[0.03] px-5 py-3 sm:px-6">
        <input
          type="text"
          placeholder="Ask ProjectOS anything..."
          className="h-12 flex-1 bg-transparent text-[17px] text-foreground placeholder:text-muted-foreground/60 outline-none"
        />
        <Button
          size="icon-lg"
          className="size-10 shrink-0 rounded-full bg-violet-600 text-white hover:bg-violet-500"
          aria-label="Submit query"
        >
          <ArrowUp className="size-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {quickActions.map((action) => (
          <button
            key={action.label}
            type="button"
            className={cn(
              "rounded-full bg-white/[0.04] px-4 py-2 text-sm text-muted-foreground",
              "transition-colors duration-200 hover:bg-white/[0.07] hover:text-foreground"
            )}
          >
            {action.label}
          </button>
        ))}
      </div>
    </section>
  );
}
