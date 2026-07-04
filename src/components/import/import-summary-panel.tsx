import type { ImportSummary } from "@/lib/import/types";

type ImportSummaryPanelProps = {
  summary: ImportSummary;
  fileName: string;
};

export function ImportSummaryPanel({ summary, fileName }: ImportSummaryPanelProps) {
  const metrics = [
    { label: "Total sheets", value: summary.totalSheets },
    { label: "Mapped sheets", value: summary.mappedSheets },
    { label: "Total records", value: summary.totalRecords },
    { label: "RFIs", value: summary.rfisCount },
    { label: "Drawings", value: summary.drawingsCount },
    { label: "Materials", value: summary.materialsCount },
    { label: "Overdue", value: summary.overdueCount, accent: "text-rose-400" },
    {
      label: "Pending approvals",
      value: summary.pendingApprovalsCount,
      accent: "text-amber-400",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-white/[0.025] p-4 ring-1 ring-white/[0.06] lg:p-5">
        <p className="text-[11px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
          Import complete
        </p>
        <p className="mt-1 text-sm font-semibold text-foreground">{fileName}</p>
      </div>

      <div className="overflow-hidden rounded-xl bg-white/[0.025] ring-1 ring-white/[0.06]">
        <div className="grid grid-cols-2 divide-x divide-y divide-white/[0.06] lg:grid-cols-4 lg:divide-y-0">
          {metrics.map((metric) => (
            <div key={metric.label} className="px-4 py-4 lg:px-5">
              <p className="text-[10px] font-medium tracking-[0.06em] text-muted-foreground uppercase">
                {metric.label}
              </p>
              <p
                className={`mt-1.5 text-xl font-semibold tabular-nums tracking-tight ${metric.accent ?? "text-foreground"}`}
              >
                {metric.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-white/[0.025] p-4 ring-1 ring-white/[0.06] lg:p-5">
        <p className="text-[11px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
          Also imported
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span>{summary.submittalsCount} submittals</span>
          <span>{summary.tasksCount} tasks</span>
          <span>{summary.lettersCount} letters</span>
        </div>
      </div>
    </div>
  );
}
