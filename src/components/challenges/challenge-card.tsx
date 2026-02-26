// No "use client" — no hooks

import { cn } from "@/lib/utils";
import { TrendingUp } from "lucide-react";
import type { ReactNode } from "react";

interface ChallengeCardProps {
  index: number;
  title: string;
  description: string;
  outcome?: string;
  visualization?: ReactNode;
  className?: string;
}

export function ChallengeCard({
  index,
  title,
  description,
  outcome,
  visualization,
  className,
}: ChallengeCardProps) {
  const stepNumber = String(index + 1).padStart(2, "0");

  return (
    <div
      className={cn(
        "aesthetic-card bg-card border border-border p-4 space-y-3",
        className
      )}
    >
      {/* Header: number + title */}
      <div className="space-y-1">
        <div className="flex items-baseline gap-2.5">
          <span className="font-mono text-xs font-medium text-primary/60 tabular-nums shrink-0 w-5">
            {stepNumber}
          </span>
          <h2 className="text-sm font-semibold leading-snug">{title}</h2>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed pl-[calc(1.25rem+0.625rem)]">
          {description}
        </p>
      </div>

      {/* Visualization slot */}
      {visualization && (
        <div className="pl-[calc(1.25rem+0.625rem)]">
          {visualization}
        </div>
      )}

      {/* Outcome statement */}
      {outcome && (
        <div
          className="flex items-start gap-1.5 rounded px-2.5 py-2"
          style={{
            backgroundColor: "color-mix(in oklch, var(--success) 6%, transparent)",
            borderColor: "color-mix(in oklch, var(--success) 15%, transparent)",
            borderWidth: "1px",
            borderStyle: "solid",
          }}
        >
          <TrendingUp className="h-3.5 w-3.5 mt-0.5 shrink-0 text-[color:var(--success)]" />
          <p className="text-xs font-medium text-[color:var(--success)]">{outcome}</p>
        </div>
      )}
    </div>
  );
}
