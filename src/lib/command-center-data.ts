export type AttentionPriority = "critical" | "high" | "medium";

export type AttentionItem = {
  id: string;
  title: string;
  project: string;
  reason: string;
  priority: AttentionPriority;
};

export type DecisionItem = {
  id: string;
  label: string;
  project: string;
  meta?: string;
};

export type ProjectStatus = "healthy" | "at-risk" | "critical";

export type ProjectSnapshot = {
  id: string;
  name: string;
  health: number;
  status: ProjectStatus;
};

export type OperationItem = {
  id: string;
  label: string;
  project: string;
  detail: string;
};

export type MeetingItem = {
  id: string;
  time: string;
  title: string;
  project?: string;
  location?: string;
};

export const workspaceContext = {
  greeting: "Good morning, Asim",
  dateLabel: "Saturday, 4 July",
  syncLabel: "Portfolio synced 2m ago",
  activeProjects: 12,
  attentionCount: 3,
  decisionsCount: 6,
};

export const morningBrief =
  "Overnight: 2 RFIs received consultant responses. AMAALA chilled-water pump delivery is 11 days behind supplier commitment. Payment certificate PC-07 for NEOM Oxagon is due today. Three submittals and one variation order require your signature before noon.";

export const attentionQueue: AttentionItem[] = [
  {
    id: "att-1",
    title: "Pump delivery at risk",
    project: "AMAALA Block C",
    reason: "May cause 5-day delay on critical path",
    priority: "critical",
  },
  {
    id: "att-2",
    title: "RFI-218 overdue",
    project: "Qiddiya Entertainment",
    reason: "Consultant response 4 days past due",
    priority: "high",
  },
  {
    id: "att-3",
    title: "Manpower below target",
    project: "Red Sea Airport",
    reason: "MEP crew at 68% of planned headcount",
    priority: "high",
  },
  {
    id: "att-4",
    title: "Concrete supply constraint",
    project: "NEOM Oxagon",
    reason: "Batch plant allocation reduced this week",
    priority: "medium",
  },
];

export const decisionsToday = {
  approve: [
    {
      id: "ap-1",
      label: "Submittal REV-04 — Façade panels",
      project: "AMAALA",
      meta: "Due by 12:00",
    },
    {
      id: "ap-2",
      label: "Shop drawings PKG-2 — HVAC",
      project: "Riyadh Metro Line 3",
      meta: "Consultant cleared",
    },
    {
      id: "ap-3",
      label: "Variation Order VO-112",
      project: "Diriyah Gate",
      meta: "SAR 840K",
    },
  ] as DecisionItem[],
  pay: [
    {
      id: "py-1",
      label: "Payment Certificate PC-07",
      project: "NEOM Oxagon",
      meta: "SAR 2.4M · Due today",
    },
    {
      id: "py-2",
      label: "Retention release — MEP package",
      project: "AMAALA",
      meta: "SAR 620K",
    },
  ] as DecisionItem[],
  review: [
    {
      id: "rv-1",
      label: "Weekly executive report",
      project: "Portfolio",
      meta: "Ready for sign-off",
    },
    {
      id: "rv-2",
      label: "Procurement exception M1",
      project: "AMAALA",
      meta: "Installation impact",
    },
  ] as DecisionItem[],
};

export const projectSnapshots: ProjectSnapshot[] = [
  { id: "p1", name: "AMAALA", health: 87, status: "healthy" },
  { id: "p2", name: "NEOM Oxagon", health: 72, status: "at-risk" },
  { id: "p3", name: "Riyadh Metro L3", health: 91, status: "healthy" },
  { id: "p4", name: "Qiddiya", health: 58, status: "critical" },
  { id: "p5", name: "Diriyah Gate", health: 84, status: "healthy" },
  { id: "p6", name: "Red Sea Airport", health: 79, status: "at-risk" },
];

export const rfisWaiting = {
  total: 14,
  overdue: 6,
  items: [
    {
      id: "rfi-1",
      label: "RFI-214",
      project: "AMAALA",
      detail: "Awaiting structural consultant",
    },
    {
      id: "rfi-2",
      label: "RFI-218",
      project: "Qiddiya",
      detail: "4 days overdue",
    },
    {
      id: "rfi-3",
      label: "RFI-221",
      project: "NEOM Oxagon",
      detail: "MEP coordination",
    },
  ] as OperationItem[],
};

export const materialsMissing = {
  total: 8,
  items: [
    {
      id: "mat-1",
      label: "Chilled water pumps",
      project: "AMAALA",
      detail: "11 days behind PO date",
    },
    {
      id: "mat-2",
      label: "Façade panel batch 4",
      project: "Qiddiya",
      detail: "Customs clearance pending",
    },
    {
      id: "mat-3",
      label: "Switchgear panel SG-07",
      project: "Red Sea Airport",
      detail: "Factory test delayed",
    },
  ] as OperationItem[],
};

export const manpowerGaps = {
  total: 3,
  items: [
    {
      id: "mp-1",
      label: "MEP crew",
      project: "Red Sea Airport",
      detail: "68% of planned headcount",
    },
    {
      id: "mp-2",
      label: "Steel fixers",
      project: "NEOM Oxagon",
      detail: "74% of planned headcount",
    },
    {
      id: "mp-3",
      label: "Façade installers",
      project: "Qiddiya",
      detail: "61% of planned headcount",
    },
  ] as OperationItem[],
};

export const meetingsToday: MeetingItem[] = [
  {
    id: "mt-1",
    time: "09:00",
    title: "Executive standup",
    location: "Boardroom A",
  },
  {
    id: "mt-2",
    time: "11:30",
    title: "Consultant sync",
    project: "AMAALA",
    location: "Teams",
  },
  {
    id: "mt-3",
    time: "14:00",
    title: "PC review board",
    project: "NEOM Oxagon",
    location: "Finance suite",
  },
  {
    id: "mt-4",
    time: "16:30",
    title: "Procurement escalation",
    project: "Qiddiya",
    location: "Site office",
  },
];

export const liveSignals = [
  { time: "06:42", text: "RFI-214 approved by consultant" },
  { time: "06:18", text: "Shop drawing uploaded — Metro L3" },
  { time: "05:55", text: "AI flagged pump delivery slippage" },
];

export const statusLabels: Record<ProjectStatus, string> = {
  healthy: "Healthy",
  "at-risk": "At risk",
  critical: "Critical",
};

export const statusDot: Record<ProjectStatus, string> = {
  healthy: "bg-emerald-400",
  "at-risk": "bg-amber-400",
  critical: "bg-rose-400",
};

export const priorityDot: Record<AttentionPriority, string> = {
  critical: "bg-rose-400",
  high: "bg-amber-400",
  medium: "bg-muted-foreground/50",
};
