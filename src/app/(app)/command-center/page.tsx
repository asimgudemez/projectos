import { AppShell } from "@/components/layout/app-shell";
import { ActivityFeed } from "@/components/command-center/activity-feed";
import { CommandBar } from "@/components/command-center/command-bar";
import { ExecutiveBrief } from "@/components/command-center/executive-brief";
import { MetricsRow } from "@/components/command-center/metrics-row";
import { PredictionCenter } from "@/components/command-center/prediction-center";
import { ProjectPortfolio } from "@/components/command-center/project-portfolio";
import { RecommendedAction } from "@/components/command-center/recommended-action";

export const metadata = {
  title: "Command Center",
};

export default function CommandCenterPage() {
  return (
    <AppShell
      title="Command Center"
      description="Your construction intelligence briefing"
      wide
    >
      <div className="mx-auto w-full max-w-[720px] px-0 pb-16 sm:px-0">
        <ExecutiveBrief />

        <div className="mt-16 sm:mt-20">
          <MetricsRow />
        </div>

        <div className="mt-14 sm:mt-16">
          <RecommendedAction />
        </div>

        <div className="mt-10 sm:mt-12">
          <CommandBar />
        </div>

        <div className="mt-16 border-t border-white/[0.04] pt-16 sm:mt-20 sm:pt-20">
          <ProjectPortfolio />

          <div className="mt-14 sm:mt-16">
            <ActivityFeed />
          </div>

          <div className="mt-14 sm:mt-16">
            <PredictionCenter />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
