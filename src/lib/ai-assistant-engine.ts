import type { AiGeneratedResponse, AiDataReference } from "@/lib/ai-assistant-types";
import {
  getAiPortfolioContext,
  getAiProjectContext,
  type AiPortfolioContext,
  type AiProjectContext,
} from "@/lib/ai-assistant-data";
import { resolveProjectId } from "@/lib/data/adapters/mock/fixtures/ids";
import {
  getImportedActionsStats,
  getTopImportedRisks,
  groupPendingByOwner,
  type ImportedActionView,
} from "@/lib/insights/imported-actions";
import { getProjectById } from "@/lib/projects-data";
import { getProjectWorkspace } from "@/lib/project-workspace-data";
import { getEngineeringData } from "@/lib/engineering-data";

function matches(query: string, keywords: string[]): boolean {
  const normalized = query.toLowerCase();
  return keywords.some((keyword) => normalized.includes(keyword));
}

function ref(
  type: string,
  reference: string,
  label: string,
  detail: string
): AiDataReference {
  return { type, reference, label, detail };
}

function buildRfiDelayResponse(ctx: AiProjectContext): AiGeneratedResponse {
  const delaying = ctx.engineering.rfis.filter(
    (r) =>
      r.rfiStatus === "Overdue" ||
      r.rfiStatus === "Open" ||
      r.priority === "Critical"
  );

  const references = delaying.map((r) =>
    ref("RFI", r.reference, r.title, `${r.rfiStatus} · ${r.daysOpen} days open · Due ${r.dueDate}`)
  );

  const lines = delaying.length
    ? delaying.map(
        (r) =>
          `• **${r.reference}** — ${r.title}. Status: ${r.rfiStatus}, open ${r.daysOpen} days. ${r.aiSummary}`
      )
    : ["No RFIs currently flagged as construction delays."];

  return {
    content: `Based on ${ctx.project.name} engineering register, ${delaying.length} RFI(s) are impacting construction:\n\n${lines.join("\n\n")}\n\n**Recommendation:** Prioritise ${delaying[0]?.reference ?? "open RFIs"} — consultant escalation may recover 3–5 days on the critical path.`,
    references,
  };
}

function buildOverdueSubmittalsResponse(ctx: AiProjectContext): AiGeneratedResponse {
  const overdue = ctx.engineering.materialSubmittals.filter(
    (s) => s.status === "Overdue" || s.status === "Rejected" || s.status === "Under Review"
  );
  const workspaceOverdue = ctx.workspace.submittals.filter(
    (s) =>
      s.status.toLowerCase().includes("review") ||
      s.status.toLowerCase().includes("revise")
  );

  const references = [
    ...overdue.map((s) =>
      ref("Submittal", s.reference, s.title, `${s.status} · Due ${s.dueDate}`)
    ),
    ...workspaceOverdue.map((s) =>
      ref("Submittal", s.number, s.title, `${s.status} · ${s.reviewer}`)
    ),
  ];

  const lines = [
    ...overdue.map(
      (s) =>
        `• **${s.reference}** — ${s.title}. ${s.status}, due ${s.dueDate}. ${s.aiSummary}`
    ),
    ...workspaceOverdue.map(
      (s) =>
        `• **${s.number}** — ${s.title}. ${s.status} (${s.reviewer}).`
    ),
  ];

  return {
    content: `Overdue and pending submittals on ${ctx.project.name}:\n\n${lines.length ? lines.join("\n\n") : "No overdue submittals found."}\n\n**Procurement impact:** ${ctx.workspace.materials.filter((m) => m.status !== "on-track").length} material line(s) linked to pending approvals.`,
    references,
  };
}

function buildCriticalActivitiesResponse(ctx: AiProjectContext): AiGeneratedResponse {
  const priorities = ctx.workspace.todaysPriorities;
  const atRiskMilestones = ctx.workspace.milestones.filter(
    (m) => m.status === "at-risk"
  );

  const references = [
    ...priorities.map((p) =>
      ref("Priority", p.id, p.title, `${p.due} · ${p.owner}`)
    ),
    ...atRiskMilestones.map((m) =>
      ref("Milestone", m.id, m.name, `${m.date} · ${m.status}`)
    ),
  ];

  return {
    content: `Critical activities for ${ctx.project.name} this week:\n\n**Today's priorities**\n${priorities.map((p) => `• **${p.title}** — ${p.due} (${p.owner})`).join("\n")}\n\n**At-risk milestones**\n${atRiskMilestones.length ? atRiskMilestones.map((m) => `• **${m.name}** — ${m.date}`).join("\n") : "• No milestones currently at risk."}\n\n**Engineering focus:** ${ctx.engineering.dashboardHighlights[0]?.detail ?? "Review engineering register for open items."}`,
    references,
  };
}

function buildSupplierDelayResponse(ctx: AiProjectContext): AiGeneratedResponse {
  const delayedMaterials = ctx.workspace.materials.filter(
    (m) => m.status === "critical" || m.status === "delayed"
  );

  const references = delayedMaterials.map((m) =>
    ref("Material", m.id, m.name, m.detail)
  );

  const primary = delayedMaterials[0];

  return {
    content: `Supplier delays affecting ${ctx.project.name}:\n\n${delayedMaterials.map((m) => `• **${m.name}** — ${m.detail}`).join("\n\n")}\n\n**Primary delay:** ${primary?.name ?? "None identified"}. ${primary?.detail ?? ""}\n\nThis supplier slippage is linked to milestone **${ctx.workspace.milestones.find((m) => m.status === "at-risk")?.name ?? "Chilled Water Plant Energized"}** on the critical path.`,
    references,
  };
}

function buildCompletionPredictionResponse(ctx: AiProjectContext): AiGeneratedResponse {
  const { project, workspace } = ctx;
  const atRiskCount = workspace.milestones.filter((m) => m.status === "at-risk").length;
  const delayDays = project.isDelayed ? 5 : atRiskCount > 0 ? 3 : 0;
  const predictedFinish = project.isDelayed
    ? "07 Feb 2027 (+5 days from baseline)"
    : atRiskCount > 0
      ? "02 Feb 2027 (+3 days risk exposure)"
      : project.finishDate;

  const references = [
    ref("Project", project.id, project.name, `${project.progress}% complete · Finish ${project.finishDate}`),
    ...workspace.criticalRisks.slice(0, 2).map((r) =>
      ref("Risk", r.id, r.title, r.impact)
    ),
  ];

  return {
    content: `**Project completion prediction — ${project.name}**\n\n• **Baseline finish:** ${project.finishDate}\n• **Current progress:** ${project.progress}%\n• **Health score:** ${project.healthScore}% (${project.health})\n• **AI predicted finish:** ${predictedFinish}\n\n**Drivers:** ${delayDays > 0 ? `${delayDays}-day slippage driven by pump delivery and open interface issues.` : "Schedule tracking to baseline with no major drift detected."}\n\n**Confidence:** ${delayDays > 0 ? "Medium — supplier recovery timeline uncertain" : "High — no critical path exposure beyond managed risks"}.`,
    references,
  };
}

function buildExecutiveReportResponse(ctx: AiProjectContext): AiGeneratedResponse {
  const { project, workspace } = ctx;
  const references = [
    ref("Project", project.id, project.name, `${project.client} · ${project.contractValueLabel}`),
    ...workspace.criticalAlerts.map((alert, i) =>
      ref("Alert", `alert-${i}`, "Critical Alert", alert)
    ),
  ];

  return {
    content: `**Executive Report — ${project.name}**\n**Date:** Saturday, 4 July 2026\n\n${workspace.executiveBrief.join("\n\n")}\n\n**Critical alerts**\n${workspace.criticalAlerts.map((a) => `• ${a}`).join("\n")}\n\n**Decisions required today**\n${workspace.todaysPriorities.slice(0, 3).map((p) => `• ${p.title} (${p.owner})`).join("\n")}`,
    references,
  };
}

function buildWeeklyClientReportResponse(ctx: AiProjectContext): AiGeneratedResponse {
  const { project, workspace, engineering } = ctx;

  const references = [
    ref("Project", project.id, project.name, `Progress ${project.progress}%`),
    ref("KPI", "rfi", "Open RFIs", String(engineering.kpis.openRfis)),
    ref("KPI", "drawings", "Pending Drawings", String(engineering.kpis.pendingDrawings)),
    ref("Milestone", workspace.milestones[0]?.id ?? "m1", workspace.milestones[0]?.name ?? "Next milestone", workspace.milestones[0]?.date ?? ""),
  ];

  return {
    content: `**Weekly Client Report — ${project.name}**\n**Period:** 28 Jun – 4 Jul 2026\n\n**Progress summary**\nOverall progress is **${project.progress}%** with health at **${project.healthScore}%**. ${project.nextMilestone} remains on track for ${project.nextMilestoneDate}.\n\n**Engineering throughput**\n• Open RFIs: ${engineering.kpis.openRfis}\n• Approved RFIs (cumulative): ${engineering.kpis.approvedRfis}\n• Pending drawings: ${engineering.kpis.pendingDrawings}\n• Pending submittals: ${engineering.kpis.pendingSubmittals}\n\n**Key risks**\n${workspace.criticalRisks.map((r) => `• ${r.title} — ${r.impact}`).join("\n")}\n\n**Lookahead (7 days)**\n${workspace.todaysPriorities.map((p) => `• ${p.title}`).join("\n")}`,
    references,
  };
}

function buildManpowerResponse(ctx: AiProjectContext): AiGeneratedResponse {
  const belowTarget = ctx.workspace.manpower.filter((m) => m.actual < m.planned);
  const references = belowTarget.map((m) =>
    ref(
      "Manpower",
      m.id,
      m.trade,
      `${m.actual}/${m.planned} ${m.unit} (${Math.round((m.actual / m.planned) * 100)}%)`
    )
  );

  return {
    content: `Manpower below target on ${ctx.project.name}:\n\n${belowTarget.map((m) => {
      const pct = Math.round((m.actual / m.planned) * 100);
      return `• **${m.trade}** — ${m.actual}/${m.planned} ${m.unit} (${pct}% of plan)`;
    }).join("\n")}\n\n**Schedule impact:** Ductwork crew shortfall (${belowTarget[0]?.trade ?? "MEP"}) may affect Week 29 milestone if not closed by Friday.`,
    references,
  };
}

function buildProcurementRisksResponse(ctx: AiProjectContext): AiGeneratedResponse {
  const { workspace, engineering } = ctx;
  const atRiskMaterials = workspace.materials.filter((m) => m.status !== "on-track");
  const blockingSubmittals = engineering.materialSubmittals.filter(
    (s) => s.status !== "Approved"
  );

  const references = [
    ...atRiskMaterials.map((m) => ref("Material", m.id, m.name, m.detail)),
    ...blockingSubmittals.map((s) =>
      ref("Submittal", s.reference, s.title, s.status)
    ),
  ];

  return {
    content: `Procurement risks on ${ctx.project.name}:\n\n**Materials at risk**\n${atRiskMaterials.map((m) => `• **${m.name}** — ${m.detail}`).join("\n")}\n\n**Submittals blocking procurement**\n${blockingSubmittals.map((s) => `• **${s.reference}** — ${s.title} (${s.status})`).join("\n")}\n\n**AI assessment:** Pump delivery remains the highest procurement risk with 11-day slippage. Alternate supplier activation recommended.`,
    references,
  };
}

function buildAreaDrawingsResponse(ctx: AiProjectContext): AiGeneratedResponse {
  const areaDrawings = ctx.engineering.drawings.filter(
    (d) =>
      d.title.toLowerCase().includes("level 2") ||
      d.title.toLowerCase().includes("level 3") ||
      d.reference.includes("L2") ||
      d.reference.includes("L3") ||
      d.priority === "Critical"
  );

  const references = areaDrawings.map((d) =>
    ref("Drawing", d.reference, d.title, `${d.status} · ${d.drawingType} · ${d.discipline}`)
  );

  return {
    content: `Drawings affecting **Area A** (Level 2–3 zone) on ${ctx.project.name}:\n\n${areaDrawings.map((d) => `• **${d.reference}** — ${d.title}. ${d.status}, ${d.revision}. ${d.aiSummary}`).join("\n\n")}\n\n**Construction hold points:** ${areaDrawings.filter((d) => d.status !== "Approved").length} drawing(s) not yet approved — ceiling close-out at Area A may be blocked until red mark and shop drawing approvals close.`,
    references,
  };
}

function actionRef(action: ImportedActionView): AiDataReference {
  const owner = action.responsibleParty ?? "Unassigned";
  const due = action.dueDate ? `Due ${action.dueDate}` : "No due date";
  return ref(
    "Action",
    action.reference,
    action.title,
    `${action.status} · ${action.priority} · ${owner} · ${due}`
  );
}

function formatActionLine(action: ImportedActionView): string {
  const owner = action.responsibleParty ?? "Unassigned";
  const due = action.dueDate ? `due ${action.dueDate}` : "no due date";
  const flags = [
    action.isOverdue ? "OVERDUE" : null,
    action.isHighPriority ? `${action.priority} priority` : null,
  ]
    .filter(Boolean)
    .join(", ");

  return `• **${action.reference}** — ${action.title}. ${action.status}, ${due}, owner: ${owner}${flags ? ` (${flags})` : ""}${action.remarks ? `. ${action.remarks}` : ""}`;
}

function buildOverdueActionsResponse(ctx: AiProjectContext): AiGeneratedResponse {
  const overdue = ctx.importedActions.actions.filter((action) => action.isOverdue);
  const references = overdue.map(actionRef);

  if (overdue.length === 0) {
    return {
      content: `No overdue actions found in the imported Follow-up Tracker for **${ctx.project.name}**.\n\nImport an Excel workbook via Documents or the project Import page to load follow-up items.`,
      references: [],
    };
  }

  return {
    content: `**Overdue actions** from imported Follow-up Tracker on ${ctx.project.name} (${ctx.importedActions.latestFileName ?? "imported workbook"}):\n\n${overdue.map(formatActionLine).join("\n\n")}\n\n**Summary:** ${overdue.length} overdue of ${ctx.importedActions.total} imported actions.`,
    references,
  };
}

function buildImmediateFollowUpResponse(ctx: AiProjectContext): AiGeneratedResponse {
  const urgent = ctx.importedActions.actions.filter(
    (action) =>
      action.isOpen &&
      (action.isOverdue || action.isHighPriority || action.status === "Overdue")
  );
  const references = urgent.map(actionRef);

  if (urgent.length === 0) {
    return {
      content: `No items flagged for immediate follow-up in the imported Follow-up Tracker on **${ctx.project.name}**.\n\n${ctx.importedActions.total > 0 ? `All ${ctx.importedActions.total} imported actions appear closed or on track.` : "Upload a Technical Deliverables workbook to populate follow-up data."}`,
      references: [],
    };
  }

  return {
    content: `**Immediate follow-up required** on ${ctx.project.name}:\n\n${urgent.map(formatActionLine).join("\n\n")}\n\n**Recommendation:** Escalate ${urgent[0]?.reference ?? "top overdue items"} with assigned owners today.`,
    references,
  };
}

function buildResponsiblePartiesResponse(ctx: AiProjectContext): AiGeneratedResponse {
  const grouped = groupPendingByOwner(resolveProjectId(ctx.project.id));
  const entries = [...grouped.entries()].sort((a, b) => b[1].length - a[1].length);

  if (entries.length === 0) {
    return {
      content: `No pending actions with assigned owners in the imported Follow-up Tracker for **${ctx.project.name}**.\n\n${ctx.importedActions.total === 0 ? "Import an Excel workbook to load action ownership data." : "All imported actions are approved or closed."}`,
      references: [],
    };
  }

  const references = entries.flatMap(([, actions]) => actions.slice(0, 2).map(actionRef));

  const lines = entries.map(
    ([owner, actions]) =>
      `• **${owner}** — ${actions.length} pending action(s): ${actions
        .slice(0, 3)
        .map((a) => a.reference)
        .join(", ")}${actions.length > 3 ? "…" : ""}`
  );

  return {
    content: `**Responsible parties for pending actions** on ${ctx.project.name}:\n\n${lines.join("\n")}\n\n**Total pending:** ${ctx.importedActions.open} open actions across ${entries.length} owner(s).`,
    references,
  };
}

function buildFollowUpSummaryResponse(ctx: AiProjectContext): AiGeneratedResponse {
  const { importedActions: stats } = ctx;

  if (stats.total === 0) {
    return {
      content: `No imported Follow-up Tracker data available for **${ctx.project.name}** yet.\n\nUpload a JCDC Technical Deliverables Master Log (.xlsx) from the Documents page to import follow-up actions.`,
      references: [],
    };
  }

  const byStatus = stats.actions.reduce<Record<string, number>>((acc, action) => {
    acc[action.status] = (acc[action.status] ?? 0) + 1;
    return acc;
  }, {});

  const byPriority = stats.actions.reduce<Record<string, number>>((acc, action) => {
    acc[action.priority] = (acc[action.priority] ?? 0) + 1;
    return acc;
  }, {});

  const references = stats.actions.slice(0, 5).map(actionRef);

  return {
    content: `**Follow-up Tracker summary — ${ctx.project.name}**\n\n**Source:** ${stats.latestFileName ?? "Imported workbook"} (${stats.latestImportedAt ? new Date(stats.latestImportedAt).toLocaleDateString("en-GB") : "recent import"})\n\n**Counts**\n• Total actions: ${stats.total}\n• Open: ${stats.open}\n• Overdue: ${stats.overdue}\n• High/Critical priority: ${stats.highPriority}\n\n**By status**\n${Object.entries(byStatus).map(([status, count]) => `• ${status}: ${count}`).join("\n")}\n\n**By priority**\n${Object.entries(byPriority).map(([priority, count]) => `• ${priority}: ${count}`).join("\n")}\n\n**Sample open items**\n${stats.actions.filter((a) => a.isOpen).slice(0, 5).map(formatActionLine).join("\n") || "• No open items"}`,
    references,
  };
}

function buildTopRisksResponse(ctx: AiProjectContext): AiGeneratedResponse {
  const risks = getTopImportedRisks(resolveProjectId(ctx.project.id), 5);

  if (risks.length === 0) {
    return {
      content: `No risk-ranked items from imported data on **${ctx.project.name}**.\n\nImport a Technical Deliverables workbook to analyse risks from the Follow-up Tracker.`,
      references: [],
    };
  }

  const references = risks.map(actionRef);

  return {
    content: `**Top 5 risks from imported Follow-up Tracker** (${ctx.importedActions.latestFileName ?? "workbook"}):\n\n${risks.map((action, index) => `${index + 1}. ${formatActionLine(action)}`).join("\n\n")}\n\n**Risk scoring** considers overdue status, priority, open state, and remarks keywords.`,
    references,
  };
}

function buildDefaultResponse(ctx: AiProjectContext, query: string): AiGeneratedResponse {
  const references = [
    ref("Project", ctx.project.id, ctx.project.name, `${ctx.project.progress}% complete`),
    ref("Alert", "summary", "Open RFIs", String(ctx.engineering.kpis.openRfis)),
    ref("Alert", "summary2", "Critical Issues", String(ctx.engineering.kpis.criticalIssues)),
  ];

  if (ctx.importedActions.total > 0) {
    references.push(
      ref(
        "Import",
        "follow-up",
        "Imported actions",
        `${ctx.importedActions.open} open · ${ctx.importedActions.overdue} overdue`
      )
    );
  }

  const importSummary =
    ctx.importedActions.total > 0
      ? `\n\n**Imported Follow-up Tracker**\n• ${ctx.importedActions.total} actions · ${ctx.importedActions.open} open · ${ctx.importedActions.overdue} overdue\n• Source: ${ctx.importedActions.latestFileName ?? "Excel import"}`
      : "";

  return {
    content: `I analysed **${ctx.project.name}** project data for: "${query}"\n\n**Current status**\n• Progress: ${ctx.project.progress}% · Health: ${ctx.project.healthScore}%\n• Open RFIs: ${ctx.engineering.kpis.openRfis} · Pending drawings: ${ctx.engineering.kpis.pendingDrawings}\n• Critical alerts: ${ctx.workspace.criticalAlerts.length}${importSummary}\n\n**Top priorities today**\n${ctx.workspace.todaysPriorities.slice(0, 3).map((p) => `• ${p.title}`).join("\n")}\n\nTry a specific prompt like "Which actions are overdue?" or "Summarize the imported follow-up tracker" for imported Excel data.`,
    references,
  };
}

function buildPortfolioResponse(
  ctx: AiPortfolioContext,
  query: string
): AiGeneratedResponse {
  const references = ctx.attentionQueue.slice(0, 4).map((item) =>
    ref("Attention", item.id, item.title, `${item.project} · ${item.reason}`)
  );

  if (ctx.importedActions.total > 0) {
    references.push(
      ref(
        "Import",
        "portfolio-actions",
        "Imported actions",
        `${ctx.importedActions.total} total · ${ctx.importedActions.overdue} overdue`
      )
    );
  }

  const importBlock =
    ctx.importedActions.total > 0
      ? `\n\n**Imported Follow-up Tracker (portfolio)**\n• ${ctx.importedActions.total} actions · ${ctx.importedActions.open} open · ${ctx.importedActions.overdue} overdue\n• Latest import: ${ctx.importedActions.latestFileName ?? "Excel workbook"}`
      : "";

  return {
    content: `**Portfolio analysis** — ${ctx.projects.length} active projects\n\n${ctx.morningBrief}\n\n**Attention queue**\n${ctx.attentionQueue.map((item) => `• **${item.title}** (${item.project}) — ${item.reason}`).join("\n")}${importBlock}\n\nFor project-specific analysis, open a project workspace or ask about a specific project.\n\nYour query: "${query}"`,
    references,
  };
}

export function generateProjectResponse(
  query: string,
  ctx: AiProjectContext
): AiGeneratedResponse {
  const q = query.toLowerCase();

  if (matches(q, ["rfi", "delay", "delaying construction"])) {
    return buildRfiDelayResponse(ctx);
  }
  if (matches(q, ["overdue submittal", "overdue submittals", "submittal"])) {
    return buildOverdueSubmittalsResponse(ctx);
  }
  if (matches(q, ["critical this week", "critical activities", "activities critical"])) {
    return buildCriticalActivitiesResponse(ctx);
  }
  if (matches(q, ["supplier", "delaying the project", "who is delaying"])) {
    return buildSupplierDelayResponse(ctx);
  }
  if (matches(q, ["predict", "completion", "finish date", "finish"])) {
    return buildCompletionPredictionResponse(ctx);
  }
  if (matches(q, ["executive report", "today's executive", "todays executive"])) {
    return buildExecutiveReportResponse(ctx);
  }
  if (matches(q, ["weekly client", "client report", "weekly report"])) {
    return buildWeeklyClientReportResponse(ctx);
  }
  if (matches(q, ["manpower", "below target", "headcount", "crew"])) {
    return buildManpowerResponse(ctx);
  }
  if (matches(q, ["procurement risk", "procurement risks", "procurement"])) {
    return buildProcurementRisksResponse(ctx);
  }
  if (matches(q, ["drawing", "area a", "area"])) {
    return buildAreaDrawingsResponse(ctx);
  }
  if (
    matches(q, [
      "overdue action",
      "overdue actions",
      "actions overdue",
      "which actions are overdue",
    ])
  ) {
    return buildOverdueActionsResponse(ctx);
  }
  if (
    matches(q, [
      "immediate follow-up",
      "immediate follow up",
      "require follow-up",
      "require follow up",
      "follow-up",
      "follow up",
    ]) &&
    !matches(q, ["summarize", "summary"])
  ) {
    return buildImmediateFollowUpResponse(ctx);
  }
  if (
    matches(q, [
      "responsible",
      "pending action",
      "pending actions",
      "who is responsible",
      "action owner",
    ])
  ) {
    return buildResponsiblePartiesResponse(ctx);
  }
  if (
    matches(q, [
      "summarize the imported",
      "summarize imported",
      "follow-up tracker",
      "follow up tracker",
      "imported follow-up",
      "imported follow up",
    ])
  ) {
    return buildFollowUpSummaryResponse(ctx);
  }
  if (
    matches(q, [
      "top 5 risk",
      "top five risk",
      "top risks",
      "risks from this file",
      "risks from the file",
      "risks from import",
    ])
  ) {
    return buildTopRisksResponse(ctx);
  }

  return buildDefaultResponse(ctx, query);
}

export function generateAiResponse(
  query: string,
  context: AiProjectContext | AiPortfolioContext
): AiGeneratedResponse {
  if ("workspace" in context) {
    return generateProjectResponse(query, context);
  }
  return buildPortfolioResponse(context, query);
}

export function getProjectContextOrFallback(
  projectId: string | null
): AiProjectContext | AiPortfolioContext {
  if (projectId) {
    const ctx = getAiProjectContext(projectId);
    if (ctx) return ctx;
  }

  const fallback = getProjectById("amaala");
  const workspace = getProjectWorkspace("amaala");
  if (fallback && workspace) {
    return {
      project: fallback,
      workspace,
      engineering: getEngineeringData("amaala"),
      importedActions: getImportedActionsStats(resolveProjectId("amaala")),
    };
  }

  return getAiPortfolioContext();
}
