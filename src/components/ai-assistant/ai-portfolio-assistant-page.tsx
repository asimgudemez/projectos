"use client";

import { AiAssistantWorkspace } from "@/components/ai-assistant/ai-assistant-workspace";

export function AiPortfolioAssistantPage() {
  return (
    <AiAssistantWorkspace
      scope={{ kind: "portfolio" }}
      projectId={null}
      headline="AI Construction Assistant"
      subheadline="Portfolio-wide intelligence — ask about projects, risks, RFIs, and reports"
    />
  );
}
