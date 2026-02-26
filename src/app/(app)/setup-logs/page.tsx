"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Terminal, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { logEntries } from "@/data/mock-data";
import type { LogSeverity } from "@/lib/types";

type SeverityFilter = "all" | LogSeverity;
type StreamFilter = "build" | "deploy";

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  const ss = String(d.getUTCSeconds()).padStart(2, "0");
  const ms = String(d.getUTCMilliseconds()).padStart(3, "0");
  return `${hh}:${mm}:${ss}.${ms}`;
}

const SEVERITY_COLOR: Record<LogSeverity, string> = {
  error: "text-destructive",
  warn: "text-[color:var(--warning)]",
  info: "text-[color:var(--success)]",
  debug: "text-muted-foreground/50",
};

const SEVERITY_LABEL: Record<LogSeverity, string> = {
  error: "ERR ",
  warn: "WARN",
  info: "INFO",
  debug: "DBG ",
};

export default function SetupLogsPage() {
  const [stream, setStream] = useState<StreamFilter>("build");
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("all");
  const [autoScroll, setAutoScroll] = useState(true);
  const logEndRef = useRef<HTMLDivElement>(null);

  const displayed = useMemo(() => {
    return logEntries
      .filter((l) => {
        const matchesStream = l.stream === stream;
        const matchesSeverity = severityFilter === "all" || l.severity === severityFilter;
        return matchesStream && matchesSeverity;
      })
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [stream, severityFilter]);

  useEffect(() => {
    if (autoScroll && logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [displayed, autoScroll]);

  const errorCount = displayed.filter((l) => l.severity === "error").length;
  const warnCount = displayed.filter((l) => l.severity === "warn").length;

  return (
    <div className="page-container space-y-3 h-full flex flex-col">
      {/* Page header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-base font-semibold tracking-tight">Setup Logs</h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-mono">
            {stream === "build"
              ? "npm install · npm run setup · Railpack build output"
              : "Express.js runtime · stdout/stderr stream"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {errorCount > 0 && (
            <span className="font-mono text-[10px] text-destructive bg-destructive/8 border border-destructive/20 px-2 py-0.5 rounded-sm">
              {errorCount} error{errorCount > 1 ? "s" : ""}
            </span>
          )}
          {warnCount > 0 && (
            <span className="font-mono text-[10px] text-[color:var(--warning)] bg-[color:var(--warning)]/8 border border-[color:var(--warning)]/20 px-2 py-0.5 rounded-sm">
              {warnCount} warn{warnCount > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 shrink-0 flex-wrap">
        {/* Stream toggle — Build Log vs Deploy Log (Railway's two distinct streams) */}
        <div className="flex items-center border border-border rounded-sm overflow-hidden">
          <button
            onClick={() => setStream("build")}
            className={cn(
              "px-3 py-1 text-[11px] font-mono transition-colors duration-75",
              stream === "build"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-[color:var(--surface-hover)]"
            )}
          >
            Build Logs
          </button>
          <button
            onClick={() => setStream("deploy")}
            className={cn(
              "px-3 py-1 text-[11px] font-mono transition-colors duration-75 border-l border-border",
              stream === "deploy"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-[color:var(--surface-hover)]"
            )}
          >
            Deploy Logs
          </button>
        </div>

        {/* Severity filter buttons */}
        <div className="flex items-center gap-1">
          {(["all", "info", "warn", "error", "debug"] as SeverityFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => setSeverityFilter(s)}
              className={cn(
                "px-2 py-0.5 text-[10px] font-mono rounded-sm border transition-colors duration-75",
                severityFilter === s
                  ? "bg-primary/10 text-primary border-primary/30"
                  : "text-muted-foreground border-border hover:bg-[color:var(--surface-hover)]"
              )}
            >
              {s === "all" ? "ALL" : s.toUpperCase()}
            </button>
          ))}
        </div>

        <span className="text-[10px] text-muted-foreground font-mono ml-auto">
          {displayed.length} line{displayed.length !== 1 ? "s" : ""}
        </span>

        {/* Auto-scroll toggle */}
        <button
          onClick={() => setAutoScroll((v) => !v)}
          className={cn(
            "flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-sm border transition-colors duration-75",
            autoScroll
              ? "text-[color:var(--success)] bg-[color:var(--success)]/8 border-[color:var(--success)]/20"
              : "text-muted-foreground border-border hover:bg-[color:var(--surface-hover)]"
          )}
        >
          <RefreshCw className={cn("w-2.5 h-2.5", autoScroll && "animate-spin [animation-duration:3s]")} />
          {autoScroll ? "Live" : "Paused"}
        </button>
      </div>

      {/* Terminal panel */}
      <div
        className="flex-1 min-h-0 overflow-hidden rounded-sm border border-border"
        style={{ background: "oklch(0.09 0.01 260)" }}
      >
        {/* Terminal title bar */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 border-b"
          style={{ background: "oklch(0.12 0.01 260)", borderColor: "oklch(0.2 0.01 260)" }}
        >
          <Terminal className="w-3 h-3" style={{ color: "oklch(0.52 0.14 260)" }} />
          <span
            className="font-mono text-[10px] tracking-wide"
            style={{ color: "oklch(0.65 0 0)" }}
          >
            legis-api — {stream === "build" ? "build" : "deploy"} log
          </span>
          <span
            className="ml-auto font-mono text-[10px]"
            style={{ color: "oklch(0.45 0 0)" }}
          >
            UTC
          </span>
        </div>

        {/* Log lines */}
        <div className="h-full overflow-y-auto p-2 space-y-0.5" style={{ maxHeight: "calc(100vh - 260px)" }}>
          {displayed.length === 0 ? (
            <div
              className="flex items-center justify-center h-32 font-mono text-xs"
              style={{ color: "oklch(0.4 0 0)" }}
            >
              No {severityFilter === "all" ? "" : severityFilter + " "}log entries in {stream} stream.
            </div>
          ) : (
            displayed.map((entry, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-start gap-2 font-mono text-[11px] leading-relaxed px-1 rounded-sm group",
                  entry.severity === "error" && "bg-destructive/10"
                )}
              >
                {/* Timestamp */}
                <span
                  className="shrink-0 select-none"
                  style={{ color: "oklch(0.40 0 0)" }}
                >
                  [{formatTimestamp(entry.timestamp)}]
                </span>

                {/* Severity label */}
                <span
                  className={cn(
                    "shrink-0 font-semibold w-8",
                    SEVERITY_COLOR[entry.severity]
                  )}
                  style={
                    entry.severity === "info" ? { color: "oklch(0.62 0.19 149)" } :
                    entry.severity === "warn" ? { color: "oklch(0.75 0.18 85)" } :
                    entry.severity === "error" ? { color: "oklch(0.577 0.245 27)" } :
                    { color: "oklch(0.40 0 0)" }
                  }
                >
                  {SEVERITY_LABEL[entry.severity]}
                </span>

                {/* Message */}
                <span
                  className="break-all"
                  style={{
                    color:
                      entry.severity === "error" ? "oklch(0.80 0.12 27)" :
                      entry.severity === "warn" ? "oklch(0.88 0.10 85)" :
                      entry.severity === "debug" ? "oklch(0.40 0 0)" :
                      "oklch(0.82 0 0)",
                  }}
                >
                  {entry.message}
                </span>
              </div>
            ))
          )}
          <div ref={logEndRef} />
        </div>
      </div>

      {/* Stream description */}
      <p className="text-[10px] text-muted-foreground font-mono shrink-0">
        {stream === "build"
          ? "Build logs contain Railpack detection, npm install output, migration, and seeding steps. Separate from runtime."
          : "Deploy logs are stdout/stderr from the running Express.js process after container start. Includes HTTP request logs, app events, and errors."}
      </p>
    </div>
  );
}
