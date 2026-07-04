import {
  BarChart3,
  Command,
  FileText,
  FolderKanban,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
};

export const mainNavItems: NavItem[] = [
  {
    title: "Command Center",
    href: "/command-center",
    icon: Command,
    description: "Your construction intelligence briefing",
  },
  {
    title: "Projects",
    href: "/projects",
    icon: FolderKanban,
    description: "Manage and track all active projects",
  },
  {
    title: "Documents",
    href: "/documents",
    icon: FileText,
    description: "Upload, search and organize project files",
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart3,
    description: "Analytics, summaries and weekly reports",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Workspace preferences and configuration",
  },
];
