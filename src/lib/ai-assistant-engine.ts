import type { AiGeneratedResponse, AiDataReference } from "@/lib/ai-assistant-types";
import {
  getAiPortfolioContext,
  getAiProjectContext,
  type AiPortfolioContext,
  type AiProjectContext,
} from "@/lib/ai-assistant-data";
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

function buildDefaultResponse(ctx: AiProjectContext, query: string): AiGeneratedResponse {
  const references = [
    ref("Project", ctx.project.id, ctx.project.name, `${ctx.project.progress}% complete`),
    ref("Alert", "summary", "Open RFIs", String(ctx.engineering.kpis.openRfis)),
    ref("Alert", "summary2", "Critical Issues", String(ctx.engineering.kpis.criticalIssues)),
  ];

  return {
    content: `I analysed **${ctx.project.name}** project data for: "${query}"\n\n**Current status**\n• Progress: ${ctx.project.progress}% · Health: ${ctx.project.healthScore}%\n• Open RFIs: ${ctx.engineering.kpis.openRfis} · Pending drawings: ${ctx.engineering.kpis.pendingDrawings}\n• Critical alerts: ${ctx.workspace.criticalAlerts.length}\n\n**Top priorities today**\n${ctx.workspace.todaysPriorities.slice(0, 3).map((p) => `• ${p.title}`).join("\n")}\n\nTry a specific prompt like "Show overdue submittals" or "Generate today's executive report" for detailed analysis with data references.`,
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

  return {
    content: `**Portfolio analysis** — ${ctx.projects.length} active projects\n\n${ctx.morningBrief}\n\n**Attention queue**\n${ctx.attentionQueue.map((item) => `• **${item.title}** (${item.project}) — ${item.reason}`).join("\n")}\n\nFor project-specific analysis, open a project workspace or ask about a specific project.\n\nYour query: "${query}"`,
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
    };
  }

  return getAiPortfolioContext();
}
