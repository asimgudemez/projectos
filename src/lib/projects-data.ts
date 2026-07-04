export type ProjectHealth = "healthy" | "at-risk" | "critical";
export type ProjectStatus = "Active" | "Mobilizing" | "Delayed" | "On Hold";
export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export type Project = {
  id: string;
  name: string;
  client: string;
  country: string;
  contractValue: number;
  contractValueLabel: string;
  progress: number;
  healthScore: number;
  health: ProjectHealth;
  riskLevel: RiskLevel;
  status: ProjectStatus;
  currentPhase: string;
  projectDirector: string;
  constructionManager: string;
  projectManager: string;
  startDate: string;
  finishDate: string;
  nextMilestone: string;
  nextMilestoneDate: string;
  isDelayed: boolean;
};

export const projects: Project[] = [
  {
    id: "amaala",
    name: "AMAALA Block C",
    client: "Red Sea Global",
    country: "Saudi Arabia",
    contractValue: 425000000,
    contractValueLabel: "SAR 425M",
    progress: 64,
    healthScore: 87,
    health: "healthy",
    riskLevel: "Low",
    status: "Active",
    currentPhase: "MEP Rough-In",
    projectDirector: "Khalid Al-Rashid",
    constructionManager: "Sarah Mitchell",
    projectManager: "Omar Hassan",
    startDate: "Jan 2024",
    finishDate: "Dec 2026",
    nextMilestone: "MEP Rough-In Complete",
    nextMilestoneDate: "18 Jul 2026",
    isDelayed: false,
  },
  {
    id: "neom-oxagon",
    name: "NEOM Oxagon",
    client: "NEOM Company",
    country: "Saudi Arabia",
    contractValue: 890000000,
    contractValueLabel: "SAR 890M",
    progress: 41,
    healthScore: 72,
    health: "at-risk",
    riskLevel: "High",
    status: "Active",
    currentPhase: "Structural Works",
    projectDirector: "James Whitfield",
    constructionManager: "Ahmed Al-Qahtani",
    projectManager: "James Whitfield",
    startDate: "Mar 2023",
    finishDate: "Jun 2027",
    nextMilestone: "Structural Topping Out",
    nextMilestoneDate: "02 Aug 2026",
    isDelayed: false,
  },
  {
    id: "riyadh-metro-l3",
    name: "Riyadh Metro Line 3",
    client: "Royal Commission for Riyadh City",
    country: "Saudi Arabia",
    contractValue: 612000000,
    contractValueLabel: "SAR 612M",
    progress: 78,
    healthScore: 91,
    health: "healthy",
    riskLevel: "Low",
    status: "Active",
    currentPhase: "Station Fit-Out",
    projectDirector: "Fatima Al-Zahrani",
    constructionManager: "David Chen",
    projectManager: "Fatima Al-Zahrani",
    startDate: "Jun 2022",
    finishDate: "Mar 2027",
    nextMilestone: "Station Fit-Out Phase 1",
    nextMilestoneDate: "25 Jul 2026",
    isDelayed: false,
  },
  {
    id: "qiddiya",
    name: "Qiddiya Entertainment",
    client: "Qiddiya Investment Company",
    country: "Saudi Arabia",
    contractValue: 540000000,
    contractValueLabel: "SAR 540M",
    progress: 33,
    healthScore: 58,
    health: "critical",
    riskLevel: "Critical",
    status: "Delayed",
    currentPhase: "Façade Installation",
    projectDirector: "Michael Torres",
    constructionManager: "Youssef Al-Mutairi",
    projectManager: "Michael Torres",
    startDate: "Sep 2023",
    finishDate: "Dec 2026",
    nextMilestone: "Façade Panel Installation",
    nextMilestoneDate: "12 Jul 2026",
    isDelayed: true,
  },
  {
    id: "diriyah-gate",
    name: "Diriyah Gate",
    client: "Diriyah Company",
    country: "Saudi Arabia",
    contractValue: 380000000,
    contractValueLabel: "SAR 380M",
    progress: 56,
    healthScore: 84,
    health: "healthy",
    riskLevel: "Low",
    status: "Active",
    currentPhase: "Landscape & External Works",
    projectDirector: "Layla Al-Harbi",
    constructionManager: "Robert Klein",
    projectManager: "Layla Al-Harbi",
    startDate: "Feb 2024",
    finishDate: "Sep 2027",
    nextMilestone: "Landscape Package Award",
    nextMilestoneDate: "30 Jul 2026",
    isDelayed: false,
  },
  {
    id: "red-sea-airport",
    name: "Red Sea International Airport",
    client: "Red Sea Global",
    country: "Saudi Arabia",
    contractValue: 720000000,
    contractValueLabel: "SAR 720M",
    progress: 49,
    healthScore: 79,
    health: "at-risk",
    riskLevel: "Medium",
    status: "Active",
    currentPhase: "Airfield Systems",
    projectDirector: "Khalid Al-Rashid",
    constructionManager: "Anna Petrov",
    projectManager: "Omar Hassan",
    startDate: "Nov 2023",
    finishDate: "Aug 2027",
    nextMilestone: "Airfield Lighting Commissioning",
    nextMilestoneDate: "08 Aug 2026",
    isDelayed: false,
  },
  {
    id: "jeddah-central",
    name: "Jeddah Central Development",
    client: "JCDC",
    country: "Saudi Arabia",
    contractValue: 310000000,
    contractValueLabel: "SAR 310M",
    progress: 18,
    healthScore: 82,
    health: "healthy",
    riskLevel: "Low",
    status: "Mobilizing",
    currentPhase: "Early Works",
    projectDirector: "Fatima Al-Zahrani",
    constructionManager: "Carlos Mendez",
    projectManager: "Carlos Mendez",
    startDate: "Apr 2025",
    finishDate: "Feb 2028",
    nextMilestone: "Site Mobilization Complete",
    nextMilestoneDate: "22 Jul 2026",
    isDelayed: false,
  },
  {
    id: "dubai-harbour",
    name: "Dubai Harbour Towers",
    client: "Mina Rashid Properties",
    country: "UAE",
    contractValue: 465000000,
    contractValueLabel: "AED 465M",
    progress: 52,
    healthScore: 76,
    health: "at-risk",
    riskLevel: "Medium",
    status: "Active",
    currentPhase: "Superstructure",
    projectDirector: "James Whitfield",
    constructionManager: "Priya Sharma",
    projectManager: "James Whitfield",
    startDate: "Aug 2023",
    finishDate: "Nov 2026",
    nextMilestone: "Level 28 Concrete Pour",
    nextMilestoneDate: "15 Jul 2026",
    isDelayed: false,
  },
];

export const healthLabels: Record<ProjectHealth, string> = {
  healthy: "Healthy",
  "at-risk": "At Risk",
  critical: "Critical",
};

export const healthStyles: Record<
  ProjectHealth,
  { dot: string; text: string; bar: string; ring: string }
> = {
  healthy: {
    dot: "bg-emerald-400",
    text: "text-emerald-400",
    bar: "bg-emerald-400",
    ring: "ring-emerald-400/30",
  },
  "at-risk": {
    dot: "bg-amber-400",
    text: "text-amber-400",
    bar: "bg-amber-400",
    ring: "ring-amber-400/30",
  },
  critical: {
    dot: "bg-rose-400",
    text: "text-rose-400",
    bar: "bg-rose-400",
    ring: "ring-rose-400/30",
  },
};

export function getProjectKpis(data: Project[]) {
  const healthy = data.filter((p) => p.health === "healthy").length;
  const atRisk = data.filter((p) => p.health === "at-risk").length;
  const delayed = data.filter((p) => p.isDelayed).length;
  const revenue = data.reduce((sum, p) => sum + p.contractValue, 0);

  return {
    total: data.length,
    healthy,
    atRisk,
    delayed,
    revenue,
    revenueLabel: formatRevenue(revenue),
    upcomingMilestones: data.length,
  };
}

export function formatRevenue(value: number): string {
  if (value >= 1_000_000_000) {
    return `SAR ${(value / 1_000_000_000).toFixed(1)}B`;
  }
  return `SAR ${(value / 1_000_000).toFixed(0)}M`;
}

export function getFilterOptions(data: Project[]) {
  return {
    countries: [...new Set(data.map((p) => p.country))].sort(),
    clients: [...new Set(data.map((p) => p.client))].sort(),
    statuses: [...new Set(data.map((p) => p.status))].sort(),
    healths: [...new Set(data.map((p) => p.health))].sort(),
    projectManagers: [...new Set(data.map((p) => p.projectManager))].sort(),
  };
}

export function filterProjects(
  data: Project[],
  filters: {
    country: string;
    client: string;
    status: string;
    health: string;
    projectManager: string;
  }
): Project[] {
  return data.filter((project) => {
    if (filters.country !== "all" && project.country !== filters.country) {
      return false;
    }
    if (filters.client !== "all" && project.client !== filters.client) {
      return false;
    }
    if (filters.status !== "all" && project.status !== filters.status) {
      return false;
    }
    if (filters.health !== "all" && project.health !== filters.health) {
      return false;
    }
    if (
      filters.projectManager !== "all" &&
      project.projectManager !== filters.projectManager
    ) {
      return false;
    }
    return true;
  });
}

export function getProjectById(id: string): Project | undefined {
  return projects.find((project) => project.id === id);
}
