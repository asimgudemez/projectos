"use client";

import { useId } from "react";
import { FileSpreadsheet, Upload } from "lucide-react";

import { EXCEL_ACCEPT, isExcelFile } from "@/lib/import/file-utils";
import { cn } from "@/lib/utils";

type ImportUploadZoneProps = {
  onFileSelected: (file: File) => void;
  onInvalidFile?: () => void;
  isProcessing?: boolean;
  acceptedHint?: string;
  buttonLabel?: string;
};

function useFileInputHandlers(
  onFileSelected: (file: File) => void,
  onInvalidFile?: () => void
) {
  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!isExcelFile(file)) {
      onInvalidFile?.();
      return;
    }
    onFileSelected(file);
  }

  return { handleInputChange };
}

export function ImportUploadZone({
  onFileSelected,
  onInvalidFile,
  isProcessing = false,
  acceptedHint = "JCDC - Technical Deliverables - Master Log (.xlsx, .xls)",
  buttonLabel = "Upload",
}: ImportUploadZoneProps) {
  const inputId = useId();
  const { handleInputChange } = useFileInputHandlers(onFileSelected, onInvalidFile);

  return (
    <div
      className={cn(
        "rounded-xl border border-dashed px-6 py-12 text-center transition-colors",
        "border-white/[0.12] bg-white/[0.02] hover:border-white/[0.18] hover:bg-white/[0.03]"
      )}
      onDragOver={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
      onDrop={(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (isProcessing) return;
        const file = event.dataTransfer.files?.[0];
        if (!file) return;
        if (!isExcelFile(file)) {
          onInvalidFile?.();
          return;
        }
        onFileSelected(file);
      }}
    >
      <input
        id={inputId}
        type="file"
        accept={EXCEL_ACCEPT}
        className="sr-only"
        onChange={handleInputChange}
      />

      <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-violet-500/15">
        <FileSpreadsheet className="size-6 text-violet-400" />
      </div>

      <h3 className="mt-4 text-base font-semibold text-foreground">
        Upload Technical Deliverables Log
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Drop your Excel workbook or use the upload button
      </p>
      <p className="mt-1 text-xs text-muted-foreground/70">{acceptedHint}</p>

      <label
        htmlFor={inputId}
        className={cn(
          "mt-6 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white",
          "transition-colors hover:bg-violet-500",
          isProcessing && "pointer-events-none opacity-50"
        )}
      >
        <Upload className="size-4" />
        {isProcessing ? "Processing..." : buttonLabel}
      </label>
    </div>
  );
}

/** Compact upload trigger for page headers — opens native file picker. */
export function ImportUploadTrigger({
  onFileSelected,
  onInvalidFile,
  isProcessing = false,
  buttonLabel = "Upload",
  className,
}: ImportUploadZoneProps & { className?: string }) {
  const inputId = useId();
  const { handleInputChange } = useFileInputHandlers(onFileSelected, onInvalidFile);

  return (
    <div className={cn("relative inline-flex", className)}>
      <input
        id={inputId}
        type="file"
        accept={EXCEL_ACCEPT}
        className="sr-only"
        onChange={handleInputChange}
      />
      <label
        htmlFor={inputId}
        className={cn(
          "inline-flex cursor-pointer items-center gap-2 rounded-md bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-2 text-sm font-medium text-white",
          "hover:from-violet-500 hover:to-indigo-500",
          isProcessing && "pointer-events-none opacity-50"
        )}
      >
        <Upload className="size-4" />
        {isProcessing ? "Importing..." : buttonLabel}
      </label>
    </div>
  );
}
