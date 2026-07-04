import type {
  ApprovalStatus,
  DateOnly,
  Priority,
  ProjectScopedEntity,
  SubmittalType,
  UUID,
} from "./common";

export type Submittal = ProjectScopedEntity & {
  reference: string;
  title: string;
  type: SubmittalType;
  status: ApprovalStatus;
  priority: Priority;
  discipline?: string | null;
  specSection?: string | null;
  responsibleEngineerId?: UUID | null;
  reviewer?: string | null;
  submittedById?: UUID | null;
  submissionDate: DateOnly;
  dueDate: DateOnly;
  approvalDate?: DateOnly | null;
  revision: string;
  aiSummary?: string | null;
  supplier?: string | null;
  linkedProcurementId?: UUID | null;
  documentId?: UUID | null;
};

export type CreateSubmittalInput = Pick<
  Submittal,
  "projectId" | "reference" | "title" | "type" | "submissionDate" | "dueDate"
> &
  Partial<
    Pick<
      Submittal,
      | "status"
      | "priority"
      | "discipline"
      | "specSection"
      | "responsibleEngineerId"
      | "reviewer"
      | "submittedById"
      | "revision"
      | "supplier"
      | "linkedProcurementId"
      | "documentId"
    >
  >;

export type UpdateSubmittalInput = Partial<
  Omit<Submittal, "id" | "companyId" | "projectId" | "createdAt" | "updatedAt">
>;

export type SubmittalFilter = {
  projectId?: UUID;
  status?: ApprovalStatus;
  type?: SubmittalType;
  overdue?: boolean;
};
