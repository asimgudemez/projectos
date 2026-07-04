"use client";

import { ExcelUploadFlow } from "@/components/import/excel-upload-flow";
import { EXPECTED_JCDC_SHEETS } from "@/lib/import/import-service";

type ExcelImportPageProps = {
  projectId: string;
  projectName: string;
};

export function ExcelImportPage({ projectId, projectName }: ExcelImportPageProps) {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <div className="space-y-1">
        <p className="text-[11px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
          Data Import
        </p>
        <h1 className="text-[1.75rem] font-semibold tracking-tight text-foreground lg:text-[2rem]">
          Excel Import Engine
        </h1>
        <p className="text-sm text-muted-foreground">
          Import technical deliverables for {projectName} — JCDC Master Log format
        </p>
      </div>

      <ExcelUploadFlow projectId={projectId} showUploadZone />

      <div className="rounded-xl bg-white/[0.02] p-4 ring-1 ring-white/[0.06] lg:p-5">
        <p className="text-[11px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
          Supported workbook sheets
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {EXPECTED_JCDC_SHEETS.map((sheet) => (
            <span
              key={sheet}
              className="rounded-full bg-white/[0.04] px-2.5 py-1 text-[11px] text-muted-foreground"
            >
              {sheet}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
