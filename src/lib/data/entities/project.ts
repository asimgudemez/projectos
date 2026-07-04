import type {
  CompanyScopedEntity,
  CurrencyCode,
  DateOnly,
  HealthStatus,
  ISO8601,
  ProjectLifecycleStatus,
  ProjectMemberRole,
  RiskLevel,
  UUID,
} from "./common";

export type Project = CompanyScopedEntity & {
  code: string;
  name: string;
  clientName: string;
  country: string;
  city?: string | null;
  description?: string | null;
  status: ProjectLifecycleStatus;
  health: HealthStatus;
  healthScore: number;
  riskLevel: RiskLevel;
  progressPct: number;
  contractValue: number;
  contractCurrency: CurrencyCode;
  currentPhase: string;
  startDate: DateOnly;
  plannedFinishDate: DateOnly;
  actualFinishDate?: DateOnly | null;
  nextMilestone?: string | null;
  nextMilestoneDate?: DateOnly | null;
  isDelayed: boolean;
  projectDirectorId?: UUID | null;
  constructionManagerId?: UUID | null;
  projectManagerId?: UUID | null;
  locationLat?: number | null;
  locationLng?: number | null;
  timezone?: string | null;
};

export type ProjectMember = CompanyScopedEntity & {
  projectId: UUID;
  userId: UUID;
  role: ProjectMemberRole;
  isPrimary: boolean;
  joinedAt: ISO8601;
};

export type CreateProjectInput = Pick<
  Project,
  | "code"
  | "name"
  | "clientName"
  | "country"
  | "status"
  | "contractValue"
  | "contractCurrency"
  | "startDate"
  | "plannedFinishDate"
> &
  Partial<
    Pick<
      Project,
      | "city"
      | "description"
      | "currentPhase"
      | "projectDirectorId"
      | "constructionManagerId"
      | "projectManagerId"
      | "nextMilestone"
      | "nextMilestoneDate"
    >
  >;

export type UpdateProjectInput = Partial<
  Omit<Project, "id" | "companyId" | "createdAt" | "updatedAt">
>;

export type ProjectSummary = Pick<
  Project,
  | "id"
  | "code"
  | "name"
  | "clientName"
  | "country"
  | "status"
  | "health"
  | "healthScore"
  | "riskLevel"
  | "progressPct"
  | "contractValue"
  | "contractCurrency"
  | "currentPhase"
  | "isDelayed"
  | "nextMilestone"
  | "nextMilestoneDate"
>;

export type ProjectKpis = {
  totalProjects: number;
  activeProjects: number;
  delayedProjects: number;
  atRiskProjects: number;
  totalContractValue: number;
  averageProgress: number;
  averageHealthScore: number;
};
