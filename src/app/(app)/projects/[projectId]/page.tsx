import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Construction } from "lucide-react";

import { getProjectById } from "@/lib/projects-data";
import { cn } from "@/lib/utils";
import { AppShell } from "@/components/layout/app-shell";
import { buttonVariants } from "@/components/ui/button";

type ProjectWorkspacePageProps = {
  params: Promise<{ projectId: string }>;
};

export async function generateMetadata({ params }: ProjectWorkspacePageProps) {
  const { projectId } = await params;
  const project = getProjectById(projectId);

  return {
    title: project ? `${project.name} · Workspace` : "Project Workspace",
  };
}

export default async function ProjectWorkspacePage({
  params,
}: ProjectWorkspacePageProps) {
  const { projectId } = await params;
  const project = getProjectById(projectId);

  if (!project) {
    notFound();
  }

  return (
    <AppShell
      title={project.name}
      description={`${project.client} · ${project.country}`}
      wide
    >
      <div className="mx-auto flex min-h-[50vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-white/[0.04] ring-1 ring-white/[0.06]">
          <Construction className="size-6 text-muted-foreground" />
        </div>

        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
          Project Workspace
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          The dedicated workspace for <strong className="text-foreground">{project.name}</strong> is
          coming in a future sprint. Routing is ready at{" "}
          <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-xs text-foreground">
            /projects/{project.id}
          </code>
          .
        </p>

        <Link
          href="/projects"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "mt-8 border-white/[0.08]"
          )}
        >
          <ArrowLeft className="size-4" data-icon="inline-start" />
          Back to Projects
        </Link>
      </div>
    </AppShell>
  );
}
