import { AppShell } from "@/components/layout/app-shell";
import { ActivityFeed } from "@/components/ai-home/activity-feed";
import { CommandBar } from "@/components/ai-home/command-bar";
import { ExecutiveBrief } from "@/components/ai-home/executive-brief";
import { HeroSection } from "@/components/ai-home/hero-section";
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
      <div className="space-y-12 pb-8 lg:space-y-14">
        <HeroSection />
        <ExecutiveBrief />
        <CommandBar />
        <RecommendedAction />
        <ProjectPortfolio />
        <div className="grid gap-12 xl:grid-cols-2 xl:gap-8">
          <ActivityFeed />
          <PredictionCenter />
        </div>
      </div>
    </AppShell>
  );
}
