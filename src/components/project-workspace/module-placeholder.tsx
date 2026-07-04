import { Construction } from "lucide-react";

import { WorkspaceSection } from "@/components/project-workspace/workspace-section";

type ModulePlaceholderProps = {
  title: string;
};

export function ModulePlaceholder({ title }: ModulePlaceholderProps) {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <WorkspaceSection title={title}>
        <div className="flex flex-col items-center py-20 text-center">
          <Construction className="size-8 text-muted-foreground/40" />
          <p className="mt-4 text-sm font-medium text-foreground">{title}</p>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            This module will be built in a future sprint. Use Overview for the
            complete project operating picture.
          </p>
        </div>
      </WorkspaceSection>
    </div>
  );
}
