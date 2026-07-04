import type { ImportModuleLabel, ImportModuleTarget } from "@/lib/import/types";

export type SheetMappingRule = {
  patterns: string[];
  targetModule: ImportModuleTarget;
  moduleLabel: ImportModuleLabel;
};

/** Known JCDC Technical Deliverables Master Log sheets. */
export const SHEET_MAPPING_RULES: SheetMappingRule[] = [
  {
    patterns: ["summary"],
    targetModule: "summary",
    moduleLabel: "Summary",
  },
  {
    patterns: ["follow-up tracker", "follow up tracker", "followup tracker"],
    targetModule: "task",
    moduleLabel: "Tasks / Actions",
  },
  {
    patterns: ["mr&tbe", "mr tbe", "mr and tbe"],
    targetModule: "submittal",
    moduleLabel: "Submittals",
  },
  {
    patterns: ["ms log", "ms t&c log", "ms t c log", "method statement"],
    targetModule: "method_statement",
    moduleLabel: "Method Statements",
  },
  {
    patterns: ["itp log", "itp"],
    targetModule: "itp",
    moduleLabel: "ITPs",
  },
  {
    patterns: ["rfi log", "rfi"],
    targetModule: "rfi",
    moduleLabel: "RFIs",
  },
  {
    patterns: ["mir log", "mir"],
    targetModule: "material_inspection",
    moduleLabel: "Material Inspections",
  },
  {
    patterns: ["plans log", "plans"],
    targetModule: "plan",
    moduleLabel: "Plans",
  },
  {
    patterns: ["sd mat-mbl log", "sd mat mbl", "sd mat-mbl"],
    targetModule: "shop_drawing",
    moduleLabel: "Shop Drawings",
  },
  {
    patterns: ["sd log", "shop drawing"],
    targetModule: "shop_drawing",
    moduleLabel: "Shop Drawings",
  },
  {
    patterns: ["dc log", "design change"],
    targetModule: "design_change",
    moduleLabel: "Design Changes",
  },
  {
    patterns: ["letter log", "letters"],
    targetModule: "letter",
    moduleLabel: "Letters",
  },
  {
    patterns: ["material follow-up log", "material follow up"],
    targetModule: "material",
    moduleLabel: "Materials",
  },
  {
    patterns: ["material awaited-hq", "material awaited hq", "awaited-hq"],
    targetModule: "material",
    moduleLabel: "Materials",
  },
];

export function normalizeSheetName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

export function resolveSheetMapping(sheetName: string): SheetMappingRule {
  const normalized = normalizeSheetName(sheetName);

  for (const rule of SHEET_MAPPING_RULES) {
    if (
      rule.patterns.some(
        (pattern) =>
          normalized === pattern ||
          normalized.includes(pattern) ||
          pattern.includes(normalized)
      )
    ) {
      return rule;
    }
  }

  return {
    patterns: [],
    targetModule: "unmapped",
    moduleLabel: "Unmapped",
  };
}

export const EXPECTED_JCDC_SHEETS = [
  "Summary",
  "Follow-up Tracker",
  "MR&TBE",
  "MS LOG",
  "ITP LOG",
  "MS T&C Log",
  "RFI LOG",
  "MIR LOG",
  "PLANS LOG",
  "SD Log",
  "SD MAT-MBL Log",
  "DC LOG",
  "LETTER LOG",
  "Material Follow-up Log",
  "Material Awaited-HQ",
];
