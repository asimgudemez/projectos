import { notFound } from "next/navigation";

import { getProjectWorkspace } from "@/lib/project-workspace-data";
import { AppShell } from "@/components/layout/app-shell";
import { ProjectWorkspaceView } from "@/components/project-workspace/project-workspace-view";

type ProjectWorkspacePageProps = {
  params: Promise<{ projectId: string }>;
};

export async function generateMetadata({ params }: ProjectWorkspacePageProps) {
  const { projectId } = await params;
  const workspace = getProjectWorkspace(projectId);

  return {
    title: workspace
      ? `${workspace.project.name} · Workspace`
      : "Project Workspace",
  };
}

export default async function ProjectWorkspacePage({
  params,
}: ProjectWorkspacePageProps) {
  const { projectId } = await params;
  const workspace = getProjectWorkspace(projectId);

  if (!workspace) {
    notFound();
  }

  return (
    <AppShell
      title={workspace.project.name}
      description={`${workspace.project.client} · Workspace`}
      fullWidth
    >
      <ProjectWorkspaceView workspace={workspace} />
    </AppShell>
  );
}
