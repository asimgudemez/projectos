#!/usr/bin/env node
/**
 * Full ProjectOS regression suite.
 * Run: npm run regression
 */

import { execSync, spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import XLSX from "xlsx";

const root = process.cwd();
const failures = [];
let passed = 0;
const pendingChecks = [];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function read(path) {
  return readFileSync(join(root, path), "utf8");
}

function mustExist(path) {
  assert(existsSync(join(root, path)), `Missing file: ${path}`);
}

function mustContain(path, ...needles) {
  const content = read(path);
  for (const needle of needles) {
    assert(content.includes(needle), `${path} must contain "${needle}"`);
  }
}

function check(name, fn) {
  pendingChecks.push(
    Promise.resolve()
      .then(() => fn())
      .then(() => {
        passed += 1;
        console.log(`  ✓ ${name}`);
      })
      .catch((error) => {
        const message = error instanceof Error ? error.message : String(error);
        failures.push({ name, message });
        console.error(`  ✗ ${name}: ${message}`);
      })
  );
}

function section(title) {
  console.log(`\n${title}`);
}

function normalizeSheetName(name) {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

function resolveSheetMapping(sheetName) {
  const rules = [
    { patterns: ["follow-up tracker", "follow up tracker"], targetModule: "task" },
    { patterns: ["rfi log", "rfi"], targetModule: "rfi" },
    { patterns: ["sd log", "shop drawing"], targetModule: "shop_drawing" },
    { patterns: ["mr&tbe"], targetModule: "submittal" },
  ];
  const normalized = normalizeSheetName(sheetName);
  for (const rule of rules) {
    if (rule.patterns.some((p) => normalized.includes(p))) return rule.targetModule;
  }
  return "unmapped";
}

async function waitForServer(url, attempts = 40) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const response = await fetch(url);
      if (response.ok || response.status === 307 || response.status === 308) {
        return true;
      }
    } catch {
      // retry
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  return false;
}

function runStaticChecks() {
  section("Global");
  check("Home redirects to Command Center", () => {
    mustContain("src/app/page.tsx", 'redirect("/command-center")');
  });
  check("Main navigation routes exist", () => {
    mustContain(
      "src/lib/navigation.ts",
      "/command-center",
      "/projects",
      "/documents",
      "/ai"
    );
  });

  section("Command Center");
  check("Command Center files", () => {
    [
      "src/app/(app)/command-center/page.tsx",
      "src/lib/command-center-data.ts",
      "src/lib/insights/imported-actions.ts",
      "src/components/command-center/imported-actions-section.tsx",
      "src/components/command-center/workspace-header.tsx",
      "src/components/command-center/decisions-today.tsx",
      "src/components/command-center/operations-grid.tsx",
      "src/components/command-center/schedule-today.tsx",
      "src/components/command-center/command-input.tsx",
    ].forEach(mustExist);
  });
  check("Command Center page composition", () => {
    mustContain(
      "src/app/(app)/command-center/page.tsx",
      "ImportedActionsSection",
      "WorkspaceHeader",
      "MorningBrief",
      "AttentionQueue",
      "DecisionsToday",
      "ProjectStatusStrip",
      "OperationsGrid",
      "ScheduleToday",
      "CommandInput"
    );
  });
  check("Imported Actions integration", () => {
    mustContain(
      "src/components/command-center/imported-actions-section.tsx",
      "getImportedActionsStats",
      "onImportComplete",
      "Imported Actions",
      "/documents"
    );
    mustContain(
      "src/lib/insights/imported-actions.ts",
      "getImportedFollowUpActions",
      "getImportedActionsStats",
      "loadImportBatches"
    );
  });

  section("Projects");
  check("Projects files", () => {
    [
      "src/app/(app)/projects/page.tsx",
      "src/components/projects/projects-view.tsx",
      "src/components/projects/project-card.tsx",
      "src/components/projects/project-filters.tsx",
      "src/lib/projects-data.ts",
    ].forEach(mustExist);
  });
  check("Projects list wiring", () => {
    mustContain(
      "src/components/projects/projects-view.tsx",
      "ProjectsView",
      "ProjectKpis",
      "ProjectFilters",
      "ProjectCard",
      "applyProjectFilters"
    );
    mustContain("src/lib/projects-data.ts", "export const projects", "getProjectById");
  });
  check("Known project IDs", () => {
    const data = read("src/lib/projects-data.ts");
    for (const id of ["amaala", "neom-oxagon", "riyadh-metro-l3", "qiddiya"]) {
      assert(data.includes(id), `projects-data must include project ${id}`);
    }
  });

  section("Workspace");
  check("Workspace files", () => {
    [
      "src/app/(app)/projects/[projectId]/layout.tsx",
      "src/app/(app)/projects/[projectId]/[[...section]]/page.tsx",
      "src/lib/project-workspace-data.ts",
      "src/components/project-workspace/project-workspace-shell.tsx",
      "src/components/project-workspace/overview-page.tsx",
      "src/components/engineering/engineering-page.tsx",
    ].forEach(mustExist);
  });
  check("Workspace section routing", () => {
    mustContain(
      "src/app/(app)/projects/[projectId]/[[...section]]/page.tsx",
      "OverviewPage",
      "EngineeringPage",
      "AiAssistantPage",
      "ExcelImportPage",
      "ModulePlaceholder",
      'sectionId === "import"'
    );
  });
  check("Workspace navigation items", () => {
    mustContain(
      "src/lib/project-workspace-data.ts",
      "workspaceNavItems",
      "overview",
      "engineering",
      "ai-assistant",
      "import",
      "documents"
    );
    mustContain(
      "src/components/project-workspace/project-workspace-shell.tsx",
      "ProjectWorkspaceShell",
      "workspaceNavItems"
    );
  });

  section("Documents & Upload");
  check("Documents page files", () => {
    [
      "src/app/(app)/documents/page.tsx",
      "src/components/documents/documents-view.tsx",
      "src/components/import/import-upload-zone.tsx",
      "src/lib/documents/documents-data.ts",
      "src/lib/import/excel-parser.ts",
      "src/lib/import/import-service.ts",
      "src/lib/import/import-store.ts",
      "src/lib/import/import-events.ts",
    ].forEach(mustExist);
  });
  check("Documents upload workflow", () => {
    mustContain(
      "src/components/documents/documents-view.tsx",
      "ImportUploadTrigger",
      "ImportUploadZone",
      "previewExcelImport",
      "executeExcelImport",
      "ImportRowPreview",
      "ImportSheetPreview",
      "ImportSuccessToast",
      "Document Library",
      "onImportComplete",
      "loadImportBatches"
    );
    mustContain(
      "src/components/import/import-upload-zone.tsx",
      'type="file"',
      "EXCEL_ACCEPT",
      "htmlFor",
      "ImportUploadZone",
      "ImportUploadTrigger"
    );
  });
  check("Excel import pipeline exports", () => {
    mustContain(
      "src/lib/import/import-service.ts",
      "previewExcelImport",
      "executeExcelImport"
    );
    mustContain(
      "src/lib/import/import-store.ts",
      "loadImportBatches",
      "dispatchImportComplete",
      "follow-up-tracker"
    );
    mustContain(
      "src/components/import/excel-upload-flow.tsx",
      "ExcelUploadFlow",
      "ImportUploadZone",
      "executeExcelImport"
    );
    mustContain(
      "src/components/import/excel-import-page.tsx",
      "ExcelImportPage",
      "ExcelUploadFlow"
    );
  });
  check("SheetJS parser smoke test", () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([
      ["Ref", "Status", "Title"],
      ["RFI-001", "Open", "Test"],
    ]);
    XLSX.utils.book_append_sheet(wb, ws, "RFI LOG");
    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    assert(buffer.length > 0, "Failed to generate test workbook");
    const parsed = XLSX.read(buffer, { type: "buffer" });
    assert(parsed.SheetNames.includes("RFI LOG"), "Sheet names must be detected");
  });
  check("Sheet mapping for Follow-up Tracker", () => {
    assert(resolveSheetMapping("Follow-up Tracker") === "task");
    assert(resolveSheetMapping("RFI LOG") === "rfi");
    assert(resolveSheetMapping("SD Log") === "shop_drawing");
  });

  section("AI Assistant");
  check("AI Assistant files", () => {
    [
      "src/app/(app)/ai/page.tsx",
      "src/components/ai-assistant/ai-assistant-workspace.tsx",
      "src/components/ai-assistant/ai-assistant-page.tsx",
      "src/components/ai-assistant/ai-portfolio-assistant-page.tsx",
      "src/lib/ai-assistant-engine.ts",
      "src/lib/ai-assistant-data.ts",
      "src/lib/ai-assistant-storage.ts",
    ].forEach(mustExist);
  });
  check("AI Assistant wiring", () => {
    mustContain(
      "src/components/ai-assistant/ai-assistant-workspace.tsx",
      "generateAiResponse",
      "getProjectContextOrFallback",
      "assistantPromptSuggestions"
    );
    mustContain(
      "src/lib/ai-assistant-data.ts",
      "getAiProjectContext",
      "getAiPortfolioContext",
      "getImportedActionsStats",
      "Which actions are overdue?",
      "Summarize the imported follow-up tracker"
    );
    mustContain(
      "src/lib/ai-assistant-engine.ts",
      "generateAiResponse",
      "buildOverdueActionsResponse",
      "buildFollowUpSummaryResponse",
      "buildTopRisksResponse",
      "buildResponsiblePartiesResponse"
    );
    mustContain("src/app/(app)/ai/page.tsx", "AiPortfolioAssistantPage");
  });
}

async function checkHttpRoutes() {
  section("HTTP route smoke tests");

  const server = spawn("npm", ["run", "start"], {
    cwd: root,
    stdio: "ignore",
    env: { ...process.env, PORT: "3099" },
  });

  const base = "http://127.0.0.1:3099";
  const routes = [
    { path: "/command-center", label: "Command Center" },
    { path: "/projects", label: "Projects" },
    { path: "/projects/amaala", label: "Workspace overview" },
    { path: "/projects/amaala/engineering", label: "Workspace engineering" },
    { path: "/projects/amaala/ai-assistant", label: "Workspace AI Assistant" },
    { path: "/projects/amaala/import", label: "Workspace import" },
    { path: "/documents", label: "Documents" },
    { path: "/ai", label: "AI Assistant" },
  ];

  try {
    const ready = await waitForServer(`${base}/command-center`);
    assert(ready, "Production server failed to start on port 3099");

    for (const route of routes) {
      check(route.label, async () => {
        const response = await fetch(`${base}${route.path}`);
        assert(response.status === 200, `${route.path} returned ${response.status}`);
        const html = await response.text();
        assert(html.includes("<!DOCTYPE html"), `${route.path} must return HTML`);
      });
    }

    check("Invalid project returns 404", async () => {
      const response = await fetch(`${base}/projects/nonexistent-project-xyz`);
      assert(response.status === 404, "Expected 404 for invalid project");
    });

    await Promise.all(pendingChecks.splice(0, pendingChecks.length));
  } finally {
    server.kill("SIGTERM");
  }
}

async function main() {
  const skipBuild = process.argv.includes("--skip-build");
  const skipHttp = process.argv.includes("--skip-http");

  console.log("ProjectOS full regression\n");

  runStaticChecks();
  await Promise.all(pendingChecks.splice(0, pendingChecks.length));

  if (!skipBuild) {
    section("Production build");
    check("npm run build", () => {
      execSync("npm run build", { cwd: root, stdio: "pipe" });
    });
    check("npm run lint", () => {
      execSync("npm run lint", { cwd: root, stdio: "pipe" });
    });
    await Promise.all(pendingChecks.splice(0, pendingChecks.length));
  }

  if (!skipHttp && !skipBuild) {
    await checkHttpRoutes();
  }

  console.log("\n--- Summary ---");
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failures.length}`);

  if (failures.length > 0) {
    console.error("\nFailures:");
    for (const failure of failures) {
      console.error(`  • ${failure.name}: ${failure.message}`);
    }
    process.exit(1);
  }

  console.log("\n✓ Full regression passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
