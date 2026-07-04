"use client";

import { ArrowUp } from "lucide-react";

import { quickActions } from "@/lib/command-center-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CommandCenterSection } from "@/components/command-center/section";

export function CommandBar() {
  return (
    <CommandCenterSection aria-label="AI command bar" delay={240}>
      <div className="space-y-5">
        <div className="flex items-center gap-3 rounded-2xl bg-white/[0.03] px-4 py-2 sm:px-5">
          <Input
            type="text"
            placeholder="Ask ProjectOS anything..."
            className="h-12 flex-1 border-0 bg-transparent px-0 text-[17px] shadow-none placeholder:text-muted-foreground/55 focus-visible:ring-0"
          />
          <Button
            size="icon-lg"
            className="size-10 shrink-0 rounded-full bg-violet-600 text-white transition-all duration-200 hover:bg-violet-500 hover:shadow-[0_8px_24px_-8px_rgba(139,92,246,0.55)]"
            aria-label="Submit query"
          >
            <ArrowUp className="size-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-x-2 gap-y-2.5">
          {quickActions.map((action) => (
            <button
              key={action.label}
              type="button"
              className={cn(
                "rounded-full bg-white/[0.04] px-4 py-2 text-[13px] text-muted-foreground",
                "transition-all duration-200 hover:bg-white/[0.08] hover:text-foreground"
              )}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </CommandCenterSection>
  );
}
