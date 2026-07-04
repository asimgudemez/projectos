import { ArrowRight } from "lucide-react";

import { executiveBriefItems } from "@/lib/command-center-data";
import { Button } from "@/components/ui/button";
import { CommandCenterSection } from "@/components/command-center/section";

export function ExecutiveBrief() {
  return (
    <CommandCenterSection aria-label="Executive Brief" delay={0}>
      <div className="space-y-10">
        <div className="space-y-4">
          <h1 className="text-balance text-[2.5rem] font-semibold leading-[1.12] tracking-tight text-foreground sm:text-[2.75rem]">
            Good Evening, Asim 👋
          </h1>
          <p className="text-xl leading-relaxed text-muted-foreground">
            I analyzed your entire construction portfolio.
          </p>
        </div>

        <div className="rounded-3xl bg-white/[0.03] px-6 py-9 sm:px-10 sm:py-12">
          <h2 className="text-[15px] font-medium tracking-tight text-foreground">
            Today&apos;s Summary
          </h2>

          <ul className="mt-8 space-y-[1.125rem]">
            {executiveBriefItems.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3.5 text-[17px] leading-[1.65] text-foreground/90"
              >
                <span
                  aria-hidden
                  className="mt-[0.65rem] size-1 shrink-0 rounded-full bg-violet-400/90"
                />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <Button
              size="lg"
              className="h-11 rounded-full bg-violet-600 px-6 text-[15px] font-medium text-white transition-all duration-200 hover:bg-violet-500 hover:shadow-[0_8px_24px_-8px_rgba(139,92,246,0.55)]"
            >
              Review Recommendations
              <ArrowRight className="size-4" data-icon="inline-end" />
            </Button>
          </div>
        </div>
      </div>
    </CommandCenterSection>
  );
}
