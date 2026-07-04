import { Filter, Plus } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Projects",
};

const projects = [
  {
    name: "Marina Tower Phase 2",
    client: "Harbor Development Group",
    status: "At Risk",
    progress: 68,
    budget: "$42.5M",
    dueDate: "Dec 2026",
  },
  {
    name: "Riverside Campus Expansion",
    client: "Northgate University",
    status: "On Track",
    progress: 41,
    budget: "$28.0M",
    dueDate: "Mar 2027",
  },
  {
    name: "Metro Line Station 7",
    client: "City Transit Authority",
    status: "Delayed",
    progress: 55,
    budget: "$61.2M",
    dueDate: "Aug 2026",
  },
  {
    name: "Greenfield Data Center",
    client: "CloudScale Inc.",
    status: "On Track",
    progress: 22,
    budget: "$19.8M",
    dueDate: "Jun 2027",
  },
];

const statusStyles: Record<string, string> = {
  "On Track":
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  "At Risk":
    "border-amber-500/30 bg-amber-500/10 text-amber-400",
  Delayed:
    "border-rose-500/30 bg-rose-500/10 text-rose-400",
};

export default function ProjectsPage() {
  return (
    <AppShell
      title="Projects"
      description="Manage and track all active projects"
    >
      <div className="space-y-8">
        <PageHeader
          title="Projects"
          description="View project status, progress, budget and risks across your portfolio."
        >
          <Button variant="outline" size="sm">
            <Filter className="size-4" data-icon="inline-start" />
            Filter
          </Button>
          <Button
            size="sm"
            className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500"
          >
            <Plus className="size-4" data-icon="inline-start" />
            New Project
          </Button>
        </PageHeader>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
          {projects.map((project) => (
            <Card
              key={project.name}
              className="border-border/60 bg-card/50 transition-colors hover:border-violet-500/30 hover:bg-card/80"
            >
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <CardTitle className="text-base">{project.name}</CardTitle>
                    <CardDescription>{project.client}</CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className={statusStyles[project.status]}
                  >
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Budget</p>
                    <p className="font-medium">{project.budget}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Target</p>
                    <p className="font-medium">{project.dueDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
