import type {
  ImportBatch,
  ImportInsight,
  ImportInsights,
  ImportSummary,
  NormalizedImportRecord,
  ParsedWorkbook,
} from "@/lib/import/types";

const PENDING_STATUSES = new Set([
  "Open",
  "Under Review",
  "Draft",
  "Pending",
  "Overdue",
]);

const OVERDUE_STATUSES = new Set(["Overdue"]);

function isOverdue(record: NormalizedImportRecord): boolean {
  if (OVERDUE_STATUSES.has(record.status)) return true;
  if (!record.dueDate) return false;
  const due = Date.parse(record.dueDate);
  if (Number.isNaN(due)) return false;
  return due < Date.now() && record.status !== "Approved" && record.status !== "Closed";
}

function isPendingApproval(record: NormalizedImportRecord): boolean {
  return PENDING_STATUSES.has(record.status) && record.status !== "Overdue";
}

export function buildImportSummary(
  workbook: ParsedWorkbook,
  records: NormalizedImportRecord[]
): ImportSummary {
  const byModule: ImportSummary["byModule"] = {};

  for (const record of records) {
    const key =
      record.module === "shop_drawing" || record.module === "plan"
        ? "shop_drawing"
        : record.module === "method_statement" ||
            record.module === "itp" ||
            record.module === "material_inspection" ||
            record.module === "submittal"
          ? record.module
          : record.module;
    byModule[key as keyof typeof byModule] =
      (byModule[key as keyof typeof byModule] ?? 0) + 1;
  }

  return {
    totalSheets: workbook.sheets.length,
    mappedSheets: workbook.sheets.filter((s) => s.targetModule !== "unmapped").length,
    totalRecords: records.length,
    rfisCount: records.filter((r) => r.module === "rfi").length,
    drawingsCount: records.filter(
      (r) => r.module === "shop_drawing" || r.module === "plan"
    ).length,
    materialsCount: records.filter((r) => r.module === "material").length,
    submittalsCount: records.filter(
      (r) =>
        r.module === "submittal" ||
        r.module === "method_statement" ||
        r.module === "itp" ||
        r.module === "material_inspection"
    ).length,
    tasksCount: records.filter((r) => r.module === "task").length,
    lettersCount: records.filter((r) => r.module === "letter").length,
    overdueCount: records.filter(isOverdue).length,
    pendingApprovalsCount: records.filter(isPendingApproval).length,
    byModule,
  };
}

export function generateImportInsights(
  records: NormalizedImportRecord[]
): ImportInsights {
  const overdue = records.filter(isOverdue);
  const pending = records.filter(isPendingApproval);
  const materialsAwaited = records.filter(
    (r) => r.module === "material" && r.status !== "Approved"
  );
  const followUp = records.filter(
    (r) =>
      r.module === "task" ||
      (r.status === "Overdue" || isOverdue(r)) ||
      r.remarks?.toLowerCase().includes("follow")
  );

  const items: ImportInsight[] = [
    {
      id: "insight-delays",
      category: "delay",
      title: "Which approvals are delayed?",
      detail:
        overdue.length > 0
          ? `${overdue.length} item(s) are overdue or past due date across RFIs, submittals, and drawings.`
          : "No overdue approvals detected in this import.",
      count: overdue.length,
      references: overdue.slice(0, 5).map((r) => r.reference),
    },
    {
      id: "insight-pending",
      category: "pending",
      title: "Which documents are pending?",
      detail:
        pending.length > 0
          ? `${pending.length} document(s) await consultant or client approval.`
          : "All imported items are approved or closed.",
      count: pending.length,
      references: pending.slice(0, 5).map((r) => r.reference),
    },
    {
      id: "insight-materials",
      category: "material",
      title: "Which materials are awaited?",
      detail:
        materialsAwaited.length > 0
          ? `${materialsAwaited.length} material line(s) pending delivery or HQ release.`
          : "No materials flagged as awaited in this workbook.",
      count: materialsAwaited.length,
      references: materialsAwaited.slice(0, 5).map((r) => r.reference),
    },
    {
      id: "insight-followup",
      category: "follow_up",
      title: "Which items require immediate follow-up?",
      detail:
        followUp.length > 0
          ? `${followUp.length} item(s) require action from the follow-up tracker or overdue register.`
          : "No immediate follow-up items identified.",
      count: followUp.length,
      references: followUp.slice(0, 5).map((r) => r.reference),
    },
  ];

  return {
    generatedAt: new Date().toISOString(),
    items,
  };
}

export function buildImportBatch(
  workbook: ParsedWorkbook,
  records: NormalizedImportRecord[],
  companyId: string,
  projectId: string,
  fileSizeBytes?: number
): ImportBatch {
  const summary = buildImportSummary(workbook, records);
  const insights = generateImportInsights(records);

  return {
    id: crypto.randomUUID(),
    fileName: workbook.fileName,
    fileSizeBytes,
    companyId,
    projectId,
    importedAt: new Date().toISOString(),
    workbook,
    records,
    summary,
    insights,
  };
}
