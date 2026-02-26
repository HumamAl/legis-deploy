// No "use client" needed — no hooks used here

import { XCircle, CheckCircle2, Database, HardDrive, RefreshCw, AlertTriangle } from "lucide-react";

export function SqlitePersistence() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {/* Before panel */}
      <div
        className="rounded border p-3 space-y-2.5"
        style={{
          backgroundColor: "color-mix(in oklch, var(--destructive) 6%, transparent)",
          borderColor: "color-mix(in oklch, var(--destructive) 20%, transparent)",
        }}
      >
        <div className="flex items-center gap-1.5">
          <XCircle className="w-3.5 h-3.5 text-destructive shrink-0" />
          <span className="text-xs font-semibold text-destructive">Ephemeral Storage (Default)</span>
        </div>

        {/* Storage layer diagram */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 rounded border border-destructive/20 bg-destructive/5 px-2 py-1.5">
            <Database className="w-3 h-3 text-destructive shrink-0" />
            <div>
              <p className="text-[10px] font-mono text-destructive">/app/data/legis.db</p>
              <p className="text-[9px] text-muted-foreground font-mono">written to container filesystem</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 pl-3">
            <div className="w-px h-4 bg-destructive/30" />
          </div>

          <div className="flex items-center gap-1.5 rounded border border-destructive/20 bg-destructive/5 px-2 py-1.5">
            <RefreshCw className="w-3 h-3 text-destructive shrink-0" />
            <div>
              <p className="text-[10px] font-mono text-destructive">redeploy / restart</p>
              <p className="text-[9px] text-muted-foreground font-mono">new container replaces old</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 pl-3">
            <div className="w-px h-4 bg-destructive/30" />
          </div>

          <div className="flex items-center gap-1.5 rounded border border-destructive/30 bg-destructive/10 px-2 py-1.5">
            <AlertTriangle className="w-3 h-3 text-destructive shrink-0" />
            <div>
              <p className="text-[10px] font-mono text-destructive font-semibold">database wiped</p>
              <p className="text-[9px] text-muted-foreground font-mono">npm run setup required again</p>
            </div>
          </div>
        </div>

        <p className="text-[9px] font-mono text-destructive/70 pt-0.5">
          Every redeploy loses users, sessions, and document history
        </p>
      </div>

      {/* After panel */}
      <div
        className="rounded border p-3 space-y-2.5"
        style={{
          backgroundColor: "color-mix(in oklch, var(--success) 6%, transparent)",
          borderColor: "color-mix(in oklch, var(--success) 20%, transparent)",
        }}
      >
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-[color:var(--success)] shrink-0" />
          <span className="text-xs font-semibold text-[color:var(--success)]">Persistent Volume Mount</span>
        </div>

        {/* Volume diagram */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 rounded border border-[color-mix(in_oklch,var(--success)_25%,transparent)] bg-[color-mix(in_oklch,var(--success)_8%,transparent)] px-2 py-1.5">
            <HardDrive className="w-3 h-3 text-[color:var(--success)] shrink-0" />
            <div>
              <p className="text-[10px] font-mono text-[color:var(--success)]">Railway Volume → /data</p>
              <p className="text-[9px] text-muted-foreground font-mono">persistent, survives redeployments</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 pl-3">
            <div className="w-px h-4 bg-[color-mix(in_oklch,var(--success)_30%,transparent)]" />
          </div>

          <div className="flex items-center gap-1.5 rounded border border-[color-mix(in_oklch,var(--success)_25%,transparent)] bg-[color-mix(in_oklch,var(--success)_8%,transparent)] px-2 py-1.5">
            <Database className="w-3 h-3 text-[color:var(--success)] shrink-0" />
            <div>
              <p className="text-[10px] font-mono text-[color:var(--success)]">DATABASE_PATH=/data/legis.db</p>
              <p className="text-[9px] text-muted-foreground font-mono">absolute path to volume mount</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 pl-3">
            <div className="w-px h-4 bg-[color-mix(in_oklch,var(--success)_30%,transparent)]" />
          </div>

          <div className="flex items-center gap-1.5 rounded border border-[color-mix(in_oklch,var(--success)_25%,transparent)] bg-[color-mix(in_oklch,var(--success)_10%,transparent)] px-2 py-1.5">
            <CheckCircle2 className="w-3 h-3 text-[color:var(--success)] shrink-0" />
            <div>
              <p className="text-[10px] font-mono text-[color:var(--success)] font-semibold">database intact after redeploy</p>
              <p className="text-[9px] text-muted-foreground font-mono">npm run setup runs once only</p>
            </div>
          </div>
        </div>

        <p className="text-[9px] font-mono text-[color-mix(in_oklch,var(--success)_80%,transparent)] pt-0.5">
          Volume is provisioned once — survives full Railway deployment lifecycle
        </p>
      </div>
    </div>
  );
}
