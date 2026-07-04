import { AppShell } from "@/components/layout/app-shell";
import { AiPortfolioAssistantPage } from "@/components/ai-assistant/ai-portfolio-assistant-page";

export const metadata = {
  title: "AI Assistant · ProjectOS",
  description: "Construction intelligence assistant grounded in project data",
};

export default function AiAssistantRoutePage() {
  return (
    <AppShell
      title="AI Assistant"
      description="Construction intelligence grounded in your project data"
      fullWidth
    >
      <AiPortfolioAssistantPage />
    </AppShell>
  );
}
