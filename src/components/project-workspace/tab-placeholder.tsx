import { Construction } from "lucide-react";

import { WorkspaceSection } from "@/components/project-workspace/workspace-section";

type TabPlaceholderProps = {
  tabLabel: string;
};

export function TabPlaceholder({ tabLabel }: TabPlaceholderProps) {
  return (
    <WorkspaceSection title={tabLabel}>
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Construction className="size-8 text-muted-foreground/50" />
        <p className="mt-4 text-sm font-medium text-foreground">
          {tabLabel} module
        </p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          This workspace module will be built in a future sprint. Overview is
          your project command view for now.
        </p>
      </div>
    </WorkspaceSection>
  );
}
