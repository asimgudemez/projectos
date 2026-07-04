"use client";

import { useCallback, useState } from "react";
import { CheckCircle2 } from "lucide-react";

import {
  executeExcelImport,
  getWorkbookStats,
  previewExcelImport,
  reprocessWorkbook,
} from "@/lib/import/import-service";
import type { ImportBatch, ParsedWorkbook } from "@/lib/import/types";
import { Button } from "@/components/ui/button";
import { ImportInsightsPanel } from "@/components/import/import-insights-panel";
import { ImportRowPreview } from "@/components/import/import-row-preview";
import { ImportSheetPreview } from "@/components/import/import-sheet-preview";
import { ImportSuccessToast } from "@/components/import/import-success-toast";
import { ImportSummaryPanel } from "@/components/import/import-summary-panel";
import { ImportUploadZone } from "@/components/import/import-upload-zone";

type ExcelUploadFlowProps = {
  projectId: string;
  onImportComplete?: (batch: ImportBatch) => void;
  showUploadZone?: boolean;
  autoImport?: boolean;
};

export function ExcelUploadFlow({
  projectId,
  onImportComplete,
  showUploadZone = true,
  autoImport = false,
}: ExcelUploadFlowProps) {
  const [workbook, setWorkbook] = useState<ParsedWorkbook | null>(null);
  const [batch, setBatch] = useState<ImportBatch | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastDetail, setToastDetail] = useState("");

  const runImport = useCallback(
    async (file: File) => {
      setError(null);
      setIsProcessing(true);

      try {
        const result = await executeExcelImport(file, projectId);
        setBatch(result.batch);
        setToastMessage("Import successful");
        setToastDetail(
          `${result.batch.summary.totalRecords} records imported from ${result.batch.fileName}`
        );
        setToastVisible(true);
        onImportComplete?.(result.batch);
      } catch (importError) {
        console.error(importError);
        setError("Import failed. Please verify the Excel file format.");
      } finally {
        setIsProcessing(false);
      }
    },
    [projectId, onImportComplete]
  );

  async function handleFileSelected(file: File) {
    setError(null);
    setIsProcessing(true);
    setSelectedFile(file);
    setBatch(null);

    try {
      const parsed = await previewExcelImport(file);
      setWorkbook(parsed);

      if (autoImport) {
        await runImport(file);
      }
    } catch (parseError) {
      console.error(parseError);
      setError("Failed to parse Excel file. Ensure it is a valid .xlsx or .xls workbook.");
      setWorkbook(null);
      setSelectedFile(null);
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleConfirmImport() {
    if (!selectedFile) return;
    await runImport(selectedFile);
  }

  function handleReset() {
    setWorkbook(null);
    setBatch(null);
    setSelectedFile(null);
    setError(null);
  }

  const previewBatch = workbook ? reprocessWorkbook(workbook, projectId) : null;
  const stats = workbook ? getWorkbookStats(workbook) : null;
  const isComplete = batch !== null;
  const showPreview = workbook !== null && !isComplete;

  return (
    <>
      {showUploadZone && !workbook ? (
        <ImportUploadZone
          onFileSelected={handleFileSelected}
          onInvalidFile={() =>
            setError("Please select a valid Excel file (.xlsx or .xls).")
          }
          isProcessing={isProcessing}
          buttonLabel="Upload"
        />
      ) : null}

      {error ? (
        <div className="rounded-lg bg-rose-500/[0.08] px-4 py-3 text-sm text-rose-300 ring-1 ring-rose-500/20">
          {error}
        </div>
      ) : null}

      {showPreview ? (
        <div className="space-y-6">
          <div className="rounded-xl bg-white/[0.025] p-4 ring-1 ring-white/[0.06] lg:p-5">
            <p className="text-[11px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
              Workbook
            </p>
            <p className="mt-1 text-lg font-semibold text-foreground">
              {workbook.fileName}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {workbook.sheetNames.length} worksheets detected ·{" "}
              {stats?.totalRows ?? 0} total rows
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {workbook.sheetNames.map((name) => {
                const sheet = workbook.sheets.find((s) => s.sheetName === name);
                return (
                  <span
                    key={name}
                    className="rounded-full bg-white/[0.04] px-2.5 py-1 text-[11px] text-muted-foreground"
                  >
                    {name}
                    {sheet ? ` (${sheet.rowCount})` : ""}
                  </span>
                );
              })}
            </div>
          </div>

          {!autoImport ? (
            <div className="flex flex-wrap gap-2">
              <Button
                className="bg-violet-600 text-white hover:bg-violet-500"
                onClick={handleConfirmImport}
                disabled={isProcessing}
              >
                {isProcessing ? "Importing..." : "Save to ProjectOS"}
              </Button>
              <Button variant="ghost" onClick={handleReset} disabled={isProcessing}>
                Cancel
              </Button>
            </div>
          ) : null}

          <ImportSheetPreview sheets={workbook.sheets} />
          <ImportRowPreview sheets={workbook.sheets} />

          {previewBatch ? (
            <div className="rounded-xl bg-white/[0.02] p-4 ring-1 ring-white/[0.06] lg:p-5">
              <p className="text-[11px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
                Normalization preview
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {previewBatch.summary.totalRecords} records →{" "}
                {previewBatch.summary.rfisCount} RFIs,{" "}
                {previewBatch.summary.drawingsCount} drawings,{" "}
                {previewBatch.summary.materialsCount} materials
              </p>
            </div>
          ) : null}
        </div>
      ) : null}

      {isComplete && batch ? (
        <div className="space-y-6">
          <div className="flex items-center gap-3 rounded-xl bg-emerald-500/[0.08] px-4 py-4 ring-1 ring-emerald-500/20">
            <CheckCircle2 className="size-5 shrink-0 text-emerald-400" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                Data saved to ProjectOS
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {batch.summary.totalRecords} records · Documents library updated
              </p>
            </div>
          </div>

          <ImportSummaryPanel summary={batch.summary} fileName={batch.fileName} />
          <ImportInsightsPanel insights={batch.insights} />

          <Button
            variant="outline"
            className="border-white/[0.08]"
            onClick={handleReset}
          >
            Import another file
          </Button>
        </div>
      ) : null}

      <ImportSuccessToast
        visible={toastVisible}
        message={toastMessage}
        detail={toastDetail}
        onDismiss={() => setToastVisible(false)}
      />
    </>
  );
}

/** Handle file from external upload trigger (e.g. Documents page header). */
export function useExcelUploadHandler(projectId: string) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [workbook, setWorkbook] = useState<ParsedWorkbook | null>(null);
  const [batch, setBatch] = useState<ImportBatch | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastDetail, setToastDetail] = useState("");

  async function handleFile(file: File, onComplete?: (batch: ImportBatch) => void) {
    setError(null);
    setIsProcessing(true);

    try {
      const parsed = await previewExcelImport(file);
      setWorkbook(parsed);

      const result = await executeExcelImport(file, projectId);
      setBatch(result.batch);
      setToastMessage("Import successful");
      setToastDetail(
        `${result.batch.summary.totalRecords} records from ${result.batch.fileName}`
      );
      setToastVisible(true);
      onComplete?.(result.batch);
    } catch (uploadError) {
      console.error(uploadError);
      setError("Failed to import Excel file.");
    } finally {
      setIsProcessing(false);
    }
  }

  return {
    isProcessing,
    error,
    workbook,
    batch,
    toastVisible,
    toastMessage,
    toastDetail,
    dismissToast: () => setToastVisible(false),
    handleFile,
    reset: () => {
      setWorkbook(null);
      setBatch(null);
      setError(null);
    },
  };
}
