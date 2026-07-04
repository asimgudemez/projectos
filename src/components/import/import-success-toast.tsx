"use client";

import { useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";

import { cn } from "@/lib/utils";

type ImportSuccessToastProps = {
  message: string;
  detail?: string;
  visible: boolean;
  onDismiss: () => void;
  durationMs?: number;
};

export function ImportSuccessToast({
  message,
  detail,
  visible,
  onDismiss,
  durationMs = 6000,
}: ImportSuccessToastProps) {
  useEffect(() => {
    if (!visible) return;
    const timer = window.setTimeout(onDismiss, durationMs);
    return () => window.clearTimeout(timer);
  }, [visible, onDismiss, durationMs]);

  if (!visible) return null;

  return (
    <div
      role="status"
      className={cn(
        "fixed right-4 bottom-4 z-50 flex max-w-sm items-start gap-3 rounded-xl",
        "border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 shadow-xl backdrop-blur-md",
        "animate-in fade-in slide-in-from-bottom-2"
      )}
    >
      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-400" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">{message}</p>
        {detail ? (
          <p className="mt-0.5 text-xs text-muted-foreground">{detail}</p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
        aria-label="Dismiss notification"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
