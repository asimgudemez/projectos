import type {
  DateOnly,
  EquipmentStatus,
  ProjectScopedEntity,
  UUID,
} from "./common";

export type Equipment = ProjectScopedEntity & {
  assetTag: string;
  name: string;
  category: string;
  status: EquipmentStatus;
  manufacturer?: string | null;
  model?: string | null;
  serialNumber?: string | null;
  location?: string | null;
  operatorId?: UUID | null;
  utilizationPct?: number | null;
  lastInspectionDate?: DateOnly | null;
  nextInspectionDate?: DateOnly | null;
  maintenanceDueDate?: DateOnly | null;
  detail?: string | null;
  dailyRate?: number | null;
  currency?: string | null;
};

export type CreateEquipmentInput = Pick<
  Equipment,
  "projectId" | "assetTag" | "name" | "category"
> &
  Partial<
    Pick<
      Equipment,
      | "status"
      | "manufacturer"
      | "model"
      | "serialNumber"
      | "location"
      | "operatorId"
      | "detail"
    >
  >;

export type UpdateEquipmentInput = Partial<
  Omit<Equipment, "id" | "companyId" | "projectId" | "createdAt" | "updatedAt">
>;

export type EquipmentFilter = {
  projectId?: UUID;
  status?: EquipmentStatus;
  category?: string;
};
