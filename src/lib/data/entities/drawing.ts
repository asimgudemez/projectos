import type {
  ApprovalStatus,
  DateOnly,
  DrawingType,
  Priority,
  ProjectScopedEntity,
  UUID,
} from "./common";

export type Drawing = ProjectScopedEntity & {
  reference: string;
  title: string;
  drawingType: DrawingType;
  discipline: string;
  status: ApprovalStatus;
  priority: Priority;
  area?: string | null;
  level?: string | null;
  grid?: string | null;
  responsibleEngineerId?: UUID | null;
  consultant?: string | null;
  submissionDate: DateOnly;
  dueDate: DateOnly;
  approvalDate?: DateOnly | null;
  revision: string;
  previousRevisionId?: UUID | null;
  aiSummary?: string | null;
  documentId?: UUID | null;
  sheetCount?: number | null;
};

export type CreateDrawingInput = Pick<
  Drawing,
  | "projectId"
  | "reference"
  | "title"
  | "drawingType"
  | "discipline"
  | "submissionDate"
  | "dueDate"
> &
  Partial<
    Pick<
      Drawing,
      | "status"
      | "priority"
      | "area"
      | "level"
      | "grid"
      | "responsibleEngineerId"
      | "consultant"
      | "revision"
      | "previousRevisionId"
      | "documentId"
      | "sheetCount"
    >
  >;

export type UpdateDrawingInput = Partial<
  Omit<Drawing, "id" | "companyId" | "projectId" | "createdAt" | "updatedAt">
>;

export type DrawingFilter = {
  projectId?: UUID;
  drawingType?: DrawingType;
  status?: ApprovalStatus;
  discipline?: string;
  area?: string;
};
