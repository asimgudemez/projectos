import type { ApprovalStatus, Priority, UUID } from "@/lib/data/entities";
import { getMockStore } from "@/lib/data/adapters/mock/mock-store";
import { loadImportBatches } from "@/lib/import/import-store";
import type { ImportedTaskRecord, NormalizedImportRecord } from "@/lib/import/types";

const CLOSED_STATUSES = new Set<ApprovalStatus>(["Approved", "Closed"]);
const OPEN_STATUSES = new Set<ApprovalStatus>([
  "Open",
  "Under Review",
  "Draft",
  "Overdue",
  "Rejected",
]);

export type ImportedActionView = {
  id: string;
  reference: string;
  title: string;
  status: ApprovalStatus;
  priority: Priority;
  responsibleParty: string | null;
  dueDate: string | null;
  remarks: string | null;
  discipline: string | null;
  sourceSheet: string;
  sourceRow: number;
  fileName: string;
  importedAt: string;
  projectId: UUID;
  isOverdue: boolean;
  isOpen: boolean;
  isHighPriority: boolean;
  riskScore: number;
};

export type ImportedActionsStats = {
  total: number;
  open: number;
  overdue: number;
  highPriority: number;
  latestFileName: string | null;
  latestImportedAt: string | null;
  actions: ImportedActionView[];
};

function isRecordOverdue(record: NormalizedImportRecord): boolean {
  if (record.status === "Overdue") return true;
  if (!record.dueDate || CLOSED_STATUSES.has(record.status)) return false;
  const due = Date.parse(record.dueDate);
  if (Number.isNaN(due)) return false;
  return due < Date.now();
}

function isRecordOpen(record: NormalizedImportRecord): boolean {
  if (CLOSED_STATUSES.has(record.status)) return false;
  return OPEN_STATUSES.has(record.status) || isRecordOverdue(record);
}

function isHighPriority(priority: Priority): boolean {
  return priority === "Critical" || priority === "High";
}

function computeRiskScore(record: NormalizedImportRecord): number {
  let score = 0;
  if (isRecordOverdue(record)) score += 4;
  if (record.priority === "Critical") score += 3;
  if (record.priority === "High") score += 2;
  if (record.status === "Open" || record.status === "Overdue") score += 1;
  if (record.remarks?.toLowerCase().includes("urgent")) score += 1;
  if (record.remarks?.toLowerCase().includes("risk")) score += 1;
  return score;
}

function mapFollowUpRecord(
  record: ImportedTaskRecord,
  fileName: string,
  importedAt: string
): ImportedActionView {
  const overdue = isRecordOverdue(record);
  const open = isRecordOpen(record);

  return {
    id: record.importId,
    reference: record.reference,
    title: record.title,
    status: record.status,
    priority: record.priority,
    responsibleParty: record.actionOwner ?? record.responsibleParty ?? null,
    dueDate: record.followUpDate ?? record.dueDate ?? null,
    remarks: record.remarks ?? null,
    discipline: record.discipline ?? null,
    sourceSheet: record.sourceSheet,
    sourceRow: record.sourceRow,
    fileName,
    importedAt,
    projectId: record.projectId,
    isOverdue: overdue,
    isOpen: open,
    isHighPriority: isHighPriority(record.priority),
    riskScore: computeRiskScore(record),
  };
}

/** Follow-up Tracker rows from saved import batches (localStorage). */
export function getImportedFollowUpActions(projectId?: UUID): ImportedActionView[] {
  const batches = loadImportBatches(projectId);
  const actions: ImportedActionView[] = [];

  for (const batch of batches) {
    for (const record of batch.records) {
      if (record.module !== "task") continue;
      actions.push(
        mapFollowUpRecord(record as ImportedTaskRecord, batch.fileName, batch.importedAt)
      );
    }
  }

  return actions.sort(
    (a, b) => new Date(b.importedAt).getTime() - new Date(a.importedAt).getTime()
  );
}

/** Aggregate stats for Command Center and AI context. */
export function getImportedActionsStats(projectId?: UUID): ImportedActionsStats {
  const actions = getImportedFollowUpActions(projectId);
  const batches = loadImportBatches(projectId);
  const latest = batches[0];

  return {
    total: actions.length,
    open: actions.filter((action) => action.isOpen).length,
    overdue: actions.filter((action) => action.isOverdue).length,
    highPriority: actions.filter((action) => action.isHighPriority).length,
    latestFileName: latest?.fileName ?? null,
    latestImportedAt: latest?.importedAt ?? null,
    actions,
  };
}

/** Tasks persisted in mock store from Excel import (Follow-up Tracker). */
export function getImportedTasksFromStore(projectId?: UUID): number {
  const tasks = getMockStore().snapshot.tasks.filter(
    (task) =>
      !task.deletedAt &&
      task.tags.includes("excel-import") &&
      task.tags.includes("follow-up-tracker") &&
      (!projectId || task.projectId === projectId)
  );
  return tasks.length;
}

export function getTopImportedRisks(
  projectId?: UUID,
  limit = 5
): ImportedActionView[] {
  return [...getImportedFollowUpActions(projectId)]
    .sort((a, b) => b.riskScore - a.riskScore || b.priority.localeCompare(a.priority))
    .slice(0, limit);
}

export function groupPendingByOwner(projectId?: UUID): Map<string, ImportedActionView[]> {
  const pending = getImportedFollowUpActions(projectId).filter((action) => action.isOpen);
  const grouped = new Map<string, ImportedActionView[]>();

  for (const action of pending) {
    const owner = action.responsibleParty?.trim() || "Unassigned";
    const existing = grouped.get(owner) ?? [];
    existing.push(action);
    grouped.set(owner, existing);
  }

  return grouped;
}
