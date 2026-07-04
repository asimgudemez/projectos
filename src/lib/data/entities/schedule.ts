import type {
  DateOnly,
  ProjectScopedEntity,
  ScheduleActivityStatus,
  UUID,
} from "./common";

export type Schedule = ProjectScopedEntity & {
  name: string;
  version: string;
  baselineDate: DateOnly;
  dataDate: DateOnly;
  isActive: boolean;
  totalActivities: number;
  criticalPathLengthDays: number;
  description?: string | null;
};

export type ScheduleActivity = ProjectScopedEntity & {
  scheduleId: UUID;
  activityCode: string;
  name: string;
  status: ScheduleActivityStatus;
  wbsCode?: string | null;
  plannedStart: DateOnly;
  plannedFinish: DateOnly;
  actualStart?: DateOnly | null;
  actualFinish?: DateOnly | null;
  durationDays: number;
  floatDays: number;
  isCritical: boolean;
  percentComplete: number;
  predecessorIds: UUID[];
  responsibleId?: UUID | null;
  discipline?: string | null;
};

export type CreateScheduleInput = Pick<
  Schedule,
  "projectId" | "name" | "version" | "baselineDate" | "dataDate"
> &
  Partial<Pick<Schedule, "description" | "isActive">>;

export type CreateScheduleActivityInput = Pick<
  ScheduleActivity,
  | "projectId"
  | "scheduleId"
  | "activityCode"
  | "name"
  | "plannedStart"
  | "plannedFinish"
  | "durationDays"
> &
  Partial<
    Pick<
      ScheduleActivity,
      | "status"
      | "wbsCode"
      | "floatDays"
      | "isCritical"
      | "percentComplete"
      | "responsibleId"
      | "discipline"
    >
  >;

export type ScheduleFilter = {
  projectId?: UUID;
  isActive?: boolean;
};

export type ScheduleActivityFilter = {
  projectId?: UUID;
  scheduleId?: UUID;
  isCritical?: boolean;
  status?: ScheduleActivityStatus;
};

export type ScheduleSlippageSummary = {
  activityId: UUID;
  activityCode: string;
  name: string;
  plannedFinish: DateOnly;
  floatDays: number;
  isCritical: boolean;
};
