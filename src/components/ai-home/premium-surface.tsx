import { cn } from "@/lib/utils";

type PremiumSurfaceProps = {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  glass?: boolean;
};

export function PremiumSurface({
  children,
  className,
  glow = false,
  glass = false,
}: PremiumSurfaceProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/[0.06] bg-card/80 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)]",
        glow && "shadow-[0_8px_40px_-12px_rgba(139,92,246,0.25)]",
        glass && "backdrop-blur-xl bg-card/60",
        className
      )}
    >
      {children}
    </div>
  );
}
