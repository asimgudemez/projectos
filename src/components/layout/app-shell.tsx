"use client";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { TopBar } from "@/components/layout/top-bar";

type AppShellProps = {
  title: string;
  description?: string;
  wide?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
};

export function AppShell({
  title,
  description,
  wide,
  fullWidth,
  children,
}: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden lg:block">
        <AppSidebar className="fixed inset-y-0 left-0 z-30" />
      </div>

      <div className="flex min-h-screen flex-1 flex-col lg:pl-64">
        <TopBar title={title} description={description} />
        <main className="flex-1 overflow-auto">
          <div
            className={`mx-auto w-full p-4 sm:p-6 lg:p-8 ${
              fullWidth
                ? "max-w-none"
                : wide
                  ? "max-w-[1440px]"
                  : "max-w-7xl"
            }`}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
