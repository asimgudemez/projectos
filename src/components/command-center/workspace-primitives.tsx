import { cn } from "@/lib/utils";

type WorkspaceSectionProps = {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
};

export function WorkspaceSection({
  label,
  hint,
  children,
  className,
}: WorkspaceSectionProps) {
  return (
    <section className={cn("space-y-4", className)}>
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-[11px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
          {label}
        </h2>
        {hint ? (
          <p className="text-[11px] text-muted-foreground/70">{hint}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

type WorkspaceRowProps = {
  primary: string;
  secondary?: string;
  meta?: string;
  indicator?: "critical" | "high" | "medium" | "healthy" | "at-risk" | "neutral";
  action?: React.ReactNode;
};

const indicatorClass: Record<
  NonNullable<WorkspaceRowProps["indicator"]>,
  string
> = {
  critical: "bg-rose-400",
  high: "bg-amber-400",
  medium: "bg-muted-foreground/40",
  healthy: "bg-emerald-400",
  "at-risk": "bg-amber-400",
  neutral: "bg-muted-foreground/30",
};

export function WorkspaceRow({
  primary,
  secondary,
  meta,
  indicator = "neutral",
  action,
}: WorkspaceRowProps) {
  return (
    <div className="group flex items-start gap-3 border-b border-white/[0.04] py-3 last:border-0">
      <span
        aria-hidden
        className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", indicatorClass[indicator])}
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-snug text-foreground">{primary}</p>
        {secondary ? (
          <p className="mt-0.5 text-xs text-muted-foreground">{secondary}</p>
        ) : null}
      </div>
      {meta ? (
        <p className="shrink-0 text-xs tabular-nums text-muted-foreground">{meta}</p>
      ) : null}
      {action}
    </div>
  );
}
