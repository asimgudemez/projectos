import type {
  CurrencyCode,
  DateOnly,
  MaterialStatus,
  ProjectScopedEntity,
  UUID,
} from "./common";

export type Material = ProjectScopedEntity & {
  code: string;
  name: string;
  status: MaterialStatus;
  category?: string | null;
  specSection?: string | null;
  quantity: number;
  unit: string;
  supplier?: string | null;
  poNumber?: string | null;
  procurementId?: UUID | null;
  requiredOnSiteDate: DateOnly;
  expectedDeliveryDate?: DateOnly | null;
  actualDeliveryDate?: DateOnly | null;
  location?: string | null;
  cost?: number | null;
  currency?: CurrencyCode | null;
  detail?: string | null;
  linkedSubmittalId?: UUID | null;
};

export type CreateMaterialInput = Pick<
  Material,
  "projectId" | "code" | "name" | "quantity" | "unit" | "requiredOnSiteDate"
> &
  Partial<
    Pick<
      Material,
      | "status"
      | "category"
      | "specSection"
      | "supplier"
      | "poNumber"
      | "procurementId"
      | "expectedDeliveryDate"
      | "location"
      | "cost"
      | "currency"
      | "detail"
      | "linkedSubmittalId"
    >
  >;

export type UpdateMaterialInput = Partial<
  Omit<Material, "id" | "companyId" | "projectId" | "createdAt" | "updatedAt">
>;

export type MaterialFilter = {
  projectId?: UUID;
  status?: MaterialStatus;
  supplier?: string;
};
