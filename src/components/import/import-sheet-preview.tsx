import type { ParsedSheet } from "@/lib/import/types";
import { cn } from "@/lib/utils";

type ImportSheetPreviewProps = {
  sheets: ParsedSheet[];
};

const moduleColors: Record<string, string> = {
  RFIs: "text-sky-400 bg-sky-500/10",
  "Shop Drawings": "text-violet-400 bg-violet-500/10",
  "Method Statements": "text-emerald-400 bg-emerald-500/10",
  ITPs: "text-teal-400 bg-teal-500/10",
  "Material Inspections": "text-amber-400 bg-amber-500/10",
  Letters: "text-indigo-400 bg-indigo-500/10",
  Materials: "text-orange-400 bg-orange-500/10",
  "Tasks / Actions": "text-rose-400 bg-rose-500/10",
  Submittals: "text-cyan-400 bg-cyan-500/10",
  Plans: "text-blue-400 bg-blue-500/10",
  "Design Changes": "text-pink-400 bg-pink-500/10",
  Summary: "text-muted-foreground bg-white/[0.04]",
  Unmapped: "text-muted-foreground bg-white/[0.04]",
};

export function ImportSheetPreview({ sheets }: ImportSheetPreviewProps) {
  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-white/[0.06]">
      <div className="border-b border-white/[0.06] px-4 py-3 lg:px-5">
        <h3 className="text-sm font-semibold text-foreground">Detected sheets</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Automatic mapping to ProjectOS modules
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] text-[10px] font-medium tracking-[0.06em] text-muted-foreground uppercase">
              <th className="px-4 py-3 font-medium lg:px-5">Sheet</th>
              <th className="px-4 py-3 font-medium lg:px-5">Maps to</th>
              <th className="px-4 py-3 font-medium lg:px-5">Headers</th>
              <th className="px-4 py-3 font-medium lg:px-5">Records</th>
              <th className="px-4 py-3 font-medium lg:px-5">Skipped</th>
            </tr>
          </thead>
          <tbody>
            {sheets.map((sheet) => (
              <tr
                key={sheet.sheetName}
                className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02]"
              >
                <td className="px-4 py-3.5 font-medium text-foreground lg:px-5">
                  {sheet.sheetName}
                </td>
                <td className="px-4 py-3.5 lg:px-5">
                  <span
                    className={cn(
                      "inline-flex rounded-md px-2 py-0.5 text-xs font-medium",
                      moduleColors[sheet.moduleLabel] ?? moduleColors.Unmapped
                    )}
                  >
                    {sheet.moduleLabel}
                  </span>
                </td>
                <td className="max-w-[200px] px-4 py-3.5 text-xs text-muted-foreground lg:px-5">
                  {sheet.headers.length > 0
                    ? sheet.headers.slice(0, 4).join(", ") +
                      (sheet.headers.length > 4 ? "…" : "")
                    : "—"}
                </td>
                <td className="px-4 py-3.5 tabular-nums text-foreground lg:px-5">
                  {sheet.rowCount}
                </td>
                <td className="px-4 py-3.5 tabular-nums text-muted-foreground lg:px-5">
                  {sheet.skippedRows}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
