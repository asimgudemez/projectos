import { cn } from "@/lib/utils";

type RiskGaugeProps = {
  label: string;
  value: number;
  color: string;
  ringColor: string;
  size?: number;
  className?: string;
};

export function RiskGauge({
  label,
  value,
  color,
  ringColor,
  size = 120,
  className,
}: RiskGaugeProps) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
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
            className={cn(ringColor, "fill-none transition-all duration-1000 ease-out")}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-2xl font-semibold tracking-tight", color)}>
            {value}%
          </span>
        </div>
      </div>
      <p className="text-center text-sm font-medium text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
