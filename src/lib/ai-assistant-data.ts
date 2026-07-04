import { attentionQueue, morningBrief } from "@/lib/command-center-data";
import { getEngineeringData } from "@/lib/engineering-data";
import {
  getProjectWorkspace,
  type ProjectWorkspaceData,
} from "@/lib/project-workspace-data";
import { projects, type Project } from "@/lib/projects-data";

export const assistantPromptSuggestions = [
  "Which RFIs are delaying construction?",
  "Show overdue submittals",
  "What activities are critical this week?",
  "Which supplier is delaying the project?",
  "Predict project completion",
  "Generate today's executive report",
  "Generate weekly client report",
  "Which manpower is below target?",
  "Show procurement risks",
  "Which drawings affect Area A?",
];

export type AiProjectContext = {
  project: Project;
  workspace: ProjectWorkspaceData;
  engineering: ReturnType<typeof getEngineeringData>;
};

export type AiPortfolioContext = {
  projects: Project[];
  morningBrief: string;
  attentionQueue: typeof attentionQueue;
};

export function getAiProjectContext(
  projectId: string
): AiProjectContext | null {
  const workspace = getProjectWorkspace(projectId);
  if (!workspace) return null;

  return {
    project: workspace.project,
    workspace,
    engineering: getEngineeringData(projectId),
  };
}

export function getAiPortfolioContext(): AiPortfolioContext {
  return {
    projects,
    morningBrief,
    attentionQueue,
  };
}

export function getConversationScopeKey(
  scope: AiProjectContext | "portfolio"
): string {
  if (scope === "portfolio") return "portfolio";
  return scope.project.id;
}
