import { notFound } from "next/navigation";

import {
  getProjectWorkspace,
  workspaceNavItems,
} from "@/lib/project-workspace-data";
import { ModulePlaceholder } from "@/components/project-workspace/module-placeholder";
import { OverviewPage } from "@/components/project-workspace/overview-page";

type ProjectSectionPageProps = {
  params: Promise<{ projectId: string; section?: string[] }>;
};

export default async function ProjectSectionPage({
  params,
}: ProjectSectionPageProps) {
  const { projectId, section } = await params;
  const workspace = getProjectWorkspace(projectId);

  if (!workspace) {
    notFound();
  }

  const sectionId = section?.[0] ?? "overview";

  if (sectionId === "overview") {
    return <OverviewPage workspace={workspace} />;
  }

  const navItem = workspaceNavItems.find((item) => item.id === sectionId);

  if (!navItem) {
    notFound();
  }

  return <ModulePlaceholder title={navItem.label} />;
}
