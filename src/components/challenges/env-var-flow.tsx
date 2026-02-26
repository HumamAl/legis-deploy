"use client";

import { useState } from "react";
import type { ComponentType } from "react";
import { CheckCircle2, XCircle, ArrowRight, FileCode, Cloud, Box, Cpu } from "lucide-react";

type FlowMode = "broken" | "correct";

interface FlowNode {
  id: string;
  label: string;
  sublabel: string;
  icon: ComponentType<{ className?: string }>;
}

const NODES: FlowNode[] = [
  {
    id: "env-example",
    label: ".env.example",
    sublabel: "Source of truth",
    icon: FileCode,
  },
  {
    id: "railway-vars",
    label: "Railway Variables",
    sublabel: "Service scope",
    icon: Cloud,
  },
  {
    id: "container",
    label: "Container Runtime",
    sublabel: "process.env",
    icon: Box,
  },
  {
    id: "application",
    label: "Application",
    sublabel: "Express handlers",
    icon: Cpu,
  },
];

const BROKEN_STATES: Record<string, { status: "ok" | "warn" | "fail"; note: string }> = {
  "env-example": { status: "ok", note: "12 vars documented" },
  "railway-vars": { status: "fail", note: "DATABASE_PATH missing" },
  "container": { status: "fail", note: "env injection incomplete" },
  "application": { status: "fail", note: "startup crash on db open" },
};

const CORRECT_STATES: Record<string, { status: "ok" | "warn" | "fail"; note: string }> = {
  "env-example": { status: "ok", note: "12 vars documented" },
  "railway-vars": { status: "ok", note: "all 12 vars set + verified" },
  "container": { status: "ok", note: "process.env validated at boot" },
  "application": { status: "ok", note: "healthcheck 200 OK" },
};

const BROKEN_VARS = [
  { key: "ANTHROPIC_API_KEY", status: "ok" as const },
  { key: "SESSION_SECRET", status: "ok" as const },
  { key: "SITE_PASSWORD", status: "ok" as const },
  { key: "DATABASE_PATH", status: "fail" as const },
  { key: "NODE_ENV", status: "ok" as const },
  { key: "PORT", status: "ok" as const },
];

const CORRECT_VARS = [
  { key: "ANTHROPIC_API_KEY", status: "ok" as const },
  { key: "SESSION_SECRET", status: "ok" as const },
  { key: "SITE_PASSWORD", status: "ok" as const },
  { key: "DATABASE_PATH", status: "ok" as const },
  { key: "NODE_ENV", status: "ok" as const },
  { key: "PORT", status: "ok" as const },
];

function StatusIcon({ status }: { status: "ok" | "warn" | "fail" }) {
  if (status === "ok") {
    return <CheckCircle2 className="w-3 h-3 text-[color:var(--success)] shrink-0" />;
  }
  return <XCircle className="w-3 h-3 text-destructive shrink-0" />;
}

function NodeCard({
  node,
  state,
  isLast,
}: {
  node: FlowNode;
  state: { status: "ok" | "warn" | "fail"; note: string };
  isLast: boolean;
}) {
  const borderColor =
    state.status === "ok"
      ? "border-[color-mix(in_oklch,var(--success)_30%,transparent)]"
      : state.status === "fail"
      ? "border-destructive/30"
      : "border-[color-mix(in_oklch,var(--warning)_30%,transparent)]";

  const bgColor =
    state.status === "ok"
      ? "bg-[color-mix(in_oklch,var(--success)_5%,transparent)]"
      : state.status === "fail"
      ? "bg-destructive/5"
      : "bg-[color-mix(in_oklch,var(--warning)_5%,transparent)]";

  return (
    <div className="flex items-center gap-1.5">
      <div
        className={`border rounded px-2.5 py-2 min-w-[120px] ${borderColor} ${bgColor} transition-all duration-100`}
      >
        <div className="flex items-center gap-1.5 mb-1">
          <node.icon className="w-3 h-3 text-muted-foreground shrink-0" />
          <span className="text-xs font-medium font-mono truncate">{node.label}</span>
        </div>
        <div className="flex items-center gap-1">
          <StatusIcon status={state.status} />
          <span className="text-[10px] text-muted-foreground font-mono">{state.note}</span>
        </div>
        <p className="text-[9px] text-muted-foreground/60 mt-0.5 font-mono">{node.sublabel}</p>
      </div>
      {!isLast && (
        <ArrowRight
          className={`w-3 h-3 shrink-0 transition-colors duration-100 ${
            state.status === "fail" ? "text-destructive/40" : "text-muted-foreground/60"
          }`}
        />
      )}
    </div>
  );
}

export function EnvVarFlow() {
  const [mode, setMode] = useState<FlowMode>("broken");

  const states = mode === "broken" ? BROKEN_STATES : CORRECT_STATES;
  const vars = mode === "broken" ? BROKEN_VARS : CORRECT_VARS;
  const failCount = vars.filter((v) => v.status === "fail").length;

  return (
    <div className="space-y-3">
      {/* Toggle control */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
          View:
        </span>
        <div className="flex border border-border rounded overflow-hidden">
          <button
            onClick={() => setMode("broken")}
            className={`px-2.5 py-1 text-xs font-mono transition-colors duration-100 ${
              mode === "broken"
                ? "bg-destructive/10 text-destructive border-r border-border"
                : "text-muted-foreground hover:bg-muted border-r border-border"
            }`}
          >
            Without config
          </button>
          <button
            onClick={() => setMode("correct")}
            className={`px-2.5 py-1 text-xs font-mono transition-colors duration-100 ${
              mode === "correct"
                ? "bg-[color-mix(in_oklch,var(--success)_10%,transparent)] text-[color:var(--success)]"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            With systematic config
          </button>
        </div>
        <span
          className={`ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded transition-all duration-100 ${
            failCount > 0
              ? "bg-destructive/10 text-destructive"
              : "bg-[color-mix(in_oklch,var(--success)_10%,transparent)] text-[color:var(--success)]"
          }`}
        >
          {failCount > 0 ? `${failCount} layer failing` : "all layers passing"}
        </span>
      </div>

      {/* Flow diagram */}
      <div className="overflow-x-auto">
        <div className="flex items-start gap-1 min-w-max pb-1">
          {NODES.map((node, i) => (
            <NodeCard
              key={node.id}
              node={node}
              state={states[node.id]}
              isLast={i === NODES.length - 1}
            />
          ))}
        </div>
      </div>

      {/* Env var checklist */}
      <div className="border border-border rounded overflow-hidden">
        <div className="bg-muted px-2 py-1 border-b border-border">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            Railway Variables — Production Environment
          </span>
        </div>
        <div>
          {vars.map((v, i) => (
            <div
              key={v.key}
              className={`flex items-center gap-2 px-2 py-1.5 ${
                i < vars.length - 1 ? "border-b border-border" : ""
              } ${v.status === "fail" ? "bg-destructive/5" : ""}`}
            >
              <StatusIcon status={v.status} />
              <span
                className={`text-[10px] font-mono ${
                  v.status === "fail" ? "text-destructive" : "text-foreground"
                }`}
              >
                {v.key}
              </span>
              {v.status === "fail" && (
                <span className="ml-auto text-[9px] font-mono text-destructive/70">
                  Missing
                </span>
              )}
              {v.status === "ok" && (
                <span className="ml-auto text-[9px] font-mono text-muted-foreground">
                  Active
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {mode === "broken" && (
        <p className="text-[10px] font-mono text-destructive/80">
          → App crashes at startup: <span className="italic">Error: SQLITE_CANTOPEN: unable to open database file</span>
        </p>
      )}
      {mode === "correct" && (
        <p className="text-[10px] font-mono text-[color:var(--success)]">
          → All env vars verified before first healthcheck poll — zero startup failures
        </p>
      )}
    </div>
  );
}
