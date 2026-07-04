import { ArrowRight } from "lucide-react";

import { executiveBriefItems } from "@/lib/ai-home-data";
import { Button } from "@/components/ui/button";

export function ExecutiveBrief() {
  return (
    <section className="space-y-10 sm:space-y-12">
      <div className="max-w-3xl space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-[2.75rem] sm:leading-[1.15]">
          Good Evening, Asim 👋
        </h1>
        <p className="text-xl leading-relaxed text-muted-foreground">
          I analyzed your entire construction portfolio.
        </p>
      </div>

      <div className="rounded-3xl bg-white/[0.025] px-8 py-10 sm:px-12 sm:py-12">
        <h2 className="text-base font-medium text-foreground">
          Today&apos;s Summary
        </h2>

        <ul className="mt-8 space-y-5">
          {executiveBriefItems.map((item) => (
            <li
              key={item}
              className="flex items-start gap-4 text-[17px] leading-relaxed text-foreground/85"
            >
              <span className="mt-2.5 size-1 shrink-0 rounded-full bg-violet-400/80" />
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-10">
          <Button
            size="lg"
            className="h-11 rounded-full bg-violet-600 px-6 text-[15px] font-medium text-white hover:bg-violet-500"
          >
            Review Recommendations
            <ArrowRight className="size-4" data-icon="inline-end" />
          </Button>
        </div>
      </div>
    </section>
  );
}
