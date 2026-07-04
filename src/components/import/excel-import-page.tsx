"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import {
  executeExcelImport,
  EXPECTED_JCDC_SHEETS,
  getWorkbookStats,
  previewExcelImport,
  reprocessWorkbook,
} from "@/lib/import/import-service";
import type { ImportBatch, ImportStep, ParsedWorkbook } from "@/lib/import/types";
import { Button } from "@/components/ui/button";
import { ImportInsightsPanel } from "@/components/import/import-insights-panel";
import { ImportSheetPreview } from "@/components/import/import-sheet-preview";
import { ImportSummaryPanel } from "@/components/import/import-summary-panel";
import { ImportUploadZone } from "@/components/import/import-upload-zone";

type ExcelImportPageProps = {
  projectId: string;
  projectName: string;
};

export function ExcelImportPage({ projectId, projectName }: ExcelImportPageProps) {
  const [step, setStep] = useState<ImportStep>("upload");
  const [workbook, setWorkbook] = useState<ParsedWorkbook | null>(null);
  const [batch, setBatch] = useState<ImportBatch | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileSelected(file: File) {
    setError(null);
    setIsProcessing(true);
    setSelectedFile(file);

    try {
      const parsed = await previewExcelImport(file);
      setWorkbook(parsed);
      setStep("preview");
    } catch {
      setError("Failed to parse Excel file. Ensure it is a valid .xlsx workbook.");
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleImport() {
    if (!selectedFile) return;
    setError(null);
    setIsProcessing(true);

    try {
      const result = await executeExcelImport(selectedFile, projectId);
      setBatch(result.batch);
      setStep("complete");
    } catch {
      setError("Import failed. Please check the file format and try again.");
    } finally {
      setIsProcessing(false);
    }
  }

  function handleReset() {
    setStep("upload");
    setWorkbook(null);
    setBatch(null);
    setSelectedFile(null);
    setError(null);
  }

  const previewBatch =
    workbook && step === "preview"
      ? reprocessWorkbook(workbook, projectId)
      : null;

  const stats = workbook ? getWorkbookStats(workbook) : null;

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

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {(["upload", "preview", "complete"] as ImportStep[]).map((s, index) => (
          <div key={s} className="flex items-center gap-2">
            <span
              className={
                step === s
                  ? "font-medium text-violet-400"
                  : step === "complete" || (step === "preview" && s === "upload")
                    ? "text-emerald-400/80"
                    : ""
              }
            >
              {s === "upload" ? "1. Upload" : s === "preview" ? "2. Preview" : "3. Complete"}
            </span>
            {index < 2 ? <ArrowRight className="size-3 opacity-40" /> : null}
          </div>
        ))}
      </div>

      {error ? (
        <div className="rounded-lg bg-rose-500/[0.08] px-4 py-3 text-sm text-rose-300 ring-1 ring-rose-500/20">
          {error}
        </div>
      ) : null}

      {step === "upload" ? (
        <div className="space-y-6">
          <ImportUploadZone
            onFileSelected={handleFileSelected}
            isProcessing={isProcessing}
          />

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
      ) : null}

      {step === "preview" && workbook ? (
        <div className="space-y-6">
          <div className="flex flex-col gap-3 rounded-xl bg-white/[0.025] p-4 ring-1 ring-white/[0.06] sm:flex-row sm:items-center sm:justify-between lg:p-5">
            <div>
              <p className="text-sm font-semibold text-foreground">{workbook.fileName}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {stats?.totalSheets} sheets detected · {stats?.mappedSheets} mapped ·{" "}
                {stats?.totalRows} rows extracted
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={handleReset} disabled={isProcessing}>
                Cancel
              </Button>
              <Button
                className="bg-violet-600 text-white hover:bg-violet-500"
                onClick={handleImport}
                disabled={isProcessing}
              >
                {isProcessing ? "Importing..." : "Import into ProjectOS"}
              </Button>
            </div>
          </div>

          <ImportSheetPreview sheets={workbook.sheets} />

          {previewBatch ? (
            <div className="rounded-xl bg-white/[0.02] p-4 ring-1 ring-white/[0.06] lg:p-5">
              <p className="text-[11px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
                Preview summary
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {previewBatch.summary.totalRecords} records will be normalized —{" "}
                {previewBatch.summary.rfisCount} RFIs, {previewBatch.summary.drawingsCount}{" "}
                drawings, {previewBatch.summary.materialsCount} materials
              </p>
            </div>
          ) : null}
        </div>
      ) : null}

      {step === "complete" && batch ? (
        <div className="space-y-6">
          <div className="flex items-center gap-3 rounded-xl bg-emerald-500/[0.08] px-4 py-4 ring-1 ring-emerald-500/20">
            <CheckCircle2 className="size-5 shrink-0 text-emerald-400" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                Import successful — data stored in mock layer
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Supabase insert payloads prepared ({batch.records.length} records)
              </p>
            </div>
          </div>

          <ImportSummaryPanel summary={batch.summary} fileName={batch.fileName} />
          <ImportInsightsPanel insights={batch.insights} />

          <div className="flex gap-2">
            <Button
              className="bg-violet-600 text-white hover:bg-violet-500"
              onClick={handleReset}
            >
              Import another file
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
