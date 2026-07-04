import { cn } from "@/lib/utils";

type RiskGaugeProps = {
  label: string;
  value: number;
  color: string;
  ringColor: string;
  size?: number;
  delay?: number;
  className?: string;
};

export function RiskGauge({
  label,
  value,
  color,
  ringColor,
  size = 120,
  delay = 0,
  className,
}: RiskGaugeProps) {
  const strokeWidth = 7;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="-rotate-90 transform"
          aria-hidden
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-white/[0.06]"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={cn(
              ringColor,
              "fill-none transition-[stroke-dashoffset] duration-1000 ease-out"
            )}
            style={{ transitionDelay: `${delay}ms` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("text-xl font-semibold tracking-tight", color)}>
            {value}%
          </span>
        </div>
      </div>
      <p className="text-center text-xs leading-snug text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
