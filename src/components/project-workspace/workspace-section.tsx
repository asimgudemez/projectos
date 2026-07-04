import { cn } from "@/lib/utils";

type WorkspaceSectionProps = {
  title: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
};

export function WorkspaceSection({
  title,
  hint,
  children,
  className,
}: WorkspaceSectionProps) {
  return (
    <section className={cn("space-y-4", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-[11px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
          {title}
        </h2>
        {hint ? (
          <span className="text-[11px] text-muted-foreground/70">{hint}</span>
        ) : null}
      </div>
      <div className="rounded-xl bg-white/[0.025] p-5 ring-1 ring-white/[0.06] lg:p-6">
        {children}
      </div>
    </section>
  );
}
