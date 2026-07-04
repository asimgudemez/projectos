"use client";

import { AiAssistantWorkspace } from "@/components/ai-assistant/ai-assistant-workspace";

type AiAssistantPageProps = {
  projectId: string;
  projectName: string;
};

export function AiAssistantPage({ projectId, projectName }: AiAssistantPageProps) {
  return (
    <AiAssistantWorkspace
      scope={{ kind: "project", projectId, projectName }}
      projectId={projectId}
      headline="AI Construction Assistant"
      subheadline={`Ask anything about ${projectName} — answers reference live project data`}
    />
  );
}
