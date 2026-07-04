import { ArrowRight, Sparkles } from "lucide-react";

import { executiveBriefItems } from "@/lib/ai-home-data";
import { Button } from "@/components/ui/button";
import { PremiumSurface } from "@/components/ai-home/premium-surface";

export function ExecutiveBrief() {
  return (
    <section>
      <PremiumSurface glow glass className="overflow-hidden">
        <div className="relative p-8 sm:p-10">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-600/10 via-transparent to-indigo-600/5" />
          <div className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative space-y-8">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/30 to-indigo-600/20 ring-1 ring-violet-400/20">
                <Sparkles className="size-5 text-violet-300" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  Today&apos;s Executive Brief
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  AI-synthesized priorities across your active portfolio
                </p>
              </div>
            </div>

            <ul className="space-y-4">
              {executiveBriefItems.map((item) => (
                <li
                  key={item.text}
                  className="flex items-start gap-3 text-base leading-relaxed text-foreground/90"
                >
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-violet-400" />
                  {item.text}
                </li>
              ))}
            </ul>

            <Button
              size="lg"
              className="h-12 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 text-white shadow-lg shadow-violet-500/20 hover:from-violet-500 hover:to-indigo-500"
            >
              Review Recommendations
              <ArrowRight className="size-4" data-icon="inline-end" />
            </Button>
          </div>
        </div>
      </PremiumSurface>
    </section>
  );
}
