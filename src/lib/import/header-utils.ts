/** Header alias groups for flexible Excel column matching. */

export const HEADER_ALIASES = {
  reference: [
    "ref",
    "reference",
    "ref no",
    "ref. no",
    "ref no.",
    "document no",
    "doc no",
    "doc no.",
    "number",
    "no",
    "no.",
    "rfi no",
    "rfi no.",
    "sd no",
    "itp no",
    "mir no",
    "ms no",
    "letter no",
    "transmittal no",
    "id",
  ],
  title: [
    "title",
    "subject",
    "description",
    "document title",
    "item",
    "activity",
    "name",
    "details",
    "scope",
  ],
  status: [
    "status",
    "approval status",
    "current status",
    "review status",
    "state",
    "approval",
  ],
  priority: ["priority", "urgency", "criticality"],
  discipline: ["discipline", "trade", "section", "department"],
  responsible: [
    "responsible",
    "responsible engineer",
    "engineer",
    "contractor",
    "submitted by",
    "originator",
    "prepared by",
    "owner",
    "action by",
    "assigned to",
  ],
  consultant: [
    "consultant",
    "reviewer",
    "reviewed by",
    "approver",
    "client",
    "engineer review",
  ],
  submissionDate: [
    "submission date",
    "submitted",
    "date submitted",
    "submit date",
    "sent date",
    "issue date",
    "date issued",
    "received date",
  ],
  dueDate: [
    "due date",
    "required date",
    "reply by",
    "target date",
    "deadline",
    "response due",
    "expected date",
    "required by",
  ],
  revision: ["revision", "rev", "rev.", "version", "ver"],
  remarks: ["remarks", "comments", "notes", "remark", "comment", "follow up"],
  supplier: ["supplier", "vendor", "manufacturer", "sub-supplier"],
  quantity: ["quantity", "qty", "amount"],
  letterFrom: ["from", "from party", "sender"],
  letterTo: ["to", "to party", "recipient"],
  awaitedFrom: ["awaited from", "awaiting from", "hq status", "source"],
} as const;

export type HeaderField = keyof typeof HEADER_ALIASES;

export function normalizeHeader(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .replace(/[^\w\s&/-]/g, "");
}

export function findColumn(
  headers: string[],
  field: HeaderField
): string | null {
  const aliases = HEADER_ALIASES[field];
  const normalizedHeaders = headers.map((h) => ({
    original: h,
    normalized: normalizeHeader(h),
  }));

  for (const alias of aliases) {
    const match = normalizedHeaders.find(
      (h) => h.normalized === alias || h.normalized.includes(alias)
    );
    if (match) return match.original;
  }

  return null;
}

export function buildColumnMap(headers: string[]): Partial<Record<HeaderField, string>> {
  const map: Partial<Record<HeaderField, string>> = {};
  for (const field of Object.keys(HEADER_ALIASES) as HeaderField[]) {
    const column = findColumn(headers, field);
    if (column) map[field] = column;
  }
  return map;
}

export function getCellValue(
  row: Record<string, unknown>,
  column: string | null | undefined
): string | null {
  if (!column) return null;
  const value = row[column];
  if (value === null || value === undefined || value === "") return null;
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  return String(value).trim();
}

export function parseExcelDate(value: string | null): string | null {
  if (!value) return null;

  // Excel serial number
  if (/^\d+(\.\d+)?$/.test(value)) {
    const serial = parseFloat(value);
    if (serial > 30000 && serial < 60000) {
      const epoch = new Date(Date.UTC(1899, 11, 30));
      epoch.setUTCDate(epoch.getUTCDate() + Math.floor(serial));
      return epoch.toISOString().slice(0, 10);
    }
  }

  // DD/MM/YYYY or DD-MM-YYYY
  const dmy = value.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
  if (dmy) {
    const day = dmy[1].padStart(2, "0");
    const month = dmy[2].padStart(2, "0");
    let year = dmy[3];
    if (year.length === 2) year = `20${year}`;
    return `${year}-${month}-${day}`;
  }

  // ISO or parseable
  const parsed = Date.parse(value);
  if (!Number.isNaN(parsed)) {
    return new Date(parsed).toISOString().slice(0, 10);
  }

  return value;
}

export function normalizeStatus(raw: string | null): string {
  if (!raw) return "Open";
  const s = raw.toLowerCase();
  if (s.includes("approv") && !s.includes("un")) return "Approved";
  if (s.includes("reject")) return "Rejected";
  if (s.includes("overdue") || s.includes("late")) return "Overdue";
  if (s.includes("review") || s.includes("pending")) return "Under Review";
  if (s.includes("close")) return "Closed";
  if (s.includes("draft")) return "Draft";
  if (s.includes("open") || s.includes("submitted")) return "Open";
  return raw;
}

export function normalizePriority(raw: string | null): string {
  if (!raw) return "Medium";
  const p = raw.toLowerCase();
  if (p.includes("crit")) return "Critical";
  if (p.includes("high")) return "High";
  if (p.includes("low")) return "Low";
  return "Medium";
}

export function isEmptyRow(row: Record<string, unknown>): boolean {
  return Object.values(row).every(
    (v) => v === null || v === undefined || String(v).trim() === ""
  );
}
