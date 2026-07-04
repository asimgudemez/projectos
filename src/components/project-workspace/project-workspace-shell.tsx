"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import {
  workspaceNavItems,
  type ProjectWorkspaceData,
  type WorkspaceNavId,
} from "@/lib/project-workspace-data";
import { healthLabels, healthStyles } from "@/lib/projects-data";
import { cn } from "@/lib/utils";

type ProjectWorkspaceShellProps = {
  workspace: ProjectWorkspaceData;
  children: React.ReactNode;
};

function resolveActiveNav(pathname: string, projectId: string): WorkspaceNavId {
  const base = `/projects/${projectId}`;
  if (pathname === base || pathname === `${base}/`) return "overview";

  for (const item of workspaceNavItems) {
    if (item.id === "overview") continue;
    if (pathname.startsWith(item.href(projectId))) return item.id;
  }

  return "overview";
}

export function ProjectWorkspaceShell({
  workspace,
  children,
}: ProjectWorkspaceShellProps) {
  const pathname = usePathname();
  const { project } = workspace;
  const activeNav = resolveActiveNav(pathname, project.id);
  const styles = healthStyles[project.health];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full flex-col lg:flex-row">
      <aside className="w-full shrink-0 border-b border-white/[0.06] bg-white/[0.01] lg:w-56 lg:border-r lg:border-b-0 xl:w-60">
        <div className="border-b border-white/[0.06] px-4 py-4 lg:px-5">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            All Projects
          </Link>
          <p className="mt-3 truncate text-sm font-semibold text-foreground">
            {project.name}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {project.client}
          </p>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-2 py-3 lg:flex-col lg:overflow-visible lg:px-3 lg:py-4">
          {workspaceNavItems.map((item) => {
            const isActive = activeNav === item.id;
            const isAi = item.id === "ai-assistant";

            return (
              <Link
                key={item.id}
                href={item.href(project.id)}
                className={cn(
                  "flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? isAi
                      ? "bg-violet-500/15 font-medium text-violet-300"
                      : "bg-white/[0.06] font-medium text-foreground"
                    : isAi
                      ? "text-violet-400/80 hover:bg-violet-500/10 hover:text-violet-300"
                      : "text-muted-foreground hover:bg-white/[0.03] hover:text-foreground"
                )}
              >
                <item.icon
                  className={cn(
                    "size-4 shrink-0 opacity-70",
                    isAi && !isActive && "text-violet-400"
                  )}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-white/[0.06] px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0 space-y-1">
              <h1 className="text-xl font-semibold tracking-tight text-foreground lg:text-2xl">
                {project.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                {project.client} · {project.contractValueLabel}
              </p>
              <p className="text-xs text-muted-foreground">
                PD: {project.projectDirector} · CM:{" "}
                {project.constructionManager}
              </p>
            </div>

            <div className="flex flex-wrap gap-6 text-sm">
              <div>
                <p className="text-[10px] tracking-[0.08em] text-muted-foreground uppercase">
                  Progress
                </p>
                <p className="mt-0.5 font-semibold tabular-nums">
                  {project.progress}%
                </p>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.08em] text-muted-foreground uppercase">
                  Overall Health
                </p>
                <p className={cn("mt-0.5 font-semibold tabular-nums", styles.text)}>
                  {project.healthScore}% · {healthLabels[project.health]}
                </p>
              </div>
            </div>
          </div>

          {workspace.criticalAlerts.length > 0 ? (
            <div className="mt-5 rounded-lg bg-rose-500/[0.06] px-4 py-3 ring-1 ring-rose-500/20">
              <p className="text-[10px] font-medium tracking-[0.08em] text-rose-400 uppercase">
                Today&apos;s Critical Alerts
              </p>
              <ul className="mt-2 space-y-1">
                {workspace.criticalAlerts.map((alert) => (
                  <li key={alert} className="text-sm text-foreground/90">
                    {alert}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </header>

        <main className="flex-1 overflow-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
