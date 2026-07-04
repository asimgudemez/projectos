import { getProjectById, type Project } from "@/lib/projects-data";
import {
  Bot,
  CalendarRange,
  CircleDollarSign,
  ClipboardCheck,
  FileText,
  HardHat,
  LayoutGrid,
  Package,
  PenTool,
  Settings,
  Shield,
  type LucideIcon,
} from "lucide-react";

export type WorkspaceNavId =
  | "overview"
  | "planning"
  | "construction"
  | "engineering"
  | "procurement"
  | "qa-qc"
  | "hse"
  | "commercial"
  | "documents"
  | "ai-assistant"
  | "settings";

export type WorkspaceNavItem = {
  id: WorkspaceNavId;
  label: string;
  icon: LucideIcon;
  href: (projectId: string) => string;
};

export const workspaceNavItems: WorkspaceNavItem[] = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutGrid,
    href: (id) => `/projects/${id}`,
  },
  {
    id: "ai-assistant",
    label: "AI Assistant",
    icon: Bot,
    href: (id) => `/projects/${id}/ai-assistant`,
  },
  {
    id: "planning",
    label: "Planning",
    icon: CalendarRange,
    href: (id) => `/projects/${id}/planning`,
  },
  {
    id: "construction",
    label: "Construction",
    icon: HardHat,
    href: (id) => `/projects/${id}/construction`,
  },
  {
    id: "engineering",
    label: "Engineering",
    icon: PenTool,
    href: (id) => `/projects/${id}/engineering`,
  },
  {
    id: "procurement",
    label: "Procurement",
    icon: Package,
    href: (id) => `/projects/${id}/procurement`,
  },
  {
    id: "qa-qc",
    label: "QA/QC",
    icon: ClipboardCheck,
    href: (id) => `/projects/${id}/qa-qc`,
  },
  {
    id: "hse",
    label: "HSE",
    icon: Shield,
    href: (id) => `/projects/${id}/hse`,
  },
  {
    id: "commercial",
    label: "Commercial",
    icon: CircleDollarSign,
    href: (id) => `/projects/${id}/commercial`,
  },
  {
    id: "documents",
    label: "Documents",
    icon: FileText,
    href: (id) => `/projects/${id}/documents`,
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    href: (id) => `/projects/${id}/settings`,
  },
];

export type CriticalRisk = {
  id: string;
  title: string;
  impact: string;
  owner: string;
  level: "critical" | "high" | "medium";
};

export type PriorityItem = {
  id: string;
  title: string;
  due: string;
  owner: string;
};

export type WorkspaceMilestone = {
  id: string;
  name: string;
  date: string;
  status: "upcoming" | "at-risk" | "completed";
};

export type RfiItem = {
  id: string;
  number: string;
  subject: string;
  status: string;
  daysOpen: number;
};

export type SubmittalItem = {
  id: string;
  number: string;
  title: string;
  status: string;
  reviewer: string;
};

export type DocumentItem = {
  id: string;
  name: string;
  type: string;
  updated: string;
};

export type MaterialItem = {
  id: string;
  name: string;
  status: "on-track" | "delayed" | "critical";
  detail: string;
};

export type ManpowerItem = {
  id: string;
  trade: string;
  planned: number;
  actual: number;
  unit: string;
};

export type EquipmentItem = {
  id: string;
  name: string;
  status: "active" | "idle" | "maintenance";
  detail: string;
};

export type AiRecommendation = {
  id: string;
  title: string;
  impact: string;
  action: string;
};

export type ProjectWorkspaceData = {
  project: Project;
  criticalAlerts: string[];
  executiveBrief: string[];
  criticalRisks: CriticalRisk[];
  todaysPriorities: PriorityItem[];
  milestones: WorkspaceMilestone[];
  rfis: RfiItem[];
  submittals: SubmittalItem[];
  documents: DocumentItem[];
  materials: MaterialItem[];
  manpower: ManpowerItem[];
  equipment: EquipmentItem[];
  aiRecommendations: AiRecommendation[];
};

const amaalaWorkspace: Omit<ProjectWorkspaceData, "project"> = {
  criticalAlerts: [
    "Pump delivery 11 days behind PO commitment",
    "Façade interface clash at Level 2 MEP routing",
  ],
  executiveBrief: [
    "AMAALA Block C MEP rough-in is 4% ahead of plan on Level 3, but chilled water pump delivery remains the primary schedule threat with an 11-day supplier slippage.",
    "Structural consultant approved RFI-214 this morning, clearing the Level 2 beam penetration detail.",
    "Ductwork subcontractor crew is at 78% of planned headcount — sufficient for current week but insufficient for Week 29 milestone.",
    "Payment certificate PC-06 is ready for commercial review. No budget overrun signals detected this week.",
  ],
  criticalRisks: [
    {
      id: "r1",
      title: "Chilled water pump delivery slippage",
      impact: "5-day critical path exposure on plant energization",
      owner: "Procurement · Sarah Mitchell",
      level: "critical",
    },
    {
      id: "r2",
      title: "Façade–MEP interface clash Level 2",
      impact: "Potential rework if unresolved before ceiling close-out",
      owner: "Engineering · Omar Hassan",
      level: "high",
    },
    {
      id: "r3",
      title: "Ductwork manpower shortfall",
      impact: "Week 29 milestone at risk if not closed by Friday",
      owner: "Construction · Sarah Mitchell",
      level: "medium",
    },
  ],
  todaysPriorities: [
    {
      id: "p1",
      title: "Expedite pump delivery with alternate supplier",
      due: "Today · 14:00",
      owner: "Sarah Mitchell",
    },
    {
      id: "p2",
      title: "Review PC-06 payment certificate",
      due: "Today · EOD",
      owner: "David Chen",
    },
    {
      id: "p3",
      title: "Close coordination workshop — façade vs MEP",
      due: "Today · 16:30",
      owner: "Omar Hassan",
    },
    {
      id: "p4",
      title: "Approve shop drawing SD-MEP-042",
      due: "Tomorrow · 10:00",
      owner: "Anna Petrov",
    },
  ],
  milestones: [
    {
      id: "m1",
      name: "MEP Rough-In Complete",
      date: "18 Jul 2026",
      status: "upcoming",
    },
    {
      id: "m2",
      name: "Chilled Water Plant Energized",
      date: "02 Aug 2026",
      status: "at-risk",
    },
    {
      id: "m3",
      name: "Level 4 Ceiling Close-Out",
      date: "15 Aug 2026",
      status: "upcoming",
    },
    {
      id: "m4",
      name: "Testing & Commissioning Start",
      date: "12 Sep 2026",
      status: "upcoming",
    },
  ],
  rfis: [
    {
      id: "rfi1",
      number: "RFI-214",
      subject: "Level 2 beam penetration detail",
      status: "Approved",
      daysOpen: 6,
    },
    {
      id: "rfi2",
      number: "RFI-219",
      subject: "Chilled water pipe routing Level 3",
      status: "Awaiting consultant",
      daysOpen: 3,
    },
    {
      id: "rfi3",
      number: "RFI-221",
      subject: "Façade bracket load transfer",
      status: "Overdue",
      daysOpen: 9,
    },
  ],
  submittals: [
    {
      id: "s1",
      number: "SD-MEP-042",
      title: "Chilled water pump technical submittal",
      status: "Under review",
      reviewer: "Consultant MEP",
    },
    {
      id: "s2",
      number: "SD-STR-018",
      title: "Level 3 deck reinforcement shop drawings",
      status: "Approved",
      reviewer: "Structural consultant",
    },
    {
      id: "s3",
      number: "SD-FAÇ-007",
      title: "Unitized curtain wall panel sample",
      status: "Revise & resubmit",
      reviewer: "Architect",
    },
  ],
  documents: [
    {
      id: "d1",
      name: "Weekly Progress Report W26",
      type: "Report",
      updated: "Today · 07:30",
    },
    {
      id: "d2",
      name: "MEP Coordination Drawing L3",
      type: "Drawing",
      updated: "Yesterday",
    },
    {
      id: "d3",
      name: "PC-06 Payment Certificate",
      type: "Commercial",
      updated: "Yesterday",
    },
    {
      id: "d4",
      name: "Inspection Report IR-QA-118",
      type: "QA/QC",
      updated: "2 days ago",
    },
  ],
  materials: [
    {
      id: "mat1",
      name: "Chilled water pumps (2 off)",
      status: "critical",
      detail: "11 days behind PO date · Supplier: FlowTech",
    },
    {
      id: "mat2",
      name: "Ductwork — Level 3 batch",
      status: "on-track",
      detail: "Delivery confirmed 16 Jul · On site",
    },
    {
      id: "mat3",
      name: "Switchgear SG-07",
      status: "delayed",
      detail: "Factory test delayed 5 days",
    },
    {
      id: "mat4",
      name: "Façade brackets Type B",
      status: "on-track",
      detail: "Customs cleared · ETA 14 Jul",
    },
  ],
  manpower: [
    { id: "mp1", trade: "MEP ductwork crew", planned: 24, actual: 19, unit: "workers" },
    { id: "mp2", trade: "Plumbers", planned: 12, actual: 12, unit: "workers" },
    { id: "mp3", trade: "Electricians", planned: 16, actual: 14, unit: "workers" },
    { id: "mp4", trade: "Façade installers", planned: 10, actual: 8, unit: "workers" },
  ],
  equipment: [
    {
      id: "eq1",
      name: "Tower crane TC-01",
      status: "active",
      detail: "Operational · 92% utilization this week",
    },
    {
      id: "eq2",
      name: "Mobile crane MC-03",
      status: "maintenance",
      detail: "Scheduled service · Returns 15 Jul",
    },
    {
      id: "eq3",
      name: "Scaffolding Level 4",
      status: "active",
      detail: "Erected · Inspection valid to 28 Jul",
    },
    {
      id: "eq4",
      name: "Concrete pump CP-02",
      status: "idle",
      detail: "Standby · Next pour 17 Jul",
    },
  ],
  aiRecommendations: [
    {
      id: "ai1",
      title: "Activate alternate pump supplier",
      impact: "Recover 3–5 days on plant energization milestone",
      action: "Start Investigation",
    },
    {
      id: "ai2",
      title: "Hold coordination workshop today",
      impact: "Prevent Level 2 MEP rework before ceiling close-out",
      action: "Schedule Now",
    },
    {
      id: "ai3",
      title: "Request 5 additional ductwork workers",
      impact: "Close Week 29 manpower gap before milestone slip",
      action: "Review Plan",
    },
  ],
};

function buildGenericWorkspace(project: Project): ProjectWorkspaceData {
  return {
    project,
    criticalAlerts: project.isDelayed
      ? [`Project ${project.status.toLowerCase()} — review recovery plan`]
      : [`${project.riskLevel} risk on ${project.currentPhase}`],
    executiveBrief: [
      `${project.name} is executing ${project.currentPhase} at ${project.progress}% overall progress with a health score of ${project.healthScore}%.`,
      `Contract value ${project.contractValueLabel}. Project Director ${project.projectDirector} reports ${project.riskLevel.toLowerCase()} risk exposure.`,
      `Next milestone: ${project.nextMilestone} due ${project.nextMilestoneDate}.`,
    ],
    criticalRisks: [
      {
        id: "r1",
        title: `${project.riskLevel} risk on critical path`,
        impact: "Requires weekly director review",
        owner: project.projectManager,
        level: project.health === "critical" ? "critical" : "high",
      },
    ],
    todaysPriorities: [
      {
        id: "p1",
        title: `Review ${project.currentPhase} weekly plan`,
        due: "Today",
        owner: project.constructionManager,
      },
    ],
    milestones: [
      {
        id: "m1",
        name: project.nextMilestone,
        date: project.nextMilestoneDate,
        status: project.isDelayed ? "at-risk" : "upcoming",
      },
    ],
    rfis: [
      {
        id: "rfi1",
        number: "RFI-101",
        subject: `${project.currentPhase} coordination query`,
        status: "Open",
        daysOpen: 4,
      },
    ],
    submittals: [
      {
        id: "s1",
        number: "SD-001",
        title: `${project.currentPhase} shop drawing package`,
        status: "Under review",
        reviewer: "Consultant",
      },
    ],
    documents: [
      {
        id: "d1",
        name: "Weekly Progress Report",
        type: "Report",
        updated: "Today",
      },
    ],
    materials: [
      {
        id: "mat1",
        name: "Primary package delivery",
        status: project.isDelayed ? "delayed" : "on-track",
        detail: "Monitor supplier commitment dates",
      },
    ],
    manpower: [
      {
        id: "mp1",
        trade: "Site crew",
        planned: 20,
        actual: project.health === "critical" ? 14 : 18,
        unit: "workers",
      },
    ],
    equipment: [
      {
        id: "eq1",
        name: "Primary crane",
        status: "active",
        detail: "Operational on site",
      },
    ],
    aiRecommendations: [
      {
        id: "ai1",
        title: `Review ${project.currentPhase} delivery plan`,
        impact: "Maintain milestone commitment",
        action: "Start Investigation",
      },
    ],
  };
}

export function getProjectWorkspace(
  projectId: string
): ProjectWorkspaceData | null {
  const project = getProjectById(projectId);
  if (!project) return null;

  if (projectId === "amaala") {
    return { project, ...amaalaWorkspace };
  }

  return buildGenericWorkspace(project);
}

export const riskLevelDot = {
  critical: "bg-rose-400",
  high: "bg-amber-400",
  medium: "bg-muted-foreground/50",
} as const;

export const materialStatusStyle = {
  "on-track": "text-emerald-400",
  delayed: "text-amber-400",
  critical: "text-rose-400",
} as const;

export const equipmentStatusStyle = {
  active: "text-emerald-400",
  idle: "text-muted-foreground",
  maintenance: "text-amber-400",
} as const;
