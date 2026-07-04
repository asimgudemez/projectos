"use client";

import { useState } from "react";

import type { ParsedSheet } from "@/lib/import/types";
import { cn } from "@/lib/utils";

type ImportRowPreviewProps = {
  sheets: ParsedSheet[];
};

export function ImportRowPreview({ sheets }: ImportRowPreviewProps) {
  const [activeSheet, setActiveSheet] = useState(sheets[0]?.sheetName ?? "");

  const current = sheets.find((sheet) => sheet.sheetName === activeSheet);

  if (sheets.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-white/[0.06]">
      <div className="border-b border-white/[0.06] px-4 py-3 lg:px-5">
        <h3 className="text-sm font-semibold text-foreground">Row preview</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          First 10 rows per worksheet
        </p>
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-white/[0.06] px-2 py-2">
        {sheets.map((sheet) => (
          <button
            key={sheet.sheetName}
            type="button"
            onClick={() => setActiveSheet(sheet.sheetName)}
            className={cn(
              "shrink-0 rounded-md px-3 py-1.5 text-xs transition-colors",
              activeSheet === sheet.sheetName
                ? "bg-white/[0.08] font-medium text-foreground"
                : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
            )}
          >
            {sheet.sheetName}
            <span className="ml-1.5 tabular-nums text-muted-foreground">
              ({sheet.rowCount})
            </span>
          </button>
        ))}
      </div>

      {current ? (
        <div className="overflow-x-auto">
          {current.previewRows.length > 0 ? (
            <table className="w-full min-w-[640px] text-left text-xs">
              <tbody>
                {current.previewRows.map((row, rowIndex) => (
                  <tr
                    key={`${current.sheetName}-${rowIndex}`}
                    className={cn(
                      "border-b border-white/[0.04] last:border-0",
                      rowIndex === 0 && "bg-white/[0.03] font-medium text-foreground"
                    )}
                  >
                    {row.map((cell, cellIndex) => (
                      <td
                        key={`${rowIndex}-${cellIndex}`}
                        className="max-w-[200px] truncate px-3 py-2 text-muted-foreground first:pl-4 last:pr-4 lg:first:pl-5 lg:last:pr-5"
                      >
                        {cell || "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground lg:px-5">
              No preview rows available for this sheet.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
