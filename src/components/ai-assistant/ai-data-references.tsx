import type { AiDataReference } from "@/lib/ai-assistant-types";
import { cn } from "@/lib/utils";

type AiDataReferencesProps = {
  references: AiDataReference[];
  className?: string;
};

export function AiDataReferences({ references, className }: AiDataReferencesProps) {
  if (references.length === 0) return null;

  return (
    <div className={cn("mt-3 space-y-2 border-t border-white/[0.06] pt-3", className)}>
      <p className="text-[10px] font-medium tracking-[0.06em] text-muted-foreground uppercase">
        Project data references
      </p>
      <div className="flex flex-wrap gap-2">
        {references.map((reference) => (
          <div
            key={`${reference.type}-${reference.reference}`}
            className="rounded-lg bg-white/[0.04] px-2.5 py-1.5 ring-1 ring-white/[0.06]"
          >
            <p className="text-[10px] font-medium text-violet-400/90">
              {reference.type} · {reference.reference}
            </p>
            <p className="mt-0.5 text-xs text-foreground">{reference.label}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {reference.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
