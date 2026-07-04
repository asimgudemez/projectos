import { AppShell } from "@/components/layout/app-shell";
import { ActivityFeed } from "@/components/ai-home/activity-feed";
import { CommandBar } from "@/components/ai-home/command-bar";
import { ExecutiveBrief } from "@/components/ai-home/executive-brief";
import { PortfolioMetrics } from "@/components/ai-home/portfolio-metrics";
import { PredictionCenter } from "@/components/ai-home/prediction-center";
import { ProjectPortfolio } from "@/components/ai-home/project-portfolio";
import { RecommendedAction } from "@/components/ai-home/recommended-action";

export const metadata = {
  title: "AI Home",
};

export default function AIHomePage() {
  return (
    <AppShell
      title="AI Home"
      description="Construction intelligence command center"
      wide
    >
      <div className="mx-auto max-w-4xl space-y-16 pb-12 sm:space-y-20">
        <ExecutiveBrief />
        <PortfolioMetrics />
        <RecommendedAction />
        <CommandBar />

        <div className="space-y-16 border-t border-white/[0.04] pt-16 sm:space-y-20 sm:pt-20">
          <ProjectPortfolio />
          <ActivityFeed />
          <PredictionCenter />
        </div>
      </div>
    </AppShell>
  );
}
