import { notFound } from "next/navigation";

import { getProjectWorkspace } from "@/lib/project-workspace-data";
import { AppShell } from "@/components/layout/app-shell";
import { ProjectWorkspaceShell } from "@/components/project-workspace/project-workspace-shell";

type ProjectLayoutProps = {
  params: Promise<{ projectId: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: ProjectLayoutProps) {
  const { projectId } = await params;
  const workspace = getProjectWorkspace(projectId);

  return {
    title: workspace
      ? `${workspace.project.name} · Workspace`
      : "Project Workspace",
  };
}

export default async function ProjectLayout({
  params,
  children,
}: ProjectLayoutProps) {
  const { projectId } = await params;
  const workspace = getProjectWorkspace(projectId);

  if (!workspace) {
    notFound();
  }

  return (
    <AppShell
      title={workspace.project.name}
      description={`${workspace.project.client} · Project Workspace`}
      fullWidth
    >
      <ProjectWorkspaceShell workspace={workspace}>
        {children}
      </ProjectWorkspaceShell>
    </AppShell>
  );
}
