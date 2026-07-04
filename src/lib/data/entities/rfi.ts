import type {
  ApprovalStatus,
  DateOnly,
  ISO8601,
  Priority,
  ProjectScopedEntity,
  UUID,
} from "./common";

export type Rfi = ProjectScopedEntity & {
  reference: string;
  subject: string;
  description?: string | null;
  status: ApprovalStatus;
  priority: Priority;
  discipline?: string | null;
  area?: string | null;
  responsibleEngineerId?: UUID | null;
  consultant?: string | null;
  submittedById?: UUID | null;
  submissionDate: DateOnly;
  dueDate: DateOnly;
  responseDate?: DateOnly | null;
  daysOpen: number;
  revision: string;
  aiSummary?: string | null;
  costImpact?: number | null;
  scheduleImpactDays?: number | null;
  linkedDrawingId?: UUID | null;
  closedAt?: ISO8601 | null;
};

export type CreateRfiInput = Pick<
  Rfi,
  "projectId" | "reference" | "subject" | "submissionDate" | "dueDate"
> &
  Partial<
    Pick<
      Rfi,
      | "description"
      | "status"
      | "priority"
      | "discipline"
      | "area"
      | "responsibleEngineerId"
      | "consultant"
      | "submittedById"
      | "revision"
      | "linkedDrawingId"
    >
  >;

export type UpdateRfiInput = Partial<
  Omit<Rfi, "id" | "companyId" | "projectId" | "createdAt" | "updatedAt">
>;

export type RfiFilter = {
  projectId?: UUID;
  status?: ApprovalStatus;
  priority?: Priority;
  responsibleEngineerId?: UUID;
  overdue?: boolean;
};
