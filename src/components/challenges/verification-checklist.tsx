// No "use client" — no hooks used here

import type { ComponentType } from "react";
import { CheckCircle2, Lock, LogIn, Cpu, FileDown, Clock } from "lucide-react";

interface CheckpointItem {
  id: string;
  number: string;
  label: string;
  endpoint: string;
  description: string;
  responseTime: number;
  httpStatus: number;
  icon: ComponentType<{ className?: string }>;
}

const CHECKPOINTS: CheckpointItem[] = [
  {
    id: "hc-01",
    number: "01",
    label: "Site Password Gate",
    endpoint: "GET /",
    description: "SITE_PASSWORD env var wired — root route returns 200 with password prompt",
    responseTime: 83,
    httpStatus: 200,
    icon: Lock,
  },
  {
    id: "hc-02",
    number: "02",
    label: "Login Authentication",
    endpoint: "POST /login",
    description: "scrypt password validation functional, session cookie set on success",
    responseTime: 142,
    httpStatus: 200,
    icon: LogIn,
  },
  {
    id: "hc-03",
    number: "03",
    label: "AI Generation Call",
    endpoint: "POST /api/generate",
    description: "ANTHROPIC_API_KEY propagated — Claude API responds and returns document content",
    responseTime: 2847,
    httpStatus: 200,
    icon: Cpu,
  },
  {
    id: "hc-04",
    number: "04",
    label: "DOCX Export",
    endpoint: "GET /api/export/:id",
    description: "Document rendered as .docx and returned with correct Content-Type header",
    responseTime: 318,
    httpStatus: 200,
    icon: FileDown,
  },
];

function ResponseTimeBar({ ms }: { ms: number }) {
  // Scale: 0-3500ms mapped to 0-100%
  const pct = Math.min((ms / 3500) * 100, 100);
  const color =
    ms < 200
      ? "bg-[color:var(--success)]"
      : ms < 1000
      ? "bg-[color:var(--warning)]"
      : "bg-primary";

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-150 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="font-mono text-[10px] text-muted-foreground w-14 text-right shrink-0">
        {ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`}
      </span>
    </div>
  );
}

export function VerificationChecklist() {
  return (
    <div className="space-y-2">
      {/* Header row */}
      <div className="grid grid-cols-[1.5rem_1fr_auto] gap-2 px-2 pb-1 border-b border-border">
        <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">#</span>
        <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Checkpoint</span>
        <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground text-right">HTTP</span>
      </div>

      {CHECKPOINTS.map((checkpoint) => (
        <div
          key={checkpoint.id}
          className="border border-border rounded overflow-hidden"
        >
          {/* Top row */}
          <div className="grid grid-cols-[1.5rem_1fr_auto] gap-2 items-center px-2 py-1.5 bg-muted/40">
            <span className="font-mono text-[10px] text-muted-foreground">{checkpoint.number}</span>
            <div className="flex items-center gap-1.5 min-w-0">
              <checkpoint.icon className="w-3 h-3 text-muted-foreground shrink-0" />
              <span className="text-xs font-medium truncate">{checkpoint.label}</span>
              <span className="text-[9px] font-mono text-muted-foreground shrink-0 hidden sm:block">
                {checkpoint.endpoint}
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span
                className="font-mono text-[10px] px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor: "color-mix(in oklch, var(--success) 10%, transparent)",
                  color: "var(--success)",
                }}
              >
                {checkpoint.httpStatus}
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-[color:var(--success)] shrink-0" />
            </div>
          </div>

          {/* Detail row */}
          <div className="px-2 pb-2 pt-1.5 space-y-1.5">
            <p className="text-[10px] text-muted-foreground font-mono">{checkpoint.description}</p>
            <div className="flex items-center gap-2">
              <Clock className="w-2.5 h-2.5 text-muted-foreground/60 shrink-0" />
              <ResponseTimeBar ms={checkpoint.responseTime} />
            </div>
          </div>
        </div>
      ))}

      <div className="flex items-center justify-between pt-1 px-1">
        <span className="text-[10px] font-mono text-muted-foreground">
          4/4 checkpoints passing
        </span>
        <span
          className="text-[10px] font-mono px-2 py-0.5 rounded"
          style={{
            backgroundColor: "color-mix(in oklch, var(--success) 10%, transparent)",
            color: "var(--success)",
          }}
        >
          Verification Complete
        </span>
      </div>
    </div>
  );
}
