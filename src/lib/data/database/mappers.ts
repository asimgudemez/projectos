/**
 * Maps between snake_case database rows and camelCase domain entities.
 */

import type { DbProject, DbRfi, DbUser } from "@/lib/data/database/database.types";
import type { Project, Rfi, User } from "@/lib/data/entities";

export function mapDbUser(row: DbUser): User {
  return {
    id: row.id,
    companyId: row.company_id,
    email: row.email,
    fullName: row.full_name,
    role: row.role as User["role"],
    jobTitle: row.job_title,
    phone: row.phone,
    avatarUrl: row.avatar_url,
    department: row.department,
    isActive: row.is_active,
    lastLoginAt: row.last_login_at,
    invitedAt: row.invited_at,
    authUserId: row.auth_user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    createdById: row.created_by_id,
    updatedById: row.updated_by_id,
    deletedAt: row.deleted_at,
  };
}

export function mapDbProject(row: DbProject): Project {
  return {
    id: row.id,
    companyId: row.company_id,
    code: row.code,
    name: row.name,
    clientName: row.client_name,
    country: row.country,
    city: row.city,
    description: row.description,
    status: row.status as Project["status"],
    health: row.health as Project["health"],
    healthScore: row.health_score,
    riskLevel: row.risk_level as Project["riskLevel"],
    progressPct: row.progress_pct,
    contractValue: Number(row.contract_value),
    contractCurrency: row.contract_currency as Project["contractCurrency"],
    currentPhase: row.current_phase ?? "",
    startDate: row.start_date,
    plannedFinishDate: row.planned_finish_date,
    actualFinishDate: row.actual_finish_date,
    nextMilestone: row.next_milestone,
    nextMilestoneDate: row.next_milestone_date,
    isDelayed: row.is_delayed,
    projectDirectorId: row.project_director_id,
    constructionManagerId: row.construction_manager_id,
    projectManagerId: row.project_manager_id,
    locationLat: row.location_lat,
    locationLng: row.location_lng,
    timezone: row.timezone,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    createdById: row.created_by_id,
    updatedById: row.updated_by_id,
    deletedAt: row.deleted_at,
  };
}

export function mapDbRfi(row: DbRfi): Rfi {
  return {
    id: row.id,
    companyId: row.company_id,
    projectId: row.project_id,
    reference: row.reference,
    subject: row.subject,
    description: row.description,
    status: row.status as Rfi["status"],
    priority: row.priority as Rfi["priority"],
    discipline: row.discipline,
    area: row.area,
    responsibleEngineerId: row.responsible_engineer_id,
    consultant: row.consultant,
    submittedById: row.submitted_by_id,
    submissionDate: row.submission_date,
    dueDate: row.due_date,
    responseDate: row.response_date,
    daysOpen: row.days_open,
    revision: row.revision,
    aiSummary: row.ai_summary,
    costImpact: row.cost_impact,
    scheduleImpactDays: row.schedule_impact_days,
    linkedDrawingId: row.linked_drawing_id,
    closedAt: row.closed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    createdById: row.created_by_id,
    updatedById: row.updated_by_id,
    deletedAt: row.deleted_at,
  };
}

export function mapProjectToDb(
  entity: Partial<Project>
): Partial<DbProject> {
  return {
    id: entity.id,
    company_id: entity.companyId,
    code: entity.code,
    name: entity.name,
    client_name: entity.clientName,
    country: entity.country,
    city: entity.city,
    description: entity.description,
    status: entity.status,
    health: entity.health,
    health_score: entity.healthScore,
    risk_level: entity.riskLevel,
    progress_pct: entity.progressPct,
    contract_value: entity.contractValue,
    contract_currency: entity.contractCurrency,
    current_phase: entity.currentPhase,
    start_date: entity.startDate,
    planned_finish_date: entity.plannedFinishDate,
    actual_finish_date: entity.actualFinishDate,
    next_milestone: entity.nextMilestone,
    next_milestone_date: entity.nextMilestoneDate,
    is_delayed: entity.isDelayed,
    project_director_id: entity.projectDirectorId,
    construction_manager_id: entity.constructionManagerId,
    project_manager_id: entity.projectManagerId,
  };
}
