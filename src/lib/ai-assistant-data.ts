import { attentionQueue, morningBrief } from "@/lib/command-center-data";
import { getEngineeringData } from "@/lib/engineering-data";
import {
  getImportedActionsStats,
  type ImportedActionsStats,
} from "@/lib/insights/imported-actions";
import { resolveProjectId } from "@/lib/data/adapters/mock/fixtures/ids";
import {
  getProjectWorkspace,
  type ProjectWorkspaceData,
} from "@/lib/project-workspace-data";
import { projects, type Project } from "@/lib/projects-data";

export const assistantPromptSuggestions = [
  "Which RFIs are delaying construction?",
  "Show overdue submittals",
  "Which actions are overdue?",
  "Which items require immediate follow-up?",
  "Who is responsible for pending actions?",
  "Summarize the imported follow-up tracker",
  "What are the top 5 risks from this file?",
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
  importedActions: ImportedActionsStats;
};

export type AiPortfolioContext = {
  projects: Project[];
  morningBrief: string;
  attentionQueue: typeof attentionQueue;
  importedActions: ImportedActionsStats;
};

export function getAiProjectContext(
  projectId: string
): AiProjectContext | null {
  const workspace = getProjectWorkspace(projectId);
  if (!workspace) return null;

  const resolvedId = resolveProjectId(projectId);

  return {
    project: workspace.project,
    workspace,
    engineering: getEngineeringData(projectId),
    importedActions: getImportedActionsStats(resolvedId),
  };
}

export function getAiPortfolioContext(): AiPortfolioContext {
  return {
    projects,
    morningBrief,
    attentionQueue,
    importedActions: getImportedActionsStats(),
  };
}

export function getConversationScopeKey(
  scope: AiProjectContext | "portfolio"
): string {
  if (scope === "portfolio") return "portfolio";
  return scope.project.id;
}
