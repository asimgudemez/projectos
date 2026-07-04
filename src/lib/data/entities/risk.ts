import type {
  DateOnly,
  Priority,
  ProjectScopedEntity,
  RiskCategory,
  RiskLevel,
  RiskStatus,
  UUID,
} from "./common";

export type Risk = ProjectScopedEntity & {
  reference: string;
  title: string;
  description?: string | null;
  category: RiskCategory;
  status: RiskStatus;
  level: RiskLevel;
  priority: Priority;
  ownerId?: UUID | null;
  identifiedDate: DateOnly;
  targetCloseDate?: DateOnly | null;
  closedDate?: DateOnly | null;
  probabilityPct: number;
  impactScore: number;
  exposureScore: number;
  mitigationPlan?: string | null;
  contingencyPlan?: string | null;
  costExposure?: number | null;
  scheduleExposureDays?: number | null;
  linkedRfiId?: UUID | null;
  linkedTaskId?: UUID | null;
  aiSummary?: string | null;
};

export type CreateRiskInput = Pick<
  Risk,
  "projectId" | "reference" | "title" | "category" | "identifiedDate"
> &
  Partial<
    Pick<
      Risk,
      | "description"
      | "status"
      | "level"
      | "priority"
      | "ownerId"
      | "targetCloseDate"
      | "probabilityPct"
      | "impactScore"
      | "mitigationPlan"
      | "linkedRfiId"
    >
  >;

export type UpdateRiskInput = Partial<
  Omit<Risk, "id" | "companyId" | "projectId" | "createdAt" | "updatedAt">
>;

export type RiskFilter = {
  projectId?: UUID;
  status?: RiskStatus;
  level?: RiskLevel;
  category?: RiskCategory;
};
