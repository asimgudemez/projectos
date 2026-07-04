import { BarChart3, Download, FileBarChart } from "lucide-react";

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
  title: "Reports",
};

const reports = [
  {
    title: "Portfolio Status — Weekly",
    description: "Executive summary of all active projects",
    frequency: "Weekly",
    lastGenerated: "Jul 1, 2026",
    status: "Ready",
  },
  {
    title: "Budget Variance Analysis",
    description: "Cost performance across project portfolio",
    frequency: "Monthly",
    lastGenerated: "Jun 30, 2026",
    status: "Ready",
  },
  {
    title: "Risk Register Summary",
    description: "Open risks, mitigations and escalation items",
    frequency: "Weekly",
    lastGenerated: "Jun 28, 2026",
    status: "Ready",
  },
  {
    title: "Schedule Performance Index",
    description: "Critical path analysis and delay trends",
    frequency: "Bi-weekly",
    lastGenerated: "Draft",
    status: "Draft",
  },
];

export default function ReportsPage() {
  return (
    <AppShell
      title="Reports"
      description="Analytics, summaries and weekly reports"
    >
      <div className="space-y-8">
        <PageHeader
          title="Reports"
          description="Generate and access portfolio analytics, summaries and weekly reports."
        >
          <Button
            size="sm"
            className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500"
          >
            <FileBarChart className="size-4" data-icon="inline-start" />
            Generate Report
          </Button>
        </PageHeader>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Reports Generated", value: "24" },
            { label: "Scheduled", value: "6" },
            { label: "Shared This Month", value: "11" },
          ].map((stat) => (
            <Card key={stat.label} className="border-border/60 bg-card/50">
              <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="mt-1 text-3xl font-semibold tracking-tight">
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {reports.map((report) => (
            <Card
              key={report.title}
              className="border-border/60 bg-card/50 transition-colors hover:border-violet-500/30"
            >
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-indigo-500/10">
                    <BarChart3 className="size-4 text-indigo-400" />
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      report.status === "Draft"
                        ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                        : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    }
                  >
                    {report.status}
                  </Badge>
                </div>
                <div>
                  <CardTitle className="text-base">{report.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {report.description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-4">
                <div className="text-xs text-muted-foreground">
                  <p>{report.frequency}</p>
                  <p className="mt-1">Last: {report.lastGenerated}</p>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="size-4" data-icon="inline-start" />
                  Export
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
