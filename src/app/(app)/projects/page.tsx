import { AppShell } from "@/components/layout/app-shell";
import { ProjectsView } from "@/components/projects/projects-view";

export const metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  return (
    <AppShell
      title="Projects"
      description="Company-wide construction portfolio"
      wide
    >
      <ProjectsView />
    </AppShell>
  );
}
