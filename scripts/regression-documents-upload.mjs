#!/usr/bin/env node
/**
 * Regression checks for Documents page Excel upload workflow.
 * Run: npm run regression:documents
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import XLSX from "xlsx";

const root = process.cwd();
const errors = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

function read(path) {
  return readFileSync(join(root, path), "utf8");
}

function checkDocumentsPageFiles() {
  const required = [
    "src/app/(app)/documents/page.tsx",
    "src/components/documents/documents-view.tsx",
    "src/components/import/import-upload-zone.tsx",
    "src/lib/import/excel-parser.ts",
    "src/lib/import/import-service.ts",
    "src/lib/import/import-store.ts",
    "src/lib/documents/documents-data.ts",
  ];

  for (const file of required) {
    assert(existsSync(join(root, file)), `Missing required file: ${file}`);
  }
}

function checkDocumentsViewContent() {
  const view = read("src/components/documents/documents-view.tsx");
  const page = read("src/app/(app)/documents/page.tsx");
  const upload = read("src/components/import/import-upload-zone.tsx");

  assert(page.includes("DocumentsView"), "Documents page must render DocumentsView");
  assert(view.includes("ImportUploadTrigger"), "DocumentsView must include header Upload trigger");
  assert(view.includes("ImportUploadZone"), "DocumentsView must include upload zone");
  assert(view.includes("previewExcelImport"), "DocumentsView must parse Excel on upload");
  assert(view.includes("executeExcelImport"), "DocumentsView must save imports to datastore");
  assert(view.includes("ImportRowPreview"), "DocumentsView must show row preview");
  assert(view.includes("ImportSheetPreview"), "DocumentsView must show sheet preview");
  assert(view.includes("Document Library"), "DocumentsView must preserve document library UI");
  assert(view.includes("ImportSuccessToast"), "DocumentsView must show success notification");
  assert(upload.includes('type="file"'), "Upload input must be a file input");
  assert(upload.includes("EXCEL_ACCEPT"), "Upload must accept Excel MIME types");
  assert(upload.includes("htmlFor"), "Upload must use label htmlFor for native file picker");
}

function checkExcelParser() {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([
    ["Ref", "Status", "Title", "Responsible", "Due Date"],
    ["ACT-001", "Open", "Follow up consultant response", "Sarah", "2026-07-01"],
    ["ACT-002", "Overdue", "Expedite shop drawing", "Omar", "2026-06-20"],
  ]);
  XLSX.utils.book_append_sheet(wb, ws, "Follow-up Tracker");
  const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  assert(buffer.length > 0, "Test workbook generation failed");

  const parsed = XLSX.read(buffer, { type: "buffer" });
  assert(parsed.SheetNames.includes("Follow-up Tracker"), "Parser must detect worksheets");
  const rows = XLSX.utils.sheet_to_json(parsed.Sheets["Follow-up Tracker"], { header: 1 });
  assert(rows.length >= 2, "Parser must read worksheet rows");
}

function checkExcelParserSource() {
  const parser = read("src/lib/import/excel-parser.ts");
  assert(parser.includes("XLSX.read"), "Excel parser must use SheetJS read");
  assert(parser.includes("previewRows"), "Excel parser must build preview rows");
  assert(parser.includes("parseExcelFile"), "Excel parser must export parseExcelFile");
}

console.log("Documents upload regression checks...\n");

checkDocumentsPageFiles();
checkDocumentsViewContent();
checkExcelParser();
checkExcelParserSource();

if (errors.length > 0) {
  console.error("FAILED:\n");
  for (const error of errors) {
    console.error(`  ✗ ${error}`);
  }
  process.exit(1);
}

console.log("✓ All Documents upload regression checks passed");
