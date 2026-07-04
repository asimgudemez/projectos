import {
  AlertTriangle,
  ArrowUpRight,
  Clock,
  FileText,
  Sparkles,
  TrendingUp,
} from "lucide-react";

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
  title: "AI Home",
};

const quickStats = [
  {
    label: "Active Projects",
    value: "12",
    change: "+2 this month",
    icon: TrendingUp,
  },
  {
    label: "Delayed Projects",
    value: "3",
    change: "Needs attention",
    icon: Clock,
  },
  {
    label: "Open Risks",
    value: "7",
    change: "2 critical",
    icon: AlertTriangle,
  },
  {
    label: "Pending Documents",
    value: "18",
    change: "5 due this week",
    icon: FileText,
  },
];

const aiSuggestions = [
  "Show delayed projects across all sites",
  "Prepare weekly status report",
  "Summarize budget variance for Tower A",
  "List urgent actions for this week",
];

const recentActivity = [
  {
    title: "Marina Tower Phase 2",
    detail: "Schedule risk detected — 4 days behind baseline",
    time: "2 hours ago",
  },
  {
    title: "Weekly Report Draft",
    detail: "AI generated summary ready for review",
    time: "5 hours ago",
  },
  {
    title: "Procurement Package B",
    detail: "3 documents uploaded and indexed",
    time: "Yesterday",
  },
];

export default function AIHomePage() {
  return (
    <AppShell
      title="AI Home"
      description="Your intelligent project command center"
    >
      <div className="space-y-8">
        <PageHeader
          title="Good evening"
          description="Ask ProjectOS anything about your projects, risks, documents, and reports."
        />

        <Card className="overflow-hidden border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-background to-indigo-500/5">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-violet-500/20">
                <Sparkles className="size-4 text-violet-400" />
              </div>
              <div>
                <CardTitle className="text-base">Ask ProjectOS</CardTitle>
                <CardDescription>
                  Natural language queries across your entire workspace
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                placeholder="e.g. Show all delayed projects and their root causes..."
                className="h-11 flex-1 border-border/60 bg-background/60"
              />
              <Button className="h-11 bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500">
                <Sparkles className="size-4" data-icon="inline-start" />
                Ask AI
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {aiSuggestions.map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  className="border-border/60 bg-background/40 text-muted-foreground hover:text-foreground"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickStats.map((stat) => (
            <Card key={stat.label} className="border-border/60 bg-card/50">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <CardDescription>{stat.label}</CardDescription>
                <stat.icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold tracking-tight">
                  {stat.value}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border/60 bg-card/50">
            <CardHeader>
              <CardTitle className="text-base">AI Summary</CardTitle>
              <CardDescription>
                Intelligent overview of your portfolio this week
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                Three projects are trending behind schedule, primarily driven by
                procurement delays and subcontractor availability. Budget
                performance remains within tolerance on 9 of 12 active projects.
              </p>
              <p>
                Two critical risks require executive attention: concrete supply
                constraints at Marina Tower and permit review backlog at
                Riverside Campus.
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                View full analysis
                <ArrowUpRight className="size-4" data-icon="inline-end" />
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/50">
            <CardHeader>
              <CardTitle className="text-base">Smart Notifications</CardTitle>
              <CardDescription>Recent signals across your workspace</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((item) => (
                <div
                  key={item.title}
                  className="flex items-start justify-between gap-4 rounded-lg border border-border/40 bg-muted/20 p-3"
                >
                  <div className="min-w-0 space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      {item.title}
                    </p>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {item.detail}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="shrink-0 border-border/60 text-[10px] text-muted-foreground"
                  >
                    {item.time}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
