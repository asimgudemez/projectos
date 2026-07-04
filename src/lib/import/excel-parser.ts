import * as XLSX from "xlsx";

import {
  buildColumnMap,
  isEmptyRow,
  normalizeHeader,
} from "@/lib/import/header-utils";
import { resolveSheetMapping } from "@/lib/import/sheet-registry";
import type { ParsedSheet, ParsedWorkbook, RawExcelRow } from "@/lib/import/types";

const MAX_HEADER_SCAN_ROWS = 15;
const MIN_HEADER_MATCHES = 2;

function sheetToMatrix(sheet: XLSX.WorkSheet): unknown[][] {
  return XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    defval: null,
    raw: false,
  }) as unknown[][];
}

function detectHeaderRow(matrix: unknown[][]): number {
  let bestRow = 0;
  let bestScore = 0;

  const limit = Math.min(matrix.length, MAX_HEADER_SCAN_ROWS);
  for (let i = 0; i < limit; i++) {
    const row = matrix[i] ?? [];
    const cells = row
      .map((c) => (c === null ? "" : String(c).trim()))
      .filter(Boolean);
    if (cells.length < 2) continue;

    const normalized = cells.map(normalizeHeader);
    const aliasHits = normalized.filter((cell) =>
      ["ref", "status", "title", "subject", "description", "date", "no", "discipline"].some(
        (token) => cell.includes(token)
      )
    ).length;

    const score = cells.length + aliasHits * 2;
    if (score > bestScore) {
      bestScore = score;
      bestRow = i;
    }
  }

  return bestRow;
}

function matrixToRows(
  matrix: unknown[][],
  headerRowIndex: number
): { headers: string[]; rows: RawExcelRow[]; skippedRows: number } {
  const headerCells = matrix[headerRowIndex] ?? [];
  const headers = headerCells.map((cell, index) => {
    const label = cell === null ? "" : String(cell).trim();
    return label || `Column ${index + 1}`;
  });

  const columnMap = buildColumnMap(headers);
  const hasUsableHeaders = Object.keys(columnMap).length >= MIN_HEADER_MATCHES;

  const rows: RawExcelRow[] = [];
  let skippedRows = 0;

  for (let i = headerRowIndex + 1; i < matrix.length; i++) {
    const line = matrix[i] ?? [];
    const record: RawExcelRow = {};

    headers.forEach((header, colIndex) => {
      const value = line[colIndex];
      if (value === null || value === undefined || value === "") {
        record[header] = null;
      } else if (typeof value === "number" || typeof value === "boolean") {
        record[header] = value;
      } else {
        record[header] = String(value).trim();
      }
    });

    if (isEmptyRow(record)) {
      skippedRows += 1;
      continue;
    }

    if (!hasUsableHeaders) {
      const firstCell = String(line[0] ?? "").trim();
      if (!firstCell || firstCell.toLowerCase().includes("total")) {
        skippedRows += 1;
        continue;
      }
    }

    rows.push(record);
  }

  return { headers, rows, skippedRows };
}

function parseSheet(sheetName: string, sheet: XLSX.WorkSheet): ParsedSheet {
  const mapping = resolveSheetMapping(sheetName);
  const matrix = sheetToMatrix(sheet);

  if (matrix.length === 0) {
    return {
      sheetName,
      targetModule: mapping.targetModule,
      moduleLabel: mapping.moduleLabel,
      headers: [],
      headerRowIndex: 0,
      rows: [],
      rowCount: 0,
      skippedRows: 0,
    };
  }

  const headerRowIndex = detectHeaderRow(matrix);
  const { headers, rows, skippedRows } = matrixToRows(matrix, headerRowIndex);

  return {
    sheetName,
    targetModule: mapping.targetModule,
    moduleLabel: mapping.moduleLabel,
    headers,
    headerRowIndex,
    rows,
    rowCount: rows.length,
    skippedRows,
  };
}

export function parseExcelBuffer(
  buffer: ArrayBuffer,
  fileName: string
): ParsedWorkbook {
  const workbook = XLSX.read(buffer, {
    type: "array",
    cellDates: true,
    dense: false,
  });

  const sheets = workbook.SheetNames.map((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    return parseSheet(sheetName, sheet);
  });

  return {
    fileName,
    sheetNames: workbook.SheetNames,
    sheets,
    parsedAt: new Date().toISOString(),
  };
}

export function parseExcelFile(file: File): Promise<ParsedWorkbook> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const buffer = reader.result as ArrayBuffer;
        resolve(parseExcelBuffer(buffer, file.name));
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read file"));
    reader.readAsArrayBuffer(file);
  });
}

export function getWorkbookStats(workbook: ParsedWorkbook) {
  return {
    totalSheets: workbook.sheets.length,
    mappedSheets: workbook.sheets.filter((s) => s.targetModule !== "unmapped").length,
    totalRows: workbook.sheets.reduce((sum, s) => sum + s.rowCount, 0),
  };
}
