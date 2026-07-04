/**
 * Shared primitives for all ProjectOS domain entities.
 * Database columns use snake_case; TypeScript entities use camelCase.
 */

export type UUID = string;
export type ISO8601 = string;
export type DateOnly = string; // YYYY-MM-DD

/** Every record in ProjectOS belongs to a company (multi-tenant root). */
export interface CompanyScoped {
  companyId: UUID;
}

/** Project-owned module records extend company + project scope. */
export interface ProjectScoped extends CompanyScoped {
  projectId: UUID;
}

/** Standard audit columns mirrored in Supabase tables. */
export interface Auditable {
  createdAt: ISO8601;
  updatedAt: ISO8601;
  createdById?: UUID | null;
  updatedById?: UUID | null;
}

/** Optional soft-delete support for enterprise records. */
export interface SoftDeletable {
  deletedAt?: ISO8601 | null;
}

export type BaseEntity = Auditable & SoftDeletable;

export type CompanyScopedEntity = CompanyScoped & BaseEntity & { id: UUID };
export type ProjectScopedEntity = ProjectScoped & BaseEntity & { id: UUID };

export type CurrencyCode = "SAR" | "AED" | "USD" | "EUR" | "GBP";

export type Priority = "Critical" | "High" | "Medium" | "Low";

export type ApprovalStatus =
  | "Draft"
  | "Open"
  | "Under Review"
  | "Approved"
  | "Rejected"
  | "Overdue"
  | "Closed";

export type HealthStatus = "healthy" | "at-risk" | "critical";

export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export type ProjectLifecycleStatus =
  | "Planning"
  | "Mobilizing"
  | "Active"
  | "Delayed"
  | "On Hold"
  | "Completed"
  | "Cancelled";

export type UserRole =
  | "owner"
  | "admin"
  | "project_director"
  | "construction_manager"
  | "project_manager"
  | "engineer"
  | "procurement"
  | "commercial"
  | "qa_qc"
  | "hse"
  | "viewer";

export type ProjectMemberRole =
  | "director"
  | "manager"
  | "engineer"
  | "supervisor"
  | "commercial"
  | "procurement"
  | "qa_qc"
  | "hse"
  | "viewer";

export type NotificationChannel = "in_app" | "email" | "push" | "sms";

export type NotificationType =
  | "rfi_overdue"
  | "submittal_pending"
  | "task_assigned"
  | "risk_escalated"
  | "meeting_reminder"
  | "document_uploaded"
  | "schedule_slippage"
  | "procurement_delay"
  | "ai_insight"
  | "system";

export type AiConversationScope = "portfolio" | "project";

export type AiMessageRole = "user" | "assistant" | "system";

export type ScheduleActivityStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "delayed"
  | "on_hold";

export type TaskStatus =
  | "backlog"
  | "todo"
  | "in_progress"
  | "blocked"
  | "done"
  | "cancelled";

export type ProcurementStatus =
  | "draft"
  | "rfq_issued"
  | "quotation_received"
  | "po_issued"
  | "in_transit"
  | "delivered"
  | "delayed"
  | "cancelled";

export type MaterialStatus =
  | "planned"
  | "ordered"
  | "in_transit"
  | "on_site"
  | "installed"
  | "delayed"
  | "critical";

export type EquipmentStatus =
  | "active"
  | "idle"
  | "maintenance"
  | "offline"
  | "decommissioned";

export type DrawingType =
  | "ifc"
  | "shop"
  | "red_mark"
  | "as_built"
  | "revision_history"
  | "coordination"
  | "other";

export type DocumentCategory =
  | "drawing"
  | "specification"
  | "report"
  | "contract"
  | "correspondence"
  | "method_statement"
  | "itp"
  | "commercial"
  | "other";

export type SubmittalType =
  | "material"
  | "shop_drawing"
  | "method_statement"
  | "itp"
  | "sample"
  | "other";

export type ContractType =
  | "main"
  | "subcontract"
  | "consultancy"
  | "supply"
  | "variation"
  | "nda";

export type ContractStatus =
  | "draft"
  | "under_review"
  | "signed"
  | "active"
  | "completed"
  | "terminated";

export type MeetingType =
  | "coordination"
  | "progress"
  | "safety"
  | "design"
  | "commercial"
  | "client"
  | "other";

export type MeetingStatus =
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "postponed";

export type RiskCategory =
  | "schedule"
  | "cost"
  | "quality"
  | "safety"
  | "design"
  | "procurement"
  | "interface"
  | "regulatory"
  | "other";

export type RiskStatus = "open" | "mitigating" | "monitoring" | "closed";

export type PaginationParams = {
  page?: number;
  pageSize?: number;
};

export type PaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
};

export type SortDirection = "asc" | "desc";

export type ListFilter<T = Record<string, unknown>> = Partial<T> &
  PaginationParams & {
    sortBy?: string;
    sortDirection?: SortDirection;
  };
