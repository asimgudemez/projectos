import type {
  ApprovalStatus,
  Priority,
  SubmittalType,
  UUID,
} from "@/lib/data/entities";

/** Target ProjectOS module for an Excel sheet. */
export type ImportModuleTarget =
  | "summary"
  | "rfi"
  | "shop_drawing"
  | "method_statement"
  | "itp"
  | "material_inspection"
  | "letter"
  | "material"
  | "task"
  | "submittal"
  | "plan"
  | "design_change"
  | "unmapped";

export type ImportModuleLabel =
  | "Summary"
  | "RFIs"
  | "Shop Drawings"
  | "Method Statements"
  | "ITPs"
  | "Material Inspections"
  | "Letters"
  | "Materials"
  | "Tasks / Actions"
  | "Submittals"
  | "Plans"
  | "Design Changes"
  | "Unmapped";

export type RawExcelRow = Record<string, string | number | boolean | null>;

export type ParsedSheet = {
  sheetName: string;
  targetModule: ImportModuleTarget;
  moduleLabel: ImportModuleLabel;
  headers: string[];
  headerRowIndex: number;
  rows: RawExcelRow[];
  rowCount: number;
  skippedRows: number;
  /** First 10 data rows (including header row) for UI preview */
  previewRows: string[][];
};

export type ParsedWorkbook = {
  fileName: string;
  sheetNames: string[];
  sheets: ParsedSheet[];
  parsedAt: string;
};

/** Normalized record base from Excel import (pre-entity). */
export type ImportedRecordBase = {
  importId: string;
  sourceSheet: string;
  sourceRow: number;
  companyId: UUID;
  projectId: UUID;
  reference: string;
  title: string;
  status: ApprovalStatus;
  priority: Priority;
  discipline?: string | null;
  responsibleParty?: string | null;
  consultant?: string | null;
  submissionDate?: string | null;
  dueDate?: string | null;
  revision?: string | null;
  remarks?: string | null;
  raw: RawExcelRow;
};

export type ImportedRfiRecord = ImportedRecordBase & {
  module: "rfi";
  subject: string;
  daysOpen?: number | null;
};

export type ImportedDrawingRecord = ImportedRecordBase & {
  module: "shop_drawing" | "plan";
  drawingType: "shop" | "ifc" | "coordination" | "other";
};

export type ImportedSubmittalRecord = ImportedRecordBase & {
  module: "method_statement" | "itp" | "material_inspection" | "submittal";
  submittalType: SubmittalType;
};

export type ImportedMaterialRecord = ImportedRecordBase & {
  module: "material";
  supplier?: string | null;
  quantity?: string | null;
  awaitedFrom?: string | null;
};

export type ImportedLetterRecord = ImportedRecordBase & {
  module: "letter";
  letterType?: string | null;
  fromParty?: string | null;
  toParty?: string | null;
};

export type ImportedTaskRecord = ImportedRecordBase & {
  module: "task";
  actionOwner?: string | null;
  followUpDate?: string | null;
};

export type ImportedDesignChangeRecord = ImportedRecordBase & {
  module: "design_change";
};

export type NormalizedImportRecord =
  | ImportedRfiRecord
  | ImportedDrawingRecord
  | ImportedSubmittalRecord
  | ImportedMaterialRecord
  | ImportedLetterRecord
  | ImportedTaskRecord
  | ImportedDesignChangeRecord;

export type ImportSummary = {
  totalSheets: number;
  mappedSheets: number;
  totalRecords: number;
  rfisCount: number;
  drawingsCount: number;
  materialsCount: number;
  submittalsCount: number;
  tasksCount: number;
  lettersCount: number;
  overdueCount: number;
  pendingApprovalsCount: number;
  byModule: Partial<Record<ImportModuleTarget, number>>;
};

export type ImportInsight = {
  id: string;
  category: "delay" | "pending" | "material" | "follow_up";
  title: string;
  detail: string;
  count: number;
  references: string[];
};

export type ImportInsights = {
  generatedAt: string;
  items: ImportInsight[];
};

export type ImportBatch = {
  id: UUID;
  fileName: string;
  fileSizeBytes?: number;
  companyId: UUID;
  projectId: UUID;
  importedAt: string;
  workbook: ParsedWorkbook;
  records: NormalizedImportRecord[];
  summary: ImportSummary;
  insights: ImportInsights;
};

/** Future Supabase bulk insert structure. */
export type SupabaseInsertBatch = {
  table: string;
  rows: Record<string, unknown>[];
};

export type ImportPersistencePayload = {
  batch: ImportBatch;
  supabaseInserts: SupabaseInsertBatch[];
};

export type ImportStep = "upload" | "preview" | "complete";
