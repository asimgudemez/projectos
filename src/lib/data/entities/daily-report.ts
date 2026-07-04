import type {
  DateOnly,
  ISO8601,
  ProjectScopedEntity,
  UUID,
} from "./common";

export type DailyReportWeather = "clear" | "cloudy" | "rain" | "sandstorm" | "extreme_heat";

export type DailyReport = ProjectScopedEntity & {
  reportDate: DateOnly;
  reportNumber: string;
  preparedById?: UUID | null;
  approvedById?: UUID | null;
  weather: DailyReportWeather;
  temperatureHighC?: number | null;
  temperatureLowC?: number | null;
  workforceCount: number;
  workHours: number;
  progressSummary: string;
  issuesSummary?: string | null;
  safetySummary?: string | null;
  qualitySummary?: string | null;
  visitors?: string | null;
  equipmentOnSite?: string | null;
  submittedAt?: ISO8601 | null;
  approvedAt?: ISO8601 | null;
  aiSummary?: string | null;
};

export type CreateDailyReportInput = Pick<
  DailyReport,
  "projectId" | "reportDate" | "reportNumber" | "weather" | "progressSummary"
> &
  Partial<
    Pick<
      DailyReport,
      | "preparedById"
      | "weather"
      | "temperatureHighC"
      | "temperatureLowC"
      | "workforceCount"
      | "workHours"
      | "issuesSummary"
      | "safetySummary"
      | "qualitySummary"
      | "visitors"
      | "equipmentOnSite"
    >
  >;

export type UpdateDailyReportInput = Partial<
  Omit<DailyReport, "id" | "companyId" | "projectId" | "createdAt" | "updatedAt">
>;
