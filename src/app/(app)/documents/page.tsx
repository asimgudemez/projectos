import { FileText, Search, Upload } from "lucide-react";

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
import { Input } from "@/components/ui/input";

export const metadata = {
  title: "Documents",
};

const documents = [
  {
    name: "Structural Drawings — Rev C",
    project: "Marina Tower Phase 2",
    type: "Drawing",
    updated: "Jul 2, 2026",
    size: "24.6 MB",
  },
  {
    name: "Weekly Progress Report W26",
    project: "Metro Line Station 7",
    type: "Report",
    updated: "Jul 1, 2026",
    size: "1.2 MB",
  },
  {
    name: "MEP Submittal Package B",
    project: "Riverside Campus Expansion",
    type: "Submittal",
    updated: "Jun 28, 2026",
    size: "18.4 MB",
  },
  {
    name: "Cost Forecast Q3",
    project: "Greenfield Data Center",
    type: "Financial",
    updated: "Jun 25, 2026",
    size: "890 KB",
  },
  {
    name: "Safety Inspection Log",
    project: "Marina Tower Phase 2",
    type: "Compliance",
    updated: "Jun 24, 2026",
    size: "456 KB",
  },
];

export default function DocumentsPage() {
  return (
    <AppShell
      title="Documents"
      description="Upload, search and organize project files"
    >
      <div className="space-y-8">
        <PageHeader
          title="Documents"
          description="Centralized document management with search across all projects."
        >
          <Button
            size="sm"
            className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500"
          >
            <Upload className="size-4" data-icon="inline-start" />
            Upload
          </Button>
        </PageHeader>

        <div className="relative max-w-xl">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search documents by name, project or type..."
            className="h-11 border-border/60 bg-muted/20 pl-9"
          />
        </div>

        <Card className="border-border/60 bg-card/50">
          <CardHeader>
            <CardTitle className="text-base">Document Library</CardTitle>
            <CardDescription>
              {documents.length} documents across active projects
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.name}
                className="flex flex-col gap-3 rounded-lg border border-border/40 bg-muted/10 p-4 transition-colors hover:border-violet-500/20 hover:bg-muted/20 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
                    <FileText className="size-4 text-violet-400" />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <p className="truncate text-sm font-medium">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {doc.project}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <Badge variant="outline" className="border-border/60">
                    {doc.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {doc.updated} · {doc.size}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
