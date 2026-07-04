"use client";

import { useCallback, useRef, useState } from "react";
import { FileSpreadsheet, Upload } from "lucide-react";

import { cn } from "@/lib/utils";

type ImportUploadZoneProps = {
  onFileSelected: (file: File) => void;
  isProcessing?: boolean;
  acceptedHint?: string;
};

export function ImportUploadZone({
  onFileSelected,
  isProcessing = false,
  acceptedHint = "JCDC - Technical Deliverables - Master Log (.xlsx)",
}: ImportUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file) return;
      if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) return;
      onFileSelected(file);
    },
    [onFileSelected]
  );

  return (
    <div
      className={cn(
        "rounded-xl border border-dashed px-6 py-12 text-center transition-colors",
        isDragging
          ? "border-violet-500/50 bg-violet-500/[0.06]"
          : "border-white/[0.12] bg-white/[0.02] hover:border-white/[0.18] hover:bg-white/[0.03]"
      )}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        handleFile(event.dataTransfer.files[0]);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        className="hidden"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />

      <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-violet-500/15">
        <FileSpreadsheet className="size-6 text-violet-400" />
      </div>

      <h3 className="mt-4 text-base font-semibold text-foreground">
        Upload Technical Deliverables Log
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Drop your Excel workbook or click to browse
      </p>
      <p className="mt-1 text-xs text-muted-foreground/70">{acceptedHint}</p>

      <button
        type="button"
        disabled={isProcessing}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "mt-6 inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white",
          "transition-colors hover:bg-violet-500 disabled:opacity-50"
        )}
      >
        <Upload className="size-4" />
        {isProcessing ? "Processing..." : "Select Excel file"}
      </button>
    </div>
  );
}
