"use client";

import { useState } from "react";
import { ArrowUp, Sparkles } from "lucide-react";

import { engineeringAiPrompts } from "@/lib/engineering-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function EngineeringAiBar() {
  const [query, setQuery] = useState("");

  return (
    <div className="space-y-3 rounded-xl bg-white/[0.02] px-4 py-3 ring-1 ring-white/[0.06] lg:px-5">
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 shrink-0 text-violet-400/80" />
        <p className="text-[11px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
          Engineering AI
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ask about RFIs, drawings, approvals..."
          className="h-9 flex-1 border-white/[0.06] bg-white/[0.02] text-sm shadow-none placeholder:text-muted-foreground/55"
        />
        <Button
          size="icon"
          className="size-9 shrink-0 bg-violet-600 text-white hover:bg-violet-500"
          aria-label="Submit engineering query"
        >
          <ArrowUp className="size-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {engineeringAiPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => setQuery(prompt)}
            className={cn(
              "rounded-full bg-white/[0.04] px-3 py-1.5 text-xs text-muted-foreground",
              "transition-colors hover:bg-white/[0.07] hover:text-foreground",
              query === prompt && "bg-violet-500/15 text-violet-300"
            )}
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
