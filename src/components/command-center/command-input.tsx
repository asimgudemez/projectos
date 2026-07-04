"use client";

import { ArrowUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CommandInput() {
  return (
    <div className="sticky bottom-0 border-t border-white/[0.06] bg-background/95 pt-6 pb-2 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Ask ProjectOS anything..."
          className="h-10 flex-1 border-white/[0.06] bg-white/[0.02] text-sm shadow-none placeholder:text-muted-foreground/60 focus-visible:border-violet-500/40 focus-visible:ring-violet-500/20"
        />
        <Button
          size="icon"
          className="size-10 shrink-0 bg-violet-600 text-white hover:bg-violet-500"
          aria-label="Submit query"
        >
          <ArrowUp className="size-4" />
        </Button>
      </div>
    </div>
  );
}
