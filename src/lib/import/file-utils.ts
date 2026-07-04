const EXCEL_EXTENSIONS = [".xlsx", ".xls"] as const;

const EXCEL_MIME_TYPES = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "application/octet-stream",
] as const;

export function isExcelFile(file: File): boolean {
  const name = file.name.toLowerCase();
  const hasExtension = EXCEL_EXTENSIONS.some((ext) => name.endsWith(ext));
  if (hasExtension) return true;

  if (!file.type) return false;
  return EXCEL_MIME_TYPES.some((mime) => file.type === mime);
}

export const EXCEL_ACCEPT =
  ".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel";

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
