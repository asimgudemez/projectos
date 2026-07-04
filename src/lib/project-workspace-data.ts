import { getProjectById, type Project } from "@/lib/projects-data";

export type CriticalIssue = {
  id: string;
  title: string;
  impact: string;
  owner: string;
  priority: "critical" | "high" | "medium";
};

export type WorkspaceMilestone = {
  id: string;
  name: string;
  date: string;
  status: "upcoming" | "at-risk" | "completed";
};

export type AiRecommendation = {
  id: string;
  title: string;
  impact: string;
  action: string;
};

export type WorkspaceActivity = {
  id: string;
  time: string;
  text: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  company: string;
};

export type ProjectWorkspaceData = {
  project: Project;
  budgetLabel: string;
  budgetVariance: string;
  delayDays: number;
  delayLabel: string;
  executiveBrief: string[];
  criticalIssues: CriticalIssue[];
  milestones: WorkspaceMilestone[];
  aiRecommendations: AiRecommendation[];
  recentActivity: WorkspaceActivity[];
  team: TeamMember[];
};

export const workspaceTabs = [
  { id: "overview", label: "Overview" },
  { id: "planning", label: "Planning" },
  { id: "construction", label: "Construction" },
  { id: "engineering", label: "Engineering" },
  { id: "procurement", label: "Procurement" },
  { id: "commercial", label: "Commercial" },
  { id: "qa-qc", label: "QA/QC" },
  { id: "documents", label: "Documents" },
  { id: "meetings", label: "Meetings" },
  { id: "ai", label: "AI" },
] as const;

export type WorkspaceTabId = (typeof workspaceTabs)[number]["id"];

const amaalaWorkspace: Omit<ProjectWorkspaceData, "project"> = {
  budgetLabel: "SAR 272M / 425M",
  budgetVariance: "2.1% under budget",
  delayDays: 0,
  delayLabel: "On schedule",
  executiveBrief: [
    "Chilled water pump delivery is 11 days behind supplier commitment.",
    "MEP rough-in progressing 4% ahead of plan on Level 3.",
    "RFI-214 received consultant approval this morning.",
    "Payment certificate PC-06 ready for commercial review.",
  ],
  criticalIssues: [
    {
      id: "ci-1",
      title: "Pump delivery slippage",
      impact: "Potential 5-day critical path delay",
      owner: "Procurement · Sarah Mitchell",
      priority: "critical",
    },
    {
      id: "ci-2",
      title: "Façade interface coordination",
      impact: "Clash with MEP routing at Level 2",
      owner: "Engineering · Omar Hassan",
      priority: "high",
    },
    {
      id: "ci-3",
      title: "Subcontractor manpower gap",
      impact: "Ductwork crew at 78% of planned headcount",
      owner: "Construction · Sarah Mitchell",
      priority: "medium",
    },
  ],
  milestones: [
    {
      id: "ms-1",
      name: "MEP Rough-In Complete",
      date: "18 Jul 2026",
      status: "upcoming",
    },
    {
      id: "ms-2",
      name: "Chilled Water Plant Energized",
      date: "02 Aug 2026",
      status: "at-risk",
    },
    {
      id: "ms-3",
      name: "Level 4 Ceiling Close-Out",
      date: "15 Aug 2026",
      status: "upcoming",
    },
    {
      id: "ms-4",
      name: "Testing & Commissioning Start",
      date: "12 Sep 2026",
      status: "upcoming",
    },
  ],
  aiRecommendations: [
    {
      id: "ai-1",
      title: "Expedite pump delivery with alternate supplier",
      impact: "Recover 3–5 days on critical path",
      action: "Start Investigation",
    },
    {
      id: "ai-2",
      title: "Schedule coordination workshop — façade vs MEP",
      impact: "Prevent rework on Level 2 routing",
      action: "Schedule Meeting",
    },
    {
      id: "ai-3",
      title: "Request additional ductwork crew for Week 28",
      impact: "Close manpower gap before milestone slip",
      action: "Review Plan",
    },
  ],
  recentActivity: [
    { id: "a-1", time: "09:10", text: "RFI-214 approved by structural consultant" },
    { id: "a-2", time: "08:45", text: "Shop drawing SD-MEP-042 uploaded" },
    { id: "a-3", time: "07:30", text: "AI flagged pump delivery slippage" },
    { id: "a-4", time: "Yesterday", text: "Level 3 rough-in inspection passed" },
    { id: "a-5", time: "Yesterday", text: "Weekly progress report generated" },
  ],
  team: [
    {
      id: "t-1",
      name: "Khalid Al-Rashid",
      role: "Project Director",
      company: "Nexora Labs",
    },
    {
      id: "t-2",
      name: "Omar Hassan",
      role: "Project Manager",
      company: "Nexora Labs",
    },
    {
      id: "t-3",
      name: "Sarah Mitchell",
      role: "Construction Manager",
      company: "Nexora Labs",
    },
    {
      id: "t-4",
      name: "Fatima Al-Zahrani",
      role: "Planning Engineer",
      company: "Nexora Labs",
    },
    {
      id: "t-5",
      name: "David Chen",
      role: "Commercial Manager",
      company: "Nexora Labs",
    },
    {
      id: "t-6",
      name: "Anna Petrov",
      role: "QA/QC Lead",
      company: "Nexora Labs",
    },
  ],
};

function buildGenericWorkspace(project: Project): ProjectWorkspaceData {
  return {
    project,
    budgetLabel: `${project.contractValueLabel} contract`,
    budgetVariance: project.health === "healthy" ? "Within tolerance" : "Review required",
    delayDays: project.isDelayed ? 12 : 0,
    delayLabel: project.isDelayed ? "12 days behind" : "On schedule",
    executiveBrief: [
      `${project.name} is in ${project.currentPhase} phase at ${project.progress}% progress.`,
      `Health score is ${project.healthScore}% with ${project.riskLevel.toLowerCase()} risk exposure.`,
      `Next milestone: ${project.nextMilestone} due ${project.nextMilestoneDate}.`,
      `${project.status} status — monitored by ${project.projectManager}.`,
    ],
    criticalIssues: [
      {
        id: "ci-1",
        title: `${project.riskLevel} risk exposure on critical path`,
        impact: "Requires director attention this week",
        owner: project.projectManager,
        priority: project.health === "critical" ? "critical" : "high",
      },
    ],
    milestones: [
      {
        id: "ms-1",
        name: project.nextMilestone,
        date: project.nextMilestoneDate,
        status: project.isDelayed ? "at-risk" : "upcoming",
      },
    ],
    aiRecommendations: [
      {
        id: "ai-1",
        title: `Review ${project.currentPhase} delivery plan`,
        impact: "Maintain milestone commitment",
        action: "Start Investigation",
      },
    ],
    recentActivity: [
      {
        id: "a-1",
        time: "Today",
        text: "Project workspace synced with portfolio data",
      },
    ],
    team: [
      {
        id: "t-1",
        name: project.projectDirector,
        role: "Project Director",
        company: "Nexora Labs",
      },
      {
        id: "t-2",
        name: project.projectManager,
        role: "Project Manager",
        company: "Nexora Labs",
      },
      {
        id: "t-3",
        name: project.constructionManager,
        role: "Construction Manager",
        company: "Nexora Labs",
      },
    ],
  };
}

export function getProjectWorkspace(projectId: string): ProjectWorkspaceData | null {
  const project = getProjectById(projectId);
  if (!project) return null;

  if (projectId === "amaala") {
    return { project, ...amaalaWorkspace };
  }

  return buildGenericWorkspace(project);
}

export const priorityDot = {
  critical: "bg-rose-400",
  high: "bg-amber-400",
  medium: "bg-muted-foreground/50",
} as const;

export const milestoneStatusStyle = {
  upcoming: "text-muted-foreground",
  "at-risk": "text-amber-400",
  completed: "text-emerald-400",
} as const;
