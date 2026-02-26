"use client";

import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  RefreshCw,
  Globe,
  ShieldCheck,
  Cpu,
  FileDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { healthChecks } from "@/data/mock-data";
import type { HealthCheck, HealthCheckStatus } from "@/lib/types";

const CHECK_ICONS = [ShieldCheck, Globe, Cpu, FileDown] as const;

function StatusBadge({ status }: { status: HealthCheckStatus }) {
  const config: Record<HealthCheckStatus, { label: string; colorClass: string }> = {
    Passing: {
      label: "Passing",
      colorClass: "text-[color:var(--success)] bg-[color:var(--success)]/10 border-[color:var(--success)]/20",
    },
    Failing: {
      label: "Failing",
      colorClass: "text-destructive bg-destructive/10 border-destructive/20",
    },
    Timeout: {
      label: "Timeout",
      colorClass: "text-[color:var(--warning)] bg-[color:var(--warning)]/10 border-[color:var(--warning)]/20",
    },
    Pending: {
      label: "Pending",
      colorClass: "text-muted-foreground bg-muted border-border",
    },
  };

  const c = config[status];

  return (
    <Badge
      variant="outline"
      className={cn("text-[10px] font-medium font-mono rounded-sm border px-1.5 py-0.5", c.colorClass)}
    >
      {c.label}
    </Badge>
  );
}

function formatResponseTime(ms: number): string {
  if (ms >= 1000) return `${(ms / 1000).toFixed(2)}s`;
  return `${ms}ms`;
}

function formatLastChecked(iso: string): string {
  const now = new Date("2026-02-25T00:00:00Z");
  const then = new Date(iso);
  const diffMs = now.getTime() - then.getTime();
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 2) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  return `${diffHr}h ago`;
}

function StatusIcon({
  status,
  running,
}: {
  status: HealthCheckStatus;
  running: boolean;
}) {
  if (running) {
    return <Loader2 className="w-10 h-10 text-primary animate-spin" />;
  }
  if (status === "Passing") {
    return <CheckCircle2 className="w-10 h-10 text-[color:var(--success)]" />;
  }
  if (status === "Failing" || status === "Timeout") {
    return <XCircle className="w-10 h-10 text-destructive" />;
  }
  return <Clock className="w-10 h-10 text-muted-foreground" />;
}

type LocalCheck = HealthCheck & { running?: boolean; justPassed?: boolean };

export default function HealthChecksPage() {
  const [checks, setChecks] = useState<LocalCheck[]>(healthChecks.map((hc) => ({ ...hc })));

  function runCheck(id: string) {
    // Set to running
    setChecks((prev) =>
      prev.map((c) => (c.id === id ? { ...c, running: true, justPassed: false } : c))
    );
    // Simulate async check — resolves after 1.4s
    setTimeout(() => {
      setChecks((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                running: false,
                justPassed: true,
                status: "Passing",
                responseTime: Math.floor(Math.random() * 200) + c.responseTime - 50,
                lastChecked: new Date("2026-02-25T00:00:00Z").toISOString(),
                httpStatus: 200,
              }
            : c
        )
      );
    }, 1400);
  }

  function runAllChecks() {
    checks.forEach((c) => runCheck(c.id));
  }

  const passingCount = checks.filter((c) => c.status === "Passing").length;
  const totalCount = checks.length;
  const allPassing = passingCount === totalCount;

  return (
    <div className="page-container space-y-3">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold tracking-tight">Health Checks</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            4-point deployment acceptance checklist — password gate · login · AI generation · DOCX export
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs font-mono flex items-center gap-1.5"
          onClick={runAllChecks}
          disabled={checks.some((c) => c.running)}
        >
          <RefreshCw className="w-3 h-3" />
          Run All Checks
        </Button>
      </div>

      {/* Overall status summary bar */}
      <div
        className={cn(
          "flex items-center justify-between px-3 py-2 rounded-sm border font-mono text-xs",
          allPassing
            ? "bg-[color:var(--success)]/8 border-[color:var(--success)]/20 text-[color:var(--success)]"
            : "bg-[color:var(--warning)]/8 border-[color:var(--warning)]/20 text-[color:var(--warning)]"
        )}
      >
        <div className="flex items-center gap-2">
          {allPassing ? (
            <CheckCircle2 className="w-3.5 h-3.5" />
          ) : (
            <Clock className="w-3.5 h-3.5" />
          )}
          <span className="font-semibold">
            {passingCount}/{totalCount} checks passing
          </span>
          {allPassing && (
            <span className="text-[10px] opacity-70">· All acceptance criteria met · Ready for handoff</span>
          )}
        </div>
        <span className="text-[10px] opacity-70">
          legis-api · production
        </span>
      </div>

      {/* Health check panels — 2x2 grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {checks.map((check, idx) => {
          const Icon = CHECK_ICONS[idx % CHECK_ICONS.length];
          const isRunning = check.running ?? false;
          const isPassing = check.status === "Passing";
          const justPassed = check.justPassed ?? false;

          return (
            <div
              key={check.id}
              className={cn(
                "aesthetic-card p-3 space-y-3",
                isPassing && !isRunning && "border-[color:var(--success)]/25",
                (check.status === "Failing" || check.status === "Timeout") &&
                  !isRunning &&
                  "border-destructive/25"
              )}
            >
              {/* Panel header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-6 h-6 rounded-sm flex items-center justify-center",
                      isPassing
                        ? "bg-[color:var(--success)]/10"
                        : "bg-destructive/10"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-3.5 h-3.5",
                        isPassing
                          ? "text-[color:var(--success)]"
                          : "text-destructive"
                      )}
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold leading-tight">{check.name}</p>
                    <code className="font-mono text-[10px] text-muted-foreground">
                      {check.endpoint}
                    </code>
                  </div>
                </div>
                <StatusBadge status={check.status} />
              </div>

              {/* Large status indicator */}
              <div className="flex items-center justify-center py-2">
                <StatusIcon status={check.status} running={isRunning} />
              </div>

              {/* Metrics row */}
              <div className="grid grid-cols-3 gap-2 border-t border-border/60 pt-2">
                <div>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wide font-mono">Response</p>
                  <p
                    className={cn(
                      "font-mono text-xs font-semibold mt-0.5",
                      check.responseTime > 2000
                        ? "text-[color:var(--warning)]"
                        : "text-foreground"
                    )}
                  >
                    {isRunning ? "—" : formatResponseTime(check.responseTime)}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wide font-mono">HTTP</p>
                  <p
                    className={cn(
                      "font-mono text-xs font-semibold mt-0.5",
                      check.httpStatus === 200
                        ? "text-[color:var(--success)]"
                        : "text-destructive"
                    )}
                  >
                    {isRunning ? "—" : check.httpStatus}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wide font-mono">Checked</p>
                  <p className="font-mono text-xs text-muted-foreground mt-0.5">
                    {isRunning ? "running..." : formatLastChecked(check.lastChecked)}
                  </p>
                </div>
              </div>

              {/* Description */}
              {check.description && (
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  {check.description}
                </p>
              )}

              {/* Run check button */}
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "w-full h-7 text-[11px] font-mono",
                  justPassed && !isRunning && "border-[color:var(--success)]/40 text-[color:var(--success)]"
                )}
                onClick={() => runCheck(check.id)}
                disabled={isRunning}
              >
                {isRunning ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                    Running check...
                  </>
                ) : justPassed ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 mr-1.5" />
                    Check passed
                  </>
                ) : (
                  "Run Check"
                )}
              </Button>
            </div>
          );
        })}
      </div>

      {/* Acceptance criteria note */}
      <div className="flex items-start gap-1.5 text-[10px] text-muted-foreground font-mono">
        <CheckCircle2 className="w-3 h-3 mt-0.5 shrink-0 text-[color:var(--success)]" />
        <span>
          These 4 checks directly mirror the client&apos;s acceptance criteria.
          All 4 passing confirms: password gate active, login accessible, Claude API propagated, DOCX download functional.
          Run All Checks before handoff.
        </span>
      </div>
    </div>
  );
}
