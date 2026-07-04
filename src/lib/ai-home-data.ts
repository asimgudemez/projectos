import {
  Activity,
  AlertTriangle,
  Banknote,
  Calendar,
  ClipboardList,
  FileText,
  FolderKanban,
  Package,
  ShieldAlert,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

export type KpiMetric = {
  label: string;
  value: string;
  trend: string;
  trendDirection: "up" | "down" | "neutral";
  icon: LucideIcon;
  accent: string;
};

export type BriefItem = {
  text: string;
};

export type QuickAction = {
  label: string;
  icon: LucideIcon;
};

export type PortfolioProject = {
  name: string;
  location: string;
  health: number;
  progress: number;
  status: "Healthy" | "At Risk" | "Critical" | "On Track";
  nextMilestone: string;
  milestoneDate: string;
};

export type ActivityItem = {
  time: string;
  title: string;
  category: "approval" | "document" | "ai" | "inspection";
};

export type RiskPrediction = {
  label: string;
  value: number;
  color: string;
  ringColor: string;
};

export const heroKpis: KpiMetric[] = [
  {
    label: "Portfolio Health",
    value: "87%",
    trend: "+4.2% vs last month",
    trendDirection: "up",
    icon: Activity,
    accent: "from-violet-500/20 to-indigo-500/10",
  },
  {
    label: "Projects",
    value: "12",
    trend: "3 mobilizing this quarter",
    trendDirection: "neutral",
    icon: FolderKanban,
    accent: "from-indigo-500/20 to-blue-500/10",
  },
  {
    label: "Critical Issues",
    value: "3",
    trend: "2 require escalation",
    trendDirection: "down",
    icon: AlertTriangle,
    accent: "from-rose-500/20 to-orange-500/10",
  },
  {
    label: "Pending RFIs",
    value: "14",
    trend: "6 overdue consultant reply",
    trendDirection: "down",
    icon: ClipboardList,
    accent: "from-amber-500/20 to-yellow-500/10",
  },
];

export const executiveBriefItems: BriefItem[] = [
  { text: "Procurement package M1 may delay installation." },
  { text: "Six RFIs require consultant review." },
  { text: "Weekly executive report is ready." },
  { text: "One payment certificate becomes due tomorrow." },
];

export const quickActions: QuickAction[] = [
  { label: "Today's Risks", icon: ShieldAlert },
  { label: "Generate Report", icon: FileText },
  { label: "Review RFIs", icon: ClipboardList },
  { label: "Procurement", icon: Package },
  { label: "Cash Flow", icon: Banknote },
  { label: "Schedule", icon: Calendar },
  { label: "Cost", icon: TrendingUp },
  { label: "Documents", icon: FileText },
];

export const recommendedAction = {
  title: "Review Pump Delivery Status",
  impact: "Prevent 5-day delay",
  estimatedTime: "12 minutes",
  context:
    "Chilled water pump set for AMAALA Block C is 11 days behind supplier commitment. Early intervention may recover 5 days on the critical path.",
};

export const portfolioProjects: PortfolioProject[] = [
  {
    name: "AMAALA",
    location: "Red Sea, KSA",
    health: 87,
    progress: 64,
    status: "Healthy",
    nextMilestone: "MEP Rough-In Complete",
    milestoneDate: "Jul 18",
  },
  {
    name: "NEOM Oxagon",
    location: "Tabuk Province, KSA",
    health: 72,
    progress: 41,
    status: "At Risk",
    nextMilestone: "Structural Topping Out",
    milestoneDate: "Aug 02",
  },
  {
    name: "Riyadh Metro Line 3",
    location: "Riyadh, KSA",
    health: 91,
    progress: 78,
    status: "On Track",
    nextMilestone: "Station Fit-Out Phase 1",
    milestoneDate: "Jul 25",
  },
  {
    name: "Qiddiya Entertainment",
    location: "Riyadh, KSA",
    health: 58,
    progress: 33,
    status: "Critical",
    nextMilestone: "Façade Panel Installation",
    milestoneDate: "Jul 12",
  },
  {
    name: "Diriyah Gate",
    location: "Diriyah, KSA",
    health: 84,
    progress: 56,
    status: "Healthy",
    nextMilestone: "Landscape Package Award",
    milestoneDate: "Jul 30",
  },
  {
    name: "Red Sea Airport",
    location: "Hanak, KSA",
    health: 79,
    progress: 49,
    status: "At Risk",
    nextMilestone: "Airfield Lighting Commissioning",
    milestoneDate: "Aug 08",
  },
];

export const liveActivity: ActivityItem[] = [
  {
    time: "09:10",
    title: "RFI-214 Approved",
    category: "approval",
  },
  {
    time: "10:42",
    title: "Shop Drawing Uploaded",
    category: "document",
  },
  {
    time: "11:15",
    title: "AI detected procurement risk",
    category: "ai",
  },
  {
    time: "12:30",
    title: "Inspection Completed",
    category: "inspection",
  },
  {
    time: "13:05",
    title: "Submittal REV-03 Returned",
    category: "document",
  },
  {
    time: "14:18",
    title: "Payment Certificate PC-07 Issued",
    category: "approval",
  },
];

export const riskPredictions: RiskPrediction[] = [
  {
    label: "Schedule Risk",
    value: 68,
    color: "text-amber-400",
    ringColor: "stroke-amber-400",
  },
  {
    label: "Budget Risk",
    value: 42,
    color: "text-emerald-400",
    ringColor: "stroke-emerald-400",
  },
  {
    label: "Quality Risk",
    value: 31,
    color: "text-sky-400",
    ringColor: "stroke-sky-400",
  },
  {
    label: "Safety Risk",
    value: 24,
    color: "text-violet-400",
    ringColor: "stroke-violet-400",
  },
];

export const aiConfidence = 92;

export const statusStyles: Record<
  PortfolioProject["status"],
  { badge: string; bar: string }
> = {
  Healthy: {
    badge: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    bar: "from-emerald-500 to-teal-400",
  },
  "On Track": {
    badge: "border-sky-500/30 bg-sky-500/10 text-sky-400",
    bar: "from-sky-500 to-indigo-400",
  },
  "At Risk": {
    badge: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    bar: "from-amber-500 to-orange-400",
  },
  Critical: {
    badge: "border-rose-500/30 bg-rose-500/10 text-rose-400",
    bar: "from-rose-500 to-red-400",
  },
};
