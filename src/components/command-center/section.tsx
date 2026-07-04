import { cn } from "@/lib/utils";

type CommandCenterSectionProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  "aria-label"?: string;
};

export function CommandCenterSection({
  children,
  className,
  delay = 0,
  "aria-label": ariaLabel,
}: CommandCenterSectionProps) {
  return (
    <section
      aria-label={ariaLabel}
      className={cn("animate-command-center-in opacity-0", className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </section>
  );
}
