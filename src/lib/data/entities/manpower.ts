import type { DateOnly, ProjectScopedEntity, UUID } from "./common";

export type Manpower = ProjectScopedEntity & {
  trade: string;
  subcontractor?: string | null;
  plannedHeadcount: number;
  actualHeadcount: number;
  unit: string;
  shift?: string | null;
  reportDate: DateOnly;
  supervisorId?: UUID | null;
  location?: string | null;
  notes?: string | null;
  variancePct: number;
};

export type CreateManpowerInput = Pick<
  Manpower,
  "projectId" | "trade" | "plannedHeadcount" | "actualHeadcount" | "unit" | "reportDate"
> &
  Partial<
    Pick<
      Manpower,
      "subcontractor" | "shift" | "supervisorId" | "location" | "notes"
    >
  >;

export type UpdateManpowerInput = Partial<
  Omit<Manpower, "id" | "companyId" | "projectId" | "createdAt" | "updatedAt">
>;

export type ManpowerFilter = {
  projectId?: UUID;
  trade?: string;
  reportDate?: DateOnly;
  belowTarget?: boolean;
};

export type ManpowerSummary = {
  trade: string;
  plannedHeadcount: number;
  actualHeadcount: number;
  variancePct: number;
  unit: string;
};
