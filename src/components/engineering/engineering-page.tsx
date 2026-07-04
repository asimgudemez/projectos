"use client";

import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";

import {
  drawingCategories,
  engineeringSections,
  getEngineeringData,
  rfiFilters,
  type DrawingType,
  type EngineeringSectionId,
  type RfiStatus,
} from "@/lib/engineering-data";
import { cn } from "@/lib/utils";
import { EngineeringAiBar } from "@/components/engineering/engineering-ai-bar";
import { EngineeringKpisBar } from "@/components/engineering/engineering-kpis";
import { EngineeringTable } from "@/components/engineering/engineering-table";

type EngineeringPageProps = {
  projectId: string;
};

const sectionMeta: Record<
  EngineeringSectionId,
  { title: string; hint: string; referenceLabel?: string }
> = {
  drawings: {
    title: "Drawings",
    hint: "IFC · Shop · Red Mark · As Built · Revision History",
    referenceLabel: "Drawing No.",
  },
  rfi: {
    title: "RFI Management",
    hint: "Requests for information and consultant responses",
    referenceLabel: "RFI No.",
  },
  "technical-queries": {
    title: "Technical Queries",
    hint: "Design and specification clarifications",
    referenceLabel: "TQ No.",
  },
  "material-submittals": {
    title: "Material Submittals",
    hint: "Product data and technical submittals",
    referenceLabel: "Submittal No.",
  },
  "method-statements": {
    title: "Method Statements",
    hint: "Installation and execution methods",
    referenceLabel: "MS No.",
  },
  itp: {
    title: "Inspection & Test Plans",
    hint: "Quality hold points and inspection sequences",
    referenceLabel: "ITP No.",
  },
  "material-approval": {
    title: "Material Approval Status",
    hint: "Approved materials register",
    referenceLabel: "MAR No.",
  },
  "design-changes": {
    title: "Design Change Register",
    hint: "Variations and design modifications",
    referenceLabel: "DCR No.",
  },
  "interface-issues": {
    title: "Interface Issues",
    hint: "Multi-discipline coordination conflicts",
    referenceLabel: "Issue No.",
  },
  dashboard: {
    title: "Engineering Dashboard",
    hint: "Weekly operating picture · AI generated",
  },
};

function FilterPills<T extends string>({
  items,
  active,
  onChange,
}: {
  items: { id: T; label: string }[];
  active: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          className={cn(
            "rounded-md px-2.5 py-1 text-xs transition-colors",
            active === item.id
              ? "bg-white/[0.08] font-medium text-foreground"
              : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export function EngineeringPage({ projectId }: EngineeringPageProps) {
  const data = getEngineeringData(projectId);
  const [section, setSection] = useState<EngineeringSectionId>("drawings");
  const [drawingFilter, setDrawingFilter] = useState<DrawingType>("ifc");
  const [rfiFilter, setRfiFilter] = useState<RfiStatus | "all">("all");

  const meta = sectionMeta[section];

  const filteredDrawings = useMemo(
    () => data.drawings.filter((d) => d.drawingType === drawingFilter),
    [data.drawings, drawingFilter]
  );

  const filteredRfis = useMemo(
    () =>
      rfiFilter === "all"
        ? data.rfis
        : data.rfis.filter((r) => r.rfiStatus === rfiFilter),
    [data.rfis, rfiFilter]
  );

  return (
    <div className="mx-auto w-full max-w-none space-y-6 lg:space-y-8">
      <div className="space-y-1">
        <p className="text-[11px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
          Module
        </p>
        <h1 className="text-[1.75rem] font-semibold tracking-tight text-foreground lg:text-[2rem]">
          Engineering
        </h1>
        <p className="text-sm text-muted-foreground">
          Technical documents, approvals, and coordination
        </p>
      </div>

      <EngineeringKpisBar kpis={data.kpis} />
      <EngineeringAiBar />

      <div className="overflow-x-auto pb-1">
        <nav className="flex min-w-max gap-1 rounded-xl bg-white/[0.02] p-1 ring-1 ring-white/[0.06]">
          {engineeringSections.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSection(item.id)}
              className={cn(
                "shrink-0 rounded-lg px-3 py-2 text-xs transition-colors lg:px-4 lg:text-sm",
                section === item.id
                  ? "bg-white/[0.08] font-medium text-foreground"
                  : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {section === "dashboard" ? (
        <EngineeringDashboardContent projectId={projectId} />
      ) : (
        <div className="rounded-xl bg-white/[0.025] ring-1 ring-white/[0.06]">
          <div className="border-b border-white/[0.06] px-4 py-4 lg:px-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  {meta.title}
                </h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {meta.hint}
                </p>
              </div>

              {section === "drawings" ? (
                <FilterPills
                  items={drawingCategories}
                  active={drawingFilter}
                  onChange={setDrawingFilter}
                />
              ) : null}

              {section === "rfi" ? (
                <FilterPills
                  items={rfiFilters}
                  active={rfiFilter}
                  onChange={setRfiFilter}
                />
              ) : null}
            </div>
          </div>

          <div className="px-4 py-4 lg:px-6 lg:py-5">
            {section === "drawings" ? (
              <EngineeringTable
                records={filteredDrawings}
                referenceLabel={meta.referenceLabel}
                emptyMessage={`No ${drawingCategories.find((c) => c.id === drawingFilter)?.label ?? "drawing"} records.`}
              />
            ) : null}

            {section === "rfi" ? (
              <EngineeringTable
                records={filteredRfis}
                referenceLabel={meta.referenceLabel}
                emptyMessage="No RFIs match this filter."
              />
            ) : null}

            {section === "technical-queries" ? (
              <EngineeringTable
                records={data.technicalQueries}
                referenceLabel={meta.referenceLabel}
              />
            ) : null}

            {section === "material-submittals" ? (
              <EngineeringTable
                records={data.materialSubmittals}
                referenceLabel={meta.referenceLabel}
              />
            ) : null}

            {section === "method-statements" ? (
              <EngineeringTable
                records={data.methodStatements}
                referenceLabel={meta.referenceLabel}
              />
            ) : null}

            {section === "itp" ? (
              <EngineeringTable
                records={data.itps}
                referenceLabel={meta.referenceLabel}
              />
            ) : null}

            {section === "material-approval" ? (
              <EngineeringTable
                records={data.materialApprovals}
                referenceLabel={meta.referenceLabel}
              />
            ) : null}

            {section === "design-changes" ? (
              <EngineeringTable
                records={data.designChanges}
                referenceLabel={meta.referenceLabel}
              />
            ) : null}

            {section === "interface-issues" ? (
              <EngineeringTable
                records={data.interfaceIssues}
                referenceLabel={meta.referenceLabel}
              />
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

function EngineeringDashboardContent({ projectId }: { projectId: string }) {
  const data = getEngineeringData(projectId);
  const { kpis, dashboardHighlights } = data;

  const weeklyBrief =
    projectId === "amaala"
      ? [
          "Engineering throughput remains stable with 87 RFIs approved to date. Four critical interface issues require resolution before Level 2 ceiling close-out.",
          "Chilled water pump shop drawing (MEP-SD-PUMP-042) is 11 days overdue — AI predicts approval by 14 Jul if resubmitted today. This item blocks Level 3 rough-in sequencing.",
          "Interface workshop for INT-008 is scheduled 07 Jul. Three BIM clash points between MEP and façade brackets must be closed before red mark submission.",
        ]
      : [
          "Engineering register is active with ongoing consultant reviews across MEP and structural disciplines.",
          "Two submittals are blocking procurement — resubmission timelines should be confirmed with suppliers this week.",
          "AI recommends prioritising overdue RFIs tied to current construction zones.",
        ];

  const statusRows = [
    { label: "Open RFIs", value: kpis.openRfis, tone: "text-amber-400" },
    { label: "Approved RFIs", value: kpis.approvedRfis, tone: "text-emerald-400" },
    { label: "Pending Drawings", value: kpis.pendingDrawings, tone: "text-muted-foreground" },
    { label: "Pending Submittals", value: kpis.pendingSubmittals, tone: "text-muted-foreground" },
    { label: "Critical Issues", value: kpis.criticalIssues, tone: "text-rose-400" },
    { label: "Avg Approval (days)", value: kpis.avgApprovalDays, tone: "text-muted-foreground" },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white/[0.025] p-5 ring-1 ring-white/[0.06] lg:p-6">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-violet-400/80" />
          <p className="text-[11px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
            Weekly Engineering Brief
          </p>
          <span className="text-[11px] text-muted-foreground/60">
            · Updated 07:04
          </span>
        </div>
        <div className="mt-4 space-y-4">
          {weeklyBrief.map((paragraph) => (
            <p
              key={paragraph.slice(0, 40)}
              className="text-[15px] leading-[1.75] text-foreground/90"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white/[0.025] ring-1 ring-white/[0.06]">
          <div className="border-b border-white/[0.06] px-5 py-4 lg:px-6">
            <h2 className="text-sm font-semibold text-foreground">
              Priority Highlights
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              AI-identified items requiring attention this week
            </p>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {dashboardHighlights.map((item) => (
              <div key={item.label} className="px-5 py-4 lg:px-6">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-sm text-foreground">{item.label}</p>
                  <span className="shrink-0 text-lg font-semibold tabular-nums text-foreground">
                    {item.value}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-white/[0.025] ring-1 ring-white/[0.06]">
          <div className="border-b border-white/[0.06] px-5 py-4 lg:px-6">
            <h2 className="text-sm font-semibold text-foreground">
              Register Summary
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Current engineering register status
            </p>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {statusRows.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between px-5 py-3.5 lg:px-6"
              >
                <span className="text-sm text-muted-foreground">{row.label}</span>
                <span
                  className={cn(
                    "text-sm font-semibold tabular-nums",
                    row.tone
                  )}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white/[0.025] ring-1 ring-white/[0.06]">
        <div className="border-b border-white/[0.06] px-5 py-4 lg:px-6">
          <h2 className="text-sm font-semibold text-foreground">
            Overdue & Critical Register
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Combined view of items past due or marked critical
          </p>
        </div>
        <div className="px-4 py-4 lg:px-6 lg:py-5">
          <EngineeringTable
            records={[
              ...data.drawings.filter(
                (d) => d.status === "Overdue" || d.priority === "Critical"
              ),
              ...data.rfis.filter(
                (r) => r.rfiStatus === "Overdue" || r.priority === "Critical"
              ),
              ...data.interfaceIssues.filter((i) => i.priority === "Critical"),
            ]}
            emptyMessage="No overdue or critical items."
          />
        </div>
      </div>
    </div>
  );
}
