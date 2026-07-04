import type {
  CurrencyCode,
  DateOnly,
  Priority,
  ProcurementStatus,
  ProjectScopedEntity,
  UUID,
} from "./common";

export type Procurement = ProjectScopedEntity & {
  poNumber: string;
  title: string;
  status: ProcurementStatus;
  priority: Priority;
  supplier: string;
  supplierContact?: string | null;
  category: string;
  description?: string | null;
  value: number;
  currency: CurrencyCode;
  issuedDate?: DateOnly | null;
  requiredDeliveryDate: DateOnly;
  expectedDeliveryDate?: DateOnly | null;
  actualDeliveryDate?: DateOnly | null;
  leadTimeDays?: number | null;
  delayDays?: number | null;
  buyerId?: UUID | null;
  linkedMaterialId?: UUID | null;
  linkedSubmittalId?: UUID | null;
  riskNotes?: string | null;
};

export type CreateProcurementInput = Pick<
  Procurement,
  | "projectId"
  | "poNumber"
  | "title"
  | "supplier"
  | "category"
  | "value"
  | "currency"
  | "requiredDeliveryDate"
> &
  Partial<
    Pick<
      Procurement,
      | "status"
      | "priority"
      | "supplierContact"
      | "description"
      | "issuedDate"
      | "expectedDeliveryDate"
      | "buyerId"
      | "linkedMaterialId"
      | "linkedSubmittalId"
    >
  >;

export type UpdateProcurementInput = Partial<
  Omit<Procurement, "id" | "companyId" | "projectId" | "createdAt" | "updatedAt">
>;

export type ProcurementFilter = {
  projectId?: UUID;
  status?: ProcurementStatus;
  supplier?: string;
  delayed?: boolean;
};

export type ProcurementRiskSummary = {
  id: UUID;
  poNumber: string;
  title: string;
  supplier: string;
  delayDays: number;
  status: ProcurementStatus;
  requiredDeliveryDate: DateOnly;
};
