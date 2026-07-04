export type EngineeringPriority = "Critical" | "High" | "Medium" | "Low";

export type EngineeringRecord = {
  id: string;
  reference: string;
  title: string;
  status: string;
  responsibleEngineer: string;
  consultant: string;
  submissionDate: string;
  dueDate: string;
  priority: EngineeringPriority;
  revision: string;
  aiSummary: string;
};

export type DrawingType = "ifc" | "shop" | "red-mark" | "as-built" | "revision-history";

export type DrawingRecord = EngineeringRecord & {
  drawingType: DrawingType;
  discipline: string;
};

export type RfiStatus =
  | "Open"
  | "Under Review"
  | "Approved"
  | "Rejected"
  | "Overdue";

export type RfiRecord = EngineeringRecord & {
  rfiStatus: RfiStatus;
  daysOpen: number;
};

export type EngineeringKpis = {
  openRfis: number;
  approvedRfis: number;
  avgApprovalDays: number;
  pendingDrawings: number;
  pendingSubmittals: number;
  criticalIssues: number;
};

export type EngineeringSectionId =
  | "drawings"
  | "rfi"
  | "technical-queries"
  | "material-submittals"
  | "method-statements"
  | "itp"
  | "material-approval"
  | "design-changes"
  | "interface-issues"
  | "dashboard";

export const engineeringSections: {
  id: EngineeringSectionId;
  label: string;
}[] = [
  { id: "drawings", label: "Drawings" },
  { id: "rfi", label: "RFI Management" },
  { id: "technical-queries", label: "Technical Queries" },
  { id: "material-submittals", label: "Material Submittals" },
  { id: "method-statements", label: "Method Statements" },
  { id: "itp", label: "ITP" },
  { id: "material-approval", label: "Material Approval" },
  { id: "design-changes", label: "Design Changes" },
  { id: "interface-issues", label: "Interface Issues" },
  { id: "dashboard", label: "Engineering Dashboard" },
];

export const drawingCategories: { id: DrawingType; label: string }[] = [
  { id: "ifc", label: "IFC" },
  { id: "shop", label: "Shop Drawings" },
  { id: "red-mark", label: "Red Mark" },
  { id: "as-built", label: "As Built" },
  { id: "revision-history", label: "Revision History" },
];

export const rfiFilters: { id: RfiStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "Open", label: "Open" },
  { id: "Under Review", label: "Under Review" },
  { id: "Approved", label: "Approved" },
  { id: "Rejected", label: "Rejected" },
  { id: "Overdue", label: "Overdue" },
];

export const engineeringAiPrompts = [
  "Why is this RFI delayed?",
  "Predict approval date",
  "Which drawings affect construction?",
  "Generate weekly engineering report",
];

export type EngineeringModuleData = {
  kpis: EngineeringKpis;
  drawings: DrawingRecord[];
  rfis: RfiRecord[];
  technicalQueries: EngineeringRecord[];
  materialSubmittals: EngineeringRecord[];
  methodStatements: EngineeringRecord[];
  itps: EngineeringRecord[];
  materialApprovals: EngineeringRecord[];
  designChanges: EngineeringRecord[];
  interfaceIssues: EngineeringRecord[];
  dashboardHighlights: {
    label: string;
    value: string;
    detail: string;
  }[];
};

const amaalaEngineering: EngineeringModuleData = {
  kpis: {
    openRfis: 14,
    approvedRfis: 87,
    avgApprovalDays: 6.2,
    pendingDrawings: 23,
    pendingSubmittals: 11,
    criticalIssues: 4,
  },
  drawings: [
    {
      id: "dr-1",
      reference: "MEP-IFC-L3-001",
      title: "Level 3 MEP coordination layout",
      drawingType: "ifc",
      discipline: "MEP",
      status: "Approved",
      responsibleEngineer: "Omar Hassan",
      consultant: "WSP MEP",
      submissionDate: "28 Jun 2026",
      dueDate: "05 Jul 2026",
      priority: "High",
      revision: "Rev C",
      aiSummary: "Approved. No construction hold points on Level 3 rough-in.",
    },
    {
      id: "dr-2",
      reference: "STR-SD-L2-018",
      title: "Level 2 deck reinforcement details",
      drawingType: "shop",
      discipline: "Structural",
      status: "Under Review",
      responsibleEngineer: "Fatima Al-Zahrani",
      consultant: "Arup Structural",
      submissionDate: "01 Jul 2026",
      dueDate: "08 Jul 2026",
      priority: "Critical",
      revision: "Rev B",
      aiSummary: "Consultant reviewing bar spacing at Grid 4-C. Response expected 07 Jul.",
    },
    {
      id: "dr-3",
      reference: "MEP-RM-L2-004",
      title: "Level 2 chilled water routing red mark",
      drawingType: "red-mark",
      discipline: "MEP",
      status: "Open",
      responsibleEngineer: "Omar Hassan",
      consultant: "WSP MEP",
      submissionDate: "03 Jul 2026",
      dueDate: "10 Jul 2026",
      priority: "Critical",
      revision: "Rev 0",
      aiSummary: "Façade bracket conflict flagged. Blocks ceiling close-out if unresolved.",
    },
    {
      id: "dr-4",
      reference: "MEP-AB-L1-002",
      title: "Level 1 as-built drainage layout",
      drawingType: "as-built",
      discipline: "MEP",
      status: "Approved",
      responsibleEngineer: "David Chen",
      consultant: "WSP MEP",
      submissionDate: "20 Jun 2026",
      dueDate: "27 Jun 2026",
      priority: "Medium",
      revision: "Rev A",
      aiSummary: "As-built matches site survey within 15mm tolerance.",
    },
    {
      id: "dr-5",
      reference: "FAÇ-IFC-EXT-012",
      title: "Unitized curtain wall panel layout",
      drawingType: "ifc",
      discipline: "Façade",
      status: "Pending",
      responsibleEngineer: "Anna Petrov",
      consultant: "Foster + Partners",
      submissionDate: "02 Jul 2026",
      dueDate: "12 Jul 2026",
      priority: "High",
      revision: "Rev D",
      aiSummary: "Awaiting architect markup on bracket detail at Level 2.",
    },
    {
      id: "dr-6",
      reference: "MEP-SD-PUMP-042",
      title: "Chilled water pump arrangement",
      drawingType: "shop",
      discipline: "MEP",
      status: "Overdue",
      responsibleEngineer: "Omar Hassan",
      consultant: "FlowTech / WSP",
      submissionDate: "18 Jun 2026",
      dueDate: "25 Jun 2026",
      priority: "Critical",
      revision: "Rev A",
      aiSummary: "11-day supplier delay. AI predicts approval 14 Jul if resubmitted today.",
    },
    {
      id: "dr-7",
      reference: "MEP-IFC-L3-001",
      title: "Level 3 MEP coordination — Rev B to Rev C",
      drawingType: "revision-history",
      discipline: "MEP",
      status: "Approved",
      responsibleEngineer: "Omar Hassan",
      consultant: "WSP MEP",
      submissionDate: "28 Jun 2026",
      dueDate: "05 Jul 2026",
      priority: "High",
      revision: "Rev C",
      aiSummary: "Chilled water routing updated at Grid 4-C. Supersedes Rev B.",
    },
    {
      id: "dr-8",
      reference: "FAÇ-IFC-EXT-012",
      title: "Curtain wall layout — Rev C to Rev D",
      drawingType: "revision-history",
      discipline: "Façade",
      status: "Pending",
      responsibleEngineer: "Anna Petrov",
      consultant: "Foster + Partners",
      submissionDate: "02 Jul 2026",
      dueDate: "12 Jul 2026",
      priority: "High",
      revision: "Rev D",
      aiSummary: "Bracket detail revised per architect markup. Awaiting final review.",
    },
    {
      id: "dr-9",
      reference: "STR-SD-L2-018",
      title: "Deck reinforcement — Rev A to Rev B",
      drawingType: "revision-history",
      discipline: "Structural",
      status: "Under Review",
      responsibleEngineer: "Fatima Al-Zahrani",
      consultant: "Arup Structural",
      submissionDate: "01 Jul 2026",
      dueDate: "08 Jul 2026",
      priority: "Critical",
      revision: "Rev B",
      aiSummary: "Bar spacing adjusted at Grid 4-C per RFI-214 resolution.",
    },
  ],
  rfis: [
    {
      id: "rfi-1",
      reference: "RFI-214",
      title: "Level 2 beam penetration detail",
      rfiStatus: "Approved",
      daysOpen: 6,
      status: "Approved",
      responsibleEngineer: "Omar Hassan",
      consultant: "Arup Structural",
      submissionDate: "28 Jun 2026",
      dueDate: "04 Jul 2026",
      priority: "High",
      revision: "—",
      aiSummary: "Approved 04 Jul. Penetration detail accepted with stiffener plates.",
    },
    {
      id: "rfi-2",
      reference: "RFI-219",
      title: "Chilled water pipe routing Level 3",
      rfiStatus: "Under Review",
      daysOpen: 3,
      status: "Under Review",
      responsibleEngineer: "Omar Hassan",
      consultant: "WSP MEP",
      submissionDate: "01 Jul 2026",
      dueDate: "08 Jul 2026",
      priority: "Medium",
      revision: "—",
      aiSummary: "Consultant reviewing insulation spec conflict with IFC Rev C.",
    },
    {
      id: "rfi-3",
      reference: "RFI-221",
      title: "Façade bracket load transfer",
      rfiStatus: "Overdue",
      daysOpen: 9,
      status: "Overdue",
      responsibleEngineer: "Anna Petrov",
      consultant: "Foster + Partners",
      submissionDate: "24 Jun 2026",
      dueDate: "01 Jul 2026",
      priority: "Critical",
      revision: "—",
      aiSummary: "9 days overdue. Impacts Level 2 MEP routing. Escalation recommended.",
    },
    {
      id: "rfi-4",
      reference: "RFI-223",
      title: "Fire damper location Grid 6-F",
      rfiStatus: "Open",
      daysOpen: 1,
      status: "Open",
      responsibleEngineer: "David Chen",
      consultant: "WSP MEP",
      submissionDate: "03 Jul 2026",
      dueDate: "10 Jul 2026",
      priority: "High",
      revision: "—",
      aiSummary: "New submission. AI routing to MEP coordinator for initial review.",
    },
    {
      id: "rfi-5",
      reference: "RFI-208",
      title: "Structural opening size Level 1",
      rfiStatus: "Rejected",
      daysOpen: 12,
      status: "Rejected",
      responsibleEngineer: "Fatima Al-Zahrani",
      consultant: "Arup Structural",
      submissionDate: "20 Jun 2026",
      dueDate: "27 Jun 2026",
      priority: "Medium",
      revision: "—",
      aiSummary: "Rejected — opening undersized for ductwork. Resubmit with 450mm width.",
    },
  ],
  technicalQueries: [
    {
      id: "tq-1",
      reference: "TQ-044",
      title: "Concrete cover requirement at podium slab",
      status: "Under Review",
      responsibleEngineer: "Fatima Al-Zahrani",
      consultant: "Arup Structural",
      submissionDate: "30 Jun 2026",
      dueDate: "07 Jul 2026",
      priority: "High",
      revision: "Rev 0",
      aiSummary: "Marine environment exposure class query. Affects rebar specification.",
    },
    {
      id: "tq-2",
      reference: "TQ-045",
      title: "Cable tray loading capacity Level 4",
      status: "Open",
      responsibleEngineer: "David Chen",
      consultant: "WSP MEP",
      submissionDate: "02 Jul 2026",
      dueDate: "09 Jul 2026",
      priority: "Medium",
      revision: "Rev 0",
      aiSummary: "Pending structural confirmation of support bracket spacing.",
    },
  ],
  materialSubmittals: [
    {
      id: "ms-1",
      reference: "SUB-MEP-042",
      title: "Chilled water pumps — technical data",
      status: "Under Review",
      responsibleEngineer: "Omar Hassan",
      consultant: "WSP MEP",
      submissionDate: "25 Jun 2026",
      dueDate: "05 Jul 2026",
      priority: "Critical",
      revision: "Rev B",
      aiSummary: "Performance curve deviation flagged. Consultant review in progress.",
    },
    {
      id: "ms-2",
      reference: "SUB-STR-018",
      title: "Structural steel Grade S355",
      status: "Approved",
      responsibleEngineer: "Fatima Al-Zahrani",
      consultant: "Arup Structural",
      submissionDate: "15 Jun 2026",
      dueDate: "22 Jun 2026",
      priority: "High",
      revision: "Rev A",
      aiSummary: "Approved. Mill certificates verified against spec Section 05 12 00.",
    },
    {
      id: "ms-3",
      reference: "SUB-FAÇ-007",
      title: "Unitized curtain wall system",
      status: "Rejected",
      responsibleEngineer: "Anna Petrov",
      consultant: "Foster + Partners",
      submissionDate: "20 Jun 2026",
      dueDate: "28 Jun 2026",
      priority: "High",
      revision: "Rev C",
      aiSummary: "Thermal performance data insufficient. Resubmit with U-value test report.",
    },
  ],
  methodStatements: [
    {
      id: "mts-1",
      reference: "MS-MEP-012",
      title: "Chilled water pipe installation Level 3",
      status: "Approved",
      responsibleEngineer: "Omar Hassan",
      consultant: "WSP MEP",
      submissionDate: "10 Jun 2026",
      dueDate: "17 Jun 2026",
      priority: "High",
      revision: "Rev A",
      aiSummary: "Approved. HSE hold points defined at pressure test stages.",
    },
    {
      id: "mts-2",
      reference: "MS-STR-008",
      title: "Level 2 post-tensioning sequence",
      status: "Under Review",
      responsibleEngineer: "Fatima Al-Zahrani",
      consultant: "Arup Structural",
      submissionDate: "01 Jul 2026",
      dueDate: "08 Jul 2026",
      priority: "Critical",
      revision: "Rev B",
      aiSummary: "Consultant reviewing stressing sequence vs. formwork removal timing.",
    },
  ],
  itps: [
    {
      id: "itp-1",
      reference: "ITP-MEP-003",
      title: "Ductwork installation inspection plan",
      status: "Approved",
      responsibleEngineer: "Anna Petrov",
      consultant: "WSP MEP / QA",
      submissionDate: "05 Jun 2026",
      dueDate: "12 Jun 2026",
      priority: "High",
      revision: "Rev A",
      aiSummary: "Approved. Hold points aligned with QA/QC inspection schedule.",
    },
    {
      id: "itp-2",
      reference: "ITP-STR-005",
      title: "Concrete pour inspection — Level 3 deck",
      status: "Under Review",
      responsibleEngineer: "Fatima Al-Zahrani",
      consultant: "Arup / QA",
      submissionDate: "28 Jun 2026",
      dueDate: "05 Jul 2026",
      priority: "Medium",
      revision: "Rev 0",
      aiSummary: "QA reviewing sampling frequency against spec requirements.",
    },
  ],
  materialApprovals: [
    {
      id: "ma-1",
      reference: "MAR-018",
      title: "Ductwork insulation — Level 3 batch",
      status: "Approved",
      responsibleEngineer: "Omar Hassan",
      consultant: "WSP MEP",
      submissionDate: "18 Jun 2026",
      dueDate: "25 Jun 2026",
      priority: "Medium",
      revision: "Rev A",
      aiSummary: "Material approved for installation. Fire rating verified.",
    },
    {
      id: "ma-2",
      reference: "MAR-022",
      title: "Switchgear SG-07",
      status: "Pending",
      responsibleEngineer: "David Chen",
      consultant: "WSP Electrical",
      submissionDate: "01 Jul 2026",
      dueDate: "10 Jul 2026",
      priority: "High",
      revision: "Rev B",
      aiSummary: "Factory test report pending from supplier. 5-day delay expected.",
    },
  ],
  designChanges: [
    {
      id: "dc-1",
      reference: "DCR-012",
      title: "Level 2 ceiling height reduction — MEP zone",
      status: "Under Review",
      responsibleEngineer: "Omar Hassan",
      consultant: "Architect / WSP",
      submissionDate: "25 Jun 2026",
      dueDate: "05 Jul 2026",
      priority: "Critical",
      revision: "Rev 0",
      aiSummary: "150mm reduction proposed. Cost impact SAR 840K. Schedule neutral.",
    },
    {
      id: "dc-2",
      reference: "DCR-014",
      title: "Façade panel type change — South elevation",
      status: "Open",
      responsibleEngineer: "Anna Petrov",
      consultant: "Foster + Partners",
      submissionDate: "02 Jul 2026",
      dueDate: "12 Jul 2026",
      priority: "High",
      revision: "Rev 0",
      aiSummary: "Material substitution for lead time reduction. Procurement impact TBC.",
    },
  ],
  interfaceIssues: [
    {
      id: "ii-1",
      reference: "INT-008",
      title: "MEP vs Façade bracket clash Level 2",
      status: "Open",
      responsibleEngineer: "Omar Hassan",
      consultant: "WSP / Foster+Partners",
      submissionDate: "01 Jul 2026",
      dueDate: "08 Jul 2026",
      priority: "Critical",
      revision: "Rev 0",
      aiSummary: "3 clash points identified in BIM. Workshop scheduled 07 Jul.",
    },
    {
      id: "ii-2",
      reference: "INT-009",
      title: "Structural opening vs ductwork Level 3",
      status: "Under Review",
      responsibleEngineer: "Fatima Al-Zahrani",
      consultant: "Arup / WSP",
      submissionDate: "28 Jun 2026",
      dueDate: "05 Jul 2026",
      priority: "High",
      revision: "Rev 0",
      aiSummary: "Opening resize under structural review. MEP on hold at Grid 4-C.",
    },
  ],
  dashboardHighlights: [
    {
      label: "Drawings affecting construction this week",
      value: "6",
      detail: "2 critical — pump shop drawing and Level 2 red mark",
    },
    {
      label: "RFIs predicted to approve by Friday",
      value: "3",
      detail: "RFI-219, RFI-223, TQ-044",
    },
    {
      label: "Submittals blocking procurement",
      value: "2",
      detail: "SUB-MEP-042, SUB-FAÇ-007",
    },
    {
      label: "Interface workshops scheduled",
      value: "1",
      detail: "INT-008 — 07 Jul 14:00",
    },
  ],
};

export function getEngineeringData(projectId: string): EngineeringModuleData {
  if (projectId === "amaala") {
    return amaalaEngineering;
  }

  return {
    ...amaalaEngineering,
    kpis: {
      openRfis: 8,
      approvedRfis: 42,
      avgApprovalDays: 7.1,
      pendingDrawings: 12,
      pendingSubmittals: 6,
      criticalIssues: 2,
    },
  };
}

export const priorityStyle: Record<EngineeringPriority, string> = {
  Critical: "text-rose-400",
  High: "text-amber-400",
  Medium: "text-muted-foreground",
  Low: "text-muted-foreground/70",
};

export const statusStyle: Record<string, string> = {
  Approved: "text-emerald-400",
  "Under Review": "text-sky-400",
  Open: "text-muted-foreground",
  Pending: "text-amber-400",
  Overdue: "text-rose-400",
  Rejected: "text-rose-400",
};
