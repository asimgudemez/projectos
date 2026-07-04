"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { FileSpreadsheet } from "lucide-react";

import {
  getImportedActionsStats,
  type ImportedActionView,
  type ImportedActionsStats,
} from "@/lib/insights/imported-actions";
import { onImportComplete } from "@/lib/import/import-events";
import {
  WorkspaceRow,
  WorkspaceSection,
} from "@/components/command-center/workspace-primitives";

function StatCard({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: number;
  tone?: "neutral" | "warning" | "critical" | "accent";
}) {
  const toneClass = {
    neutral: "text-foreground",
    warning: "text-amber-300",
    critical: "text-rose-300",
    accent: "text-violet-300",
  }[tone];

  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3">
      <p className="text-[11px] font-medium tracking-[0.06em] text-muted-foreground uppercase">
        {label}
      </p>
      <p className={`mt-1 text-2xl font-semibold tabular-nums ${toneClass}`}>
        {value}
      </p>
    </div>
  );
}

function actionIndicator(action: ImportedActionView) {
  if (action.isOverdue) return "critical" as const;
  if (action.isHighPriority) return "high" as const;
  if (action.isOpen) return "medium" as const;
  return "healthy" as const;
}

function formatDueDate(dueDate: string | null): string {
  if (!dueDate) return "No due date";
  try {
    return new Date(dueDate).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dueDate;
  }
}

export function ImportedActionsSection() {
  const [stats, setStats] = useState<ImportedActionsStats>(() =>
    getImportedActionsStats()
  );

  const refresh = useCallback(() => {
    setStats(getImportedActionsStats());
  }, []);

  useEffect(() => {
    return onImportComplete(() => {
      refresh();
    });
  }, [refresh]);

  const previewActions = stats.actions
    .filter((action) => action.isOpen)
    .slice(0, 6);

  return (
    <WorkspaceSection
      label="Imported Actions"
      hint={
        stats.latestFileName
          ? `From ${stats.latestFileName}`
          : "Upload Excel to populate"
      }
    >
      {stats.total === 0 ? (
        <div className="rounded-xl border border-dashed border-white/[0.1] bg-white/[0.02] px-6 py-8 text-center">
          <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-violet-500/10">
            <FileSpreadsheet className="size-5 text-violet-400" />
          </div>
          <p className="mt-3 text-sm font-medium text-foreground">
            No imported follow-up actions yet
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Import a Technical Deliverables workbook to surface Follow-up Tracker
            items here.
          </p>
          <Link
            href="/documents"
            className="mt-4 inline-flex text-xs font-medium text-violet-300 hover:text-violet-200"
          >
            Upload Excel workbook →
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total imported" value={stats.total} tone="accent" />
            <StatCard label="Open actions" value={stats.open} />
            <StatCard
              label="Overdue actions"
              value={stats.overdue}
              tone={stats.overdue > 0 ? "critical" : "neutral"}
            />
            <StatCard
              label="High priority"
              value={stats.highPriority}
              tone={stats.highPriority > 0 ? "warning" : "neutral"}
            />
          </div>

          {previewActions.length > 0 ? (
            <div className="rounded-xl ring-1 ring-white/[0.06]">
              <div className="border-b border-white/[0.06] px-4 py-3">
                <p className="text-sm font-medium text-foreground">
                  Open follow-up items
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  From Follow-up Tracker · {stats.open} open
                </p>
              </div>
              <div className="px-4">
                {previewActions.map((action) => (
                  <WorkspaceRow
                    key={action.id}
                    primary={`${action.reference} — ${action.title}`}
                    secondary={
                      action.responsibleParty
                        ? `${action.responsibleParty} · ${action.status}`
                        : action.status
                    }
                    meta={formatDueDate(action.dueDate)}
                    indicator={actionIndicator(action)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              All imported follow-up actions are closed or approved.
            </p>
          )}
        </div>
      )}
    </WorkspaceSection>
  );
}
