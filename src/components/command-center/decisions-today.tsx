import { decisionsToday } from "@/lib/command-center-data";
import { Button } from "@/components/ui/button";
import {
  WorkspaceRow,
  WorkspaceSection,
} from "@/components/command-center/workspace-primitives";

function DecisionGroup({
  title,
  items,
}: {
  title: string;
  items: (typeof decisionsToday.approve)[number][];
}) {
  return (
    <div className="space-y-1">
      <h3 className="text-xs font-medium text-muted-foreground">{title}</h3>
      <div>
        {items.map((item) => (
          <div key={item.id} className="group">
            <WorkspaceRow
              primary={item.label}
              secondary={item.project}
              meta={item.meta}
              indicator="neutral"
              action={
                <Button
                  variant="ghost"
                  size="xs"
                  className="opacity-0 transition-opacity group-hover:opacity-100"
                >
                  Open
                </Button>
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DecisionsToday() {
  const total =
    decisionsToday.approve.length +
    decisionsToday.pay.length +
    decisionsToday.review.length;

  return (
    <WorkspaceSection
      label="What decisions must I make today"
      hint={`${total} items`}
    >
      <div className="space-y-6">
        <DecisionGroup title="What should I approve" items={decisionsToday.approve} />
        <DecisionGroup title="What payments are due" items={decisionsToday.pay} />
        <DecisionGroup title="Review" items={decisionsToday.review} />
      </div>
    </WorkspaceSection>
  );
}
