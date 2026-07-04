"use client";

import { useCallback, useEffect, useState } from "react";
import { FileText, Search } from "lucide-react";

import { getDocumentsLibrary } from "@/lib/documents/documents-data";
import { onImportComplete } from "@/lib/import/import-events";
import { loadImportBatches } from "@/lib/import/import-store";
import {
  executeExcelImport,
  getWorkbookStats,
  previewExcelImport,
} from "@/lib/import/import-service";
import type { ImportBatch, ParsedWorkbook } from "@/lib/import/types";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ImportRowPreview } from "@/components/import/import-row-preview";
import { ImportSheetPreview } from "@/components/import/import-sheet-preview";
import { ImportSuccessToast } from "@/components/import/import-success-toast";
import { ImportUploadTrigger, ImportUploadZone } from "@/components/import/import-upload-zone";

const DEFAULT_PROJECT_ID = "amaala";

function getLatestImportState(): { workbook: ParsedWorkbook | null; batch: ImportBatch | null } {
  if (typeof window === "undefined") {
    return { workbook: null, batch: null };
  }
  const latest = loadImportBatches(DEFAULT_PROJECT_ID)[0];
  return {
    workbook: latest?.workbook ?? null,
    batch: latest ?? null,
  };
}

export function DocumentsView() {
  const [documents, setDocuments] = useState(() => getDocumentsLibrary());
  const [search, setSearch] = useState("");
  const [workbook, setWorkbook] = useState<ParsedWorkbook | null>(
    () => getLatestImportState().workbook
  );
  const [lastBatch, setLastBatch] = useState<ImportBatch | null>(
    () => getLatestImportState().batch
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastDetail, setToastDetail] = useState("");

  const refreshDocuments = useCallback(() => {
    setDocuments(getDocumentsLibrary());
  }, []);

  useEffect(() => {
    return onImportComplete((detail) => {
      refreshDocuments();
      const latest = loadImportBatches(DEFAULT_PROJECT_ID)[0];
      if (latest?.workbook) {
        setWorkbook(latest.workbook);
        setLastBatch(latest);
      }
      setToastMessage("Import successful");
      setToastDetail(
        `${detail.totalRecords} records imported from ${detail.fileName}`
      );
      setToastVisible(true);
    });
  }, [refreshDocuments]);

  async function handleFileSelected(file: File) {
    setError(null);
    setIsProcessing(true);
    setWorkbook(null);
    setLastBatch(null);

    try {
      const parsed = await previewExcelImport(file);
      setWorkbook(parsed);

      const result = await executeExcelImport(file, DEFAULT_PROJECT_ID);
      setLastBatch(result.batch);
      refreshDocuments();

      setToastMessage("Import successful");
      setToastDetail(
        `${result.batch.summary.totalRecords} records saved · Documents updated`
      );
      setToastVisible(true);
    } catch (uploadError) {
      console.error(uploadError);
      setError(
        "Failed to import Excel file. Please use a valid .xlsx or .xls workbook."
      );
      setWorkbook(null);
    } finally {
      setIsProcessing(false);
    }
  }

  const filtered = documents.filter((doc) => {
    const q = search.toLowerCase();
    if (!q) return true;
    return (
      doc.name.toLowerCase().includes(q) ||
      doc.project.toLowerCase().includes(q) ||
      doc.type.toLowerCase().includes(q)
    );
  });

  const stats = workbook ? getWorkbookStats(workbook) : null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-[1.75rem] font-semibold tracking-tight text-foreground lg:text-[2rem]">
            Documents
          </h1>
          <p className="text-sm text-muted-foreground">
            Centralized document management with Excel import
          </p>
        </div>

        <ImportUploadTrigger
          onFileSelected={handleFileSelected}
          onInvalidFile={() =>
            setError("Please select a valid Excel file (.xlsx or .xls).")
          }
          isProcessing={isProcessing}
          buttonLabel="Upload"
        />
      </div>

      {error ? (
        <div className="rounded-lg bg-rose-500/[0.08] px-4 py-3 text-sm text-rose-300 ring-1 ring-rose-500/20">
          {error}
        </div>
      ) : null}

      {!workbook ? (
        <ImportUploadZone
          onFileSelected={handleFileSelected}
          onInvalidFile={() =>
            setError("Please select a valid Excel file (.xlsx or .xls).")
          }
          isProcessing={isProcessing}
          buttonLabel="Upload Excel"
        />
      ) : null}

      {workbook ? (
        <div className="space-y-6">
          <div className="rounded-xl bg-white/[0.025] p-4 ring-1 ring-white/[0.06] lg:p-5">
            <p className="text-[11px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
              Imported workbook
            </p>
            <p className="mt-1 text-lg font-semibold text-foreground">
              {workbook.fileName}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {workbook.sheetNames.length} sheets · {stats?.totalRows ?? 0} rows
              parsed
              {lastBatch
                ? ` · ${lastBatch.summary.totalRecords} records saved`
                : ""}
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
                    {sheet ? ` (${sheet.rowCount} rows)` : ""}
                  </span>
                );
              })}
            </div>
          </div>

          <ImportSheetPreview sheets={workbook.sheets} />
          <ImportRowPreview sheets={workbook.sheets} />
        </div>
      ) : null}

      <div className="relative max-w-xl">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search documents by name, project or type..."
          className="h-11 border-white/[0.06] bg-white/[0.02] pl-9"
        />
      </div>

      <Card className="border-white/[0.06] bg-white/[0.02]">
        <CardHeader>
          <CardTitle className="text-base">Document Library</CardTitle>
          <CardDescription>
            {filtered.length} documents
            {documents.some((d) => d.source === "import")
              ? " · includes imported Excel deliverables"
              : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No documents match your search.
            </p>
          ) : (
            filtered.map((doc) => (
              <div
                key={doc.id}
                className="flex flex-col gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 transition-colors hover:border-violet-500/20 hover:bg-white/[0.03] sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
                    <FileText className="size-4 text-violet-400" />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <p className="truncate text-sm font-medium">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.project}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  {doc.source === "import" ? (
                    <Badge className="bg-violet-500/15 text-violet-300">
                      Imported
                    </Badge>
                  ) : null}
                  <Badge variant="outline" className="border-white/[0.08]">
                    {doc.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {doc.updated} · {doc.size}
                  </span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <ImportSuccessToast
        visible={toastVisible}
        message={toastMessage}
        detail={toastDetail}
        onDismiss={() => setToastVisible(false)}
      />
    </div>
  );
}
