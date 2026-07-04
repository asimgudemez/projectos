import { Bell, Building2, Palette, Users } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "Settings",
};

const settingsSections = [
  {
    icon: Building2,
    title: "Workspace",
    description: "Organization name, timezone and regional preferences",
  },
  {
    icon: Users,
    title: "Team",
    description: "Manage team members, roles and invitations",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Email alerts, in-app notifications and digests",
  },
  {
    icon: Palette,
    title: "Appearance",
    description: "Theme, density and display preferences",
  },
];

export default function SettingsPage() {
  return (
    <AppShell
      title="Settings"
      description="Workspace preferences and configuration"
    >
      <div className="space-y-8">
        <PageHeader
          title="Settings"
          description="Configure your ProjectOS workspace and preferences."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="border-border/60 bg-card/50 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">General</CardTitle>
              <CardDescription>
                Basic workspace information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="workspace-name"
                  className="text-sm font-medium text-foreground"
                >
                  Workspace name
                </label>
                <Input
                  id="workspace-name"
                  defaultValue="Nexora Labs"
                  className="border-border/60 bg-muted/20"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="workspace-slug"
                  className="text-sm font-medium text-foreground"
                >
                  Workspace URL
                </label>
                <Input
                  id="workspace-slug"
                  defaultValue="nexora-labs"
                  className="border-border/60 bg-muted/20"
                />
              </div>
              <Button
                size="sm"
                className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500"
              >
                Save changes
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/50">
            <CardHeader>
              <CardTitle className="text-base">Plan</CardTitle>
              <CardDescription>Current subscription</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg border border-violet-500/20 bg-violet-500/10 p-4">
                <p className="text-sm font-medium text-violet-300">
                  Development
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  MVP workspace — authentication coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="bg-border/60" />

        <div className="grid gap-4 sm:grid-cols-2">
          {settingsSections.map((section) => (
            <Card
              key={section.title}
              className="border-border/60 bg-card/50 transition-colors hover:border-violet-500/20 hover:bg-card/80"
            >
              <CardHeader className="flex-row items-start gap-4 space-y-0">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted/40">
                  <section.icon className="size-4 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-base">{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
