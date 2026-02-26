"use client";

import { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Clock,
  XCircle,
  GitCommit,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { deployments } from "@/data/mock-data";
import type { Deployment, DeploymentStatus } from "@/lib/types";

type SortKey = "deployedAt" | "buildDuration" | "serviceName" | "status";
type ServiceFilter = "all" | string;
type StatusFilter = "all" | DeploymentStatus;

const STATUS_CONFIG: Record<
  DeploymentStatus,
  { label: string; colorClass: string; icon: React.ReactNode }
> = {
  Active: {
    label: "Active",
    colorClass: "text-[color:var(--success)] bg-[color:var(--success)]/10 border-[color:var(--success)]/20",
    icon: <CheckCircle2 className="w-2.5 h-2.5" />,
  },
  Building: {
    label: "Building",
    colorClass: "text-[color:var(--warning)] bg-[color:var(--warning)]/10 border-[color:var(--warning)]/20",
    icon: <Loader2 className="w-2.5 h-2.5 animate-spin" />,
  },
  Deploying: {
    label: "Deploying",
    colorClass: "text-[color:var(--warning)] bg-[color:var(--warning)]/10 border-[color:var(--warning)]/20",
    icon: <Loader2 className="w-2.5 h-2.5 animate-spin" />,
  },
  Initializing: {
    label: "Initializing",
    colorClass: "text-[color:var(--warning)] bg-[color:var(--warning)]/10 border-[color:var(--warning)]/20",
    icon: <Clock className="w-2.5 h-2.5" />,
  },
  Failed: {
    label: "Failed",
    colorClass: "text-destructive bg-destructive/10 border-destructive/20",
    icon: <XCircle className="w-2.5 h-2.5" />,
  },
  Crashed: {
    label: "Crashed",
    colorClass: "text-destructive bg-destructive/10 border-destructive/20",
    icon: <AlertCircle className="w-2.5 h-2.5" />,
  },
  Completed: {
    label: "Completed",
    colorClass: "text-muted-foreground bg-muted border-border",
    icon: <CheckCircle2 className="w-2.5 h-2.5" />,
  },
  Removing: {
    label: "Removing",
    colorClass: "text-muted-foreground bg-muted border-border",
    icon: <Clock className="w-2.5 h-2.5" />,
  },
  Removed: {
    label: "Removed",
    colorClass: "text-muted-foreground/50 bg-muted/50 border-border/50",
    icon: null,
  },
};

function DeploymentStatusBadge({ status }: { status: DeploymentStatus }) {
  const c = STATUS_CONFIG[status];
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[10px] font-mono font-medium flex items-center gap-1 w-fit px-1.5 py-0.5 rounded-sm border",
        c.colorClass
      )}
    >
      {c.icon}
      {c.label}
    </Badge>
  );
}

function formatBuildDuration(seconds: number): string {
  if (seconds >= 60) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  }
  return `${seconds}s`;
}

function formatDeployedAt(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

const ENV_LABEL: Record<string, string> = {
  production: "prod",
  staging: "staging",
  "pr-142": "pr-142",
  "pr-138": "pr-138",
  demo: "demo",
};

// Unique service names
const serviceNames = Array.from(new Set(deployments.map((d) => d.serviceName))).sort();

// Active status filters — pill toggles
const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "Active", label: "Active" },
  { value: "Failed", label: "Failed" },
  { value: "Crashed", label: "Crashed" },
  { value: "Removed", label: "Removed" },
];

export default function DeploymentsPage() {
  const [serviceFilter, setServiceFilter] = useState<ServiceFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("deployedAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const displayed = useMemo(() => {
    return deployments
      .filter((d) => {
        const matchesService = serviceFilter === "all" || d.serviceName === serviceFilter;
        const matchesStatus = statusFilter === "all" || d.status === statusFilter;
        return matchesService && matchesStatus;
      })
      .sort((a, b) => {
        let av: string | number;
        let bv: string | number;
        if (sortKey === "deployedAt") {
          av = new Date(a.deployedAt).getTime();
          bv = new Date(b.deployedAt).getTime();
        } else if (sortKey === "buildDuration") {
          av = a.buildDuration;
          bv = b.buildDuration;
        } else if (sortKey === "serviceName") {
          av = a.serviceName;
          bv = b.serviceName;
        } else {
          av = a.status;
          bv = b.status;
        }
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
  }, [serviceFilter, statusFilter, sortKey, sortDir]);

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return null;
    return sortDir === "asc" ? (
      <ChevronUp className="w-2.5 h-2.5 inline ml-0.5" />
    ) : (
      <ChevronDown className="w-2.5 h-2.5 inline ml-0.5" />
    );
  }

  const failureCount = displayed.filter(
    (d) => d.status === "Failed" || d.status === "Crashed"
  ).length;

  return (
    <div className="page-container space-y-3">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold tracking-tight">Deployment History</h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-mono">
            All services · all environments · last 30 days
          </p>
        </div>
        <div className="flex items-center gap-2">
          {failureCount > 0 && (
            <span className="font-mono text-[10px] text-destructive bg-destructive/8 border border-destructive/20 px-2 py-0.5 rounded-sm">
              {failureCount} failure{failureCount > 1 ? "s" : ""}
            </span>
          )}
          <span className="font-mono text-[10px] text-muted-foreground">
            {displayed.length} / {deployments.length} deployments
          </span>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Service filter dropdown */}
        <Select value={serviceFilter} onValueChange={setServiceFilter}>
          <SelectTrigger className="h-7 w-40 text-[11px] font-mono">
            <SelectValue placeholder="All services" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs font-mono">All services</SelectItem>
            {serviceNames.map((s) => (
              <SelectItem key={s} value={s} className="text-xs font-mono">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status filter pill toggles */}
        <div className="flex items-center gap-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={cn(
                "px-2 py-0.5 text-[10px] font-mono rounded-sm border transition-colors duration-75",
                statusFilter === f.value
                  ? "bg-primary/10 text-primary border-primary/30"
                  : "text-muted-foreground border-border hover:bg-[color:var(--surface-hover)]"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Deployments table */}
      <div className="aesthetic-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border">
                {/* Expand col */}
                <TableHead className="bg-muted/60 h-7 py-0 px-2 w-6" />

                <TableHead
                  className="bg-muted/60 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide h-7 py-0 px-2 w-24 cursor-pointer select-none hover:text-foreground transition-colors duration-75"
                  onClick={() => handleSort("deployedAt")}
                >
                  Deployed
                  <SortIcon col="deployedAt" />
                </TableHead>

                <TableHead className="bg-muted/60 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide h-7 py-0 px-2 w-20">
                  ID
                </TableHead>

                <TableHead
                  className="bg-muted/60 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide h-7 py-0 px-2 cursor-pointer select-none hover:text-foreground transition-colors duration-75"
                  onClick={() => handleSort("serviceName")}
                >
                  Service
                  <SortIcon col="serviceName" />
                </TableHead>

                <TableHead
                  className="bg-muted/60 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide h-7 py-0 px-2 cursor-pointer select-none hover:text-foreground transition-colors duration-75"
                  onClick={() => handleSort("status")}
                >
                  Status
                  <SortIcon col="status" />
                </TableHead>

                <TableHead className="bg-muted/60 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide h-7 py-0 px-2 w-20">
                  Env
                </TableHead>

                <TableHead className="bg-muted/60 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide h-7 py-0 px-2">
                  Commit
                </TableHead>

                <TableHead className="bg-muted/60 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide h-7 py-0 px-2">
                  Triggered By
                </TableHead>

                <TableHead
                  className="bg-muted/60 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide h-7 py-0 px-2 w-20 cursor-pointer select-none hover:text-foreground transition-colors duration-75 text-right"
                  onClick={() => handleSort("buildDuration")}
                >
                  Build
                  <SortIcon col="buildDuration" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayed.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="h-20 text-center text-xs text-muted-foreground font-mono"
                  >
                    No deployments match this filter.
                  </TableCell>
                </TableRow>
              ) : (
                displayed.map((dep) => {
                  const isExpanded = expandedId === dep.id;
                  const hasFailure = dep.status === "Failed" || dep.status === "Crashed";

                  return (
                    <>
                      <TableRow
                        key={dep.id}
                        className={cn(
                          "hover:bg-[color:var(--surface-hover)] transition-colors duration-75 border-b border-border/50 cursor-pointer",
                          hasFailure && "bg-destructive/4 hover:bg-destructive/6",
                          dep.status === "Active" && "bg-[color:var(--success)]/3"
                        )}
                        onClick={() => setExpandedId(isExpanded ? null : dep.id)}
                      >
                        {/* Expand toggle */}
                        <TableCell className="py-1.5 px-2">
                          <ChevronRight
                            className={cn(
                              "w-3 h-3 text-muted-foreground transition-transform duration-75",
                              isExpanded && "rotate-90"
                            )}
                          />
                        </TableCell>

                        {/* Deployed at */}
                        <TableCell className="py-1.5 px-2">
                          <span className="font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                            {formatDeployedAt(dep.deployedAt)}
                          </span>
                        </TableCell>

                        {/* ID */}
                        <TableCell className="py-1.5 px-2">
                          <span className="font-mono text-[10px] text-primary/80">
                            {dep.id}
                          </span>
                        </TableCell>

                        {/* Service */}
                        <TableCell className="py-1.5 px-2">
                          <span className="font-mono text-[11px] font-medium">
                            {dep.serviceName}
                          </span>
                        </TableCell>

                        {/* Status */}
                        <TableCell className="py-1.5 px-2">
                          <DeploymentStatusBadge status={dep.status} />
                        </TableCell>

                        {/* Environment */}
                        <TableCell className="py-1.5 px-2">
                          <span
                            className={cn(
                              "font-mono text-[10px] px-1.5 py-0.5 rounded-sm border",
                              dep.environment === "production"
                                ? "text-primary/80 bg-primary/6 border-primary/15"
                                : dep.environment.startsWith("pr-")
                                ? "text-[color:var(--warning)]/80 bg-[color:var(--warning)]/8 border-[color:var(--warning)]/20"
                                : "text-muted-foreground bg-muted border-border"
                            )}
                          >
                            {ENV_LABEL[dep.environment] ?? dep.environment}
                          </span>
                        </TableCell>

                        {/* Commit */}
                        <TableCell className="py-1.5 px-2 max-w-[200px]">
                          <div className="flex items-center gap-1.5">
                            <GitCommit className="w-2.5 h-2.5 text-muted-foreground shrink-0" />
                            <span className="font-mono text-[10px] text-muted-foreground shrink-0">
                              {dep.commitSha}
                            </span>
                            <span className="text-[11px] text-foreground/70 truncate">
                              {dep.commitMessage}
                            </span>
                          </div>
                        </TableCell>

                        {/* Triggered by */}
                        <TableCell className="py-1.5 px-2">
                          <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                            {dep.triggeredBy}
                          </span>
                        </TableCell>

                        {/* Build duration */}
                        <TableCell className="py-1.5 px-2 text-right">
                          <span
                            className={cn(
                              "font-mono text-[11px] tabular-nums",
                              dep.buildDuration > 300
                                ? "text-[color:var(--warning)]"
                                : "text-foreground/70"
                            )}
                          >
                            {formatBuildDuration(dep.buildDuration)}
                          </span>
                        </TableCell>
                      </TableRow>

                      {/* Expanded detail row */}
                      {isExpanded && (
                        <TableRow key={`${dep.id}-expanded`} className="border-b border-border/50">
                          <TableCell colSpan={9} className="py-3 px-4 bg-muted/30">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                              <div>
                                <p className="text-[9px] text-muted-foreground uppercase tracking-wide font-mono mb-1">
                                  Deployment ID
                                </p>
                                <p className="font-mono text-[11px]">{dep.id}</p>
                              </div>
                              <div>
                                <p className="text-[9px] text-muted-foreground uppercase tracking-wide font-mono mb-1">
                                  Service ID
                                </p>
                                <p className="font-mono text-[11px] text-muted-foreground">{dep.serviceId}</p>
                              </div>
                              <div>
                                <p className="text-[9px] text-muted-foreground uppercase tracking-wide font-mono mb-1">
                                  Environment
                                </p>
                                <p className="font-mono text-[11px]">{dep.environment}</p>
                              </div>
                              <div>
                                <p className="text-[9px] text-muted-foreground uppercase tracking-wide font-mono mb-1">
                                  Build Duration
                                </p>
                                <p
                                  className={cn(
                                    "font-mono text-[11px]",
                                    dep.buildDuration > 300 ? "text-[color:var(--warning)]" : ""
                                  )}
                                >
                                  {formatBuildDuration(dep.buildDuration)}
                                  {dep.buildDuration > 300 && " — full cache rebuild (package.json changed)"}
                                </p>
                              </div>
                              <div className="col-span-2 md:col-span-4">
                                <p className="text-[9px] text-muted-foreground uppercase tracking-wide font-mono mb-1">
                                  Commit Message
                                </p>
                                <p className="font-mono text-[11px]">{dep.commitSha} · {dep.commitMessage}</p>
                              </div>
                              {dep.failureReason && (
                                <div className="col-span-2 md:col-span-4">
                                  <p className="text-[9px] text-destructive uppercase tracking-wide font-mono mb-1">
                                    Failure Reason
                                  </p>
                                  <p className="font-mono text-[11px] text-destructive bg-destructive/8 border border-destructive/20 p-2 rounded-sm leading-relaxed">
                                    {dep.failureReason}
                                  </p>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground font-mono">
        Click any row to expand deployment details. Rows highlighted red indicate Failed or Crashed deployments. Build times above 5m suggest a full cache rebuild from a package.json change.
      </p>
    </div>
  );
}
