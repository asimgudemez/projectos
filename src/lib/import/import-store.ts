import type { TaskStatus, UUID } from "@/lib/data/entities";
import { getMockStore } from "@/lib/data/adapters/mock/mock-store";
import { NOW } from "@/lib/data/adapters/mock/fixtures/ids";
import { dispatchImportComplete } from "@/lib/import/import-events";
import { formatFileSize } from "@/lib/import/file-utils";
import type {
  ImportBatch,
  ImportPersistencePayload,
  ImportedMaterialRecord,
  ImportedSubmittalRecord,
  ImportedTaskRecord,
  NormalizedImportRecord,
  SupabaseInsertBatch,
} from "@/lib/import/types";

const STORAGE_KEY = "projectos-import-batches";

export function loadImportBatches(projectId?: UUID): ImportBatch[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const all = JSON.parse(raw) as ImportBatch[];
    return projectId
      ? all.filter((batch) => batch.projectId === projectId)
      : all;
  } catch {
    return [];
  }
}

export function saveImportBatch(batch: ImportBatch): void {
  if (typeof window === "undefined") return;
  const existing = loadImportBatches();
  const updated = [batch, ...existing.filter((b) => b.id !== batch.id)];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

function toSnakeCaseRow(
  record: NormalizedImportRecord
): Record<string, unknown> {
  return {
    company_id: record.companyId,
    project_id: record.projectId,
    reference: record.reference,
    title: record.title,
    status: record.status,
    priority: record.priority,
    discipline: record.discipline,
    responsible_party: record.responsibleParty,
    consultant: record.consultant,
    submission_date: record.submissionDate,
    due_date: record.dueDate,
    revision: record.revision,
    remarks: record.remarks,
    import_source_sheet: record.sourceSheet,
    import_source_row: record.sourceRow,
    import_id: record.importId,
  };
}

export function buildSupabaseInsertPayload(
  batch: ImportBatch
): SupabaseInsertBatch[] {
  const groups: Record<string, NormalizedImportRecord[]> = {
    rfis: [],
    drawings: [],
    submittals: [],
    materials: [],
    tasks: [],
    documents: [],
  };

  for (const record of batch.records) {
    switch (record.module) {
      case "rfi":
        groups.rfis.push(record);
        break;
      case "shop_drawing":
      case "plan":
        groups.drawings.push(record);
        break;
      case "method_statement":
      case "itp":
      case "material_inspection":
      case "submittal":
        groups.submittals.push(record);
        break;
      case "material":
        groups.materials.push(record);
        break;
      case "task":
      case "design_change":
        groups.tasks.push(record);
        break;
      case "letter":
        groups.documents.push(record);
        break;
    }
  }

  const inserts: SupabaseInsertBatch[] = [];

  if (groups.rfis.length) {
    inserts.push({
      table: "rfis",
      rows: groups.rfis.map((r) => ({
        ...toSnakeCaseRow(r),
        subject: r.title,
        days_open: 0,
      })),
    });
  }

  if (groups.drawings.length) {
    inserts.push({
      table: "drawings",
      rows: groups.drawings.map((r) => ({
        ...toSnakeCaseRow(r),
        drawing_type: r.module === "plan" ? "ifc" : "shop",
      })),
    });
  }

  if (groups.submittals.length) {
    inserts.push({
      table: "submittals",
      rows: (groups.submittals as ImportedSubmittalRecord[]).map((r) => ({
        ...toSnakeCaseRow(r),
        type: r.submittalType,
      })),
    });
  }

  if (groups.materials.length) {
    inserts.push({
      table: "materials",
      rows: (groups.materials as ImportedMaterialRecord[]).map((r) => ({
        ...toSnakeCaseRow(r),
        code: r.reference,
        name: r.title,
        status: r.status === "Approved" ? "on_site" : "ordered",
        quantity: 1,
        unit: "lot",
        required_on_site_date: r.dueDate ?? r.submissionDate,
        supplier: r.supplier,
        detail: r.awaitedFrom ?? r.remarks,
      })),
    });
  }

  if (groups.tasks.length) {
    inserts.push({
      table: "tasks",
      rows: groups.tasks.map((r) => ({
        ...toSnakeCaseRow(r),
        status: "todo",
        tags: ["excel-import"],
      })),
    });
  }

  if (groups.documents.length) {
    inserts.push({
      table: "documents",
      rows: groups.documents.map((r) => ({
        ...toSnakeCaseRow(r),
        category: "correspondence",
        file_name: `${r.reference}.pdf`,
        mime_type: "application/pdf",
        file_size_bytes: 0,
        storage_path: `imports/${batch.id}/${r.reference}`,
        storage_bucket: "project-documents",
        tags: ["letter", "excel-import"],
      })),
    });
  }

  return inserts;
}

/** Merge normalized import records into the in-memory mock data store. */
export function applyImportToMockStore(batch: ImportBatch): void {
  const store = getMockStore().snapshot;
  const now = NOW;

  for (const record of batch.records) {
    switch (record.module) {
      case "rfi":
        store.rfis.push({
          id: record.importId,
          companyId: record.companyId,
          projectId: record.projectId,
          reference: record.reference,
          subject: record.title,
          status: record.status,
          priority: record.priority,
          discipline: record.discipline,
          area: null,
          responsibleEngineerId: null,
          consultant: record.consultant,
          submittedById: null,
          submissionDate: record.submissionDate ?? now.slice(0, 10),
          dueDate: record.dueDate ?? now.slice(0, 10),
          daysOpen: 0,
          revision: record.revision ?? "—",
          aiSummary: record.remarks,
          createdAt: now,
          updatedAt: now,
        });
        break;

      case "shop_drawing":
      case "plan":
        store.drawings.push({
          id: record.importId,
          companyId: record.companyId,
          projectId: record.projectId,
          reference: record.reference,
          title: record.title,
          drawingType: record.module === "plan" ? "ifc" : "shop",
          discipline: record.discipline ?? "General",
          status: record.status,
          priority: record.priority,
          area: null,
          responsibleEngineerId: null,
          consultant: record.consultant,
          submissionDate: record.submissionDate ?? now.slice(0, 10),
          dueDate: record.dueDate ?? now.slice(0, 10),
          revision: record.revision ?? "Rev A",
          aiSummary: record.remarks,
          createdAt: now,
          updatedAt: now,
        });
        break;

      case "method_statement":
      case "itp":
      case "material_inspection":
      case "submittal": {
        const submittal = record as ImportedSubmittalRecord;
        store.submittals.push({
          id: record.importId,
          companyId: record.companyId,
          projectId: record.projectId,
          reference: record.reference,
          title: record.title,
          type: submittal.submittalType,
          status: record.status,
          priority: record.priority,
          discipline: record.discipline,
          responsibleEngineerId: null,
          reviewer: record.consultant,
          submittedById: null,
          submissionDate: record.submissionDate ?? now.slice(0, 10),
          dueDate: record.dueDate ?? now.slice(0, 10),
          revision: record.revision ?? "Rev A",
          aiSummary: record.remarks,
          createdAt: now,
          updatedAt: now,
        });
        break;
      }

      case "material":
        store.materials.push({
          id: record.importId,
          companyId: record.companyId,
          projectId: record.projectId,
          code: record.reference,
          name: record.title,
          status:
            record.status === "Approved"
              ? "on_site"
              : record.status === "Overdue"
                ? "critical"
                : "ordered",
          quantity: 1,
          unit: "lot",
          supplier: "supplier" in record ? record.supplier : null,
          requiredOnSiteDate: record.dueDate ?? now.slice(0, 10),
          detail:
            ("awaitedFrom" in record ? record.awaitedFrom : null) ?? record.remarks,
          createdAt: now,
          updatedAt: now,
        });
        break;

      case "task":
      case "design_change": {
        const taskRecord = record as ImportedTaskRecord;
        const owner = taskRecord.actionOwner ?? record.responsibleParty;
        const importStatus = record.status;
        const taskStatus: TaskStatus =
          importStatus === "Approved" || importStatus === "Closed"
            ? "done"
            : importStatus === "Overdue"
              ? "blocked"
              : importStatus === "Under Review"
                ? "in_progress"
                : "todo";

        const tags =
          record.module === "task"
            ? ["excel-import", "follow-up-tracker"]
            : ["excel-import", "design-change"];

        store.tasks.push({
          id: record.importId,
          companyId: record.companyId,
          projectId: record.projectId,
          reference: record.reference,
          title: record.title,
          description: [
            owner ? `Owner: ${owner}` : null,
            record.remarks ? `Remarks: ${record.remarks}` : null,
            `Import status: ${importStatus}`,
            `Source: ${record.sourceSheet} row ${record.sourceRow}`,
          ]
            .filter(Boolean)
            .join(" · "),
          status: taskStatus,
          priority: record.priority,
          assigneeId: null,
          dueDate: taskRecord.followUpDate ?? record.dueDate,
          module: record.module,
          tags,
          createdAt: now,
          updatedAt: now,
        });
        break;
      }

      case "letter":
        store.documents.push({
          id: record.importId,
          companyId: record.companyId,
          projectId: record.projectId,
          name: record.title,
          category: "correspondence",
          fileName: `${record.reference}.pdf`,
          mimeType: "application/pdf",
          fileSizeBytes: 0,
          storagePath: `imports/${batch.id}/${record.reference}`,
          storageBucket: "project-documents",
          version: 1,
          uploadedAt: now,
          tags: ["letter", "excel-import"],
          isConfidential: false,
          description: record.remarks,
          createdAt: now,
          updatedAt: now,
        });
        break;
    }
  }
}

function registerImportedWorkbook(batch: ImportBatch): void {
  const store = getMockStore().snapshot;
  const now = new Date().toISOString();
  const size = batch.fileSizeBytes ?? 0;

  store.documents.unshift({
    id: batch.id,
    companyId: batch.companyId,
    projectId: batch.projectId,
    name: batch.fileName,
    category: "report",
    fileName: batch.fileName,
    mimeType: batch.fileName.endsWith(".xls")
      ? "application/vnd.ms-excel"
      : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    fileSizeBytes: size,
    storagePath: `imports/${batch.id}/${batch.fileName}`,
    storageBucket: "project-documents",
    version: 1,
    uploadedAt: now,
    tags: ["excel-import", "technical-deliverables"],
    isConfidential: false,
    description: `Imported ${batch.summary.totalRecords} records from ${batch.summary.totalSheets} sheets (${formatFileSize(size)})`,
    createdAt: now,
    updatedAt: now,
  });
}

export function persistImportBatch(batch: ImportBatch): ImportPersistencePayload {
  applyImportToMockStore(batch);
  registerImportedWorkbook(batch);
  saveImportBatch(batch);

  dispatchImportComplete({
    fileName: batch.fileName,
    totalRecords: batch.summary.totalRecords,
    projectId: batch.projectId,
  });

  return {
    batch,
    supabaseInserts: buildSupabaseInsertPayload(batch),
  };
}

export function getLatestImportBatch(projectId: UUID): ImportBatch | null {
  const batches = loadImportBatches(projectId);
  return batches[0] ?? null;
}
