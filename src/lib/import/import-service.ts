import { resolveProjectId } from "@/lib/data/adapters/mock/fixtures/ids";
import { DEFAULT_COMPANY_ID } from "@/lib/data";
import { parseExcelFile } from "@/lib/import/excel-parser";
import { buildImportBatch } from "@/lib/import/import-insights";
import { persistImportBatch } from "@/lib/import/import-store";
import { normalizeWorkbook } from "@/lib/import/normalizers";
import type {
  ImportBatch,
  ImportPersistencePayload,
  ParsedWorkbook,
} from "@/lib/import/types";

export async function previewExcelImport(file: File): Promise<ParsedWorkbook> {
  return parseExcelFile(file);
}

export async function executeExcelImport(
  file: File,
  projectId: string,
  companyId: string = DEFAULT_COMPANY_ID
): Promise<ImportPersistencePayload> {
  const workbook = await parseExcelFile(file);
  const resolvedProjectId = resolveProjectId(projectId);

  const records = normalizeWorkbook(
    workbook.sheets,
    companyId,
    resolvedProjectId
  );

  const batch = buildImportBatch(
    workbook,
    records,
    companyId,
    resolvedProjectId
  );

  return persistImportBatch(batch);
}

export function reprocessWorkbook(
  workbook: ParsedWorkbook,
  projectId: string,
  companyId: string = DEFAULT_COMPANY_ID
): ImportBatch {
  const resolvedProjectId = resolveProjectId(projectId);
  const records = normalizeWorkbook(
    workbook.sheets,
    companyId,
    resolvedProjectId
  );
  return buildImportBatch(workbook, records, companyId, resolvedProjectId);
}

export { EXPECTED_JCDC_SHEETS } from "@/lib/import/sheet-registry";
export { getWorkbookStats } from "@/lib/import/excel-parser";
