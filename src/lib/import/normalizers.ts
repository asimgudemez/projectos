import {
  buildColumnMap,
  getCellValue,
  normalizePriority,
  normalizeStatus,
  parseExcelDate,
} from "@/lib/import/header-utils";
import type {
  ApprovalStatus,
  Priority,
  SubmittalType,
  UUID,
} from "@/lib/data/entities";
import type {
  ImportModuleTarget,
  ImportedDesignChangeRecord,
  ImportedDrawingRecord,
  ImportedLetterRecord,
  ImportedMaterialRecord,
  ImportedRfiRecord,
  ImportedSubmittalRecord,
  ImportedTaskRecord,
  NormalizedImportRecord,
  ParsedSheet,
  RawExcelRow,
} from "@/lib/import/types";

type NormalizeContext = {
  companyId: UUID;
  projectId: UUID;
  sheet: ParsedSheet;
};

function baseRecord(
  ctx: NormalizeContext,
  row: RawExcelRow,
  rowIndex: number,
  columnMap: ReturnType<typeof buildColumnMap>
) {
  const reference =
    getCellValue(row, columnMap.reference) ??
    getCellValue(row, Object.keys(row)[0] ?? null) ??
    `${ctx.sheet.sheetName}-${rowIndex + 1}`;

  const title =
    getCellValue(row, columnMap.title) ??
    getCellValue(row, columnMap.remarks) ??
    reference;

  return {
    importId: crypto.randomUUID(),
    sourceSheet: ctx.sheet.sheetName,
    sourceRow: rowIndex + 1,
    companyId: ctx.companyId,
    projectId: ctx.projectId,
    reference,
    title,
    status: normalizeStatus(getCellValue(row, columnMap.status)) as ApprovalStatus,
    priority: normalizePriority(getCellValue(row, columnMap.priority)) as Priority,
    discipline: getCellValue(row, columnMap.discipline),
    responsibleParty: getCellValue(row, columnMap.responsible),
    consultant: getCellValue(row, columnMap.consultant),
    submissionDate: parseExcelDate(getCellValue(row, columnMap.submissionDate)),
    dueDate: parseExcelDate(getCellValue(row, columnMap.dueDate)),
    revision: getCellValue(row, columnMap.revision) ?? "—",
    remarks: getCellValue(row, columnMap.remarks),
    raw: row,
  };
}

function submittalTypeForModule(module: ImportModuleTarget): SubmittalType {
  switch (module) {
    case "method_statement":
      return "method_statement";
    case "itp":
      return "itp";
    case "material_inspection":
      return "sample";
    default:
      return "material";
  }
}

function normalizeRow(
  ctx: NormalizeContext,
  row: RawExcelRow,
  rowIndex: number
): NormalizedImportRecord | null {
  const columnMap = buildColumnMap(ctx.sheet.headers);
  const base = baseRecord(ctx, row, rowIndex, columnMap);
  const targetModule = ctx.sheet.targetModule;

  switch (targetModule) {
    case "rfi":
      return {
        ...base,
        module: "rfi",
        subject: base.title,
      } satisfies ImportedRfiRecord;

    case "shop_drawing":
    case "plan":
      return {
        ...base,
        module: targetModule === "plan" ? "plan" : "shop_drawing",
        drawingType: targetModule === "plan" ? "ifc" : "shop",
      } satisfies ImportedDrawingRecord;

    case "method_statement":
    case "itp":
    case "material_inspection":
    case "submittal":
      return {
        ...base,
        module: targetModule,
        submittalType: submittalTypeForModule(targetModule),
      } satisfies ImportedSubmittalRecord;

    case "material":
      return {
        ...base,
        module: "material",
        supplier: getCellValue(row, columnMap.supplier),
        quantity: getCellValue(row, columnMap.quantity),
        awaitedFrom: getCellValue(row, columnMap.awaitedFrom),
      } satisfies ImportedMaterialRecord;

    case "letter":
      return {
        ...base,
        module: "letter",
        fromParty: getCellValue(row, columnMap.letterFrom),
        toParty: getCellValue(row, columnMap.letterTo),
      } satisfies ImportedLetterRecord;

    case "task":
      return {
        ...base,
        module: "task",
        actionOwner: base.responsibleParty,
        followUpDate: base.dueDate,
      } satisfies ImportedTaskRecord;

    case "design_change":
      return {
        ...base,
        module: "design_change",
      } satisfies ImportedDesignChangeRecord;

    default:
      return null;
  }
}

export function normalizeSheet(
  sheet: ParsedSheet,
  companyId: UUID,
  projectId: UUID
): NormalizedImportRecord[] {
  if (sheet.targetModule === "summary" || sheet.targetModule === "unmapped") {
    return [];
  }

  const ctx: NormalizeContext = { companyId, projectId, sheet };
  const records: NormalizedImportRecord[] = [];

  sheet.rows.forEach((row, index) => {
    const normalized = normalizeRow(ctx, row, index);
    if (normalized) records.push(normalized);
  });

  return records;
}

export function normalizeWorkbook(
  sheets: ParsedSheet[],
  companyId: UUID,
  projectId: UUID
): NormalizedImportRecord[] {
  return sheets.flatMap((sheet) => normalizeSheet(sheet, companyId, projectId));
}
