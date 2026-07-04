import type { EngineeringRecord } from "@/lib/engineering-data";
import { priorityStyle, statusStyle } from "@/lib/engineering-data";
import { cn } from "@/lib/utils";

type EngineeringTableProps = {
  records: EngineeringRecord[];
  referenceLabel?: string;
  emptyMessage?: string;
};

export function EngineeringTable({
  records,
  referenceLabel = "Reference",
  emptyMessage = "No records found.",
}: EngineeringTableProps) {
  if (records.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[960px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/[0.06] text-[10px] font-medium tracking-[0.06em] text-muted-foreground uppercase">
            <th className="pb-3 pr-4 font-medium">{referenceLabel}</th>
            <th className="pb-3 pr-4 font-medium">Title</th>
            <th className="pb-3 pr-4 font-medium">Status</th>
            <th className="pb-3 pr-4 font-medium">Responsible Engineer</th>
            <th className="pb-3 pr-4 font-medium">Consultant</th>
            <th className="pb-3 pr-4 font-medium">Submitted</th>
            <th className="pb-3 pr-4 font-medium">Due</th>
            <th className="pb-3 pr-4 font-medium">Priority</th>
            <th className="pb-3 pr-4 font-medium">Rev</th>
            <th className="pb-3 font-medium">AI Summary</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr
              key={record.id}
              className="border-b border-white/[0.04] transition-colors last:border-0 hover:bg-white/[0.02]"
            >
              <td className="py-3.5 pr-4 font-mono text-xs text-foreground">
                {record.reference}
              </td>
              <td className="max-w-[180px] py-3.5 pr-4 text-foreground">
                {record.title}
              </td>
              <td
                className={cn(
                  "py-3.5 pr-4 text-xs font-medium",
                  statusStyle[record.status] ?? "text-muted-foreground"
                )}
              >
                {record.status}
              </td>
              <td className="py-3.5 pr-4 text-muted-foreground">
                {record.responsibleEngineer}
              </td>
              <td className="py-3.5 pr-4 text-muted-foreground">
                {record.consultant}
              </td>
              <td className="py-3.5 pr-4 text-xs tabular-nums text-muted-foreground">
                {record.submissionDate}
              </td>
              <td className="py-3.5 pr-4 text-xs tabular-nums text-muted-foreground">
                {record.dueDate}
              </td>
              <td
                className={cn(
                  "py-3.5 pr-4 text-xs font-medium",
                  priorityStyle[record.priority]
                )}
              >
                {record.priority}
              </td>
              <td className="py-3.5 pr-4 font-mono text-xs text-muted-foreground">
                {record.revision}
              </td>
              <td className="max-w-[220px] py-3.5 text-xs leading-relaxed text-muted-foreground">
                {record.aiSummary}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
